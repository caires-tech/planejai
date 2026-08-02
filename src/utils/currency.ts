/**
 * Funções utilitárias para formatação e conversão de valores monetários no formato Real (BRL).
 * Aplica máscara de moeda em tempo de digitação (ex: de "1000" para "10,00").
 * Extrai apenas dígitos, divide por 100 e formata para a moeda brasileira.
 * value: String contendo os caracteres digitados.
 * String: formatada no padrão PT-BR ("0,00").
 */
export function formatCurrencyMask(value: string): string {
    const digits = value.replace(/\D/g, "");
    // Remove qualquer caractere que não seja número
    if (!digits) {
        return ""
    }

    const number = Number(digits) / 100;

    if (isNaN(number)) {
        return ""
    }

    return number.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
/**
 * Converte uma string formatada em moeda brasileira de volta para um valor numérico (number).
 * Exemplo: "R$ 1.250,50" -> 1250.5
 * value: String formatada em moeda.
 * returns: Número float equivalente ou 0 se inválido.
 */
export function parseCurrency(value: string): number {
    return (
        parseFloat(value.replace(/\./g, '').replace(',', '.').replace('R$', '')) || 0
    )
}