/**
 * Componente genérico e reutilizável de botão.
 * Suporta múltiplos estilos visuais (variantes), adição opcional de ícones Lucide
 * e herda todas as propriedades nativas de um botão HTML.
 */
import type { ButtonHTMLAttributes } from "react"
import type { LucideIcon } from 'lucide-react'

/**
 * Propriedades aceitas pelo componente Button.
 * Extende os atributos nativos de botão do React.
 * variant: Estilo visual do botão ('primary', 'secondary' ou 'ghost').
 * icon: Ícone opcional do Lucide a ser exibido ao lado do texto.
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'primary' | 'secondary' | 'ghost'
    icon?: LucideIcon
}

// ==========================================
// CONFIGURAÇÕES DE ESTILIZAÇÃO E VARIANTES
// ==========================================
const baseClasses = 
    'flex cursor-pointer items-center justify-center font-medium text-sm gap-2 px-4 py-3 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-80'

const variantClasses = {
    primary: 'bg-primary text-primary-foreground font-semibold rounded-xl',
    secondary: 'bg-secondary-button border border-border rounded-3xl',
    ghost: 'rounded-lg text-foreground',
}

/**
 * Renderiza o elemento de botão customizado aplicando as classes de variante e mesclando o ícone.
 */
export function Button({
    variant,
    icon: Icon,
    children,
    className,
    ...props
}: ButtonProps) {
    return (
        <button {...props} className={[baseClasses, variantClasses[variant], className].join(' ')}>
            {Icon && <Icon size={20} />}
            {children}
        </button>
    )
}