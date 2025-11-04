import axios from 'axios';

// 1. Create a new "instance" of axios
const api = axios.create({
  // 2. Set the "base URL" to our backend server's address
  //    This way, we can just call `api.post('/auth/login')`
  //    instead of typing the full URL every time.
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api',
});

// 3. We'll also add a way to attach our auth token to requests
//    (We'll use this in a later step)
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;