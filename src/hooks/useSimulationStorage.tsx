/**
 * Custom hook responsável pela persistência dos dados de simulação no LocalStorage.
 * Prove métodos de CRUD (Criar, Ler, Atualizar e Deletar) para gerenciar o histórico 
 * de simulações e dados associados (insights e mensagens do chat).
 */
import type { SimulationFormData, SimulationRecord } from "../data/simulation"

/**
 * Chave utilizada para leitura e escrita dos registros no LocalStorage do navegador.
 */
const LOCAL_STORAGE_KEY = 'simulation-data'

/**
 * Disponibiliza métodos utilitários para manipular o armazenamento local das simulações.
 */
export const useSimulationStorage = () => {
    const saveFormData = (formData: SimulationFormData) => {
        const id = crypto.randomUUID()
        const record: SimulationRecord = { ...formData, id }

        const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
        const savedData = storage
            ? (JSON.parse(storage) as SimulationRecord[])
            : []
        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify([...savedData, record]),
        )

        return id
    }
    /**
     * Salva uma nova simulação gerando um ID único (UUID v4).
     * formData: Dados preenchidos no formulário de simulação.
     * returns: O ID gerado para a nova simulação.
     */
    const getFormData = (id: string) => {
        const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (!storage) {
            return null
        }
        const savedData = JSON.parse(storage) as SimulationRecord[]
        return savedData.find((record) => record.id === id) || null
    }
    /**
     * Atualiza os dados de uma simulação existente no LocalStorage.
     * Utilizado para anexar insights gerados e histórico de conversas do chat.
     * id: Identificador da simulação a ser atualizada.
     * data: Objeto completo do registro atualizado.
     */
    const updateSimulation = (id: string, data: SimulationRecord) => {
        const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
        const savedData = storage ? (JSON.parse(storage) as SimulationRecord[]) : []

        const updated = savedData.map((record) => 
            record.id === id ? { ...data } : record,
        )

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
    }

    /**
     * Retorna todas as simulações salvas no histórico.
     * returns: Lista completa de registros de simulação.
     */
    const getAllSimulations = (): SimulationRecord[] => {
        const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (!storage) return []
        return JSON.parse(storage) as SimulationRecord[]
    }
    /**
     * Remove uma simulação do LocalStorage pelo seu ID.
     * id: Identificador da simulação que será removida.
     * returns: Lista atualizada de simulações após a exclusão.
     */
    const deleteSimulation = (id: string): SimulationRecord[] => {
        const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (!storage) return []

        const savedData = JSON.parse(storage) as SimulationRecord[]
        const updated = savedData.filter((record) => record.id !== id)

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
        return updated
    }

    return { 
        saveFormData, 
        getFormData, 
        updateSimulation, 
        getAllSimulations, 
        deleteSimulation 
    }
}