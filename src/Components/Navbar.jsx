import { appleImg, bagImg, searchImg } from '../utils';
import { navLists } from '../constants';

const Navbar = () => {
  return (
    <header className="relative z-10 w-full py-5 sm:px-10 px-5 flex justify-between items-center">
      <nav className="flex w-full screen-max-width">
        <img src={appleImg} alt="Apple" width={14} height={18} />

        <div className="flex flex-1 justify-center max-sm:hidden">
          {navLists.map((nav) => (
            <button
              key={nav}
              type="button"
              className="nav-item px-5 text-sm cursor-pointer text-gray hover:text-white transition-colors duration-200"
            >
              {nav}
            </button>
          ))}
        </div>

        <div className="flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1">
          <img src={searchImg} alt="search" width={18} height={18} className='hover:scale-110 cursor-pointer transition-all' />
          <img src={bagImg} alt="bag" width={18} height={18} className='hover:scale-110 cursor-pointer transition-all' />
        </div>
      </nav>
    </header>
  )
}

export default Navbar