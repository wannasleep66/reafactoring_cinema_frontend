import React from "react";

interface NotificationTextProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

const NotificationText: React.FC<NotificationTextProps> = ({ message, type = 'info' }) => {
  const getClassName = () => {
    switch(type) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-danger';
      default: return 'text-info';
    }
  };

  return <p className={getClassName()}>{message}</p>;
};

export default NotificationText;