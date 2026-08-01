import { useState, useRef, useEffect } from "react"
import Skeleton from "react-loading-skeleton"
import { MessageSquare, Send } from "lucide-react"
import { useInsight } from "../../../hooks/useInsight"
import { Content } from "../insights/Content"
import { Error } from "../insights/Error"
import 'react-loading-skeleton/dist/skeleton.css'

interface AIInsightCardProps {
    simulationId: string
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
    const { 
        insight, 
        messages, 
        isLoading, 
        isSendingMessage, 
        error, 
        chatError, 
        fetchInsight, 
        sendMessage 
    } = useInsight(simulationId)

    const [inputText, setInputText] = useState("")
    
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        
        if (!isSendingMessage) {
            inputRef.current?.focus()
        }
    }, [messages, isSendingMessage])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputText.trim() || isSendingMessage) return

        const textToSend = inputText
        setInputText("")
        await sendMessage(textToSend)
    }

    return (
        <div className="bg-card order-2 flex h-full max-h-[480px] flex-col justify-between rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
            
            {/* Cabeçalho Fixo */}
            <div className="mb-3 flex shrink-0 items-center gap-1.5">
                <span>✨</span>
                <span className="text-primary text-xs font-semibold tracking-widest uppercase">
                    Insight Financeiro Personalizado
                </span>
            </div>

            {/* Container ÚNICO com scroll vertical */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 min-h-0">
                {isLoading && (
                    <div className="flex">
                        <Skeleton
                            count={10}
                            baseColor="var(--color-skeleton-base)"
                            highlightColor="var(--color-skeleton-highlight)"
                            className="mb-3 flex rounded-lg"
                            containerClassName="flex-1"
                            inline
                        />
                    </div>
                )}

                {!isLoading && error && (
                    <Error 
                        simulationId={simulationId}
                        message={error}
                        onRetry={() => { fetchInsight() }}
                    />
                )}

                {!isLoading && insight && !error && (
                    <>
                        <Content insight={insight} />

                        {messages.length > 0 && (
                            <div className="pt-4 border-t border-border space-y-6">
                                {messages.map((msg) => (
                                    <div key={msg.id} className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-primary font-medium text-sm">
                                            <MessageSquare className="w-4 h-4 text-primary" />
                                            <span>{msg.sender === 'user' ? 'Você' : 'Resposta da IA'}</span>
                                        </div>
                                        <p className="text-sm text-foreground/80 leading-relaxed pl-6 text-justify">
                                            {msg.text.replaceAll('**', '')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isSendingMessage && (
                            <div className="flex items-center gap-2 text-xs text-primary/80 pl-6 animate-pulse">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Educador financeiro está digitando a resposta...</span>
                            </div>
                        )}

                        {/* Feedback visual de Erro no Chat */}
                        {chatError && (
                            <p className="text-xs text-red-500 pl-6">{chatError}</p>
                        )}

                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input adaptado ao sistema de temas (Theme Aware) */}
            {!isLoading && insight && !error && (
                <form onSubmit={handleSend} className="mt-4 pt-3 border-t border-border flex items-center gap-2 shrink-0">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Quais são os investimentos mais seguros que posso usar para que minha renda aumente?"
                        disabled={isSendingMessage}
                        className="flex-1 bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim() || isSendingMessage}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            )}
        </div>
    )
}