import OpenAI from 'openai';
import { TaskFormData } from '../types';

const openai = new OpenAI({
  apiKey: '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', // Replace with your API key
  dangerouslyAllowBrowser: true
});

export async function analyzeTasks(tasks: TaskFormData[]) {
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
  } catch (error) {
    console.error('Error analyzing tasks:', error);
    return null;
  }
}

export async function categorizeTasks(taskDescription: string): Promise<{
  category: 'work' | 'personal' | 'errands';
  priority: 'low' | 'medium' | 'high';
}> {
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
  } catch (error) {
    console.error('Error categorizing task:', error);
    return {
      category: 'personal',
      priority: 'medium'
    };
  }
}