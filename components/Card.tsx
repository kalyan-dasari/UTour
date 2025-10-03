
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
