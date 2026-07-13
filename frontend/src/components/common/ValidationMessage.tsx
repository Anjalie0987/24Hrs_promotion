import React from 'react';

interface ValidationMessageProps {
  error?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({ error }) => {
  if (!error) return null;
  return (
    <span role="alert" className="text-red-500 text-sm mt-1 block">
      {error}
    </span>
  );
};
