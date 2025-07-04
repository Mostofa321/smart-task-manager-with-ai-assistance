export interface Subtask {
  id: string
  title: string
  isCompleted: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'completed'
  dueDate?: string
  subtasks?: Subtask[]
}
