import React, { useState } from 'react';
// 1. We import 'useNavigate'
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AtSign, Lock, LogIn, Sparkles } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';

// 2. We import our API client AND our new auth store!
import api, { setAuthToken } from '../lib/api';
import useAuthStore from '../store/authStore';

// (GoogleIcon SVG is the same as before)
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// (Animation variants are the same)
const cardVariants = { hidden: { opacity: 0, scale: 0.9, y: -20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 }}};
const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }};

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // 3. We get the 'login' function from our global store!
  const { login } = useAuthStore();

  // 4. --- THIS IS THE NEW, REAL handleSubmit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 5. We call our backend API!
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // 6. If successful, we get the token and user from the response
      const { token, user } = response.data;
      
      // 7. We call our global store's 'login' function
      login(token, user);
      
      // 8. We set the token for all future API calls
      setAuthToken(token);
      
      // 9. Show success and redirect!
      toast.success('Logged in successfully!');
      // 10. We send the user to the main app (dashboard)
      navigate('/dashboard'); 

    } catch (error) {
      // 11. If the backend sends an error (like "Invalid credentials")
      console.error('Login Error:', error);
      toast.error(error.response?.data?.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // (The rest of the JSX is exactly the same as before)
    <div className="flex h-screen w-full items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md rounded-2xl border border-white/10
                   bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white/10 p-3">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">CineMatch</h1>
          <p className="text-zinc-300">Sign in to find your next great movie</p>
        </motion.div>

        <motion.form 
          variants={itemVariants}
          onSubmit={handleSubmit} 
          className="space-y-6"
        >
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-11" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-11" />
          </div>
          <div>
            <Button type="submit" isLoading={isLoading}>
              {!isLoading && <LogIn className="mr-2 h-5 w-5" />}
              Sign In
            </Button>
          </div>
        </motion.form>

        <motion.div variants={itemVariants} className="my-6 flex items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="mx-4 flex-shrink text-sm text-zinc-400">OR</span>
          <div className="flex-grow border-t border-white/10"></div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <button type="button" className="w-full px-4 py-3 font-bold text-white bg-white/10 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 flex items-center justify-center">
            <GoogleIcon />
            <span className="ml-3">Sign in with Google</span>
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-zinc-300">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-white hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginPage;