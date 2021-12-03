import React from 'react';
import { Spinner } from 'react-bootstrap';

export const SpinnerPreloader = () => {
  return (
    <div className="spinner-preloader-wrapper">
      <Spinner
        animation="grow"
        variant="light"
        style={{ marginRight: '10px' }}
      />
      Загрузка...
    </div>
  );
};
