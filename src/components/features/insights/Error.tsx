/**
 * Componente de UI para exibição de mensagens de erro durante a requisição da IA.
 * Fornece feedback visual ao usuário e um botão para tentar a requisição novamente.
 */
import { RefreshCw } from "lucide-react"
import { Button } from "../../shared/Button"

/**
 * Propriedades aceitas pelo componente Error.
 * simulationId: Identificador da simulação atual.
 * message: Mensagem descritiva do erro ocorrido.
 * onRetry: Função de callback acionada para reexecutar a chamada.
 */
interface ErrorProps {
    simulationId: string
    message: string
    onRetry: () => void
}

/**
 * Componente de fallback exibido quando ocorre uma falha no carregamento dos insights.
 */
export function Error({ simulationId, message, onRetry }: ErrorProps) {
    if (!simulationId || !message) {
        return null
    }

    return (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
            <p className="text-sm text-red-500">⚠️ {message}</p>
            <Button
                variant="primary"
                className="px-6"
                icon={RefreshCw}
                onClick={onRetry}
            >
                Tentar novamente
            </Button>
        </div>
    )
}