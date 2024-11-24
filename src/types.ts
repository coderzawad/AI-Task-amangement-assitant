export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'errands';
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Task['priority'];
  category: Task['category'];
  dueDate: Date;
}