/**
 * Componente genérico e reutilizável de cartão para exibição de métricas e indicadores.
 * Suporta diferentes variantes visuais (padrão e destaque) adaptadas aos temas da aplicação.
 */
import type { LucideIcon } from 'lucide-react'

/**
 * Propriedades aceitas pelo componente Card.
 * icon: Ícone do Lucide a ser exibido no cabeçalho.
 * label: Rótulo ou título da métrica.
 * value: Valor principal em destaque (ex: "R$ 5.000,00").
 * subtitle: Texto explicativo ou complementar.
 * variant: Estilo visual do card ('default' ou 'primary').
 */
interface CardProps {
    icon: LucideIcon
    label: string
    value: string
    subtitle: string
    variant?: 'default' | 'primary'
}

/**
 * Mapeamento de classes de estilização dinâmicas baseadas na variante selecionada.
 */
const variantClasses = {
    default: {
        card: 'bg-card',
        accent: 'text-primary',
        value: 'text-foreground',
        subtitle: 'text-muted-foreground',
    },
    primary: {
        card: 'bg-primary',
        accent: 'text-primary-foreground',
        value: 'text-primary-foreground',
        subtitle: 'text-primary-foreground/70',
    },
}

/**
 * Renderiza um card contendo ícone, rótulo, valor principal e subtítulo estilizados.
 */
export function Card({
    icon: Icon,
    label,
    value,
    subtitle,
    variant = 'default',
}: CardProps) {
    const styles = variantClasses[variant]

    return (
        <div
            className={[
                'rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]',
                styles.card,
            ].join(' ')}
        >
            <div className="mb-3 flex items-center gap-2">
                <Icon size={16} className={styles.accent} />
                <span
                    className={[
                        'text-xs font-semibold tracking-widest uppercase',
                        styles.accent,
                    ].join(' ')}
                >
                    {label}
                </span>
            </div>
            <p className={['text-3xl font-semibold', styles.value].join(' ')}>
                {value}
            </p>
            <p className={['mt-1 text-sm', styles.subtitle].join(' ')}>
                {subtitle}
            </p>
        </div>
    )
}