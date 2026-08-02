/**
 * Provedor do contexto de tema (Light/Dark).
 * Inicializa o tema baseado na preferência salva no LocalStorage ou no sistema do usuário,
 * persiste alterações e atualiza o atributo `data-theme` no elemento HTML principal (`<html>`).
 */
import { type PropsWithChildren, useState, useEffect } from 'react'
import { type Theme, ThemeContext } from './ThemeContext'

/**
 * Componente Wrapper que disponibiliza o estado do tema e a função de alternância para toda a árvore de componentes.
 */
export function ThemeProvider({ children }: PropsWithChildren) {
    const [theme, setTheme] = useState<Theme>(() => {
        const localStorageTheme = localStorage.getItem('theme') as Theme | null
        if (localStorageTheme) {
            return localStorageTheme
        }
        const systemPrefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches
        return systemPrefersDark ? 'dark' : 'light'
    })
    // Recupera o tema salvo no LocalStorage ou detecta a preferência de cor do sistema operacional
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])
    /**
     * Alterna o estado do tema entre 'light' e 'dark'.
     */
    const toggleTheme = () => {
        setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
    }
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}