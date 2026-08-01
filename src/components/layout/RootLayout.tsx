import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '../shared/Header'

export function RootLayout() {
  const location = useLocation()

  return (
    <>
      <Header />
      {/* A key garante que o React destrua o componente da página antiga ao mudar de rota */}
      <Outlet key={location.pathname} />
    </>
  )
}
