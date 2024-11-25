import OpenAI from 'openai';
import { TaskFormData } from '../types';
import { toast } from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true
});

const hasValidApiKey = !!import.meta.env.VITE_OPENAI_API_KEY;

export async function analyzeTasks(tasks: TaskFormData[]) {
  if (!hasValidApiKey) {
    return null;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a productivity assistant analyzing tasks and providing insights."
        },
        {
          role: "user",
          content: `Analyze these tasks and provide insights: ${JSON.stringify(tasks)}`
        }
      ]
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    handleAIError(error);
    return null;
  }
}

export async function categorizeTasks(taskDescription: string): Promise<{
  category: 'work' | 'personal' | 'errands';
  priority: 'low' | 'medium' | 'high';
}> {
  if (!hasValidApiKey) {
    return inferCategories(taskDescription);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Categorize the following task into 'work', 'personal', or 'errands' and assign priority ('low', 'medium', 'high')"
        },
        {
          role: "user",
          content: taskDescription
        }
      ]
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      category: result.category || 'personal',
      priority: result.priority || 'medium'
    };
  } catch (error: any) {
    handleAIError(error);
    return inferCategories(taskDescription);
  }
}

function handleAIError(error: any) {
  if (error.code === 'insufficient_quota') {
    toast.error('AI features temporarily unavailable. Using smart categorization instead.', {
      duration: 4000,
    });
  } else if (error.code === 'invalid_api_key') {
    console.warn('Invalid OpenAI API key');
  } else {
    console.error('AI service error:', error);
  }
}

function inferCategories(text: string): {
  category: 'work' | 'personal' | 'errands';
  priority: 'low' | 'medium' | 'high';
} {
  const lowercaseText = text.toLowerCase();
  
  // Work-related keywords
  const workKeywords = ['meeting', 'project', 'deadline', 'client', 'report', 'presentation', 'email', 'call'];
  // Errands-related keywords
  const errandsKeywords = ['buy', 'shop', 'groceries', 'pickup', 'appointment', 'store', 'bank', 'pay'];
  // Priority-related keywords
  const urgentKeywords = ['urgent', 'asap', 'important', 'critical', 'due', 'deadline'];
  const lowPriorityKeywords = ['sometime', 'eventually', 'when possible', 'later'];
  
  // Determine category
  let category: 'work' | 'personal' | 'errands' = 'personal';
  if (workKeywords.some(keyword => lowercaseText.includes(keyword))) {
    category = 'work';
  } else if (errandsKeywords.some(keyword => lowercaseText.includes(keyword))) {
    category = 'errands';
  }
  
  // Determine priority
  let priority: 'low' | 'medium' | 'high' = 'medium';
  if (urgentKeywords.some(keyword => lowercaseText.includes(keyword))) {
    priority = 'high';
  } else if (lowPriorityKeywords.some(keyword => lowercaseText.includes(keyword))) {
    priority = 'low';
  }
  
  return { category, priority };
}