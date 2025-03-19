import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Comment } from '../types';

interface CommentsProps {
  comments: Comment[];
  taskId: string;
  onAddComment: (taskId: string, content: string) => void;
}

export function Comments({ comments, taskId, onAddComment }: CommentsProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(taskId, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Comments</h4>
      
      <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-700">{comment.author}</span>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}