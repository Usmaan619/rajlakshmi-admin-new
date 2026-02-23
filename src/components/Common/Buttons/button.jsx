import React from 'react'

const Button = ({ title, btnColor, }) => {
  return (
    <div>
      <button className={`rounded-3 ${btnColor}`}>{title}</button>
    </div>
  );
};

export default Button