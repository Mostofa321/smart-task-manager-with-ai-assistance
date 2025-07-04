import { Task } from '@/types/task'
import Link from 'next/link'

interface TaskCardProps {
    task: Task
    onDelete: (id: string) => void
    onToggleStatus: (id: string) => void
}


export default function TaskCard({ task, onDelete, onToggleStatus }: TaskCardProps) {
    return (
        <div className="dark:bg-gray-800 p-4 border rounded-lg shadow flex flex-col gap-2 bg-white">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{task.title}</h2>
                <span
                    className={`text-xs px-2 py-1 rounded ${task.status === 'completed'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                        }`}
                >
                    {task.status}
                </span>
            </div>

            <p className="text-shadow-white">{task.description}</p>
            {task.dueDate && (
                <p className="text-sm text-gray-400">Due: {task.dueDate}</p>
            )}

            <div className="flex gap-2 pt-2">
                <button
                    onClick={() => onToggleStatus(task.id)}
                    className="text-sm cursor-pointer px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                >
                    {task.status === 'pending' ? 'Mark as Completed' : 'Mark as Pending'}
                </button>

                <Link href={`/tasks/edit/${task.id}`}>
                    <button className="text-sm cursor-pointer px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
                        Edit
                    </button>
                </Link>

                <button
                    onClick={() => onDelete(task.id)}
                    className="text-sm px-3 py-1 cursor-pointer bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                    Delete
                </button>
            </div>
        </div>
    )
}
