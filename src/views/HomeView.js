const HomeView = () => `
  <!-- Hero Section -->
  <section class="relative min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden px-6 md:px-10 py-20">
    <!-- Sophisticated Background Atmosphere -->
    <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[160px] rounded-full"></div>
    <div class="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/10 blur-[180px] rounded-full"></div>
    
    <div class="max-w-[1400px] mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-32 items-center relative z-10">
      <div class="space-y-12 text-center lg:text-left">
        <div class="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-text-muted text-[10px] font-black uppercase tracking-[0.4em]">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Exclusive Access • Live Now
        </div>
        
        <h1 class="text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-black font-outfit leading-[0.85] tracking-tighter">
          Own the <br/>
          <span class="text-gradient">Unknown.</span>
        </h1>
        
        <p class="text-xl text-text-muted max-w-[500px] mx-auto lg:mx-0 leading-relaxed font-medium">
          The ultimate digital destination for time-bound luxury acquisitions. 
          Discover rare assets curated for the world's most discerning collectors.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
          <a href="#/search" class="bg-accent-blue hover:bg-white hover:text-accent-blue text-white px-10 py-4 rounded-full text-xs md:text-sm font-black uppercase tracking-widest transition-all hover:scale-105 shadow-glow no-underline ring-1 ring-accent-blue/50 text-center">
            Enter Marketplace
          </a>
          <button class="bg-white/5 hover:bg-white/10 text-white px-10 py-4 rounded-full text-xs md:text-sm font-black uppercase tracking-widest border border-white/10 transition-all hover:scale-105">
            The Process
          </button>
        </div>
      </div>

      <!-- Hero Visual Component -->
      <div class="relative hidden lg:block perspective-1000">
        <div class="relative z-10 p-16 glass-effect rounded-[80px] border-white/10 shadow-premium transform rotate-3 hover:rotate-0 transition-all duration-1000 group">
          <div class="aspect-square rounded-[50px] overflow-hidden mb-12 shadow-2xl ring-1 ring-white/10">
            <img src="https://picsum.photos/1000/1000?random=88" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Exhibition Piece" />
          </div>
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <span class="text-[9px] font-black text-text-dark uppercase tracking-[0.4em]">Featured Series</span>
              <span class="px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest border border-rose-500/20">Ending Soon</span>
            </div>
            <div class="flex justify-between items-end pt-2">
              <div class="space-y-1">
                <p class="text-[10px] font-black text-text-dark uppercase tracking-widest">Starting Reserve</p>
                <p class="text-5xl font-black font-outfit tracking-tighter">$14,500</p>
              </div>
              <div class="h-16 w-16 rounded-full border border-white/20 flex items-center justify-center text-white text-xl group-hover:bg-accent-blue group-hover:border-accent-blue transition-all duration-700">
                 ↗
              </div>
            </div>
          </div>
        </div>
        
        <!-- Ambient Light -->
        <div class="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full -z-10 animate-pulse"></div>
      </div>
    </div>
  </section>

  <!-- Curated Themes -->
  <section class="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-32 border-t border-white/5">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 md:mb-16 gap-4">
      <div class="space-y-2">
        <h3 class="text-[10px] font-black text-accent-blue uppercase tracking-[0.4em]">Curated</h3>
        <h2 class="text-4xl font-black font-outfit tracking-tighter">Elite Collections</h2>
      </div>
      <a href="#/search" class="text-xs font-bold text-text-muted hover:text-white transition-colors uppercase tracking-[0.2em] no-underline border-b border-white/10 pb-1">View All Sets</a>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
      ${['Chronographs', 'Fine Art', 'Hypercars', 'Rare Gems'].map((cat, i) => `
        <div class="group cursor-pointer">
          <div class="aspect-[4/5] rounded-[40px] overflow-hidden bg-white/5 border border-white/5 mb-8 transition-all duration-700 group-hover:border-accent-blue/30 group-hover:shadow-glow ring-1 ring-white/5 hover:ring-white/10">
            <img src="https://picsum.photos/600/800?random=${i + 20}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110 opacity-40 group-hover:opacity-100" />
          </div>
          <div class="px-2">
            <h4 class="text-xs font-black uppercase tracking-[0.3em] text-text-muted group-hover:text-white transition-colors text-center group-hover:text-accent-blue">${cat}</h4>
            <p class="text-[9px] text-text-dark font-bold text-center mt-2 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Browse Series</p>
          </div>
        </div>
      `).join('')}
    </div>
  </section>
`;

export default HomeView;
