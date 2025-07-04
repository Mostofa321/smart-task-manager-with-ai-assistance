'use client'

import { useEffect, useState } from 'react'
import { Task } from '@/types/task'
import TaskCard from '@/components/TaskCard'
import { loadTasks, saveTasks } from '@/lib/storage'
import Link from 'next/link'

export default function TaskPage() {
    const [tasks, setTasks] = useState<Task[]>(loadTasks())

    // Load from localStorage on first load
    useEffect(() => {
        const storedTasks = loadTasks()
        setTasks(storedTasks)
    }, [])

    // Save to localStorage on change
    useEffect(() => {
        saveTasks(tasks)
    }, [tasks])

    const handleDelete = (id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id))
    }

    const handleToggleStatus = (id: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' }
                    : task
            )
        )
    }

    // const handleSuggestSubtasks = async (taskId: string) => {
    //     console.log('Suggest subtasks clicked for task:', taskId)
    //     const task = tasks.find((t) => t.id === taskId)
    //     if (!task) return

    //     try {
    //         const res = await fetch('/api/gemini', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 taskTitle: task.title,
    //                 taskDescription: task.description,
    //             }),
    //         })

    //         const data = await res.json()

    //         console.log('API response:', data) // 🐞 Check what Gemini sends

    //         const subtasks = data.subtasks || []

    //         // const { subtasks } = await res.json()

    //         // console.log('Gemini API response:', subtasks)

    //         const enriched = tasks.map((t) =>
    //             t.id === taskId
    //                 ? {
    //                     ...t,
    //                     subtasks: subtasks.map((s: string, i: number) => ({
    //                         id: `${taskId}-${i}`,
    //                         title: s,
    //                         isCompleted: false,
    //                     })),
    //                 }
    //                 : t
    //         )

    //         setTasks(enriched)
    //         saveTasks(enriched)
    //     } catch (err) {
    //         console.log('Gemini API response:', err)
    //         console.error('Gemini API failed', err)
    //         alert('AI suggestion failed. Try again later.')
    //     }
    // }

    const handleSuggestSubtasks = async (taskId: string) => {
        const task = tasks.find((t) => t.id === taskId)
        if (!task) return

        try {
            const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
            const prompt = `Break this task into 3–5 subtasks:\n\nTitle: ${task.title}\nDescription: ${task.description}`

            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            })

            const data = await res.json()
            console.log('[Client Gemini Response]', data)

            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
            if (!text) {
                alert('Gemini returned no suggestions.')
                return
            }

            const subtasks = text
                .split('\n')
                .map((line: string) => line.replace(/^\d+\.?\s*/, '').trim())
                .filter(Boolean)

            const enriched = tasks.map((t) =>
                t.id === taskId
                    ? {
                        ...t,
                        subtasks: subtasks.map((s: any, i: any) => ({
                            id: `${taskId}-${i}`,
                            title: s,
                            isCompleted: false,
                        })),
                    }
                    : t
            )

            setTasks(enriched)
            saveTasks(enriched)
        } catch (err) {
            console.error('Gemini client call failed', err)
            alert('Gemini API failed.')
        }
    }



    return (
        <div>
            <div className='flex items-center justify-between mb-6'>
                <h1 className="text-2xl font-bold mb-4">Smart Task Manager</h1>

                <Link href="/tasks/add">
                    <button className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded mb-4 hover:bg-blue-700">
                        + Add Task
                    </button>
                </Link>
            </div>

            {tasks.length === 0 ? (
                <p className="text-red-500 text-center mt-[120px]">
                    You have no tasks. Start by adding one!
                </p>
            ) : (
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                            onSuggest={handleSuggestSubtasks}
                        />
                    ))}
                </div>
            )}

        </div>
    )
}

