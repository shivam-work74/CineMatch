import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, LogIn, LogOut, Users, HelpCircle, 
  Film, Clock 
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import api, { setAuthToken } from '../lib/api';
import toast from 'react-hot-toast';
import Logo from '../components/Logo'; // Import the custom Logo component

// We need our reusable components
import Input from '../components/Input';
import Button from '../components/Button';

// --- Reusable Poster Component for "What's Hot" ---
const posterBaseUrl = "https://image.tmdb.org/t/p/w500";
const MovieCard = ({ movie }) => (
  <motion.div 
    variants={itemVariants} 
    className="flex-shrink-0 w-40 space-y-2"
  >
    <img
      src={`${posterBaseUrl}${movie.poster_path}`}
      alt={movie.title}
      className="w-full h-60 object-cover rounded-lg shadow-lg"
    />
    <p className="text-white text-sm font-semibold truncate">{movie.title}</p>
  </motion.div>
);

// --- Reusable Header Component for the App Shell ---
const AppHeader = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setAuthToken(null);
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-white/5 p-3 px-6 shadow-2xl backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-white" />
          <span className="text-xl font-bold text-white">CineMatch</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-white/20"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </header>
  );
};

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1 
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

function DashboardPage() {
  const { user, token } = useAuthStore();
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  
  // --- STATE FOR OUR NEW SECTIONS ---
  const [popularMovies, setPopularMovies] = useState([]);
  const [mySessions, setMySessions] = useState([]); // Mock data for now
  
  const navigate = useNavigate();

  // --- On Page Load: Fetch movies and set token ---
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
    
    // 1. Fetch Popular Movies (The "Entertainment")
    const fetchPopularMovies = async () => {
      try {
        const response = await api.get('/movies/popular');
        // Get just the top 10 for our scroller
        setPopularMovies(response.data.slice(0, 10)); 
      } catch (error) {
        console.error("Failed to fetch popular movies", error);
        toast.error("Could not load popular movies.");
      }
    };
    
    // 2. Mock "My Sessions" (The "Necessary" Item)
    const fetchMySessions = () => {
      // TODO: Build a backend endpoint `/api/sessions/my-sessions`
      // For now, we'll use mock data to build the "premium" UI.
      setMySessions([
        { joinCode: 'AB12CD', participants: 3, matches: 2 },
        { joinCode: 'ZY98XW', participants: 5, matches: 1 },
      ]);
    };
    
    fetchPopularMovies();
    fetchMySessions();
    
  }, [token]);

  // --- API Call: Create Session ---
  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      const response = await api.post('/sessions/create');
      const { session } = response.data;
      toast.success('Session created!');
      navigate(`/session/${session.joinCode}`); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create session');
    } finally {
      setIsCreating(false);
    }
  };

  // --- API Call: Join Session ---
  const handleJoinSession = async (e) => {
    e.preventDefault();
    if (!joinCode) return toast.error('Please enter a session code');
    setIsJoining(true);
    try {
      const response = await api.post('/sessions/join', { joinCode });
      const { session } = response.data;
      toast.success('Joined session!');
      navigate(`/session/${session.joinCode}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join session');
    } finally {
      setIsJoining(false);
    }
  };
  
  return (
    <div className="h-screen w-full overflow-y-auto">
      <AppHeader />
      
      {/* --- Main Content Area --- */}
      {/* We add pt-28 to leave space for our fixed header */}
      <main className="mx-auto max-w-7xl p-4 pt-28 pb-16">
        
        {/* --- 1. Welcome Header --- */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-white">
            Welcome, {user ? user.name : 'Guest'}!
          </h1>
          <p className="text-xl text-zinc-300 mt-2">
            Ready to find your next movie?
          </p>
        </motion.div>

        {/* --- We use our stagger-animation container --- */}
        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
        
          {/* --- 2. Action Cards (Create/Join) --- */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Create Session */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl flex flex-col">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white/10 p-3 self-center">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white text-center mb-3">Create a New Session</h2>
              <p className="text-zinc-300 text-center mb-8 flex-grow">
                Start a new session and invite your friends with a 6-digit code.
              </p>
              <Button onClick={handleCreateSession} isLoading={isCreating} className="mt-auto">
                <Plus className="mr-2 h-5 w-5" />
                Create Session
              </Button>
            </div>
            
            {/* Join Session */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl flex flex-col">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white/10 p-3 self-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white text-center mb-3">Join a Session</h2>
              <p className="text-zinc-300 text-center mb-8 flex-grow">
                Got a code from a friend? Enter it here to join their swiping session.
              </p>
              <form onSubmit={handleJoinSession} className="space-y-4">
                <div className="relative">
                  <HelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <Input 
                    type="text"
                    placeholder="e.g. AB12CD"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="pl-11 text-center text-lg font-bold tracking-widest"
                    maxLength={6}
                  />
                </div>
                <Button type="submit" isLoading={isJoining}>
                  <LogIn className="mr-2 h-5 w-5" />
                  Join Session
                </Button>
              </form>
            </div>
          </motion.div>

          {/* --- 3. "My Active Sessions" (Using Mock Data) --- */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-white mb-6">My Active Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mySessions.map((session) => (
                <div 
                  key={session.joinCode}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl
                             hover:border-white/20 transition-all cursor-pointer"
                  onClick={() => navigate(`/session/${session.joinCode}`)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-bold text-white tracking-widest">{session.joinCode}</span>
                    <span className="flex items-center gap-2 text-sm text-zinc-300">
                      <Users className="h-4 w-4" /> {session.participants}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <Film className="h-4 w-4" />
                    <span>{session.matches} Matches</span>
                  </div>
                  <Button className="mt-6 w-full text-sm py-2">
                    <LogIn className="mr-2 h-4 w-4" />
                    Rejoin
                  </Button>
                </div>
              ))}
              {mySessions.length === 0 && (
                <p className="text-zinc-400 col-span-3">You haven't joined any sessions yet.</p>
              )}
            </div>
          </motion.div>
          
          {/* --- 4. "What's Hot" (The Entertainment) --- */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-white mb-6">What's Hot Right Now</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {popularMovies.length > 0 ? (
                popularMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))
              ) : (
                // Loading Skeleton
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-40 space-y-2 animate-pulse">
                    <div className="w-full h-60 rounded-lg bg-white/10"></div>
                    <div className="w-3/4 h-4 rounded bg-white/10"></div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}

export default DashboardPage;