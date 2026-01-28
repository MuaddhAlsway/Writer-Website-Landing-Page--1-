import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function BookStoryAr() {
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
            لماذا وُجد هذا الكتاب
          </h2>
          
          <div className="space-y-6 text-lg md:text-xl text-stone-300 leading-relaxed">
            <p>
              كتبتُ هذا لأنني كنتُ بحاجة لفهم شيء لا أستطيع تسميته.
              شعور يعيش في زوايا المحادثات، في اللحظة قبل الوداع،
              في ثقل الرسائل التي لم تُرسَل قط.
            </p>
            
            <p>
              هذا الكتاب يستكشف المسافة بين شخصين يحبان بعضهما
              لكنهما يتحدثان لغتين مختلفتين من لغات القلب. يسأل: <em className="text-amber-200">ماذا يحدث
              حين يكون الشيء الذي يجمعنا هو نفسه الذي يفرقنا؟</em>
            </p>
            
            <p>
              إنه عن الحزن والنعمة. عن تعلّم أن بعض النهايات هي بدايات
              متخفية. عن الشجاعة المطلوبة للتخلي، والحنان
              المطلوب للتمسك.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
