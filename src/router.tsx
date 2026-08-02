/**
 * Configuração central de rotas da aplicação utilizando React Router.
 * Define a estrutura de layout principal (RootLayout) e encapsula as páginas de formulário,
 * resultados e histórico de simulações.
 */
import { createBrowserRouter } from 'react-router-dom';
import { PiggyBank } from 'lucide-react';
import { Button } from './components/shared/Button';
import { RootLayout } from './components/layout/RootLayout';
import { SimulationFormPage } from './pages/SimulationFormPage';
import { SimulationResultsPage } from './pages/SimulationResultsPage';
import { SimulationHistoryPage } from './pages/SimulationHistoryPage';
/**
 * Mapeamento das rotas navegáveis da aplicação.
 */
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Rota inicial: Formulário de criação de nova simulação
      {
        path: '/',
        element: <SimulationFormPage />
      },
      // Rota de resultado/diagnóstico de uma simulação específica por ID
      {
        path: '/resultado/:id',
        element: <SimulationResultsPage />,
      },
      // Rota de histórico com a listagem de todas as simulações salvas
      {
        path: '/historico',
        element: <SimulationHistoryPage />,
      },
    ],
  },
]);