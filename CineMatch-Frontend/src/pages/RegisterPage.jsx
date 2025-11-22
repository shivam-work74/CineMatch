import React, { useState } from 'react';
// 1. We now import 'Link' AND 'useNavigate'
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AtSign, Lock, User, UserPlus } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import Logo from '../components/Logo'; // Import the custom Logo component

// 2. We import our new API client!
import api from '../lib/api';
import AnimatedBackground from '../components/AnimatedBackground';

// (GoogleIcon SVG is the same as before)
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// (Animation variants are the same)
const cardVariants = { hidden: { opacity: 0, scale: 0.9, y: -20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 3. We get the 'navigate' function from React Router
  const navigate = useNavigate();

  // 4. --- THIS IS THE NEW, REAL handleSubmit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill out all fields');
      return;
    }

    setIsLoading(true);

    try {
      // 5. We call our backend API!
      await api.post('/auth/register', {
        name,
        email,
        password,
      });

      // 6. If successful...
      toast.success('Account created! Please log in.');
      // 7. We automatically send the user to the login page.
      navigate('/login');

    } catch (error) {
      // 8. If the backend sends an error (like "Email already in use")
      console.error('Registration Error:', error);
      toast.error(error.response?.data?.message || 'Registration failed.');
    } finally {
      // 9. This *always* runs, success or fail
      setIsLoading(false);
    }
  };

  return (
    // (The rest of the JSX is exactly the same as before)
    <AnimatedBackground className="flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white/10 p-3 shadow-lg shadow-purple-500/20">
            <Logo className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-zinc-400 mt-2">Join CineMatch to start swiping</p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-purple-400 transition-colors" />
            <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="pl-11 bg-white/5 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all" />
          </div>
          <div className="relative group">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-purple-400 transition-colors" />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-11 bg-white/5 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all" />
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-purple-400 transition-colors" />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-11 bg-white/5 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all" />
          </div>
          <div>
            <Button type="submit" isLoading={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25">
              {!isLoading && <UserPlus className="mr-2 h-5 w-5" />}
              Create Account
            </Button>
          </div>
        </motion.form>

        <motion.div variants={itemVariants} className="my-8 flex items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="mx-4 flex-shrink text-sm text-zinc-500 font-medium">OR CONTINUE WITH</span>
          <div className="flex-grow border-t border-white/10"></div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <button type="button" className="w-full px-4 py-3 font-bold text-white bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-center group">
            <GoogleIcon />
            <span className="ml-3 group-hover:text-white transition-colors">Google</span>
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-white hover:text-purple-400 transition-colors">
              Sign In
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </AnimatedBackground>
  );
}

export default RegisterPage;