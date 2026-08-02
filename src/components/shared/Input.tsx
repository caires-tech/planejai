/**
 * Componente de campo de entrada de texto padronizado.
 * Suporta a inserção opcional de prefixo (ex: "R$") e sufixo (ex: "meses"),
 * utilizando o componente Divider para separação visual elegante.
 */
import type { InputHTMLAttributes } from 'react'
import { Divider } from './Divider'

/**
 * Propriedades aceitas pelo componente Input.
 * Herda todos os atributos nativos de um elemento input do React.
 * prefix: Texto exibido no início do campo (ex: "R$").
 * suffix: Texto exibido no final do campo (ex: "meses").
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    prefix?: string
    suffix?: string
}

/**
 * Renderiza o input envolvido em um container estilizado com suporte a pré/pós-fixos.
 */
export function Input({ prefix, suffix, ...rest }: InputProps) {
    return (
        <div className="bg-input flex items-center rounded-2xl p-4 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
            {prefix && (
                <>
                    <span className="text-muted-foreground text-sm font-medium">
                        {prefix}
                    </span>
                    <Divider orientation="vertical" />
                    </>
            )}
            <input
                className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
                autoFocus
                {...rest}
            />
            {suffix && (
                <>
                    <Divider orientation="vertical" />
                    <span className="text-muted-foreground text-sm font-medium">
                        {suffix}
                    </span>
                </>
            )}
        </div>
    )

}