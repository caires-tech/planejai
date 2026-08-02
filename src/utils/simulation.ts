/**
 * Funções utilitárias para cálculos financeiros das simulações de metas.
 */
import type { SimulationFormData } from "../data/simulation";
import { parseCurrency } from "./currency";

/**
 * Calcula a capacidade de economia mensal estimada do usuário.
 * Subtrai os custos fixos e as dívidas da renda mensal informada.
 * 
 * data: Objeto com os dados digitados no formulário de simulação.
 * returns: Valor numérico da sobra financeira mensal disponível (pode ser negativo).
 */
export function calcMonthlySavings(data: SimulationFormData) {
    return (
        parseCurrency(data.income) - 
        parseCurrency(data.expenses) - 
        parseCurrency(data.debts)
    )
}