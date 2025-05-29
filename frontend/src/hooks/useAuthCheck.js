import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function useAuthCheck() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4000/auth/check-auth', { withCredentials: true })
      .then(() => setLoading(false))
      .catch(() => {
        navigate('/login');
      });
  }, [navigate]);

  return loading;
}
