/**
 * Componente principal do formulário multi-etapas de simulação financeira.
 * Gerencia o estado dos passos (wizard), coleta os dados informados pelo usuário,
 * persiste no storage local e redireciona para a tela de resultado.
 */
import { useState } from "react"
import { simulationFormSteps, type SimulationFormData } from "../../../data/simulation"
import { FormStep } from "./FormStep"
import { StepProgress } from "./Progress"
import { PiggyBank } from "lucide-react"
import { useSimulationStorage } from "../../../hooks/useSimulationStorage"
import { useNavigate } from "react-router-dom"

/**
 * Componente que controla o fluxo sequencial das perguntas da simulação.
 */
export const SimulationForm = () => {
    // Hooks para persistência de dados local e navegação de rotas
    const { saveFormData } = useSimulationStorage()
    const navigate = useNavigate()
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [formData, setFormData] = useState<SimulationFormData>({} as SimulationFormData)
    const totalSteps = simulationFormSteps.length
    const currentStep = simulationFormSteps[currentStepIndex]
    /**
     * Avança para a próxima etapa do formulário ou finaliza a simulação.
     * Atualiza o estado com o valor do passo atual e, se for o último passo,
     * salva a simulação e navega para a rota de resultados.
     * value: Valor preenchido no campo do passo atual.
     */
    const handleNextStep = (value: string) => {
        const updatedFormData = { ...formData, [currentStep.id]: value }
        setFormData(updatedFormData)

        if (currentStepIndex + 1 > totalSteps - 1) {
            const id = saveFormData(updatedFormData)
            void navigate(`/resultado/${id}`)
            return
        }
        setCurrentStepIndex((prev) => prev + 1)
    }
    /**
     * Retorna para a etapa anterior do formulário, se não estiver na primeira etapa.
     */
    const handlePreviousStep = () => {
        if (currentStepIndex === 0) {
            return
        }
        setCurrentStepIndex((prev) => prev - 1)
    }

    return (
       <>
            <StepProgress currentStep={currentStepIndex + 1} totalSteps={totalSteps}/>
            <FormStep key={currentStep.id} {...currentStep} onBack={handlePreviousStep} onNext={handleNextStep} hideBackButton={currentStepIndex === 0} />
       </>
    )
}