import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function AuthorSectionAr() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-6 bg-gradient-to-b from-white to-stone-50/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl mb-4 text-stone-900 leading-tight font-light">
            عن الكاتبة
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-200 to-amber-100 mx-auto"></div>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 items-center"
        >
          {/* Text Content */}
          <div className="order-2 lg:order-1 lg:col-span-2 space-y-6 text-right">
            <p className="text-stone-700 leading-relaxed text-base md:text-lg">
              لم أظن يوماً أنني سأكتبُ كتاباً عن الشعور بالعبث و الضياع.. أنا التي لطالما رأيتُ طريقيَ مرسوماً أمامي بأدقِّ تفاصيله. وُلدتُ الابنةَ الكبرى لمهندسٍ بارعٍِ ومعلّمة لامعة، تربّيتُ على أن أكون موضع الثقة، وموضع الرهان, في بيتٍ آمن بالاجتهاد، وربط القيمة بالإنجاز، وعلّق عليّ أحلامًا كبيرة منذ نعومة أظفاري.
            </p>

            <p className="text-stone-700 leading-relaxed text-base md:text-lg">
              «الطفلة الذهبيّة» التي لا تدخل بابًا إلّا وأحكمت إغلاقه خلفها بالإنجاز، ولا تُقبل على شيءٍ إلّا واتقنته وبَرَعت فيه. لم أُعرف يومًا بالفوضى، ولا بالتقصير، ولا بالتردّد.
            </p>

            <p className="text-stone-700 leading-relaxed text-base md:text-lg">
              درستُ و تخرجتُ و توظفت.. بدأتُ حياةً يُشار إليها بوصفها «المسار الناجح». غير أنّ شيئًا ما بدأ يخفت في داخلي بعد عامين من العمل؛ فقد أصابني شحوبٌ لا تُفسّره الأرقام، وحالةُ تيهٍ لا تُعالَج بالترقيات. شعرتُ بأنّ أيّامي تمضي بلا وزن، وبأنّني أؤدّي الحياة أداءً مُتقناً، و كأنني آلةٌ تلبّي الطلباتِ بكفايةٍ و تُنجزُ المهامَ بإجادة. وحسب.
            </p>

            <p className="text-stone-700 leading-relaxed text-base md:text-lg">
              عندها بدأتُ أكتب. لا طلبًا للإجابة، بل محاولةً للفهم. أطلقتُ نشرتي البريدية لأقول ما لا يُقال عادةً عن النجاح حين يخلو من المعنى، وعن الشعور بالضياع حين يأتي متخفّيًا في ثوب الإنجاز.
            </p>

            <p className="text-stone-700 leading-relaxed text-base md:text-lg">
              و هذا الكتاب ليس إعلان وصول، بل شهادة سعي. هو استجابةٌ لرغبةٍ دفينة في مشاركة ما أتعلمهُ في رحلتي، لا من مقام المعلّم، بل من موضع الإنسان الذي يُحاول. فلطالما ظنّ الناس أنّني شخصية ناجحة، عارفةٌ بنفسها، موقنةٌ بوجهتها؛ والحقيقة أنّني — مثل كثيرين — استكشف، وأتعثّر، وأتعلّم وأنا أسير.
            </p>

            <p className="text-stone-700 leading-relaxed text-base md:text-lg">
              أكتب لأنّ الكتابة أصبحت طريقتي في الفهم، ووسيلتي لتوثيق الرحلة، ومحاولتي الصادقة لأن أمسك بزمام نفسي…حتى لا أكون سُبَهْلَلًا.
            </p>
          </div>

          {/* Author Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="order-1 lg:order-2 lg:col-span-1 flex justify-start  px-4 lg:px-0 pt-8"
          >
            <div className="w-full max-w-md aspect-square rounded-full overflow-hidden shadow-2xl flex items-start"> 
              <img
                src="/AuthurFatima.jpeg"
                alt="فاطمة سيف كميل"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
