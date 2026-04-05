// BidX Router — hash-based with parameterized routes and post-mount hooks

const routes = [
  { path: '/', view: 'HomeView' },
  { path: '/search', view: 'BrowseView' },
  { path: '/auction/:id', view: 'AuctionDetailView' },
  { path: '/auth', view: 'AuthView' },
  { path: '/dashboard', view: 'DashboardView' },
  { path: '/sell', view: 'CreateListingView' },
];

// Cleanup functions from previous view
let cleanupFns = [];

export const registerCleanup = (fn) => {
  cleanupFns.push(fn);
};

const runCleanups = () => {
  cleanupFns.forEach(fn => fn());
  cleanupFns = [];
};

const matchRoute = (hash) => {
  const path = hash.replace('#', '') || '/';
  for (const route of routes) {
    const paramNames = [];
    const pattern = route.path.replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const match = path.match(new RegExp(`^${pattern}$`));
    if (match) {
      const params = {};
      paramNames.forEach((name, i) => { params[name] = match[i + 1]; });
      return { view: route.view, params };
    }
  }
  return null;
};

export const navigateTo = (path) => {
  window.location.hash = `#${path}`;
};

export const initRouter = async () => {
  const mountRoute = async () => {
    runCleanups();

    const hash = window.location.hash || '#/';
    const matched = matchRoute(hash);

    const routerView = document.getElementById('router-view');
    routerView.style.opacity = '0';

    if (!matched) {
      routerView.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <h1 class="text-6xl font-black font-outfit">404</h1>
          <p class="text-text-muted">Page not found</p>
          <a href="#/" class="text-accent-blue hover:underline text-sm font-bold">Return Home</a>
        </div>`;
      setTimeout(() => { routerView.style.opacity = '1'; }, 50);
      return;
    }

    try {
      const module = await import(`./views/${matched.view}.js`);
      const viewFn = module.default;
      const mountFn = module.mount;

      routerView.innerHTML = viewFn(matched.params);
      setTimeout(() => { routerView.style.opacity = '1'; }, 50);

      // Call mount hook if the view exports one — this is where views bind events
      if (typeof mountFn === 'function') {
        mountFn(matched.params);
      }
    } catch (err) {
      console.error('Failed to load view:', err);
      routerView.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <h1 class="text-6xl font-black font-outfit">Error</h1>
          <p class="text-text-muted">Failed to load page</p>
          <a href="#/" class="text-accent-blue hover:underline text-sm font-bold">Return Home</a>
        </div>`;
      setTimeout(() => { routerView.style.opacity = '1'; }, 50);
    }
  };

  window.addEventListener('hashchange', mountRoute);
  mountRoute();
};
