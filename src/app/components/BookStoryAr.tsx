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
          <h2 className="text-4xl md:text-5xl mb-8 leading-tight">لماذا وجد الكتاب          </h2>
          
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

            <div className="border-r-4 border-amber-200 pr-6 my-8">
              <p className="text-amber-100 italic">
                وُلدت فكرة هذا الكتابِ من ملاحظةٍ بسيطة ومخيفة في آنٍ واحد: 
                أن كثيرًا من الناس يعيشون حياةً ممتلئة بالحركة ومحاولات التغيير والتطوير، 
                لكنها على الرغم من ظاهرها الملهم، تفتقرُ إلى المعنى.
              </p>
            </div>

            <p>
              نُكثر من السعي، ونُحسن التعلُّم، نتقلّب بين المهن والتخصّصات والمهارات، 
              نقرأ كتاباً ونُتابع لقاءً ونواكِبُ أشخاصاً نحسَبُهم قدوات.. 
              وجميعنا يزعم أنّه يسعى لأن يكون «أفضل نسخة من نفسه». 
              غير أنّ السؤال المُهمَل يظلّ معلقًا في الهواء: <em className="text-amber-200">إلى أين نمضي بكلّ هذا التحسين؟</em>
            </p>

            <p>
              هذا الكتاب لا يقدّم لك موعظة، ولا يضع قناعًا على فراغك، 
              ولا يعدك بحياة مثالية. كُتب لأن العبث أصبَحَ نمطًا، 
              ولأن الفراغَ صار رائجاً، ولأنّ العمر كثيراً ما يذوبُ في زخمٍ بلا وجهة.
            </p>

            <p className="text-amber-100 font-semibold">
              لأنكَ تمتلك الحقَّ في أن تعيشَ على هدىً بذاتِك وغايةِ وجودها. 
              حتى لا تكونَ سبهلَلاً.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
