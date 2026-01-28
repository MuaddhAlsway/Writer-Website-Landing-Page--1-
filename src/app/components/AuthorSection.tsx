import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function AuthorSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6 bg-stone-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3">
              <div className="aspect-square rounded-full bg-gradient-to-br from-stone-300 to-amber-200 shadow-2xl" />
            </div>
            
            <div className="md:w-2/3 space-y-6">
              <h2 className="text-4xl md:text-5xl text-stone-900">
                About the Author
              </h2>
              
              <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                <p>
                  I'm a woman who has spent most of her life trying to put feelings
                  into words. Some days I succeed. Most days, I try anyway.
                </p>
                
                <p>
                  I write because I believe stories can hold what we cannot—the
                  contradictions, the messy middles, the quiet truths we're afraid
                  to say out loud. I write to make sense of a world that often doesn't,
                  and to remind us all that we're not alone in the confusion.
                </p>
                
                <p>
                  This is my first novel, but it won't be my last. I've been writing
                  it in my head for years, living it in small ways, learning its lessons
                  before I knew they were lessons at all.
                </p>
                
                <p className="italic text-stone-700">
                  Thank you for being here. For caring about stories. For letting this
                  one find you.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
