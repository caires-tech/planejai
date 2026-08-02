/**
 * Definições de tipos, interfaces e configurações do fluxo de simulação.
 * Contém o mapeamento de etapas do formulário, estrutura das mensagens do chat e tipos do histórico.
 */
import {
    CalendarClock,
    CreditCard,
    Goal,
    Landmark,
    PiggyBank,
    Wallet,
} from 'lucide-react'

import type { FormStepProps } from '../components/features/Simulation/FormStep'
import type { InsightData } from '../services/aiService'

/**
 * Representa uma mensagem individual trocada no chat de insights.
 * id: Identificador único da mensagem.
 * sender: Identifica a origem da mensagem ('user' para usuário ou 'ai' para o assistente).
 * text: Conteúdo em texto da mensagem.
 * timestamp: Data/hora do envio em formato Unix timestamp.
 */
export interface ChatMessage {
    id: string
    sender: 'user' | 'ai'
    text: string
    timestamp: number
}

/**
 * Configuração estática de todas as etapas do formulário de simulação financeira.
 * Define os ícones, rótulos, perguntas e configurações de input para cada passo.
 */
export const simulationFormSteps = [
    {
        id: 'income',
        icon: PiggyBank,
        title: 'Renda mensal bruta',
        question: 'Quanto é depositado na sua conta todo mês (somando todas as fontes)?',
        inputProps: {
            placeholder: 'ex: 5.000,00',
            prefix: 'R$',
            maxLength: 12,
        },
    },
    {
        id: 'expenses',
        icon: CreditCard,
        title: 'Custos fixos de vida',
        question: 'Quanto você gasta mensalmente com custos fixos (aluguel, contas de consumo etc)?',
        inputProps: {
            placeholder: 'ex: 2.000,00',
            prefix: 'R$',
            maxLength: 12,
        },
    },
    {
        id: 'debts',
        icon: Landmark,
        title: 'Dívidas / parcelas',
        question: 'Você tem algum valor comprometido com parcelas ou empréstimos mensalmente?',
        inputProps: {
            placeholder: 'ex: 500,00',
            prefix: 'R$',
            maxLength: 12,
        },
    },
    {
        id: 'goalName',
        icon: Goal,
        title: 'Nome da meta',
        question: 'Qual o objetivo que você deseja alcançar?',
        inputProps: {
            placeholder: 'ex: Viagem para o japão',
            maxLength: 50,
        },
    },
    {
        id: 'goalAmount',
        icon: Wallet,
        title: 'Custo da meta',
        question: 'Quanto custa realizar esse sonho?',
        inputProps: {
            placeholder: 'ex: 15.000,00',
            prefix: 'R$',
            maxLength: 12,
        },
    },
    {
        id: 'goalDeadline',
        icon: CalendarClock,
        title: 'Prazo desejado',
        question: 'Em quantos meses você planeja atingir esse objetivo?',
        inputProps: {
            type: 'number',
            placeholder: 'ex: 12',
            suffix: 'meses',
            min: 1,
            max: 120,
        },
        submitButtonProps: {
            label: 'Gerar simulação',
            emojiIcon: '✨',
        },
    },
] satisfies FormStepProps[]

/**
 * Mapeamento dinâmico dos dados do formulário baseados nos IDs das etapas.
 */
export type SimulationFormData = Record<
    (typeof simulationFormSteps)[number]['id'], 
    string
>

/**
 * Estrutura completa de um registro de simulação salvo no histórico.
 * Inclui os dados informados no formulário, o ID gerado, o insight da IA e as mensagens do chat.
 */
export type SimulationRecord = SimulationFormData & { 
    id: string
    insight?: InsightData
    messages?: ChatMessage[]
}