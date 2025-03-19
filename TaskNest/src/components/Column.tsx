import React from 'react';
import { TaskCard } from './TaskCard';
import { Column as ColumnType, Task } from '../types';
import { Droppable } from 'react-beautiful-dnd';

interface ColumnProps {
  column: ColumnType;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddComment: (taskId: string, content: string) => void;
}

const columnColors = {
  'To Do': 'bg-gray-50',
  'In Progress': 'bg-blue-50',
  'Completed': 'bg-green-50',
};

export function Column({ column, onEditTask, onDeleteTask, onAddComment }: ColumnProps) {
  return (
    <div className={`${columnColors[column.title]} p-4 rounded-lg min-w-[320px] max-w-[320px]`}>
      <h2 className="font-semibold text-gray-700 mb-4 flex items-center">
        {column.title}
        <span className="ml-2 bg-gray-200 px-2 py-1 rounded-full text-sm">
          {column.tasks.length}
        </span>
      </h2>
      
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3 min-h-[200px]"
          >
            {column.tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onAddComment={onAddComment}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}