// src/hooks/useCalculateDuration.js
import { useState } from 'react';
import { calculatePlaylistDuration } from '../Utils/api';

const useCalculateDuration = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculate = async (playlistUrl, speed) => {
    setLoading(true);
    setError(null);
    try {
      const data = await calculatePlaylistDuration({ playlistUrl, speed });
      setResult(data.data);
    } catch (err) {
      setError(err.message || 'Error calculating playlist duration');
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, calculate };
};

export default useCalculateDuration;
