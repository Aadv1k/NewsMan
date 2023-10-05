import React from 'react';

function Button({ variant, onClick, children, className }) {
    const buttonClasses = `${className} px-4 py-1 text-sm rounded-md shadow shadow-lg ${
    variant === 'primary' ? 'bg-gray-800 text-white' : 'bg-white text-black border-gray-800'
  }`;

  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
