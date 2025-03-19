export interface Comment {
  id: string;
  taskId: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  tags?: string[];
  comments: Comment[];
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface TaskModalProps {
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id'>) => void;
  initialData?: Task;
  mode: 'create' | 'edit';
}