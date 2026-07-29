import { useCallback, useEffect, useState } from "react"
import { getInsight, type InsightData } from "../services/aiService"
import { buildAIPrompt } from "../data/aiPrompt"
import { useSimulationStorage } from "./useSimulationStorage"
import { data } from "react-router-dom"

export const useInsight = (id: string) => {
    const [insight, setInsight] = useState<InsightData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { getFormData } = useSimulationStorage()

    //Necessário o uso do useCallBack pois temos que colocar essa função
    //Como array de dependências do useEffect
    const fetchInsight = useCallback(
        async (simulationId: string) => {
            const simulation = getFormData(simulationId)

            if (!simulation) {
                setError('Simulação não encontrada.')
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                const prompt = buildAIPrompt(simulation)
                const data = await getInsight(prompt)
                setInsight(data)
            } catch {
                setError('Erro ao gerar o diagnóstico. Tente novamente')
            } finally {
                setIsLoading(false)
            }
        },
        [getFormData],
    )

    useEffect(() => {
        // Evita loop infinito de requisições para a API do Gemini
        if (!data) {
            return
        }

        fetchInsight(id)
    }, [id, insight, isLoading, fetchInsight])

    return { insight, isLoading, error, fetchInsight }
}