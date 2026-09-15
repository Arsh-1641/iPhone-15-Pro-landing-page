import React, { useEffect, useRef, useState } from 'react'
import { hightlightsSlides } from '../constants'
import gsap from 'gsap'
import { pauseImg, playImg, replayImg } from '../utils'
import { useGSAP } from '@gsap/react'

const VideoCarousel = () => {
    const videoRef = useRef([])
    const videoSpanRef = useRef([])
    const videoDivRef = useRef([])
    const sliderRef = useRef(null)
    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false
    })
    const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

    useGSAP(() => {
        gsap.to('#video', {
            scrollTrigger: {
                trigger: '#video',
                toggleActions: 'restart none none none',
            },
            onComplete: () => {
                setVideo((pre) => ({
                    ...pre,
                    startPlay: true,
                    isPlaying: true,
                }))
            }
        })
    }, [isEnd, videoId])

    // Slide carousel to current video using GSAP transform
    useEffect(() => {
        let sliderElement = sliderRef.current;
        if (sliderElement) {
            let firstSlider = sliderElement.querySelector('#slider');
            if (firstSlider) {
                // gap-5 is 20px, so add to offsetWidth
                const slideWidth = firstSlider.offsetWidth + 20;
                gsap.to(sliderElement, {
                    x: -videoId * slideWidth,
                    duration: 0.5,
                    ease: 'power1.inOut'
                })
            }
        }
    }, [videoId])
    const [loadedData, setLoadedData] = useState([])
    useEffect(() => {
        if (loadedData.length > 3) {
            if (!isPlaying) {
                videoRef.current[videoId]?.pause();
            }
            else {
                videoRef.current[videoId]?.play()
            }
        }
    }, [startPlay, videoId, isPlaying])

    const handleLoadedMetadata = (i, e) => setLoadedData((pre) => [...pre, e])

    useEffect(() => {
        let currentProgress = 0;
        let span = videoSpanRef.current;
        
        // Kill all animations and reset all progress bars except current one immediately
        span.forEach((s, index) => {
            if (index !== videoId && s) {
                gsap.killTweensOf(s);
                gsap.killTweensOf(videoDivRef.current[index]);
                gsap.set(s, {
                    width: '0%',
                    backgroundColor: '#afafaf'
                })
                gsap.set(videoDivRef.current[index], {
                    width: '12px'
                })
            }
        })
        
        if (span[videoId]) {
            // Kill any existing animations on this span to prevent multiple animations
            gsap.killTweensOf(span[videoId]);
            gsap.killTweensOf(videoDivRef.current[videoId]);
            
            let anim = gsap.to(span[videoId], {
                duration: hightlightsSlides[videoId].videoDuration,
                onUpdate: () => {
                    const progress = Math.ceil(anim.progress() * 100)
                    if (progress != currentProgress) {
                        currentProgress = progress
                        gsap.to(videoDivRef.current[videoId], {
                            width: window.innerWidth < 768 ? '10vw' : window.innerWidth < 1280 ? '10vw' : '4vw'
                        })
                        gsap.to(span[videoId], {
                            width: `${currentProgress}%`,
                            backgroundColor: 'white',
                        })
                    }
                },
                onComplete: () => {
                    gsap.to(videoDivRef.current[videoId], {
                        width: '12px',
                    })
                    gsap.to(span[videoId], {
                        background: '#afafaf'
                    })
                },
                paused: true
            })
            
            const animUpdate = () => {
                if (videoRef.current[videoId]) {
                    anim.progress(videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration)
                }
            }
            
            if (isPlaying) {
                anim.play();
                gsap.ticker.add(animUpdate)
            } else {
                anim.pause();
                gsap.ticker.remove(animUpdate)
            }
            
            return () => {
                gsap.ticker.remove(animUpdate)
                gsap.killTweensOf(span[videoId])
            }
        }
    }, [videoId, startPlay, isPlaying])

    const handleProcess = (type, i) => {
        switch (type) {
            case 'video-end':
                if (i < hightlightsSlides.length - 1) {
                    setVideo((prevVideo) => ({ ...prevVideo, isEnd: true, videoId: i + 1 }))
                } else {
                    setVideo((prevVideo) => ({ ...prevVideo, isEnd: true, isLastVideo: true }))
                }
                break;
            case 'video-last':
                setVideo((prevVideo) => ({ ...prevVideo, isLastVideo: true }))
                break;
            case 'video-reset':
                setVideo((prevVideo) => ({ ...prevVideo, isLastVideo: false, videoId: 0, isPlaying: true }))
                break;
            case 'play':
                setVideo((prevVideo) => ({ ...prevVideo, isPlaying: !prevVideo.isPlaying }))
                break;
            case 'pause':
                setVideo((prevVideo) => ({ ...prevVideo, isPlaying: false }))
                break;
            default:
                return video;
        }
    }

    return (
        <>
            <div className="flex items-center gap-5" ref={sliderRef}>
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id='slider' className='sm:pr-20 pr-10'>
                        <div className="video-carousel_container">
                            <div className='w-full h-full flex justify-center items-center rounded-xl overflow-hidden bg-black'>
                                <video id='video' playsInline={true}
                                    onLoadedMetadata={(e) => handleLoadedMetadata(i, e)}
                                    preload='auto' 
                                    onPlay={() => {
                                        setVideo({
                                            ...video,
                                            isPlaying: true
                                        })
                                    }}
                                    onEnded={() => handleProcess('video-end', i)}
                                    ref={(el) => (videoRef.current[i] = el)} muted>
                                    <source src={list.video} type='video/mp4' />
                                </video>
                            </div>
                            <div className='absolute top-12 left-[5%] z-10'>
                                {list.textLists.map((text) => (
                                    <p className='md:text-2xl text-xl font-medium' key={text}>
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='relative flex items-center justify-center mt-10'>
                <div className="flex items-center justify-center bg-gray-300 px-7 py-5 backdrop-blur-md rounded-full " >
                    {videoRef.current.map((_, i) => (
                        <span className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer' key={i} ref={(el) => { videoDivRef.current[i] = el }}>
                            <span className='absolute h-full w-full rounded-full'
                                ref={(el) => { videoSpanRef.current[i] = el }}
                            />
                        </span>
                    ))}
                </div>
                <button className='control-btn cursor-pointer'  onClick={isLastVideo ? () => handleProcess('video-reset') : !isPlaying ? () => handleProcess('play') : () => handleProcess('pause')} >
                    <img src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg} alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'}
                    />
                </button>
            </div>
        </>
    )
}

export default VideoCarousel
