import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const RedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/map');
  }, []);
  return <div></div>;
};
