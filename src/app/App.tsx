//import { RouterProvider } from 'react-router-dom';
//import { AuthProvider } from './providers/AuthProvider';
//import { router } from './router';

//export function App() {
//  return (
//    <AuthProvider>
//      <RouterProvider router={router} />
//    </AuthProvider>
//  );
//}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { ToastProvider } from './providers/ToastProvider';
import { router } from './router';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>,
);