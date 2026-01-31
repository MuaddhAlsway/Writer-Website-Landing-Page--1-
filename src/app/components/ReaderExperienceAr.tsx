import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Heart, Sparkles, Moon } from 'lucide-react';

export function ReaderExperienceAr() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const experiences = [
    {
      icon: Heart,
      title: "كُنْ",
      description: "ستُغلق الصفحة الأخيرة مختلفاً عما كنت حين فتحت الأولى. شيء بداخلك سيتغير، سيلين، سيستيقظ."
    },
    {
      icon: Sparkles,
      title: "كوِّنْ make ",
      description: "ستخرج من أسر التردّد إلى ميدان الفعل،وتتعلّم كيف يُصاغ المعنى بالمبادرة، لا بالتمنّي، وبالعمل المتدرّج لا بالانتظار الطويل"
    },
    {
      icon: Moon,
      title: "تَكَوَّنْ",
      description: "ستستوي لك الوجهة، ويجتمع شتاتك على قصدٍ واحد، فتسير ولا تلتفِت وتغدو أفعالك امتدادًا لما تؤمن به لا بما يُملى عليك."
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
            رحلة التحول
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            لا تكُن سَبَهْلَلًا. كتابٌ عن النجاة من العبث، واسترداد المعنى قبل أن يتآكل العمر بلا قصد.
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
