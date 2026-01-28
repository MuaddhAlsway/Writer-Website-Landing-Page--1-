import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Quote } from 'lucide-react';

export function BookTeaser() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6 bg-gradient-to-b from-stone-900 to-stone-800 text-stone-50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <Quote className="w-12 h-12 mx-auto mb-8 text-amber-200 opacity-50" />
          
          <blockquote className="text-2xl md:text-3xl leading-relaxed mb-8 italic text-stone-100">
            "She used to think silence was the absence of sound. Now she knows
            it's the presence of everything left unsaid. And maybe—just maybe—that's
            where all the truth lives. In the spaces between words, where fear can't
            follow and love doesn't need permission."
          </blockquote>
          
          <p className="text-stone-400 text-sm tracking-wider uppercase">
            — From Chapter Seven
          </p>
        </motion.div>
      </div>
    </section>
  );
}
