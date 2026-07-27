import { createBrowserRouter } from 'react-router-dom';
import { PiggyBank } from 'lucide-react';
import { Button } from './components/shared/Button';
import { RootLayout } from './components/layout/RootLayout';
import { SimulationFormPage } from './pages/SimulationFormPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <SimulationFormPage />
      },
      {
        path: '/resultado',
        element: <h1>Resultado da Simulação</h1>,
      },
      {
        path: '/historico',
        element: <h1>Histórico de Simulações</h1>,
      },
    ],
  },
]);