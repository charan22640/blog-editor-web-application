import { Variants } from 'framer-motion';

export const pageTransition = {
  hidden: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

export const cardTransition = {
  initial: { scale: 0.98, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.98, opacity: 0 },
  transition: { type: "spring", stiffness: 80 }
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const fadeInUp: Variants = {
  initial: {
    y: 10,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4
    }
  }
};

export const scaleIn: Variants = {
  initial: {
    scale: 0.9,
    opacity: 0
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export const slideInFromRight: Variants = {
  initial: {
    x: 100,
    opacity: 0
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};
