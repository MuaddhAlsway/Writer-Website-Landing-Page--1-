import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function BookStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6 bg-stone-900 text-stone-50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl mb-8 leading-tight">
            Why This Book Exists
          </h2>
          
          <div className="space-y-6 text-lg md:text-xl text-stone-300 leading-relaxed">
            <p>
              I wrote this because I needed to understand something I couldn't name.
              A feeling that lived in the corners of conversations, in the pause before goodbye,
              in the weight of unsent messages.
            </p>
            
            <p>
              This book explores the distance between two people who love each other
              but speak different languages of the heart. It asks: <em className="text-amber-200">What happens
              when the thing holding you together is the same thing pulling you apart?</em>
            </p>
            
            <p>
              It's about grief and grace. About learning that some endings are really
              beginnings in disguise. About the courage it takes to let go, and the
              tenderness required to hold on.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
