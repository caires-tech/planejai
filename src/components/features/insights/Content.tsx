/**
 * Componente encarregado de renderizar visualmente os dados do diagnóstico 
 * retornado pela IA (viabilidade, diagnóstico, sugestões, investimentos e motivação).
 */
import type { PropsWithChildren } from "react"
import type { InsightData } from "../../../services/aiService"

/**
 * Propriedades aceitas pelo componente Content.
 */
interface ContentProps {
    insight: InsightData
}

// ==========================================
// SUBCOMPONENTES AUXILIARES DE ESTILIZAÇÃO
// ==========================================

/**
 * Parágrafo padrão padronizado com estilos de tipografia e espaçamento.
 */
function Paragraph({ children }: PropsWithChildren) {
    return (
        <p className="text-muted-foreground text-sm leading-relaxed">{children}</p>
    )
}

/**
 * Título de seção com formatação de texto e margens pré-definidas.
 */
function SectionTitle({ children }: PropsWithChildren) {
    return (
        <h3 className="text-foreground mt-5 mb-1.5 text-sm leading-relaxed font-semibold">
            {children}
        </h3>
    )
}

/**
 * Lista ordenada (1, 2, 3...) para exibição dos itens de sugestões e recomendações.
 */
function OrderedList({ items}: { items: string[] }) {
    return (
        <ol className="text-muted-foreground ml-6 list-decimal text-sm leading-relaxed">
            {items.map((item, index) => (
                <li key={index} className="pl-1">
                    {item}
                </li>
            ))}
        </ol>
    )
}

/**
 * Mapeamento de estilos visuais (badges/tags) de acordo com a viabilidade calculada pela IA.
 */
const statusStyles = {
    viable: {
        label: 'Meta viável no prazo',
        className:
            'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300',
    },
    needs_adjustment: {
        label: 'Ajuste necessário',
        className:
            'bg-amber-100 text-amber-950 font-bold border border-amber-300',
    },
    unfeasible: {
        label: 'Meta inviável no prazo',
        className: 
            'bg-rose-100 text-rose-950 font-bold border border-rose-300',
    },
}

/**
 * Componente principal que organiza a exibição modular dos insights da IA em seções visuais.
 */
export function Content({ insight }: ContentProps) {
    const status = statusStyles[insight.feasibility.status] ?? null

    return (
        <div className="space-y-4">
            <section className="flex flex-col gap-2">
                <div className="flex flex-col items-start gap-2 sm:flex-row">
                    <span className="text-foreground text-sm font-semibold">
                        🎯 Viabilidade da Meta
                    </span>
                    {status && (
                        <span
                            className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
                        >
                            {status.label}
                        </span>
                    )}
                </div>
                <Paragraph>{insight.feasibility.content}</Paragraph>
            </section>

            <section>
                <SectionTitle>💰 Diagnóstico Financeiro</SectionTitle>
                <Paragraph>{insight.diagnosis.content}</Paragraph>
            </section>

            <section>
                <SectionTitle>📋 Sugestões Práticas</SectionTitle>
                <OrderedList items={insight.suggestions.items}/>
            </section>

            <section>
                <SectionTitle>💡 Como aumentar sua renda</SectionTitle>
                <OrderedList items={insight.extraIncome.items}/>
            </section>

            <section>
                <SectionTitle>🏛 Sugestões de Investimento</SectionTitle>
                <OrderedList items={insight.investment.items}/>
            </section>

            <section>
                <SectionTitle>🚀 Mensagem Final</SectionTitle>
                <Paragraph>{insight.motivation.content}</Paragraph>
            </section>
        </div>
    )
}