// main.tsx
import ReactDOM from 'react-dom/client';
import AppRoutes from './routing/AppRoutes';
import './index.css'; // Tailwind or global CSS
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
