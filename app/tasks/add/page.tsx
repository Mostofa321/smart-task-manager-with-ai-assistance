'use client'

import TaskForm from '@/components/TaskForm'
import { Task } from '@/types/task'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { loadTasks, saveTasks } from '@/lib/storage'

export default function AddTaskPage() {
  const router = useRouter()

  const handleAdd = (newTask: Task) => {
    const tasks = loadTasks()
    const updatedTasks = [{ ...newTask, id: uuidv4() }, ...tasks]
    saveTasks(updatedTasks)
    router.push('/tasks')
  }

  return (
    <div className="max-w-xl mx-auto mt-[120px]">
      <h1 className="text-2xl font-bold mb-4">Add New Task</h1>
      <TaskForm onAdd={handleAdd} />
    </div>
  )
}
