const AuctionDetailView = () => `
  <section class="max-w-[1240px] mx-auto px-6 py-20 gap-16 grid lg:grid-cols-[1fr_420px]">
    <!-- Product Gallery -->
    <div class="space-y-8">
      <div class="aspect-[4/3] rounded-[48px] overflow-hidden border border-white/5 shadow-premium group">
         <img src="https://picsum.photos/1200/900?random=11" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
      </div>
      <div class="grid grid-cols-4 gap-6">
        ${[11, 12, 13, 14].map(id => `
          <div class="aspect-square rounded-3xl overflow-hidden border border-white/10 cursor-pointer hover:border-accent-blue/50 transition-all opacity-60 hover:opacity-100">
            <img src="https://picsum.photos/400/400?random=${id}" class="w-full h-full object-cover" />
          </div>
        `).join('')}
      </div>

      <!-- Description Section -->
      <div class="pt-12 border-t border-white/5 space-y-6">
        <h3 class="text-2xl font-bold font-outfit">Product Details</h3>
        <p class="text-text-muted leading-relaxed text-lg">
          The MacBook Pro (16-inch) with M3 Max is the ultimate powerhouse for creative professionals. 
          Featuring a 14-core CPU and 30-core GPU, this machine handles the most demanding workflows with ease. 
          The Liquid Retina XDR display provides industry-leading brightness and color accuracy.
        </p>
        <div class="grid grid-cols-2 gap-y-6 gap-x-12 pt-6">
          <div class="space-y-1">
            <p class="text-[10px] font-bold text-text-dark uppercase tracking-widest">Model</p>
            <p class="font-semibold text-text-main">M3 Max 16" (2024)</p>
          </div>
          <div class="space-y-1">
            <p class="text-[10px] font-bold text-text-dark uppercase tracking-widest">Memory</p>
            <p class="font-semibold text-text-main">64GB Unified Memory</p>
          </div>
          <div class="space-y-1">
            <p class="text-[10px] font-bold text-text-dark uppercase tracking-widest">Storage</p>
            <p class="font-semibold text-text-main">2TB SSD Storage</p>
          </div>
          <div class="space-y-1">
            <p class="text-[10px] font-bold text-text-dark uppercase tracking-widest">Condition</p>
            <p class="font-semibold text-accent-cyan">Factory Sealed</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bidding Sidebar -->
    <aside class="space-y-8">
      <div class="sticky top-32 space-y-8">
        <div>
          <div class="text-[10px] font-bold text-accent-blue uppercase tracking-[0.2em] mb-4">Current Auction</div>
          <h1 class="text-4xl font-bold font-outfit leading-tight mb-4">MacBook Pro M3 Max <br/> Space Black</h1>
          <div class="flex items-center gap-4 text-xs font-medium text-text-dark uppercase tracking-widest">
            <span>By Apple Elite</span>
            <span>•</span>
            <span class="text-accent-rose">02h 45m remaining</span>
          </div>
        </div>

        <div class="p-8 bg-bg-card border border-white/10 rounded-[40px] shadow-premium space-y-8">
           <div class="space-y-2">
             <p class="text-[10px] font-bold text-text-dark uppercase tracking-widest">Current Bid</p>
             <div class="flex items-baseline gap-2">
               <span class="text-5xl font-bold font-outfit">$4,250</span>
               <span class="text-sm font-medium text-accent-cyan">High Bid</span>
             </div>
             <p class="text-xs text-text-muted">Total Bids: 38</p>
           </div>

           <div class="space-y-4">
             <div class="relative">
               <span class="absolute left-6 top-1/2 -translate-y-1/2 text-text-dark font-bold font-outfit">$</span>
               <input type="number" placeholder="4,260+" 
                      class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-6 text-xl font-bold font-outfit focus:outline-none focus:border-accent-blue/50 transition-all" />
             </div>
             <button class="w-full bg-accent-blue hover:bg-accent-blue/90 text-white py-5 rounded-2xl text-lg font-bold shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]">
               Place a Bid
             </button>
             <p class="text-[10px] text-center text-text-dark uppercase tracking-widest">Minimum increment $10</p>
           </div>
        </div>

        <div class="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-4">
          <div class="h-12 w-12 rounded-full bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
             <span class="icon-security">🛡️</span>
          </div>
          <div>
            <p class="text-sm font-bold">Secure Escrow</p>
            <p class="text-[10px] text-text-muted uppercase tracking-widest">Verified Seller & Goods</p>
          </div>
        </div>
      </div>
    </aside>
  </section>
`;

export default AuctionDetailView;
