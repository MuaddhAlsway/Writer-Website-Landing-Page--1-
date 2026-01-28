import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function AuthorSectionAr() {
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
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
            <div className="md:w-1/3">
              <div className="aspect-square rounded-full bg-gradient-to-br from-stone-300 to-amber-200 shadow-2xl" />
            </div>
            
            <div className="md:w-2/3 space-y-6">
              <h2 className="text-4xl md:text-5xl text-stone-900">
                عن الكاتبة
              </h2>
              
              <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                <p>
                  أنا امرأة قضيتُ معظم حياتي أحاول وضع المشاعر
                  في كلمات. بعض الأيام أنجح. معظم الأيام، أحاول على أي حال.
                </p>
                
                <p>
                  أكتب لأنني أؤمن أن القصص قادرة على احتواء ما لا نستطيع—
                  التناقضات، الأوساط الفوضوية، الحقائق الهادئة التي نخاف
                  قولها بصوت عالٍ. أكتب لأفهم عالماً غالباً لا معنى له،
                  ولأذكّرنا جميعاً أننا لسنا وحدنا في الحيرة.
                </p>
                
                <p>
                  هذه روايتي الأولى، لكنها لن تكون الأخيرة. كنت أكتبها
                  في رأسي لسنوات، أعيشها بطرق صغيرة، أتعلم دروسها
                  قبل أن أعرف أنها دروس أصلاً.
                </p>
                
                <p className="italic text-stone-700">
                  شكراً لك لأنك هنا. لأنك تهتم بالقصص. لأنك سمحت لهذه
                  القصة أن تجدك.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
