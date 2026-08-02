/**
 * Ponto de entrada (entry point) da aplicação React.
 * Inicializa a árvore de componentes, englobando o app com o provedor de temas (ThemeProvider)
 * e o StrictMode no elemento DOM raiz ('root').
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/theme/ThemeProvider'
// Renderiza a aplicação no container raiz do HTML
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)