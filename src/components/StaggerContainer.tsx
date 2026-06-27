import { motion, HTMLMotionProps, Variants } from 'framer-motion';

const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.23, 1, 0.32, 1], // cinematic ease-out
    },
  },
};

interface ContainerProps extends HTMLMotionProps<'div'> {
  once?: boolean;
  margin?: string;
}

/**
 * Reusable wrapper to coordinate staggered animations of children.
 * Triggers the animation when the container scrolls into view.
 */
export function StaggerContainer({ children, once = true, margin = '-50px', ...props }: ContainerProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once, margin }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Child element within a StaggerContainer that will be animated sekuensial.
 */
export function StaggerItem({ children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div variants={itemVariants} {...props}>
      {children}
    </motion.div>
  );
}
