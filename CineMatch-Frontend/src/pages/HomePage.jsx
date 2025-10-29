import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

// --- I'VE ADDED THE NEW ICONS FOR THE FOOTER ---
import { 
  Sparkles, Swords, CheckCircle, PlayCircle, LogIn, 
  Users, Star, ThumbsUp, ThumbsDown,
  Github, Twitter, Linkedin // <-- NEW ICONS
} from 'lucide-react';

// --- A "Smart" Header Component (Internal to this page) ---
const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 p-4"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-white/5 p-3 px-6 shadow-2xl backdrop-blur-xl">
        {/* --- Logo --- */}
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-white" />
          <span className="text-xl font-bold text-white">CineMatch</span>
        </Link>
        
        {/* --- Navigation --- */}
        <div className="flex items-center gap-4">
          {user ? (
            // --- If user IS logged in ---
            <>
              <span className="text-zinc-300">Welcome, {user.name}!</span>
              <Button onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
              <Button onClick={logout} variant="secondary">
                Log Out
              </Button>
            </>
          ) : (
            // --- If user is NOT logged in ---
            <>
              <Link to="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-900 transition-transform hover:scale-105">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

// --- Movie Poster Data ---
const moviePosters = [
  "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", "/sF1U4EUQS8YCl0MhSjSjWj2W5G.jpg",
  "/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg", "/ldfCF9vER1mjNYPi3yCNKAkA0Y.jpg", "/j9mH1pr3jCNYxTjAU2HbmP1Aou0.jpg",
  "/f89JAyKM1f7xb9sKEaGYaj1sM8S.jpg", "/yF1eOkaYvwiORXpffA2kY0Rj8Vz.jpg", "/iTWrsOVsUqcwYSxrpC5iGA8yS0i.jpg",
  "/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg", "/1XDDXPXGiI8id7MrUxTOwnFvdjI.jpg", "/rrO5gu4N5Sjryy7uw7Qdxe65nJk.jpg",
  "/fiVW06jE7z9YnO4trhaMEdclSiC.jpg", "/gKkl37BQuKTanygYQG1pyYgLVgf.jpg", "/rktDFPbfVXVNClvuL5aAps3zOaP.jpg"
];
const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

// --- The "Impressive" Movie Marquee Component ---
const MovieMarquee = ({ direction = "forward" }) => (
  <div className="relative flex w-full overflow-hidden">
    <motion.div
      className={`flex flex-shrink-0 ${direction === 'reverse' ? 'animate-marquee-reverse' : 'animate-marquee'}`}
    >
      {[...moviePosters, ...moviePosters].map((poster, index) => (
        <img
          key={index}
          src={`${posterBaseUrl}${poster}`}
          alt="Movie poster"
          className="w-40 rounded-xl shadow-lg mx-3"
        />
      ))}
    </motion.div>
  </div>
);

// --- Animation Variants for Scroll-Triggered Sections ---
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay }
  })
};

// --- The Main Home Page Component ---
function HomePage() {
  return (
    // We must use 'overflow-x-hidden' to prevent marquee from breaking layout
    <div className="w-full overflow-x-hidden">
      <Header />
      
      {/* --- 1. Hero Section --- */}
      <main className="relative flex h-screen w-full flex-col items-center justify-center pt-20">
        {/* --- Text Content --- */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { 
              opacity: 1, y: 0, 
              transition: { staggerChildren: 0.1, delayChildren: 0.2 }
            }
          }}
          initial="hidden"
          animate="visible"
          className="z-10 flex flex-col items-center text-center p-4"
        >
          <motion.h1 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-6xl md:text-8xl font-bold text-white"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          >
            Stop Scrolling.
          </motion.h1>
          <motion.h1 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-6xl md:text-8xl font-bold text-blue-400 mb-6"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          >
            Start Matching.
          </motion.h1>
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="mb-8 max-w-xl text-lg text-zinc-300"
          >
            CineMatch is the fun, social way for you and your friends to
            finally agree on a movie. Swipe, match, and watch.
          </motion.p>
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="flex gap-4"
          >
            <Link to="/register" className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-lg font-semibold text-zinc-900 shadow-lg transition-transform hover:scale-105">
              Get Started for Free
            </Link>
          </motion.div>
        </motion.div>
        
        {/* --- Faded Overlay & Movie Marquee Background --- */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm z-10" />
          <div className="absolute inset-0 z-0 opacity-30 transform -rotate-12 scale-150 space-y-6">
            <MovieMarquee />
            <MovieMarquee direction="reverse" />
          </div>
        </div>
      </main>
      
      {/* --- 2. "How It Works" Section --- */}
      <section className="w-full bg-zinc-900 py-24 z-20 relative">
        <div className="mx-auto max-w-6xl p-4">
          <h2 className="mb-4 text-center text-4xl font-bold text-white">
            How It Works
          </h2>
          <p className="mb-16 text-center text-lg text-zinc-400">
            Finding your next movie night favorite is as easy as 1, 2, 3.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/5 p-8"
            >
              <div className="mb-4 rounded-full bg-blue-600/20 p-4 text-blue-400">
                <Swords className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">1. Create a Session</h3>
              <p className="text-zinc-400">
                Start a new session and invite your friends with a simple code.
                No more "what do you want to watch?" texts.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div
              variants={sectionVariants}
              custom={0.2} // This 'custom' prop is used by the variants to set a delay
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/5 p-8"
            >
              <div className="mb-4 rounded-full bg-green-600/20 p-4 text-green-400">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">2. Start Swiping</h3>
              <p className="text-zinc-400">
                Everyone in the session swipes right on movies they'd watch and
                left on the ones they'd skip.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div
              variants={sectionVariants}
              custom={0.4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/5 p-8"
            >
              <div className="mb-4 rounded-full bg-red-600/20 p-4 text-red-400">
                <PlayCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">3. Get Your Matches</h3>
              <p className="text-zinc-400">
                When everyone in the session swipes right on the same movie,
                it's a match! We'll show you a list of all your matches.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- 3. VISUAL FEATURE --- */}
      <section className="w-full bg-zinc-900 py-24 z-20 relative">
        <div className="mx-auto max-w-6xl p-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* --- Left Side: Mock App UI --- */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <img
                src={`${posterBaseUrl}${moviePosters[0]}`}
                alt="Dune Movie Poster"
                className="w-full rounded-lg shadow-lg"
              />
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-white">Dune: Part Two</h3>
                <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                  Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen...
                </p>
              </div>
              <div className="mt-6 flex justify-around gap-4">
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-400 transition-transform hover:scale-110 hover:bg-red-500/40">
                  <ThumbsDown className="h-8 w-8" />
                </button>
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400 transition-transform hover:scale-110 hover:bg-green-500/40">
                  <ThumbsUp className="h-8 w-8" />
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* --- Right Side: Text Description --- */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { 
                opacity: 1, y: 0, 
                transition: { staggerChildren: 0.1, delay: 0.2 }
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <motion.h2 variants={sectionVariants} className="text-4xl font-bold text-white mb-6">
              Swipe. Match. Watch.
            </motion.h2>
            <motion.p variants={sectionVariants} className="text-lg text-zinc-300 mb-6">
              The core of CineMatch is a simple, fun, and intuitive swiping interface
              that everyone can enjoy. No more endless debates, just quick, easy
              decisions.
            </motion.p>
            <ul className="space-y-4">
              <motion.li variants={sectionVariants} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-blue-400" />
                <span className="text-zinc-300">Discover hundreds of new and popular movies.</span>
              </motion.li>
              <motion.li variants={sectionVariants} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-blue-400" />
                <span className="text-zinc-300">Instantly see what your friends like.</span>
              </motion.li>
              <motion.li variants={sectionVariants} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-blue-400" />
                <span className="text-zinc-300">Build a shared watchlist of only the movies you *all* agree on.</span>
              </motion.li>
            </ul>
          </motion.div>
        </div>
      </section>
      
      {/* --- 4. TESTIMONIALS --- */}
      <section className="w-full py-24 z-20 relative">
        <div className="mx-auto max-w-6xl p-4">
          <h2 className="mb-4 text-center text-4xl font-bold text-white">
            Loved by Movie Fans
          </h2>
          <p className="mb-16 text-center text-lg text-zinc-400">
            Don't just take our word for it.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-8"
            >
              <div className="flex text-yellow-400 mb-4">
                <Star /><Star /><Star /><Star /><Star />
              </div>
              <p className="text-lg text-zinc-200 mb-4 font-light">
                "This app literally saved our movie nights. My partner and I
                used to spend an hour just *arguing* over what to watch."
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Sarah K.</p>
                  <p className="text-sm text-zinc-400">Movie Enthusiast</p>
                </div>
              </div>
            </motion.div>
            
            {/* Testimonial 2 */}
            <motion.div
              variants={sectionVariants}
              custom={0.2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-8"
            >
              <div className="flex text-yellow-400 mb-4">
                <Star /><Star /><Star /><Star /><Star />
              </div>
              <p className="text-lg text-zinc-200 mb-4 font-light">
                "I love this for planning movie nights with my roommates.
                We create a session, swipe during the day, and have a match list
                ready by the evening."
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Mike R.</p>
                  <p className="text-sm text-zinc-400">College Student</p>
                </div>
              </div>
            </motion.div>
            
            {/* Testimonial 3 */}
            <motion.div
              variants={sectionVariants}
              custom={0.4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-8"
            >
              <div className="flex text-yellow-400 mb-4">
                <Star /><Star /><Star /><Star /><Star />
              </div>
              <p className="text-lg text-zinc-200 mb-4 font-light">
                "The UI is beautiful and it's just... fun. Swiping on movies
                is my new favorite time-waster."
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Emily W.</p>
                  <p className="text-sm text-zinc-400">Designer</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- 5. FAQ --- */}
      <section className="w-full bg-zinc-900 py-24 z-20 relative">
        <div className="mx-auto max-w-6xl p-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            
            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
              <h4 className="font-semibold text-white text-lg mb-2">Is CineMatch free to use?</h4>
              <p className="text-zinc-400">
                Yes, CineMatch is completely free for all users. You can create sessions,
                swipe, and get matches all at no cost.
              </p>
            </motion.div>
            
            <motion.div variants={sectionVariants} custom={0.1} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
              <h4 className="font-semibold text-white text-lg mb-2">How many people can join a session?</h4>
              <p className="text-zinc-400">
                Currently, you can have up to 10 people in a single session. We're
                working on options for even larger groups!
              </p>
            </motion.div>
            
            <motion.div variants={sectionVariants} custom={0.2} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
              <h4 className="font-semibold text-white text-lg mb-2">Where do the movies come from?</h4>
              <p className="text-zinc-400">
                CineMatch uses the TMDB (The Movie Database) API, giving you access to
                hundreds of thousands of movies and TV shows.
              </p>
            </motion.div>
            
            <motion.div variants={sectionVariants} custom={0.3} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
              <h4 className="font-semibold text-white text-lg mb-2">Does this app tell me *where* to watch the movie?</h4>
              <p className="text-zinc-400">
                Not yet, but this is our most requested feature! We are actively working
                on integrating streaming service information into the match details.
              </p>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* --- 6. FINAL CTA --- */}
      <section className="w-full py-32 z-20 relative text-center">
        <div className="mx-auto max-w-3xl p-4">
          <motion.h2 
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-5xl font-bold text-white mb-6"
          >
            Ready to find your perfect movie?
          </motion.h2>
          <motion.p
            variants={sectionVariants}
            custom={0.1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-lg text-zinc-300 mb-10"
          >
            Stop the "what to watch" debate before it even starts.
            Get your friends, create a session, and start swiping.
          </motion.p>
          <motion.div
            variants={sectionVariants}
            custom={0.2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-xl font-semibold text-zinc-900 shadow-lg transition-transform hover:scale-105">
              Get Started Now for Free
            </Link>
          </motion.div>
        </div>
      </section>


      {/* ---
      --- NEW PROFESSIONAL FOOTER ---
      ---
      */}
      <footer className="w-full bg-zinc-900 border-t border-white/10 py-16 z-20 relative">
        <div className="mx-auto max-w-6xl p-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">CineMatch</span>
            </Link>
            <p className="text-zinc-400 text-sm">
              The social way to find movies you'll actually watch.
            </p>
            <div className="flex gap-4 mt-6">
              {/* These are mock links. You can replace '#' with your own links. */}
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Product Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link to="/register" className="text-zinc-400 hover:text-white transition-colors">Get Started</Link></li>
              <li><Link to="/login" className="text-zinc-400 hover:text-white transition-colors">Login</Link></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Features</a></li>
            </ul>
          </div>

          {/* Column 3: Legal Links (Mock) */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Developer */}
          <div>
            <h4 className="font-semibold text-white mb-4">Developer</h4>
            <p className="text-zinc-400">
              Built by a top-notch developer for a professional portfolio.
            </p>
            {/* You can put your portfolio link here! */}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors mt-2 inline-block">
              See more projects
            </a>
          </div>
          
        </div>
        
        {/* Bottom Bar: Copyright */}
        <div className="mx-auto max-w-6xl p-4 mt-12 border-t border-white/10 text-center">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} CineMatch. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}

// --- We need to create these components for the header to work ---
// This is a simplified, non-glassy button for the header
const Button = ({ onClick, children, variant = 'primary' }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold 
      transition-transform hover:scale-105
      ${variant === 'primary' ? 'bg-white text-zinc-900' : 'bg-white/10 text-white hover:bg-white/20'}
    `}
  >
    {children}
  </button>
);


export default HomePage;