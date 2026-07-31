import { useCallback, useEffect, useRef, useState } from "react"
import { getInsight, type InsightData } from "../services/aiService"
import { buildAIPrompt } from "../data/aiPrompt"
import { useSimulationStorage } from "./useSimulationStorage"
import type { SimulationRecord } from "../data/simulation"

export const useInsight = (id: string) => {
  const { getFormData, updateSimulation } = useSimulationStorage()

  // Guarda o ID da simulação que já teve a busca disparada/carregada
  const fetchedIdRef = useRef<string | null>(null)

  // Inicializa com o cache local se já existir
  const [insight, setInsight] = useState<InsightData | null>(() => {
    if (!id) return null
    const simulation = getFormData(id)
    return simulation?.insight ?? null
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInsight = useCallback(
    async (simulationId: string) => {
      if (!simulationId) return

      const simulation = getFormData(simulationId)

      if (!simulation) {
        setError('Simulação não encontrada.')
        return
      }

      // Se já possui o insight em cache no localStorage
      if (simulation.insight) {
        setInsight(simulation.insight)
        setError(null)
        return
      }

      // MARCAÇÃO IMEDIATA: Bloqueia qualquer chamada paralela com o mesmo ID
      fetchedIdRef.current = simulationId

      setIsLoading(true)
      setError(null)

      try {
        const prompt = buildAIPrompt(simulation)
        const data = await getInsight(prompt)
        
        setInsight(data)
        setError(null)

        updateSimulation(simulationId, {
          ...simulation,
          insight: data,
        } as SimulationRecord)
      } catch (err) {
        console.error('Erro na requisição da IA:', err)
        // Em caso de erro, permite que o usuário possa tentar novamente via botão
        fetchedIdRef.current = null 
        setError('Erro ao gerar o diagnóstico. Tente novamente')
      } finally {
        setIsLoading(false)
      }
    },
    [getFormData, updateSimulation],
  )

  useEffect(() => {
    // 1. Se não tiver ID válido, encerra
    if (!id) return

    // 2. Se o ID mudou na navegação, atualiza o estado local do insight com o novo cache
    const currentSimulation = getFormData(id)
    if (currentSimulation?.insight) {
      setInsight(currentSimulation.insight)
      setError(null)
      return
    }

    // 3. Se já temos o insight, se está carregando ou se este ID JÁ foi enviado/disparado, Bloqueia!
    if (insight || isLoading || error || fetchedIdRef.current === id) {
      return
    }

    void fetchInsight(id)
  }, [id, insight, isLoading, error, fetchInsight, getFormData])

  return { insight, isLoading, error, fetchInsight }
}