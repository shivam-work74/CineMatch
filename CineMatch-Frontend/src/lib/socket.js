import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';

// 1. Get the URL of our backend
const URL = import.meta.env.VITE_BACKEND_URL?.replace('/api', '') || 'http://localhost:3001';

// 2. We create the socket instance, but we set 'autoConnect: false'
//    This is CRITICAL. We do not want to connect until the user
//    is logged in and we have their token.
export const socket = io(URL, {
  autoConnect: false,
});

// 3. This is our "initializer" function
//    We will call this from our SessionPage when it loads.
export const initializeSocket = () => {
  // Get the token from our global store
  const { token } = useAuthStore.getState();

  if (token) {
    // 4. Set the 'token' in the 'auth' object
    //    This is what our backend's "io.use()" middleware
    //    will look for and verify.
    socket.auth = { token };
    
    // 5. Now, we manually connect.
    socket.connect();
  } else {
    console.error('No auth token, socket connection not initialized.');
  }
};

// 6. We also need a function to disconnect
export const disconnectSocket = () => {
  socket.disconnect();
};