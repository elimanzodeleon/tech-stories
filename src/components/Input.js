import React from 'react';

const Input = ({ type, handleInputChange, value, children }) => {
  return (
    <>
      <input
        type={type}
        value={value}
        onChange={handleInputChange}
        placeholder={children}
        autoFocus
        className='input'
      />
    </>
  );
};

export default Input;
