/**
 * Custom hook para consumo simplificado do contexto de tema (Light/Dark).
 * Garante que o componente solicitante esteja adequadamente envolvido por um ThemeProvider,
 * disparando um erro descritivo em ambiente de desenvolvimento/runtime caso contrário.
 */
import { useContext } from 'react'
import { ThemeContext } from '../context/theme/ThemeContext'

/**
 * Retorna o estado do tema atual e a função para alterná-lo.
 * Error: Se executado fora de um `ThemeProvider`.
 * ThemeContextValue: O objeto contendo `theme` e `toggleTheme`.
 */
export function useTheme() {
    const context = useContext(ThemeContext)
    // Validação de segurança para garantir a presença do Provider pai na árvore de componentes
    if (context === undefined) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider')
    }
    
    return context

}