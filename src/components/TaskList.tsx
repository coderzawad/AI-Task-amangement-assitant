import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Tag, Trash2 } from 'lucide-react';
import { Task } from '../types';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            whileHover={{ scale: 1.02 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className={`p-4 rounded-lg shadow-sm border transition-colors ${
              task.completed
                ? 'bg-gray-50 border-gray-200'
                : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <motion.button
                onClick={() => onToggleTask(task.id)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="mt-1 focus:outline-none"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </motion.button>
              <motion.div 
                className="flex-1 min-w-0"
                animate={{ opacity: task.completed ? 0.7 : 1 }}
              >
                <motion.h3
                  layout
                  className={`text-sm font-medium ${
                    task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}
                >
                  {task.title}
                </motion.h3>
                {task.description && (
                  <motion.p 
                    layout
                    className="mt-1 text-sm text-gray-500"
                  >
                    {task.description}
                  </motion.p>
                )}
                <motion.div 
                  layout
                  className="mt-2 flex items-center gap-4 text-xs"
                >
                  <span className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Tag className="w-4 h-4" />
                    {task.category}
                  </span>
                  <motion.span
                    layout
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {task.priority}
                  </motion.span>
                </motion.div>
              </motion.div>
              <motion.button
                onClick={() => onDeleteTask(task.id)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}