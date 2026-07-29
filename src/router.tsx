import { createBrowserRouter } from 'react-router-dom';
import { PiggyBank } from 'lucide-react';
import { Button } from './components/shared/Button';
import { RootLayout } from './components/layout/RootLayout';
import { SimulationFormPage } from './pages/SimulationFormPage';
import { SimulationResultsPage } from './pages/SimulationResultsPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <SimulationFormPage />
      },
      {
        path: '/resultado/:id',
        element: <SimulationResultsPage />,
      },
      {
        path: '/historico',
        element: <h1>Histórico de Simulações</h1>,
      },
    ],
  },
]);