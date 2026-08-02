/**
 * Página de entrada da aplicação onde o usuário realiza uma nova simulação financeira.
 * Combina o componente de apresentação/abertura (SimulationHero) com o formulário interativo por etapas (SimulationForm).
 */
import { SimulationForm } from "../components/features/Simulation/Form";
import { SimulationHero } from "../components/features/Simulation/Hero";
/**
 * Renderiza o contêiner principal da página de formulário de simulação.
 */
export function SimulationFormPage() {
    return (
        <main className="mx-auto max-w-xl px-4 py-10 sm:py-14">
            <SimulationHero />
            <SimulationForm />
        </main>
    )
}