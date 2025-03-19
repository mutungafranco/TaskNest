import React, { useState } from 'react';
import { Clock, Flag, Tag, Pencil, Trash2, MessageSquare } from 'lucide-react';
import { Task } from '../types';
import { Draggable } from 'react-beautiful-dnd';
import { Comments } from './Comments';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onAddComment: (taskId: string, content: string) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export function TaskCard({ task, index, onEdit, onDelete, onAddComment }: TaskCardProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-800">{task.title}</h3>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(task)}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="text-gray-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                  <div className="flex items-center">
                    <Flag className="w-3 h-3 mr-1" />
                    {task.priority}
                  </div>
                </span>
              </div>
              
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>

            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs flex items-center"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center text-sm text-gray-600 hover:text-blue-600"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                {task.comments.length} Comments
              </button>
            </div>

            {showComments && (
              <Comments
                comments={task.comments}
                taskId={task.id}
                onAddComment={onAddComment}
              />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}