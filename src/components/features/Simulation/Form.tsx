import { FormStep } from "./FormStep"
import { StepProgress } from "./Progress"
import { PiggyBank } from "lucide-react"

export const SimulationForm = () => {
    return (
       <>
            <StepProgress currentStep={1} totalSteps={6}/>
            <FormStep
                icon={PiggyBank}
                title="Renda mensal bruta"
                question="Quanto é depositado ma sua conta todo mês (somando todas as fontes)?"
                inputProps={{
                    type: 'text',
                    placeholder: 'ex: 5.000,00',
                    prefix: 'R$',
                }}
            />
       </>
    )
}