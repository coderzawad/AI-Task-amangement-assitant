import React, { useState, useEffect } from 'react';
import { Task, TaskFormData } from './types';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Analytics from './components/Analytics';
import { Brain, ListTodo, PieChart } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { analyzeTasks } from './services/ai';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'ai-task-assistant-tasks';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
  });
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
      toast.error('Failed to save tasks. Please check your browser storage settings.');
    }
  }, [tasks]);

  const handleAddTask = async (taskData: TaskFormData) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...taskData,
      completed: false,
      createdAt: new Date(),
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    toast.success('Task added successfully!');

    try {
      const analysis = await analyzeTasks([newTask]);
      if (analysis) {
        toast(analysis, {
          duration: 5000,
          icon: '🤖',
        });
      }
    } catch (error) {
      console.error('Error analyzing task:', error);
    }
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
    toast.success('Task status updated!');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast.success('Task deleted!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-12"
        >
          <motion.div 
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Brain className="w-12 h-12 text-blue-600" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <ListTodo className="w-12 h-12 text-indigo-600" />
            </motion.div>
          </motion.div>
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            AI Task Assistant
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Organize your tasks intelligently and boost your productivity
          </motion.p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add New Task
          </h2>
          <TaskForm onSubmit={handleAddTask} />
        </motion.div>

        <motion.div 
          className="flex justify-between items-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
          <motion.button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PieChart className="w-5 h-5" />
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {showAnalytics && (
            <motion.div 
              key="analytics"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="mb-8 overflow-hidden"
            >
              <Analytics tasks={tasks} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {tasks.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <p className="text-gray-500">No tasks yet. Add your first task above!</p>
            </motion.div>
          ) : (
            <TaskList 
              tasks={tasks} 
              onToggleTask={handleToggleTask} 
              onDeleteTask={handleDeleteTask}
            />
          )}
        </motion.div>
      </div>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
        }}
      />
    </motion.div>
  );
}

export default App;