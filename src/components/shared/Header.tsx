/**
 * Componente do cabeçalho de navegação principal da aplicação.
 * Exibe a marca Planej.ai, atalhos para nova simulação e histórico,
 * além do alternador de tema claro/escuro (Dark Mode).
 */
import { Clock, Moon, Sun, TrendingUp, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from './Button'
import { Divider } from './Divider'
import { useTheme } from '../../hooks/useTheme'

/**
 * Renderiza a barra superior de navegação global com suporte a responsividade e alternância de temas.
 */
export function Header() {
    const navigate = useNavigate()
    const { theme, toggleTheme } = useTheme()
    // Hooks para navegação de rotas e alternância do tema global (Light/Dark)
    return (
        <header className="border-b border-(--border) px-6 py-3">
            <nav className="flex items-center justify-between">
                {/* logo */}
                <div className="flex items-center gap-2">
                    <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-full">
                        <Wallet size={20} className="text-primary-foreground" />
                    </div>
                    <span className="text-lg">
                        <span className="text-muted-foreground font-medium">Planej</span>
                        <span className="font-extrabold">.ai</span>
                    </span>
                </div>

                {/* Actions Buttons */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="secondary"
                        icon={TrendingUp}
                        onClick={() => navigate('/')}
                    >
                        <span className="hidden sm:inline">Nova Simulação</span>
                    </Button>
                    <Button
                        variant="ghost"
                        icon={Clock}
                        onClick={() => navigate('/historico')}
                    >
                        <span className="hidden sm:inline">Histórico</span>
                    </Button>
                    <Divider orientation="vertical" />
                    <Button
                        aria-label={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
                        variant="ghost"
                        icon={theme === 'light' ? Moon : Sun}
                        onClick={toggleTheme}
                    />
                </div>
            </nav>
        </header>
    )
}