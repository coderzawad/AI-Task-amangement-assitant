import React, { useState } from 'react';
import { Calendar, Tag, AlertCircle } from 'lucide-react';
import { TaskFormData } from '../types';
import VoiceInput from './VoiceInput';
import { categorizeTasks } from '../services/ai';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface TaskFormProps {
  onSubmit: (task: TaskFormData) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    category: 'personal',
    dueDate: new Date(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const aiCategories = await categorizeTasks(formData.title + ' ' + formData.description);
      const finalTask: TaskFormData = {
        ...formData,
        priority: aiCategories.priority,
        category: aiCategories.category,
      };

      onSubmit(finalTask);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'personal',
        dueDate: new Date(),
      });
      toast.success('Task added successfully!');
    } catch (error) {
      console.error('Error processing task:', error);
      toast.error('Failed to process task. Using default categories.');
      onSubmit(formData);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setFormData(prev => ({
      ...prev,
      title: transcript,
    }));
    toast.success('Voice input captured!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <motion.input
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          type="text"
          placeholder="What needs to be done?"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="flex-1 px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <VoiceInput onTranscript={handleVoiceInput} />
      </div>
      
      <motion.textarea
        whileFocus={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        placeholder="Add a description..."
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Tag className="w-4 h-4 inline mr-1" />
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as TaskFormData['category'] })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="errands">Errands</option>
          </select>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskFormData['priority'] })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            Due Date
          </label>
          <input
            type="date"
            value={formData.dueDate.toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, dueDate: new Date(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </motion.div>
      </div>

      <motion.button
        type="submit"
        disabled={isProcessing}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Add Task'}
      </motion.button>
    </form>
  );
}