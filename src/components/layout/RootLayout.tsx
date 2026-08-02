/**
 * Layout base (Shell) da aplicação.
 * Renderiza o cabeçalho fixo (Header) e gerencia a substituição dinâmica das páginas filhas via React Router.
 */
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '../shared/Header'

/**
 * Componente de layout principal que envelopa todas as rotas da aplicação.
 */
export function RootLayout() {
  // Hook para monitorar a rota atual e forçar a re-renderização completa na troca de páginas
  const location = useLocation()

  return (
    <>
      <Header />
      {/* A key garante que o React destrua o componente da página antiga ao mudar de rota */}
      <Outlet key={location.pathname} />
    </>
  )
}