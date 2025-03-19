import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Task, Column } from '../types';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface DashboardProps {
  columns: Column[];
}

const COLORS = ['#3B82F6', '#F59E0B', '#10B981'];

export function Dashboard({ columns }: DashboardProps) {
  const allTasks = columns.flatMap(column => column.tasks);
  
  // Calculate statistics
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(task => task.status === 'completed').length;
  const upcomingTasks = allTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate > today && task.status !== 'completed';
  }).length;
  const overdueTasks = allTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate < today && task.status !== 'completed';
  }).length;

  // Prepare data for charts
  const statusData = columns.map(column => ({
    name: column.title,
    tasks: column.tasks.length,
  }));

  const priorityData = [
    { name: 'High', value: allTasks.filter(task => task.priority === 'high').length },
    { name: 'Medium', value: allTasks.filter(task => task.priority === 'medium').length },
    { name: 'Low', value: allTasks.filter(task => task.priority === 'low').length },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6">Task Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Tasks</p>
              <p className="text-2xl font-bold text-blue-700">{totalTasks}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-700">{completedTasks}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Upcoming</p>
              <p className="text-2xl font-bold text-yellow-700">{upcomingTasks}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Overdue</p>
              <p className="text-2xl font-bold text-red-700">{overdueTasks}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Tasks by Status</h3>
          <div className="h-64">
            <BarChart width={400} height={250} data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#3B82F6" />
            </BarChart>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Tasks by Priority</h3>
          <div className="h-64">
            <PieChart width={400} height={250}>
              <Pie
                data={priorityData}
                cx={200}
                cy={125}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
}