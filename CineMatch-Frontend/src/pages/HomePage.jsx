import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useMotionTemplate, useScroll } from 'framer-motion';
import useAuthStore from '../store/authStore';

import {
  Sparkles, Swords, CheckCircle, PlayCircle, LogIn,
  Users, Star, ThumbsUp, ThumbsDown,
  Github, Twitter, Linkedin
} from 'lucide-react';
import Logo from '../components/Logo';

// --- Mouse Spotlight Component ---
const MouseSpotlight = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
      }}
    />
  );
};

// --- Floating 3D Shapes Background ---
const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Shape 1: Blue Orb */}
      <motion.div
        animate={{
          y: [0, -50, 0],
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px]"
      />

      {/* Shape 2: Purple Orb */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.5, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"
      />

      {/* Shape 3: Pink Accent */}
      <motion.div
        animate={{
          x: [0, -50, 0],
          rotate: [0, -180],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px]"
      />
    </div>
  );
};

// --- 3D Tilt Card Component for Hero ---
const TiltHero = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  return (
    <motion.div
      style={{ x, y, rotateX, rotateY, z: 100 }}
      drag
      dragElastic={0.16}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      whileTap={{ cursor: "grabbing" }}
      className="relative z-20 cursor-grab perspective-1000 group"
    >
      <div
        style={{
          transformStyle: "preserve-3d",
        }}
        className="flex flex-col items-center text-center"
      >
        <motion.h1
          style={{ transform: "translateZ(50px)" }}
          className="text-7xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl"
        >
          STOP
        </motion.h1>
        <motion.h1
          style={{ transform: "translateZ(80px)" }}
          className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 tracking-tighter drop-shadow-2xl"
        >
          SCROLLING
        </motion.h1>
        <motion.div
          style={{ transform: "translateZ(40px)" }}
          className="mt-6 max-w-lg text-xl text-zinc-200 font-light tracking-wide"
        >
          The social way to find movies you'll actually watch.
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- Updated Movie Poster Data (Known Working URLs) ---
const moviePosters = [
  "/1E5baAaEse26fej7uHcjOgEE2t2.jpg", // Fast X
  "/fiVW06jE7z9YnO4trhaMEdclSiC.jpg", // Fast & Furious
  "/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg", // The Super Mario Bros. Movie
  "/vZloFAK7NmvMGKE7VkF5UxEcKzP.jpg", // John Wick 4
  "/22z44CsQIVj4E3zIt8Ev3rLvpU.jpg", // Puss in Boots
  "/sv1xJUazXeYqALzczSZ3O6nkH75.jpg", // Black Panther
  "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg", // Avatar 2
  "/uJYYizSuA9Y3DCs0qS4qWvHfZg4.jpg", // Spider-Man
  "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", // Fight Club
  "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", // The Godfather
  "/qJ2tW6WMUDux911r6m7haRef0WH.jpg", // The Dark Knight
  "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", // Oppenheimer
];
const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

// --- 3D Phone Mockup Component (Fixed Rotation) ---
const PhoneMockup = () => {
  const { scrollYProgress } = useScroll();
  // Restrict rotation to avoid inversion. range: -20deg to 20deg
  const rotateX = useTransform(scrollYProgress, [0, 1], [10, -10]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <div className="perspective-1000 w-full flex justify-center py-10">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-zinc-800 shadow-2xl shadow-blue-500/20"
      >
        {/* Screen */}
        <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] bg-zinc-900">
          <img
            src={`${posterBaseUrl}${moviePosters[3]}`} // Using John Wick 4 poster
            alt="App Screen"
            className="h-full w-full object-cover opacity-90"
          />

          {/* Mock UI Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent pt-20">
            <h3 className="text-2xl font-bold text-white drop-shadow-md">John Wick: Chapter 4</h3>
            <p className="text-zinc-300 text-sm mt-1 line-clamp-2">With the price on his head ever increasing, John Wick takes his fight against the High Table global.</p>
            <div className="mt-6 flex justify-center gap-8">
              <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 border border-red-500/50 backdrop-blur-md shadow-lg shadow-red-500/20 transition-transform hover:scale-110">
                <ThumbsDown size={28} />
              </div>
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/50 backdrop-blur-md shadow-lg shadow-green-500/20 transition-transform hover:scale-110">
                <ThumbsUp size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Reflection/Gloss */}
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-white/20 to-transparent pointer-events-none z-10" />
      </motion.div>
    </div>
  );
};

// --- 3D Tilt Card for Features ---
const FeatureCard = ({ icon: Icon, title, description, colorClass, delay }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  return (
    <motion.div
      style={{ x, y, rotateX, rotateY, z: 100 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="group relative flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer perspective-1000 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-white/20"
    >
      <div
        style={{ transform: "translateZ(30px)" }}
        className={`mb-6 rounded-full p-5 ${colorClass} bg-opacity-20 shadow-lg`}
      >
        <Icon className="h-10 w-10" />
      </div>
      <h3 style={{ transform: "translateZ(40px)" }} className="mb-3 text-2xl font-bold text-white">
        {title}
      </h3>
      <p style={{ transform: "translateZ(20px)" }} className="text-zinc-400 leading-relaxed">
        {description}
      </p>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

// --- Header Component ---
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
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-black/50 p-3 px-6 shadow-2xl backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2 group">
          <Logo className="h-8 w-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
          <span className="text-xl font-bold text-white tracking-tight">CineMatch</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-zinc-300 hidden md:block">Welcome, {user.name}!</span>
              <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
              <Button onClick={logout} variant="secondary">Log Out</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-zinc-900 transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

const MovieMarquee = ({ direction = "forward" }) => (
  <div className="relative flex w-full overflow-hidden py-10">
    <motion.div
      className={`flex flex-shrink-0 gap-6 ${direction === 'reverse' ? 'animate-marquee-reverse' : 'animate-marquee'}`}
    >
      {[...moviePosters, ...moviePosters].map((poster, index) => (
        <img
          key={index}
          src={`${posterBaseUrl}${poster}`}
          alt="Movie poster"
          className="w-48 h-72 object-cover rounded-xl shadow-2xl border border-white/10 hover:scale-105 transition-transform duration-300"
        />
      ))}
    </motion.div>
  </div>
);

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" }
  })
};

// --- Main Home Page Component ---
function HomePage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-[#0a0a0a] text-white selection:bg-blue-500/30 font-sans">
      <MouseSpotlight />
      <FloatingShapes />
      <Header />

      {/* --- 1. Hero Section --- */}
      <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden pt-20">
        <TiltHero />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="z-20 mt-12 flex flex-col md:flex-row gap-6 items-center"
        >
          <Link to="/register" className="group relative px-10 py-5 bg-white text-black font-bold text-lg rounded-full overflow-hidden shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all hover:scale-105">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 group-hover:text-white transition-colors">Start Matching Now</span>
          </Link>
          <Link to="/login" className="px-10 py-5 border border-white/20 hover:bg-white/10 rounded-full font-medium text-lg transition-all hover:scale-105 backdrop-blur-sm">
            I have an account
          </Link>
        </motion.div>

        {/* Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 opacity-60 mask-image-gradient">
          <MovieMarquee />
        </div>
      </main>

      {/* --- 2. How It Works --- */}
      <section className="w-full bg-zinc-900/50 backdrop-blur-3xl py-32 z-20 relative border-t border-white/5">
        <div className="mx-auto max-w-6xl p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Finding your next movie night favorite is as easy as 1, 2, 3. No more arguments, just movies.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={Swords}
              title="1. Create a Session"
              description="Start a new session and invite your friends instantly with a simple code."
              colorClass="text-blue-400 bg-blue-600"
              delay={0}
            />
            <FeatureCard
              icon={CheckCircle}
              title="2. Start Swiping"
              description="Everyone swipes right on movies they'd watch and left on ones they'd skip."
              colorClass="text-green-400 bg-green-600"
              delay={0.2}
            />
            <FeatureCard
              icon={PlayCircle}
              title="3. Get Your Matches"
              description="When everyone swipes right on the same movie, it's a match! Pop the corn."
              colorClass="text-red-400 bg-red-600"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* --- 3. Visual Feature --- */}
      <section className="w-full py-32 z-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/0 via-blue-900/10 to-zinc-900/0 pointer-events-none" />
        <div className="mx-auto max-w-6xl p-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <PhoneMockup />
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delay: 0.2 } } }} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
            <motion.h2 variants={sectionVariants} className="text-5xl font-bold text-white mb-8 leading-tight">
              Swipe. Match. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Watch Together.</span>
            </motion.h2>
            <motion.p variants={sectionVariants} className="text-xl text-zinc-300 mb-8 leading-relaxed">
              The core of CineMatch is a simple, fun, and intuitive swiping interface.
              It feels like a game, but the prize is a great movie night.
            </motion.p>
            <ul className="space-y-6">
              <motion.li variants={sectionVariants} className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-blue-500/20 text-blue-400"><CheckCircle className="h-6 w-6" /></div>
                <span className="text-zinc-200 text-lg">Discover hidden gems and blockbusters.</span>
              </motion.li>
              <motion.li variants={sectionVariants} className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-purple-500/20 text-purple-400"><Users className="h-6 w-6" /></div>
                <span className="text-zinc-200 text-lg">See what your friends are into.</span>
              </motion.li>
              <motion.li variants={sectionVariants} className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-pink-500/20 text-pink-400"><PlayCircle className="h-6 w-6" /></div>
                <span className="text-zinc-200 text-lg">Build a shared watchlist instantly.</span>
              </motion.li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* --- 4. Testimonials --- */}
      <section className="w-full py-32 z-20 relative bg-zinc-900/30 border-y border-white/5">
        <div className="mx-auto max-w-6xl p-6">
          <h2 className="mb-16 text-center text-4xl font-bold text-white">Loved by Movie Fans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah K.", role: "Movie Enthusiast", text: "This app literally saved our movie nights. No more scrolling for hours!" },
              { name: "Mike R.", role: "College Student", text: "I love this for planning movie nights with my roommates. It's actually fun." },
              { name: "Emily W.", role: "Designer", text: "The UI is beautiful and it's just... fun. Swiping is addictive." }
            ].map((t, i) => (
              <motion.div key={i} variants={sectionVariants} custom={i * 0.2} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-colors">
                <div className="flex text-yellow-400 mb-6"><Star className="fill-current" /><Star className="fill-current" /><Star className="fill-current" /><Star className="fill-current" /><Star className="fill-current" /></div>
                <p className="text-lg text-zinc-200 mb-6 font-light italic">"{t.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
                    {t.name[0]}
                  </div>
                  <div><p className="font-semibold text-white text-lg">{t.name}</p><p className="text-sm text-zinc-400">{t.role}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. FAQ --- */}
      <section className="w-full py-32 z-20 relative">
        <div className="mx-auto max-w-4xl p-6">
          <h2 className="mb-16 text-center text-4xl font-bold text-white">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 gap-6">
            {[
              { q: "Is CineMatch free to use?", a: "Yes, CineMatch is completely free for all users. Create sessions, swipe, and match without paying a dime." },
              { q: "How many people can join a session?", a: "Currently, you can have up to 10 people in a single session. Perfect for small to medium groups!" },
              { q: "Where do the movies come from?", a: "We use the TMDB (The Movie Database) API, giving you access to hundreds of thousands of movies." },
              { q: "Does this app tell me where to watch?", a: "We are actively working on integrating streaming service availability (Netflix, Hulu, etc.) soon!" }
            ].map((faq, i) => (
              <motion.div
                key={i}
                variants={sectionVariants}
                custom={i * 0.1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-white/20 transition-colors"
              >
                <h4 className="font-bold text-white text-xl mb-3">{faq.q}</h4>
                <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 6. CTA --- */}
      <section className="w-full py-40 z-20 relative text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-3xl p-6 relative z-10">
          <motion.h2 variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
            Ready to find your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">perfect movie?</span>
          </motion.h2>
          <motion.div variants={sectionVariants} custom={0.2} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
            <Link to="/register" className="inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-xl font-bold text-zinc-900 shadow-2xl shadow-blue-500/30 transition-transform hover:scale-105 hover:shadow-blue-500/50">
              Get Started Now <span className="text-blue-600">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="w-full bg-black border-t border-white/10 py-20 z-20 relative">
        <div className="mx-auto max-w-6xl p-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6"><Logo className="h-8 w-8 text-white" /><span className="text-2xl font-bold text-white">CineMatch</span></Link>
            <p className="text-zinc-500 text-sm leading-relaxed">The social way to find movies you'll actually watch. Built for movie lovers, by movie lovers.</p>
            <div className="flex gap-4 mt-8">
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Github className="h-6 w-6" /></a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Twitter className="h-6 w-6" /></a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Linkedin className="h-6 w-6" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">Product</h4>
            <ul className="space-y-4">
              <li><Link to="/register" className="text-zinc-400 hover:text-white transition-colors">Get Started</Link></li>
              <li><Link to="/login" className="text-zinc-400 hover:text-white transition-colors">Login</Link></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Features</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">Developer</h4>
            <p className="text-zinc-400 mb-4">Built with ❤️ and ☕ by a top-notch developer.</p>
            <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">View Portfolio →</a>
          </div>
        </div>
        <div className="mx-auto max-w-6xl p-6 mt-16 border-t border-white/10 text-center">
          <p className="text-zinc-600 text-sm">&copy; {new Date().getFullYear()} CineMatch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const Button = ({ onClick, children, variant = 'primary' }) => (
  <button onClick={onClick} className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all hover:scale-105 ${variant === 'primary' ? 'bg-white text-zinc-900 hover:bg-zinc-100' : 'bg-white/10 text-white hover:bg-white/20'}`}>
    {children}
  </button>
);

export default HomePage;