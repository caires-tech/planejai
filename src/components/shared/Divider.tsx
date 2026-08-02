/**
 * Componente divisor genérico e reutilizável.
 * Utilizado para separar visualmente elementos da interface, suportando orientação 
 * horizontal e vertical, espaçamento dinâmico e recursos de acessibilidade (ARIA).
 * Propriedades aceitas pelo componente Divider.
 * orientation: Orientação da linha divisória ('horizontal' ou 'vertical').
 * spacing: Valor numérico do espaçamento em pixels nas margens.
 * className: Classes CSS adicionais para customização.
 */
interface DividerProps {
    orientation?: 'horizontal' | 'vertical'
    spacing?: number
    className?: string
}

/**
 * Renderiza uma linha de separação com suporte a orientação flexível e acessibilidade.
 */
export function Divider({
    orientation = 'horizontal',
    spacing = 16,
    className,
}: DividerProps) {
    // Define o espaçamento dinâmico (margem) baseado na orientação escolhida
    const style = 
        orientation === 'horizontal'
        ? { marginTop: spacing, marginBottom: spacing }
        : { marginLeft: spacing, marginRight: spacing }

    const classNameByOrientation = {
        horizontal: 'w-full h-px',
        vertical: 'self-stretch w-px',
    }

    return (
        <div
            role="separator"
            aria-orientation={orientation}
            style={style}
            className={['bg-border', classNameByOrientation[orientation], className]
                .filter(Boolean)
                .join(' ')}
        />
    )
}