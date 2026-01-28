import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Heart, Sparkles, Moon } from 'lucide-react';

export function ReaderExperience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const experiences = [
    {
      icon: Heart,
      title: "Deeply Felt",
      description: "You'll feel seen in ways you didn't know you needed. This story will hold your heart gently, even as it breaks it open."
    },
    {
      icon: Sparkles,
      title: "Quietly Transformed",
      description: "You'll close the last page different than when you opened the first. Something inside you will have shifted, softened, awakened."
    },
    {
      icon: Moon,
      title: "Peacefully Haunted",
      description: "The characters will stay with you long after. You'll think of them in quiet moments, recognizing pieces of yourself in their journey."
    }
  ];

  return (
    <section ref={ref} className="py-24 px-6 bg-gradient-to-b from-amber-50/30 to-stone-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-6 text-stone-900 leading-tight">
            What You'll Experience
          </h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            This book isn't just read—it's felt. Here's what awaits you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.2 + (index * 0.15), ease: "easeOut" }}
              className="text-center"
            >
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center">
                  <exp.icon className="w-8 h-8 text-amber-200" />
                </div>
              </div>
              <h3 className="text-2xl mb-4 text-stone-900">{exp.title}</h3>
              <p className="text-stone-600 leading-relaxed">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
