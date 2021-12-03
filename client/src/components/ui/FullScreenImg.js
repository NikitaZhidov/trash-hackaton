import React from 'react';

export const FullScreenImg = ({ img, onClose, show }) => {
  return (
    <div
      style={{ display: show ? 'flex' : 'none' }}
      className="fullscreen-wrapper"
      onClick={() => onClose()}
    >
      <div
        style={{
          position: 'absolute',
          right: '50px',
          top: '15px',
          fontSize: '40px',
          cursor: 'pointer',
        }}
        onClick={() => onClose()}
      >
        &times;
      </div>
      <img style={{ width: 'auto', height: '90%' }} src={img} alt="img" />
    </div>
  );
};
