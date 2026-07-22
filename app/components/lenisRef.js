// Tiny shared holder for the live Lenis instance so components that need to
// pause/resume the global smooth scroll (e.g. the full-screen quote modal) can
// reach it without prop-drilling or a global on window.
let instance = null;

export const setLenis = (l) => {
  instance = l;
};

export const getLenis = () => instance;
