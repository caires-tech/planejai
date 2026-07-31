import { useCallback, useEffect, useRef, useState } from "react"
import { getInsight, sendChatMessage, type InsightData } from "../services/aiService"
import { buildAIPrompt } from "../data/aiPrompt"
import { useSimulationStorage } from "./useSimulationStorage"
import type { ChatMessage, SimulationRecord } from "../data/simulation"

export const useInsight = (id: string) => {
  const { getFormData, updateSimulation } = useSimulationStorage()

  // Trava rígida: armazena qual ID já teve tentativa de disparo nesta sessão
  const fetchedIdRef = useRef<string | null>(null)
  const isFetchingRef = useRef<boolean>(false)

  // Inicializa o insight com o cache local se existir
  const [insight, setInsight] = useState<InsightData | null>(() => {
    if (!id) return null
    const simulation = getFormData(id)
    return simulation?.insight ?? null
  })

  // Inicializa o histórico de mensagens com o cache local se existir
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (!id) return []
    const simulation = getFormData(id)
    return simulation?.messages ?? []
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [chatError, setChatError] = useState<string | null>(null)

  const fetchInsight = useCallback(
    async (simulationId: string, forceRetry = false) => {
      if (!simulationId) return

      // Se já está buscando ou se já tentou disparar esse ID (e não é uma tentativa manual via botão)
      if (isFetchingRef.current || (!forceRetry && fetchedIdRef.current === simulationId)) {
        return
      }

      const simulation = getFormData(simulationId)

      if (!simulation) {
        setError('Simulação não encontrada.')
        return
      }

      // Se já possui o insight em cache no localStorage
      if (simulation.insight && !forceRetry) {
        setInsight(simulation.insight)
        setMessages(simulation.messages ?? [])
        setError(null)
        return
      }

      // REGISTRA A TRAVA ANTES DE EXECUTAR
      isFetchingRef.current = true
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
        setError('Erro ao gerar o diagnóstico. Tente novamente')
        // Mantemos fetchedIdRef.current marcado com o ID para IMPEDIR que o useEffect tente de novo automaticamente
      } finally {
        setIsLoading(false)
        isFetchingRef.current = false
      }
    },
    [getFormData, updateSimulation],
  )

  // Função para enviar uma nova pergunta do usuário no chat
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isSendingMessage || !id) return

      const simulation = getFormData(id)
      if (!simulation) return

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'user',
        text: text.trim(),
        timestamp: Date.now(),
      }

      const updatedMessagesWithUser = [...messages, userMessage]

      setMessages(updatedMessagesWithUser)
      setIsSendingMessage(true)
      setChatError(null)

      try {
        const replyText = await sendChatMessage(simulation, messages, text.trim())

        const aiMessage: ChatMessage = {
          id: crypto.randomUUID(),
          sender: 'ai',
          text: replyText,
          timestamp: Date.now(),
        }

        const finalMessages = [...updatedMessagesWithUser, aiMessage]
        setMessages(finalMessages)

        updateSimulation(id, {
          ...simulation,
          messages: finalMessages,
        } as SimulationRecord)
      } catch (err) {
        console.error('Erro ao enviar mensagem:', err)
        setChatError('Erro ao obter resposta da IA. Tente novamente.')
      } finally {
        setIsSendingMessage(false)
      }
    },
    [getFormData, id, isSendingMessage, messages, updateSimulation],
  )

  useEffect(() => {
    if (!id) return

    const currentSimulation = getFormData(id)

    // 1. Se já tem insight salvo, carrega do cache
    if (currentSimulation?.insight) {
      setInsight(currentSimulation.insight)
      setMessages(currentSimulation.messages ?? [])
      setError(null)
      return
    }

    // 2. Só dispara o fetch se AINDA NÃO tentou esse ID nesta sessão
    if (fetchedIdRef.current !== id) {
      void fetchInsight(id)
    }
  }, [id, fetchInsight, getFormData])

  // Função exportada para quando o usuário clicar manualmente no botão "Tentar novamente"
  const retryFetch = useCallback(() => {
    if (id) {
      void fetchInsight(id, true)
    }
  }, [id, fetchInsight])

  return {
    insight,
    messages,
    isLoading,
    isSendingMessage,
    error,
    chatError,
    fetchInsight: retryFetch, // Repassa a função de retry forçado para o botão
    sendMessage,
  }
}