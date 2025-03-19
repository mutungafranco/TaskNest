import React, { useState, useEffect } from 'react';
import { PlusCircle, Layout, Search, Bell, BarChart3 } from 'lucide-react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Column as ColumnComponent } from './components/Column';
import { TaskModal } from './components/TaskModal';
import { EmailSettings } from './components/EmailSettings';
import { Dashboard } from './components/Dashboard';
import { Task, Column, Comment } from './types';
import { sendNotification } from './utils/emailService';
import { Toaster, toast } from 'react-hot-toast';

export default function App() {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [emailSettings, setEmailSettings] = useState({
    email: '',
    daysBeforeDue: 1
  });
  const [columns, setColumns] = useState<Column[]>([
    {
      id: '1',
      title: 'To Do',
      tasks: [
        {
          id: '1',
          title: 'Research competitors',
          description: 'Analyze main competitors and their features',
          status: 'todo',
          priority: 'high',
          dueDate: '2024-03-25',
          tags: ['research', 'planning'],
          comments: [],
        },
      ],
    },
    {
      id: '2',
      title: 'In Progress',
      tasks: [
        {
          id: '2',
          title: 'Design system update',
          description: 'Update color palette and typography',
          status: 'in-progress',
          priority: 'medium',
          dueDate: '2024-03-20',
          tags: ['design', 'ui'],
          comments: [],
        },
      ],
    },
    {
      id: '3',
      title: 'Completed',
      tasks: [
        {
          id: '3',
          title: 'Setup development environment',
          description: 'Install and configure necessary tools',
          status: 'completed',
          priority: 'low',
          dueDate: '2024-03-15',
          tags: ['setup', 'dev'],
          comments: [],
        },
      ],
    },
  ]);

  useEffect(() => {
    // Check for upcoming tasks daily
    const checkUpcomingTasks = () => {
      if (!emailSettings.email) return;

      const today = new Date();
      const allTasks = columns.flatMap(column => column.tasks);
      
      allTasks.forEach(task => {
        const dueDate = new Date(task.dueDate);
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilDue === emailSettings.daysBeforeDue) {
          sendNotification(task, emailSettings.email)
            .then(success => {
              if (success) {
                toast.success(`Notification sent for task: ${task.title}`);
              }
            });
        }
      });
    };

    const interval = setInterval(checkUpcomingTasks, 24 * 60 * 60 * 1000); // Check daily
    checkUpcomingTasks(); // Check immediately

    return () => clearInterval(interval);
  }, [columns, emailSettings]);

  const handleTaskSubmit = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      // Update existing task
      setColumns(columns.map(column => ({
        ...column,
        tasks: column.tasks.map(task => 
          task.id === editingTask.id 
            ? { ...taskData, id: task.id, comments: task.comments }
            : task
        ),
      })));
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: Math.random().toString(36).substr(2, 9),
        comments: [],
      };

      setColumns(columns.map(column => {
        if (column.id === '1') {
          return {
            ...column,
            tasks: [...column.tasks, newTask],
          };
        }
        return column;
      }));
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setColumns(columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => task.id !== taskId),
    })));
  };

  const handleAddComment = (taskId: string, content: string) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      taskId,
      content,
      author: 'User', // In a real app, this would come from authentication
      createdAt: new Date().toISOString(),
    };

    setColumns(columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task =>
        task.id === taskId
          ? { ...task, comments: [...task.comments, newComment] }
          : task
      ),
    })));
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = sourceColumn === destColumn ? sourceTasks : [...destColumn.tasks];

    const [removed] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, removed);

    setColumns(columns.map(column => {
      if (column.id === source.droppableId) {
        return {
          ...column,
          tasks: sourceTasks,
        };
      }
      if (column.id === destination.droppableId) {
        return {
          ...column,
          tasks: destTasks,
        };
      }
      return column;
    }));
  };

  const filteredColumns = columns.map(column => ({
    ...column,
    tasks: column.tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      task.comments.some(comment => 
        comment.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ),
  }));

  const handleCloseModal = () => {
    setShowTaskModal(false);
    setEditingTask(undefined);
  };

  const handleSaveEmailSettings = (email: string, daysBeforeDue: number) => {
    setEmailSettings({ email, daysBeforeDue });
  };

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <Layout className="h-6 w-6 text-blue-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">Task Management</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDashboard(!showDashboard)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                {showDashboard ? 'Hide' : 'Show'} Dashboard
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={() => setShowEmailSettings(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </button>
              <button
                onClick={() => setShowTaskModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                New Task
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showDashboard && <Dashboard columns={columns} />}
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {filteredColumns.map((column) => (
              <ColumnComponent
                key={column.id}
                column={column}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onAddComment={handleAddComment}
              />
            ))}
          </div>
        </DragDropContext>
      </main>

      {showTaskModal && (
        <TaskModal
          mode={editingTask ? 'edit' : 'create'}
          initialData={editingTask}
          onClose={handleCloseModal}
          onSubmit={handleTaskSubmit}
        />
      )}

      {showEmailSettings && (
        <EmailSettings
          onClose={() => setShowEmailSettings(false)}
          onSave={handleSaveEmailSettings}
          currentEmail={emailSettings.email}
          currentDaysBeforeDue={emailSettings.daysBeforeDue}
        />
      )}
    </div>
  );
}