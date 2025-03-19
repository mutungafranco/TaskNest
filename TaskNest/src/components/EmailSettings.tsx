import React, { useState } from 'react';
import { X, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

interface EmailSettingsProps {
  onClose: () => void;
  onSave: (email: string, daysBeforeDue: number) => void;
  currentEmail?: string;
  currentDaysBeforeDue?: number;
}

export function EmailSettings({ onClose, onSave, currentEmail = '', currentDaysBeforeDue = 1 }: EmailSettingsProps) {
  const [email, setEmail] = useState(currentEmail);
  const [daysBeforeDue, setDaysBeforeDue] = useState(currentDaysBeforeDue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address');
      return;
    }
    onSave(email, daysBeforeDue);
    toast.success('Email notification settings saved!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">Email Notifications</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Send notification days before due date
            </label>
            <select
              value={daysBeforeDue}
              onChange={(e) => setDaysBeforeDue(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
              <option value={1}>1 day before</option>
              <option value={2}>2 days before</option>
              <option value={3}>3 days before</option>
              <option value={7}>1 week before</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}