import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Main.tsx loading...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Failed to find root element');
} else {
  console.log('Found root element, rendering...');
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
