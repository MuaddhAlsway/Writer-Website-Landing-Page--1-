import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';

interface HeroSectionProps {
  onJoinClick: () => void;
}

export function HeroSection({ onJoinClick }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-b from-stone-50 to-amber-50/30">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl leading-tight mb-6 text-stone-900">
            Some stories choose us.<br />
            This one chose me.
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-stone-600 mb-12 leading-relaxed max-w-2xl mx-auto"
        >
          A story about the spaces between what we say and what we mean.
          About finding yourself in the silence.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Button
            onClick={onJoinClick}
            size="lg"
            className="bg-stone-800 hover:bg-stone-900 text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Join the Early Readers
          </Button>
          <p className="text-sm text-stone-500 mt-4">
            Launching in 3 months • Be the first to know
          </p>
        </motion.div>
      </div>
    </section>
  );
}
