/**
 * Componente raiz da aplicação.
 * Responsável por prover o gerenciamento de rotas através do React Router.
 */
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

/**
 * Renderiza o provedor de rotas principal configurado no módulo router.
 */
function App() {
    return (
      <RouterProvider router={router}/>
  )
}

export default App