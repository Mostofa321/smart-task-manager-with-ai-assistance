'use client'

import { useEffect, useState } from 'react'
import { Task } from '@/types/task'
import { v4 as uuidv4 } from 'uuid'

interface TaskFormProps {
  onAdd: (task: Task) => void
  onUpdate?: (task: Task) => void
  editTask?: Task
}

export default function TaskForm({ onAdd, onUpdate, editTask }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<'pending' | 'completed'>('pending')

  // Prefill form for editing
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title)
      setDescription(editTask.description)
      setDueDate(editTask.dueDate || '')
      setStatus(editTask.status)
    }
  }, [editTask])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const task: Task = {
      id: editTask?.id || uuidv4(),
      title,
      description,
      dueDate,
      status,
      subtasks: editTask?.subtasks || [],
    }

    if (editTask && onUpdate) {
      onUpdate(task)
    } else {
      onAdd(task)
    }

    // Clear form after submit
    setTitle('')
    setDescription('')
    setDueDate('')
    setStatus('pending')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 dark:bg-gray-800 p-4 border rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold">
        {editTask ? 'Edit Task' : 'Add New Task'}
      </h2>

      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'pending' | 'completed')}
          className="w-full border px-3 py-2 rounded mt-1"
        >
          <option className='dark:bg-gray-800 shadow' value="pending">Pending</option>
          <option className='dark:bg-gray-800 shadow' value="completed">Completed</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {editTask ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  )
}
