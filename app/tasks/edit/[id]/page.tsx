// app/tasks/edit/[id]/page.tsx
'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Task } from '@/types/task'
import TaskForm from '@/components/TaskForm'
import { loadTasks, saveTasks } from '@/lib/storage'

export default function EditTaskPage() {
  const router = useRouter()
  const { id } = useParams()
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)

  useEffect(() => {
    const tasks = loadTasks()
    const task = tasks.find((t) => t.id === id)
    if (!task) return router.push('/tasks')
    setTaskToEdit(task)
  }, [id, router])

  const handleUpdate = (updatedTask: Task) => {
    const tasks = loadTasks()
    const updated = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    saveTasks(updated)
    router.push('/tasks')
  }

  if (!taskToEdit) {
    return <p className="text-gray-500">Loading task...</p>
  }

  return (
    <div className="max-w-xl mx-auto mt-[120px]">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
      <TaskForm editTask={taskToEdit} onUpdate={handleUpdate} onAdd={() => {}} />
    </div>
  )
}
