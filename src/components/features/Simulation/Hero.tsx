/**
 * Componente de cabeçalho (Hero) da tela inicial do formulário de simulação.
 * Exibe o título chamativo, a ilustração do cofrinho e a instrução inicial.
 */
import PiggyBankImage from '../../../assets/images/piggy-bank.png'

/**
 * Renderiza o bloco introdutório visual no topo da página de simulação.
 */
export function SimulationHero() {
    return (
        <div className="mb-8 text-center">
            <div className="flex flex-col items-center sm:flex-row">
                <h1 className="text-foreground text-3xl font-semibold sm:text-4xl">
                    Vamos planejar seu futuro
                </h1>
                <img
                    src={PiggyBankImage}
                    alt=""
                    aria-hidden="true"
                    className="h-16 w-16 sm:-mt-2 sm:-ml-3"
                />
            </div>
            <p className="text-muted-foreground text-sm">
                Responda algumas questões para ter insights financeiros personalizados
            </p>
        </div>
    )
}