/**
 * Contexto do React responsável pelo gerenciamento do tema global (claro/escuro).
 * Define o contrato de tipos e o ponto de acesso centralizado para a alternância de temas na aplicação.
 */
import { createContext } from 'react'
export type Theme = 'light' | 'dark'

/**
 * Contrato de valores expostos pelo contexto do tema.
 * theme: O tema ativo no momento ('light' ou 'dark').
 * toggleTheme: Função que alterna entre os temas claro e escuro.
 */
interface ThemeContextValue {
    theme: Theme
    toggleTheme: () => void
}

/**
 * Instância do contexto de tema criada com valor inicial indefinido.
 * Deve ser consumida preferencialmente através do custom hook `useTheme`.
 */
export const ThemeContext = createContext<ThemeContextValue | undefined>(
    undefined,
)