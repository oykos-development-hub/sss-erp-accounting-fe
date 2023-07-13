import React from 'react';
import ReactDOM, {Root} from 'react-dom/client';
import {MICRO_SERVICE_SLUG} from './services/constants';
import {MicroserviceProps} from './types/micro-service-props';
import {Router} from './router';

const renderMicroService = (App: React.FC) => {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  let container: Root | null = null;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window[`render${MICRO_SERVICE_SLUG}`] = (containerId: string, props: MicroserviceProps) => {
    if (!container) {
      container = ReactDOM.createRoot(document.getElementById(containerId) as HTMLElement);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    container.render(<App {...props} />);
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window[`unmount${MICRO_SERVICE_SLUG}`] = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    container?.unmount();
    container = null;
  };

  if (!document.getElementById(`${MICRO_SERVICE_SLUG}-container`)) {
    root.render(<App />);
  }
};

renderMicroService((props: MicroserviceProps) => {
  return (
    <React.StrictMode>
      <Router {...props} />
    </React.StrictMode>
  );
});
