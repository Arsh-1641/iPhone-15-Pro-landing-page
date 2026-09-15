import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as Sentry from "@sentry/react";
import React from 'react';

Sentry.init({
  dsn: "https://c22f8f33059816ad6c3ea079adc4da08@o4512078503280640.ingest.us.sentry.io/4512078507737088",
  dataCollection: {
   
  },
  integrations: [
    Sentry.browserTracingIntegration(),
    // Sentry.metrics.metricsAggregatorIntegration(),
    Sentry.reactRouterBrowserTracingIntegration({
      useEffect:React.useEffect
    }),
    Sentry.replayIntegration()
  ],
  
  tracesSampleRate: 1.0, 
  
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
 
  replaysSessionSampleRate: 0.1, 
  replaysOnErrorSampleRate: 1.0 
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
