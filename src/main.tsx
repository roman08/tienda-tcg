import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { siteConfig } from './config/site';
import './styles.css';

// Aplica los colores de la configuración centralizada como variables CSS.
const root = document.documentElement.style;
const { theme } = siteConfig;
root.setProperty('--black', theme.black);
root.setProperty('--purple', theme.purple);
root.setProperty('--blue', theme.blue);
root.setProperty('--white', theme.white);
root.setProperty('--gray', theme.gray);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
