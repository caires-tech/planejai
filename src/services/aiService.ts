/**
 * Módulo de integração com a API do Google Gemini (Google Generative AI).
 * Responsável por obter diagnósticos financeiros estruturados em JSON e gerenciar
 * as interações do chat conversacional com o Educador Financeiro.
 */
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ChatMessage, SimulationRecord } from '../data/simulation'

/**
 * Interface que representa a estrutura do diagnóstico (insight) retornado pela IA.
 */
export interface InsightData {
    feasibility: {
        status: 'viable' | 'needs_adjustment' | 'unfeasible'
        content: string
    }
    diagnosis: {
        content: string
    }
    suggestions: {
        items: string[]
    }
    extraIncome: {
        items: string[]
    }
    investment: {
        items: string[]
    }
    motivation: {
        content: string
    }
}

// Obtém a API key do .env.local
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(API_KEY)

// Modelo da IA suportado pela API Key
const MODEL_NAME = 'gemini-flash-latest'

export const getInsight = async (prompt: string): Promise<InsightData> => {
    const model = genAI.getGenerativeModel({ 
        model: MODEL_NAME,
        generationConfig: { responseMimeType: 'application/json' } 
    })

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    return JSON.parse(responseText) as InsightData
}

/**
 * Envia uma mensagem do usuário para o assistente virtual de educação financeira.
 * Mantém o contexto incluindo os dados da simulação e o histórico recente da conversa.
 * simulation: Registro com os dados financeiros do usuário.
 * history: Histórico prévio de mensagens da conversa.
 * newMessage: Nova mensagem/dúvida enviada pelo usuário.
 * Resposta: em texto puro gerada pelo assistente.
 */
export const sendChatMessage = async (
    simulation: SimulationRecord,
    history: ChatMessage[],
    newMessage: string
): Promise<string> => {
    const historyText = history.length > 0
        ? history.map(m => `${m.sender === 'user' ? 'Usuário' : 'Educador Financeiro'}: ${m.text}`).join('\n')
        : 'Nenhuma pergunta anterior.'

    const prompt = `
Você é um Educador Financeiro consultivo, amigável e extremamente direto.
Responda às dúvidas do usuário sobre o planejamento financeiro dele de forma clara, sucinta e objetiva.

DADOS DA SIMULAÇÃO DO USUÁRIO:
- Objetivo: ${simulation.goalName}
- Custo da Meta: R$ ${simulation.goalAmount}
- Prazo: ${simulation.goalDeadline} meses
- Renda Mensal: R$ ${simulation.income}
- Custos Fixos: R$ ${simulation.expenses}
- Dívidas / Parcelas: R$ ${simulation.debts}

HISTÓRICO DA CONVERSA:
${historyText}

NOVA PERGUNTA DO USUÁRIO:
${newMessage}

INSTRUÇÕES OBRIGATÓRIAS:
- NUNCA use formatação Markdown (como **, *, # ou listas numeradas). Escreva estritamente em texto puro (plain text).
- Seja extremamente conciso, sucinto e direto ao ponto.
- Limite sua resposta a no máximo 4 ou 5 parágrafos curtos.
- Evite saudações longas ou explicações extensas, focando nos cálculos e na solução prática.
- Mantenha um tom encorajador e realista.
`

    const model = genAI.getGenerativeModel({ model: MODEL_NAME })
    const result = await model.generateContent(prompt)
    return result.response.text()
}