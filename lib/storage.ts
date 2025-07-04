// lib/storage.ts
import { Task } from '@/types/task'

const STORAGE_KEY = 'tasks'

export const loadTasks = (): Task[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
    } catch (e) {
        console.error('Failed to load tasks:', e)
        return []
    }
}

export const saveTasks = (tasks: Task[]) => {
    console.log('Saving tasks:', tasks)
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (e) {
        console.error('Failed to save tasks:', e)
    }
}
