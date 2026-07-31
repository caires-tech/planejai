import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ChatMessage, SimulationRecord } from '../data/simulation'

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

// Modelo estável e suportado pelo SDK
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

export const sendChatMessage = async (
    simulation: SimulationRecord,
    history: ChatMessage[],
    newMessage: string
): Promise<string> => {
    const historyText = history.length > 0
        ? history.map(m => `${m.sender === 'user' ? 'Usuário' : 'Educador Financeiro'}: ${m.text}`).join('\n')
        : 'Nenhuma pergunta anterior.'

    const prompt = `
Você é um Educador Financeiro consultivo, amigável e direto.
Responda de forma clara e prática às dúvidas do usuário sobre o planejamento financeiro dele.

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

INSTRUÇÕES:
- Responda diretamente em texto simples.
- Mantenha um tom encorajador e focado em soluções financeiras realistas.
`

    const model = genAI.getGenerativeModel({ model: MODEL_NAME })
    const result = await model.generateContent(prompt)
    return result.response.text()
}