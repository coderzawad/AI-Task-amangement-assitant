import React, { useState } from 'react';
import { Calendar, Tag, AlertCircle } from 'lucide-react';
import { TaskFormData } from '../types';
import VoiceInput from './VoiceInput';
import { categorizeTasks } from '../services/ai';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

// ... rest of the imports ...

export default function TaskForm({ onSubmit }: TaskFormProps) {
  // ... existing state and handlers ...

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
        {/* ... existing select and input elements with motion ... */}
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