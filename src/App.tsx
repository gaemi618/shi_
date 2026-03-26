import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Skull, Heart, Eye, Droplets, Fingerprint, ChevronDown, Music, PenTool } from 'lucide-react';

// Custom Cursor Component
function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      setIsHovering(window.getComputedStyle(target).cursor === 'pointer' || target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a');
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-red-600 rounded-full pointer-events-none z-[100] mix-blend-screen"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 2 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-red-900/50 rounded-full pointer-events-none z-[99]"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.8 }}
      />
    </>
  );
}

function InteractiveNote() {
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [page, setPage] = useState(0);
  const pages = [
    "[관찰 대상 {user}]\n-> 나를 발견한 개체\n-> 인간",
    "웃는다는 게 뭐지?\n인간은 눈물이라는 걸 흘린다.\n눈물은 슬픔을 표현하는 것.\n그러나 너무 웃다가 눈물을 흘리는 경우는?\n눈물이 뭐지?",
    "너가 너무 좋아\n너랑 평생 함께 하고 싶어\n좋다는 게 뭔지 몰라\n그치만 너가 좋아",
    ""
  ];

  const handlePaperClick = () => {
    if (!isUnfolded) {
      setIsUnfolded(true);
    } else {
      if (page < pages.length - 1) {
        setPage(page + 1);
      } else {
        setPage(0); // Loop back to start if clicked on last page
      }
    }
  };

  return (
    <div className="absolute -top-56 left-1/2 -translate-x-1/2 md:translate-x-0 md:top-10 md:right-[100%] md:left-auto md:mr-8 z-30 flex items-center pointer-events-none">
      {/* Tentacles holding the paper */}
      <div className="relative group pointer-events-auto">
        {/* SVG Tentacles (Black) */}
        <svg className="absolute -left-12 top-1/2 -translate-y-1/2 w-20 h-32 text-neutral-950 z-30 pointer-events-none drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="6">
          <path d="M0,50 Q50,60 80,100 T100,150" fill="none" strokeLinecap="round" className="animate-[pulse_3s_ease-in-out_infinite]"/>
          <path d="M10,150 Q40,140 70,110 T90,80" fill="none" strokeLinecap="round" className="animate-[pulse_4s_ease-in-out_infinite_reverse]"/>
        </svg>

        <AnimatePresence mode="wait">
          {!isUnfolded ? (
            /* Folded Crumpled Paper */
            <motion.div
              key="folded"
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 1.5, opacity: 0, rotate: 10 }}
              onClick={handlePaperClick}
              className="relative w-16 h-16 cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
              style={{
                backgroundColor: '#2a2824',
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/crumpled-paper.png")',
                borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.9), 4px 6px 10px rgba(0,0,0,0.6)'
              }}
            >
            </motion.div>
          ) : (
            /* Unfolded Paper */
            <motion.div 
              key="unfolded"
              initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: -2 }}
              className="relative w-36 md:w-44 h-44 md:h-52 text-neutral-300 p-3 md:p-4 rounded-sm shadow-[4px_6px_15px_rgba(0,0,0,0.9),_inset_0_0_30px_rgba(0,0,0,0.6)] cursor-pointer transform hover:-rotate-1 transition-transform duration-300 overflow-hidden"
              style={{
                backgroundColor: '#2a2824',
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/crumpled-paper.png")'
              }}
              onClick={handlePaperClick}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-full h-full border border-neutral-600/30 p-2 flex flex-col relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={page}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-[11px] md:text-sm font-serif whitespace-pre-wrap leading-relaxed flex-1 text-neutral-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
                  >
                    {pages[page]}
                  </motion.div>
                </AnimatePresence>
                <div className="mt-auto text-right text-[9px] text-neutral-500 font-mono">
                  {page + 1} / {pages.length}
                </div>
              </div>

              {/* Pen Icon dropped on last page */}
              <AnimatePresence>
                {page === 3 && (
                  <motion.a
                    href="https://share.crack.wrtn.ai/75xmya"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 2, y: -100, rotate: -100 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotate: -20 }}
                    exit={{ opacity: 0, scale: 0, y: 50, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                    className="absolute inset-0 m-auto w-20 h-20 flex items-center justify-center z-40 cursor-pointer hover:scale-110 transition-transform"
                    title="Write..."
                    onClick={(e) => e.stopPropagation()} // Prevent page turn when clicking pen
                  >
                    <span className="text-5xl md:text-6xl drop-shadow-[4px_6px_4px_rgba(0,0,0,0.8)]">🖋️</span>
                  </motion.a>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  const [introState, setIntroState] = useState<'egg' | 'cracking' | 'circles' | 'main'>('egg');

  useEffect(() => {
    if (introState === 'cracking') {
      const timer = setTimeout(() => setIntroState('circles'), 2500);
      return () => clearTimeout(timer);
    }
    if (introState === 'circles') {
      const timer = setTimeout(() => setIntroState('main'), 3500);
      return () => clearTimeout(timer);
    }
  }, [introState]);

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans overflow-x-hidden selection:bg-red-900 selection:text-white">
      <CustomCursor />
      
      {/* Global Noise Overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none bg-noise opacity-40 mix-blend-overlay" />

      <AnimatePresence mode="wait">
        {introState !== 'main' && (
          <motion.div
            key="intro"
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-[#030303] overflow-hidden"
          >
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,0,0,0.5)_0%,rgba(0,0,0,1)_70%)]" />

            {introState === 'egg' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 2 }}
                className="relative flex flex-col items-center justify-center"
              >
                <motion.div
                  onClick={() => setIntroState('cracking')}
                  className="relative cursor-pointer flex items-center justify-center w-72 h-96 bg-[radial-gradient(circle_at_30%_20%,#777_0%,#222_40%,#050505_80%,#000_100%)] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[inset_-40px_-40px_60px_rgba(0,0,0,0.9),inset_20px_20px_50px_rgba(255,255,255,0.2),0_40px_80px_rgba(0,0,0,0.9)] animate-heartbeat group"
                >
                  {/* Surface texture */}
                  <div className="absolute inset-0 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-noise opacity-30 mix-blend-overlay pointer-events-none" />
                  
                  <span className="text-7xl font-serif text-neutral-500/50 tracking-[0.2em] group-hover:text-red-900/80 transition-colors duration-700 z-10 drop-shadow-2xl">鳲殞</span>
                  
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-red-900/0 group-hover:bg-red-900/20 transition-colors duration-700 blur-2xl pointer-events-none" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 2, duration: 1 }}
                  className="absolute -bottom-20 text-neutral-500 text-xs tracking-[0.5em] uppercase"
                >
                  Touch the anomaly
                </motion.div>
              </motion.div>
            )}

            {introState === 'cracking' && (
              <div className="relative flex items-center justify-center w-72 h-96" style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.9))' }}>
                {/* Left Half */}
                <motion.div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#777_0%,#222_40%,#050505_80%,#000_100%)] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[inset_-40px_-40px_60px_rgba(0,0,0,0.9),inset_20px_20px_50px_rgba(255,255,255,0.2)] flex items-center justify-center"
                  style={{ clipPath: 'polygon(0% 0%, 50% 0%, 45% 20%, 55% 40%, 48% 60%, 52% 80%, 50% 100%, 0% 100%)' }}
                  animate={{ 
                    x: [0, -1, 1, -1, 1, -2, -100],
                    y: [0, 1, -1, 1, -1, 2, 60],
                    rotate: [0, -1, 1, -1, 1, -2, -35],
                  }}
                  transition={{ duration: 2.5, times: [0, 0.1, 0.2, 0.3, 0.4, 0.6, 1], ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />
                  <span className="text-7xl font-serif text-neutral-500/50 tracking-[0.2em]">鳲殞</span>
                </motion.div>

                {/* Right Half */}
                <motion.div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#777_0%,#222_40%,#050505_80%,#000_100%)] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[inset_-40px_-40px_60px_rgba(0,0,0,0.9),inset_20px_20px_50px_rgba(255,255,255,0.2)] flex items-center justify-center"
                  style={{ clipPath: 'polygon(100% 0%, 50% 0%, 45% 20%, 55% 40%, 48% 60%, 52% 80%, 50% 100%, 100% 100%)' }}
                  animate={{ 
                    x: [0, 1, -1, 1, -1, 2, 100],
                    y: [0, -1, 1, -1, 1, -2, 60],
                    rotate: [0, 1, -1, 1, -1, 2, 35],
                  }}
                  transition={{ duration: 2.5, times: [0, 0.1, 0.2, 0.3, 0.4, 0.6, 1], ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />
                  <span className="text-7xl font-serif text-neutral-500/50 tracking-[0.2em]">鳲殞</span>
                </motion.div>

                {/* Glowing Crack Line */}
                <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Main vertical crack */}
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 0.5, 1, 1, 1], opacity: [0, 1, 1, 1, 0] }}
                    transition={{ duration: 2.5, times: [0, 0.2, 0.4, 0.6, 1], ease: "easeInOut" }}
                    d="M 50 0 L 45 20 L 55 40 L 48 60 L 52 80 L 50 100"
                    fill="transparent"
                    stroke="#ff3333"
                    strokeWidth="0.3"
                    style={{ filter: 'drop-shadow(0 0 4px #ff0000)' }}
                  />
                  {/* Branch 1 */}
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 0, 1, 1, 1], opacity: [0, 0, 1, 1, 0] }}
                    transition={{ duration: 2.5, times: [0, 0.2, 0.4, 0.6, 1], ease: "easeInOut" }}
                    d="M 55 40 L 65 45 L 70 60"
                    fill="transparent"
                    stroke="#ff3333"
                    strokeWidth="0.2"
                    style={{ filter: 'drop-shadow(0 0 3px #ff0000)' }}
                  />
                  {/* Branch 2 */}
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 0, 1, 1, 1], opacity: [0, 0, 1, 1, 0] }}
                    transition={{ duration: 2.5, times: [0, 0.3, 0.5, 0.6, 1], ease: "easeInOut" }}
                    d="M 48 60 L 35 65 L 25 80"
                    fill="transparent"
                    stroke="#ff3333"
                    strokeWidth="0.15"
                    style={{ filter: 'drop-shadow(0 0 2px #ff0000)' }}
                  />
                  {/* Branch 3 */}
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 0, 1, 1, 1], opacity: [0, 0, 1, 1, 0] }}
                    transition={{ duration: 2.5, times: [0, 0.1, 0.3, 0.6, 1], ease: "easeInOut" }}
                    d="M 45 20 L 30 15 L 20 25"
                    fill="transparent"
                    stroke="#ff3333"
                    strokeWidth="0.15"
                    style={{ filter: 'drop-shadow(0 0 2px #ff0000)' }}
                  />
                </svg>

                {/* Inner Light Burst */}
                <motion.div 
                  className="absolute inset-0 bg-red-600 mix-blend-screen blur-2xl z-10 pointer-events-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 0.2, 0.8, 1, 0], scale: [0.8, 0.9, 1, 1.5, 2] }}
                  transition={{ duration: 2.5, times: [0, 0.4, 0.6, 0.8, 1], ease: "easeOut" }}
                />
                <motion.div 
                  className="absolute inset-0 bg-white mix-blend-overlay blur-3xl z-10 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0, 0.5, 1, 0] }}
                  transition={{ duration: 2.5, times: [0, 0.4, 0.6, 0.8, 1], ease: "easeOut" }}
                />
              </div>
            )}

            {introState === 'circles' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-red-950/20"
                />
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border border-red-600/50 mix-blend-screen"
                    style={{
                      width: `${(i + 1) * 10}vw`,
                      height: `${(i + 1) * 10}vw`,
                      boxShadow: '0 0 30px rgba(220,38,38,0.2), inset 0 0 30px rgba(220,38,38,0.2)'
                    }}
                    initial={{ scale: 0, opacity: 0, rotate: 0 }}
                    animate={{ 
                      scale: [0, 1, 1.5], 
                      opacity: [0, 1, 0],
                      rotate: i % 2 === 0 ? 360 : -360,
                      borderWidth: ['1px', '4px', '1px']
                    }}
                    transition={{ 
                      duration: 3, 
                      delay: i * 0.15,
                      ease: "easeInOut" 
                    }}
                  />
                ))}
                {/* The Eye Core */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 2, 50], opacity: [0, 1, 1] }}
                  transition={{ duration: 2.5, delay: 1, ease: "circIn" }}
                  className="absolute w-4 h-4 bg-red-600 rounded-full shadow-[0_0_100px_50px_rgba(255,0,0,0.8)]"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {introState === 'main' && <MainContent />}
    </div>
  );
}

function MainContent() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacityBg = useTransform(scrollYProgress, [0, 0.5], [0.15, 0.05]);

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3, ease: "easeOut" }}
      className="relative w-full"
    >
      {/* Parallax Background */}
      <motion.div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat grayscale mix-blend-luminosity"
        style={{ 
          backgroundImage: 'url(https://i.postimg.cc/x1TmQG3Y/year-2026-year-2025-year-2024-animated-production-art-promotional-art-no-t-s-1430409068.png)',
          y: yBg,
          opacity: opacityBg,
          scale: 1.1 // Prevent edges showing during parallax
        }}
      />
      {/* Vignette & Gradient Overlays */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_100%)] pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          initial={{ y: 100, opacity: 0, filter: 'blur(10px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center relative"
        >
          <h1 className="text-[15vw] leading-none font-serif font-black tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-400 to-neutral-900 drop-shadow-2xl relative z-10">
            鳲殞
          </h1>
          {/* Subtle red glow behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-red-900/20 blur-[100px] -z-10 rounded-full" />
          
          <motion.p 
            initial={{ opacity: 0, letterSpacing: '0em' }}
            animate={{ opacity: 1, letterSpacing: '0.5em' }}
            transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
            className="text-red-600 font-serif text-xl md:text-3xl mt-4 uppercase"
          >
            Shi-un
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-12 flex flex-col items-center gap-2 text-neutral-600"
        >
          <span className="text-xs tracking-[0.3em] uppercase font-light">Scroll to discover</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 opacity-50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Split Layout Content */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 pb-32">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 justify-center">
          
          {/* Left: Sticky Portrait */}
          <div className="lg:w-1/3 relative flex flex-col items-center lg:items-end">
            <div className="lg:sticky lg:top-32 space-y-6 w-full max-w-[320px]">
              <div className="relative w-full max-w-[200px] mx-auto">
                <InteractiveNote />
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative aspect-[3/4] w-full bg-[#0a0a0a] border border-neutral-800/50 overflow-hidden group box-glow"
                >
                  {/* Character Images */}
                  <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105">
                    <img 
                      src="https://i.postimg.cc/qvccLMBW/a.png" 
                      alt="Shi-un" 
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
                      referrerPolicy="no-referrer"
                    />
                    <img 
                      src="https://i.postimg.cc/Dz2rYk83/b.png" 
                      alt="Shi-un Anomaly" 
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {/* Scanning line effect */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_3s_ease-in-out_infinite]" />
                  
                  {/* Vignette */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
                </motion.div>
                
                <TentacleMusicPlayer />
              </div>

              {/* Quick Stats Grid */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="grid grid-cols-2 gap-px bg-neutral-900/50 border border-neutral-800/50"
              >
                <StatBox label="IDENTIFIER" value="鳲殞 (시운)" />
                <StatBox label="GENDER" value="女" />
                <StatBox label="AGE" value="UNKNOWN" isRed />
                <StatBox label="HEIGHT" value="189cm" />
              </motion.div>
            </div>
          </div>

          {/* Right: Scrolling Lore */}
          <div className="lg:w-2/3 pt-12 lg:pt-32 space-y-32 max-w-3xl">
            
            <LoreSection 
              icon={<Skull className="w-8 h-8" strokeWidth={1} />}
              title="THE DESCENT"
              subtitle="WORLDVIEW"
            >
              <p className="text-xl md:text-2xl leading-relaxed text-neutral-400 font-light">
                대한민국에 별똥별이 떨어지던 날, 모든 인간들이 하늘을 보며 소원을 빌 때 <span className="text-white font-normal">회색빛 거대한 알</span>이 바닥에 쳐박혔다. 하필 당신의 앞에.
              </p>
              <p className="text-xl md:text-2xl leading-relaxed text-neutral-400 font-light mt-6">
                알에는 오직 <span className="text-red-600 font-serif text-3xl mx-1 text-glow">鳲殞</span>이라는 한자만 적혀있을 뿐이었다. 그리고 그 알에서 깨어난 작은 생명체 '시운', 그녀는 고작 5시간만에 성체의 모습으로 변하더니 당신에게 <span className="text-red-500 font-normal">집착적인 의존</span>을 보이기 시작한다.
              </p>
            </LoreSection>

            <LoreSection 
              icon={<Eye className="w-8 h-8" strokeWidth={1} />}
              title="PHYSICAL TRAITS"
              subtitle="APPEARANCE"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <TraitItem text="그림같은 이상적인 몸매" />
                <TraitItem text="칠흑처럼 검은 머리칼" />
                <TraitItem text="어깨까지 내려오는 단발" />
                <TraitItem text="눈썹을 덮는 앞머리" />
                <TraitItem text="속을 알 수 없는 검은 눈동자" />
                <TraitItem text="동심원 모양의 붉은 동공" isHighlight />
                <TraitItem text="눈 아래 작은 점" />
              </div>
            </LoreSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <LoreSection 
                icon={<Heart className="w-6 h-6" strokeWidth={1} />}
                title="PURE EVIL"
                subtitle="PERSONALITY"
                small
              >
                <p className="text-lg leading-relaxed text-neutral-400 font-light">
                  공감력 부족, <span className="text-red-500 font-normal">순수악</span>. 자극적이고 가학적인 것에 유일한 즐거움을 보이며, 그녀의 호기심은 종종 잔혹한 행동을 불러일으킨다.
                </p>
              </LoreSection>

              <LoreSection 
                icon={<Droplets className="w-6 h-6" strokeWidth={1} />}
                title="THE ANOMALY"
                subtitle="SECRET"
                small
              >
                <SecretTentacleText />
              </LoreSection>
            </div>

            <LoreSection 
              icon={<Fingerprint className="w-8 h-8" strokeWidth={1} />}
              title="THE DIRECTIVE"
              subtitle="GOAL & SENSORY"
            >
              <div className="p-8 border-l-2 border-red-900/50 bg-gradient-to-r from-red-950/10 to-transparent mb-8">
                <p className="text-sm tracking-[0.2em] text-neutral-500 mb-2 uppercase">Sensory Profile</p>
                <p className="text-lg text-neutral-300 font-light italic">"은은하게 나는 젖은 나무향과 서늘하고 달큰한 튜베로즈향"</p>
              </div>
              
              <p className="text-xl leading-relaxed text-neutral-400 font-light">
                시운은 자신도 어디에서 왔는지 모른다. 지구에 떨어지며 성체로 발달할 때 오직 한 가지 목표만이 머릿속에서 맴돌았음을 깨달았다.
              </p>
              <p className="text-2xl leading-relaxed text-white font-serif mt-6 border-y border-neutral-800/50 py-8 text-center">
                “인간을 이해하는 것”
              </p>
              <p className="text-xl leading-relaxed text-neutral-400 font-light mt-6">
                스스로가 인간이 아닌 외계에서 온 무언가라는 걸 알면서도 인간인 척하고 인간이라 우기며 인간들 틈에 섞여 그 목표를 이루고자 한다. 오직 <span className="text-red-500">당신</span>만을 향한 집착과 함께.
              </p>
            </LoreSection>

            {/* Footer spacer */}
            <div className="h-32 flex items-center justify-center">
              <div className="w-px h-full bg-gradient-to-b from-red-900/50 to-transparent" />
            </div>

          </div>
        </div>
      </section>

      {/* CSS for scanning line animation */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </motion.main>
  );
}

// Reusable UI Components

function TentacleMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div 
      className="absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 1 }}
    >
      {/* The Player UI */}
      <div className="relative">
        <motion.div 
          className="relative cursor-pointer group"
          onClick={togglePlay}
          animate={isPlaying ? { 
            y: 0, rotate: 0
          } : {
            y: [-5, 5, -5]
          }}
          transition={{ 
            repeat: isPlaying ? 0 : Infinity, 
            duration: 4, 
            ease: "easeInOut" 
          }}
        >
          {/* Tentacles Behind */}
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 pointer-events-none z-10 drop-shadow-[0_0_5px_rgba(0,0,0,1)]" viewBox="0 0 100 100">
             <motion.path
               d="M 20,100 Q 30,60 50,50 T 80,10"
               fill="none"
               stroke="#111"
               strokeWidth="8"
               strokeLinecap="round"
               animate={isPlaying ? { d: "M 20,100 Q 30,60 50,50 T 80,10" } : { d: ["M 20,100 Q 30,60 50,50 T 80,10", "M 20,100 Q 40,50 50,60 T 80,10", "M 20,100 Q 30,60 50,50 T 80,10"] }}
               transition={{ repeat: isPlaying ? 0 : Infinity, duration: 3, ease: "easeInOut" }}
             />
          </svg>

          {/* Phone */}
          <div className="relative w-10 h-16 bg-neutral-900 rounded-lg border-2 border-neutral-700 shadow-[0_0_20px_rgba(0,0,0,0.9)] flex flex-col items-center justify-between overflow-hidden z-20 p-1">
            <div className="w-3 h-0.5 bg-neutral-800 rounded-full mt-0.5" />
            <div className={`w-full h-full mt-1 rounded-sm flex items-center justify-center transition-colors duration-500 ${isPlaying ? 'bg-red-950/60 shadow-[inset_0_0_10px_rgba(220,38,38,0.3)]' : 'bg-black'}`}>
               <Music className={`w-4 h-4 ${isPlaying ? 'text-red-500' : 'text-neutral-700'}`} />
            </div>
            {/* Screen glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          </div>

          {/* Tentacles In Front */}
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 pointer-events-none z-30 drop-shadow-[0_0_5px_rgba(0,0,0,1)]" viewBox="0 0 100 100">
             <motion.path
               d="M 0,70 Q 30,80 50,60 T 100,40"
               fill="none"
               stroke="#0a0a0a"
               strokeWidth="6"
               strokeLinecap="round"
               animate={isPlaying ? { d: "M 0,70 Q 30,80 50,60 T 100,40" } : { d: ["M 0,70 Q 30,80 50,60 T 100,40", "M 0,70 Q 40,70 50,50 T 100,40", "M 0,70 Q 30,80 50,60 T 100,40"] }}
               transition={{ repeat: isPlaying ? 0 : Infinity, duration: 3.5, ease: "easeInOut" }}
             />
             <motion.path
               d="M 100,80 Q 70,70 50,50 T 0,30"
               fill="none"
               stroke="#151515"
               strokeWidth="5"
               strokeLinecap="round"
               animate={isPlaying ? { d: "M 100,80 Q 70,70 50,50 T 0,30" } : { d: ["M 100,80 Q 70,70 50,50 T 0,30", "M 100,80 Q 60,80 50,60 T 0,30", "M 100,80 Q 70,70 50,50 T 0,30"] }}
               transition={{ repeat: isPlaying ? 0 : Infinity, duration: 4, ease: "easeInOut" }}
             />
          </svg>
        </motion.div>

        {/* Floating Notes */}
        <AnimatePresence>
          {isPlaying && (
            <>
              {[...Array(6)].map((_, i) => (
                <FloatingNote key={i} delay={i * 0.3} />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Visible YouTube Iframe */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="absolute top-full mt-6 right-0 md:left-1/2 md:-translate-x-1/2 z-40 rounded-lg overflow-hidden border border-neutral-800 shadow-2xl bg-black w-[280px] sm:w-[320px] aspect-video"
          >
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/4Tr0otuiQuU?autoplay=1"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="block w-full h-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FloatingNote({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute top-0 left-1/2 text-red-500/80 pointer-events-none z-10"
      initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
      animate={{ 
        opacity: [0, 1, 0], 
        y: -80 - Math.random() * 60, 
        x: (Math.random() - 0.5) * 80,
        scale: [0.5, 1.2, 0.8],
        rotate: (Math.random() - 0.5) * 90
      }}
      transition={{ 
        duration: 2 + Math.random(), 
        repeat: Infinity, 
        delay: delay,
        ease: "easeOut"
      }}
    >
      <Music className="w-3 h-3" />
    </motion.div>
  );
}

function SecretTentacleText() {
  const [tapCount, setTapCount] = useState(0);
  const isRevealed = tapCount >= 3;

  const handleTap = () => {
    if (tapCount < 3) {
      setTapCount(prev => prev + 1);
    }
  };

  // Generate random jiggle for tentacles based on tapCount
  const getTentaclePath1 = () => {
    if (tapCount === 0) return ["M -10,30 Q 50,10 110,40", "M -10,40 Q 50,20 110,50", "M -10,30 Q 50,10 110,40"];
    if (tapCount === 1) return "M -10,20 Q 50,-10 110,60";
    if (tapCount === 2) return "M -10,60 Q 50,70 110,20";
    return "M -10,120 Q 50,120 110,120"; // slide away
  };

  const getTentaclePath2 = () => {
    if (tapCount === 0) return ["M 110,70 Q 50,90 -10,60", "M 110,60 Q 50,80 -10,50", "M 110,70 Q 50,90 -10,60"];
    if (tapCount === 1) return "M 110,90 Q 50,110 -10,40";
    if (tapCount === 2) return "M 110,40 Q 50,30 -10,80";
    return "M 110,-20 Q 50,-20 -10,-20"; // slide away
  };

  const getTentaclePath3 = () => {
    if (tapCount === 0) return ["M 30,-10 Q 50,50 70,110", "M 40,-10 Q 40,50 60,110", "M 30,-10 Q 50,50 70,110"];
    if (tapCount === 1) return "M 10,-10 Q 70,50 90,110";
    if (tapCount === 2) return "M 60,-10 Q 30,50 40,110";
    return "M 120,-10 Q 120,50 120,110"; // slide away
  };

  return (
    <div 
      className="relative cursor-pointer group rounded-lg p-6 -m-6 overflow-hidden"
      onClick={handleTap}
    >
      {/* The actual text */}
      <p className={`text-lg leading-relaxed text-neutral-400 font-light relative z-10 transition-all duration-1000 ${isRevealed ? 'opacity-100 blur-none' : 'opacity-20 blur-md select-none'}`}>
        등의 척수로부터 끈적하고 매끈한 <span className="text-red-500 font-normal">검은색 촉수</span> 여러 개를 뻗어낼 수 있다.
      </p>

      {/* Tentacle Overlay */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div 
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
          >
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <defs>
                 <filter id="goo">
                   <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                   <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                   <feBlend in="SourceGraphic" in2="goo" />
                 </filter>
                 <linearGradient id="tentacle-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#050505" />
                   <stop offset="50%" stopColor="#1a1a1a" />
                   <stop offset="100%" stopColor="#050505" />
                 </linearGradient>
                 <linearGradient id="tentacle-grad2" x1="0%" y1="100%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#111" />
                   <stop offset="50%" stopColor="#222" />
                   <stop offset="100%" stopColor="#0a0a0a" />
                 </linearGradient>
               </defs>
               
               <g filter="url(#goo)">
                 {/* Tentacle 1 */}
                 <motion.path
                   fill="none"
                   stroke="url(#tentacle-grad)"
                   strokeWidth="30"
                   strokeLinecap="round"
                   animate={{ d: getTentaclePath1() }}
                   transition={{ 
                     repeat: tapCount === 0 ? Infinity : 0, 
                     duration: tapCount === 0 ? 4 : 0.2, 
                     ease: tapCount === 0 ? "easeInOut" : "backOut" 
                   }}
                 />
                 {/* Tentacle 2 */}
                 <motion.path
                   fill="none"
                   stroke="url(#tentacle-grad2)"
                   strokeWidth="25"
                   strokeLinecap="round"
                   animate={{ d: getTentaclePath2() }}
                   transition={{ 
                     repeat: tapCount === 0 ? Infinity : 0, 
                     duration: tapCount === 0 ? 5 : 0.2, 
                     ease: tapCount === 0 ? "easeInOut" : "backOut",
                     delay: tapCount === 0 ? 0.2 : 0 
                   }}
                 />
                 {/* Tentacle 3 */}
                 <motion.path
                   fill="none"
                   stroke="#0a0a0a"
                   strokeWidth="35"
                   strokeLinecap="round"
                   animate={{ d: getTentaclePath3() }}
                   transition={{ 
                     repeat: tapCount === 0 ? Infinity : 0, 
                     duration: tapCount === 0 ? 3.5 : 0.2, 
                     ease: tapCount === 0 ? "easeInOut" : "backOut",
                     delay: tapCount === 0 ? 0.5 : 0 
                   }}
                 />
               </g>
            </svg>
            
            <motion.div 
              key={tapCount}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-30 text-[10px] tracking-[0.3em] text-red-500/80 uppercase font-mono bg-black/60 px-4 py-2 rounded-full border border-red-900/40 backdrop-blur-md shadow-[0_0_15px_rgba(220,38,38,0.2)]"
              style={{ pointerEvents: 'none' }}
            >
              {tapCount === 0 ? "Touch to reveal" : tapCount === 1 ? "It reacts..." : "It's slipping away..."}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBox({ label, value, isRed = false }: { label: string, value: string, isRed?: boolean }) {
  return (
    <div className="p-4 bg-[#050505] flex flex-col justify-center overflow-hidden">
      <span className="text-[10px] tracking-[0.2em] text-neutral-600 mb-1">{label}</span>
      <span className={`text-base font-serif tracking-widest ${isRed ? 'text-red-600 text-glow' : 'text-neutral-200'} whitespace-nowrap`}>{value}</span>
    </div>
  );
}

function LoreSection({ 
  icon, 
  title, 
  subtitle, 
  children, 
  small = false,
  className = "" 
}: { 
  icon: React.ReactNode, 
  title: string, 
  subtitle: string, 
  children: React.ReactNode,
  small?: boolean,
  className?: string
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative ${className}`}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="text-red-600 opacity-80">{icon}</div>
        <div>
          <h4 className="text-[10px] tracking-[0.3em] text-red-600/60 mb-1">{subtitle}</h4>
          <h2 className={`${small ? 'text-2xl' : 'text-3xl md:text-4xl'} font-serif tracking-widest text-white`}>{title}</h2>
        </div>
      </div>
      <div className="pl-0 md:pl-12">
        {children}
      </div>
    </motion.div>
  );
}

function TraitItem({ text, isHighlight = false }: { text: string, isHighlight?: boolean }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isHighlight ? 'bg-red-600 box-glow scale-150' : 'bg-neutral-700 group-hover:bg-red-600/50'}`} />
      <span className={`text-lg font-light tracking-wide transition-colors duration-300 ${isHighlight ? 'text-red-400' : 'text-neutral-400 group-hover:text-neutral-200'}`}>
        {isHighlight ? (
          <span dangerouslySetInnerHTML={{ __html: text.replace('붉은 동공', '<span class="text-red-600 font-medium text-glow">붉은 동공</span>') }} />
        ) : text}
      </span>
    </div>
  );
}

