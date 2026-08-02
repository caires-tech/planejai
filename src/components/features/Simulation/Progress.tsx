/**
 * Componente de barra de progresso visual e textual para o formulário multi-etapas.
 * Exibe o indicador quantitativo de etapas (ex: Passo 1 de 6) e a barra com preenchimento percentual.
 * Propriedades aceitas pelo componente StepProgress.
 * currentStep: Índice da etapa atual em execução (base 1).
 * totalSteps: Quantidade total de etapas do formulário.
 */
interface StepProgressProps {
    currentStep: number
    totalSteps: number
}

/**
 * Renderiza o progresso numérico e a barra de preenchimento dinâmica com atributos de acessibilidade (ARIA).
 */
export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
    const progress = (currentStep / totalSteps) * 100

    return (
        <div className="mb-4">
            <p className="text-muted-foreground md-2 text-sm">
                Passo {currentStep} de {totalSteps}
            </p>
            <div className="bg-border h-1 w-full overflow-hidden rounded-full">
                <div 
                    role="progressbar"
                    aria-valuenow={currentStep}
                    aria-valuemin={1}
                    aria-valuemax={totalSteps}
                    aria-label={`Passo ${currentStep} de ${totalSteps}`}
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                    />
            </div>
        </div>
    )
}