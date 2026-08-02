/**
 * Página de histórico de simulações financeiras.
 * Exibe a lista de simulações salvas localmente com suas métricas principais (custo, prazo, economia),
 * além de permitir navegar para os detalhes de uma simulação ou excluí-la.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, Target, Trash2 } from 'lucide-react'
import { Button } from '../components/shared/Button'
import { PageHero } from '../components/shared/PageHero'
import { useSimulationStorage } from '../hooks/useSimulationStorage'
import { calcMonthlySavings } from '../utils/simulation'

/**
 * Renderiza a listagem de simulações armazenadas ou um estado vazio (empty state) caso não haja registros.
 */
export function SimulationHistoryPage() {
  const navigate = useNavigate()
  // Recupera as simulações do LocalStorage e gerencia o estado da lista local
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()
  const [simulations, setSimulations] = useState(getAllSimulations)
  /**
   * Remove uma simulação do armazenamento local e atualiza o estado para refletir a exclusão na interface.
   * id: Identificador da simulação a ser excluída.
   */
  const handleDelete = (id: string) => {
    const updatedList = deleteSimulation(id)
    setSimulations(updatedList)
  }

  const handleViewDetails = (id: string) => {
    void navigate(`/resultado/${id}`)
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Acompanhe o histórico de seus planos financeiros."
      />

      {simulations.length === 0 ? (
        <div className="bg-card flex flex-col items-center justify-center rounded-2xl p-8 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
          <p className="text-muted-foreground text-sm">
            Nenhuma simulação salva até o momento.
          </p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => void navigate('/')}
          >
            Criar primeira simulação
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          // Renderiza os cards de simulação calculando dinamicamente o valor formatado de economia mensal
          {simulations.map((item) => {
            const monthlySavings = calcMonthlySavings(item)
            const formattedSavings = monthlySavings.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })

            return (
              <div
                key={item.id}
                className="bg-card flex flex-col gap-4 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] md:grid md:grid-cols-12 md:items-center"
              >
                {/* Ícone e Nome da Meta (5 colunas) */}
                <div className="flex items-center gap-3.5 md:col-span-5 min-w-0">
                  <div className="bg-primary/15 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                    <Target className="text-primary" size={22} />
                  </div>
                  <div className="min-w-0 pr-2">
                    <h3 
                      className="text-foreground font-semibold text-base line-clamp-2 leading-snug" 
                      title={item.goalName}
                    >
                      {item.goalName}
                    </h3>
                  </div>
                </div>

                {/* Métricas Principais (4 colunas) */}
                <div className="grid grid-cols-3 gap-2 text-left md:col-span-4 border-t border-b border-border/40 py-2 md:border-none md:py-0">
                  <div>
                    <span className="text-muted-foreground block text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap">
                      Custo Meta
                    </span>
                    <span className="text-foreground font-semibold text-xs sm:text-sm truncate block">
                      {item.goalAmount}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap">
                      Prazo
                    </span>
                    <span className="text-foreground font-semibold text-xs sm:text-sm whitespace-nowrap block">
                      {item.goalDeadline} meses
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap">
                      Econ. Mensal
                    </span>
                    <span className="text-foreground font-semibold text-xs sm:text-sm whitespace-nowrap block">
                      R$ {formattedSavings}
                    </span>
                  </div>
                </div>

                {/* Ações (3 colunas) */}
                <div className="flex items-center justify-end gap-2 shrink-0 md:col-span-3">
                  <Button
                    variant="ghost"
                    aria-label="Excluir simulação"
                    className="text-red-500 hover:text-red-600 p-2 shrink-0"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={18} />
                  </Button>

                  <Button
                    variant="secondary"
                    icon={ExternalLink}
                    className="whitespace-nowrap shrink-0 text-xs sm:text-sm px-3 sm:px-4"
                    onClick={() => handleViewDetails(item.id)}
                  >
                    Ver detalhes
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}