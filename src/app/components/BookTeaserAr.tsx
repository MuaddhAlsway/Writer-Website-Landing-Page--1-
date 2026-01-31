import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Quote } from 'lucide-react';

export function BookTeaserAr() {
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
            «الصحةُ رأس مالٍ، والفراغُ ميدانُ عمل، فإذا استُهلِكت الصحّة في لهوٍ، وامتلأ الفراغُ بباطلٍ، لم يتبقّى من العمر شيءٌ سوا قشرةٍ خاوية. »
          </blockquote>
          
          <p className="text-stone-400 text-sm tracking-wider uppercase">
            
          </p>
        </motion.div>
      </div>
    </section>
  );
}
