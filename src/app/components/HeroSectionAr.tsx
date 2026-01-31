import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';

interface HeroSectionArProps {
  onJoinClick: () => void;
}

export function HeroSectionAr({ onJoinClick }: HeroSectionArProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-b from-stone-50 to-amber-50/30">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl leading-tight mb-6 text-stone-900">
             

لا تكُن سَبَهْلَلًا <br />
كتابٌ عن النجاة من العبث، واسترداد المعنى 
قبل أن يتآكل العمر بلا قصد 
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-stone-600 mb-12 leading-relaxed max-w-2xl mx-auto"
        >
           

هذا الكتابَ ليس مُجلّداً في الوعظ، 
ولا دليلًا سريعًا للنجاة، 
ولا وعدًا بتغييرٍ فوريّ 

بل محاولة جادّة 
لإعادة الإنسان إلى سؤاله الأوّل: 
من أنا؟ 
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Button
            onClick={onJoinClick}
            size="lg"
            className="bg-stone-800 hover:bg-stone-900 text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            انضم للقراء الأوائل
          </Button>
          <p className="text-sm text-stone-500 mt-4">
            الإطلاق بعد ٣ أشهر • كن أول من يعرف
          </p>
        </motion.div>
      </div>
    </section>
  );
}
