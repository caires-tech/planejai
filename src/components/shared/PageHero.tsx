/**
 * Componente genérico de cabeçalho para páginas internas (ex: Histórico, Resultado).
 * Exibe um título principal e um subtítulo descritivo com margens e estilos padronizados.
 */
interface PageHeroProps {
    title: string
    subtitle: string
}

/**
 * Renderiza o cabeçalho textual reutilizável para páginas da aplicação.
 */
export function PageHero({ title, subtitle }: PageHeroProps) {
    return (
        <>
            <h1 className="text-foreground mb-1 text-2xl font-semibold am:text-3xl">
                {title}
            </h1>
            <p className="text-muted-foreground mb-8 text-sm">
                {subtitle}
            </p>
        </>
    )
}