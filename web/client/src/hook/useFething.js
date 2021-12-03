import { useState } from 'react';

export const useFetching = (cb) => {
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState(null);

  const fetch = async (...args) => {
    try {
      setIsLoading(true);
      await cb(...args);
    } catch (e) {
      setError('fetching error');
    } finally {
      setIsLoading(false);
    }
  };

  return [fetch, isLoading, error];
};
