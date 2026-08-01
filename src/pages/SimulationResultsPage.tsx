import { CalendarClock, CreditCardIcon, Goal, Landmark, PiggyBank, Wallet } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { AIInsightsCard } from '../components/features/SimulationResults/AIInsightCardProps'
import { Card } from '../components/features/SimulationResults/Card'
import { PageHero } from '../components/shared/PageHero'
import { useSimulationStorage } from '../hooks/useSimulationStorage'
import { calcMonthlySavings } from '../utils/simulation'

export function SimulationResultsPage() {
  const { id } = useParams<{ id: string }>()
  const { getFormData } = useSimulationStorage()
  const data = id ? getFormData(id) : null

  if (!data) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 text-center">
        <p className="text-muted-foreground">Simulação não encontrada.</p>
      </main>
    )
  }

  const monthlySavings = calcMonthlySavings(data)

  return (
    <main key={data.id} className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Resultado da sua simulação"
        subtitle="Com base no seu perfil financeiro e objetivos"
      />

      {/* Grid Superior */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          icon={Goal}
          label="Custo da Meta"
          value={data.goalAmount}
          subtitle={data.goalName}
        />
        <Card
          icon={CalendarClock}
          label="Prazo"
          value={`${data.goalDeadline} meses`}
          subtitle="Prazo para atingir a meta"
        />
        <Card
          variant="primary"
          icon={PiggyBank}
          label="Economia mensal"
          value={`R$ ${monthlySavings.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          subtitle="Economia mensal necessária"
        />
      </div>

      {/* Grid Inferior - Sem items-stretch */}
      <div className="grid gap-6 lg:grid-cols-3">
        <AIInsightsCard key={data.id} simulationId={data.id} />

        {/* Coluna da Direita */}
        <div className="order-1 flex flex-col gap-8 lg:order-2">
          <Card
            icon={Wallet}
            label="Renda mensal"
            value={data.income}
            subtitle="Renda total bruta por mês"
          />
          <Card
            icon={CreditCardIcon}
            label="Custos Fixos da vida"
            value={data.expenses}
            subtitle="Gastos essenciais por mês"
          />
          <Card
            icon={Landmark}
            label="Dívidas / Parcelas"
            value={data.debts}
            subtitle="Valor comprometido e parcelas/depósito"
          />
        </div>
      </div>
    </main>
  )
}