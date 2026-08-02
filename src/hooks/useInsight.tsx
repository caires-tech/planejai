/**
 * Custom hook responsável pela integração do frontend com o serviço de IA.
 * Gerencia a busca do diagnóstico financeiro, controle de cache/persistência local,
 * envio de mensagens no chat em tempo real e prevenção de memory leaks (component unmount).
 */
import { useCallback, useEffect, useRef, useState } from "react"
import { getInsight, sendChatMessage, type InsightData } from "../services/aiService"
import { buildAIPrompt } from "../data/aiPrompt"
import { useSimulationStorage } from "./useSimulationStorage"
import type { ChatMessage, SimulationRecord } from "../data/simulation"

/**
 * Gerencia todo o ciclo de vida dos insights e interações do chat por simulação.
 * 
 * id: Identificador único da simulação ativa.
 * Objeto: contendo estados (insight, mensagens, loading, erros) e métodos (fetchInsight, sendMessage).
 */
export const useInsight = (id: string) => {
  const { getFormData, updateSimulation } = useSimulationStorage()

  // Controle de concorrência e montagem de componente para evitar memory leaks
  const isMountedRef = useRef<boolean>(true)
  const fetchedIdRef = useRef<string | null>(null)
  const isFetchingRef = useRef<boolean>(false)
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

  /**
   * Executa a requisição para gerar o diagnóstico financeiro via IA.
   * Valida se já existe cache salvo antes de efetuar chamadas externas.
   * 
   * simulationId: ID da simulação a ser processada.
   * forceRetry: Se verdadeiro, ignora as travas de cache e força nova requisição.
   */
  const fetchInsight = useCallback(
    async (simulationId: string, forceRetry = false) => {
      if (!simulationId) return

      if (isFetchingRef.current || (!forceRetry && fetchedIdRef.current === simulationId)) {
        return
      }

      const simulation = getFormData(simulationId)

      if (!simulation) {
        if (isMountedRef.current) setError('Simulação não encontrada.')
        return
      }

      if (simulation.insight && !forceRetry) {
        if (isMountedRef.current) {
          setInsight(simulation.insight)
          setMessages(simulation.messages ?? [])
          setError(null)
        }
        return
      }

      isFetchingRef.current = true
      fetchedIdRef.current = simulationId

      if (isMountedRef.current) {
        setIsLoading(true)
        setError(null)
      }

      try {
        const prompt = buildAIPrompt(simulation)
        const data = await getInsight(prompt)

        // SÓ ATUALIZA O ESTADO SE O COMPONENTE AINDA ESTIVER MONTADO
        if (isMountedRef.current) {
          setInsight(data)
          setError(null)
        }

        updateSimulation(simulationId, {
          ...simulation,
          insight: data,
        } as SimulationRecord)
      } catch (err) {
        console.error('Erro na requisição da IA:', err)
        if (isMountedRef.current) {
          setError('Erro ao gerar o diagnóstico. Tente novamente')
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false)
        }
        isFetchingRef.current = false
      }
    },
    [getFormData, updateSimulation],
  )

  /**
   * Trata o envio de mensagens do usuário no chat e obtém a trégua/resposta da IA.
   * Mantém o histórico sincronizado no estado local e no armazenamento contínuo.
   * text: Texto da mensagem enviada pelo usuário.
   */
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

        if (isMountedRef.current) {
          setMessages(finalMessages)
        }

        updateSimulation(id, {
          ...simulation,
          messages: finalMessages,
        } as SimulationRecord)
      } catch (err) {
        console.error('Erro ao enviar mensagem:', err)
        if (isMountedRef.current) {
          setChatError('Erro ao obter resposta da IA. Tente novamente.')
        }
      } finally {
        if (isMountedRef.current) {
          setIsSendingMessage(false)
        }
      }
    },
    [getFormData, id, isSendingMessage, messages, updateSimulation],
  )

  // Monitora mudanças na rota/ID para inicializar os dados ou buscar novos insights
  useEffect(() => {
    isMountedRef.current = true

    if (!id) return

    const currentSimulation = getFormData(id)

    if (currentSimulation?.insight) {
      setInsight(currentSimulation.insight)
      setMessages(currentSimulation.messages ?? [])
      setError(null)
    } else if (fetchedIdRef.current !== id) {
      void fetchInsight(id)
    }

    return () => {
      isMountedRef.current = false
    }
  }, [id])
  /**
   * Função utilitária exposta para re-tentar a busca de insights em caso de erro.
   */
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
    fetchInsight: retryFetch,
    sendMessage,
  }
}