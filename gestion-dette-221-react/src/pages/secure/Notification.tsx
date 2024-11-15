// Notification.tsx
import React from 'react';

interface NotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-5 right-5 bg-blue-600 text-white p-4 rounded shadow-lg transition-opacity duration-300">
      <p>{message}</p>
      <button onClick={onClose} className="ml-2 text-sm underline">
        Close
      </button>
    </div>
  );
};

export default Notification;
