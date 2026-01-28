import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Mail, Check } from 'lucide-react';
import { apiClient } from '@/utils/api';

export function EmailWaitlistAr() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      await apiClient.addSubscriber(email, 'ar');
      setSubmitted(true);
      setEmail('');
      setName('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.message || 'فشل الاشتراك. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={ref} className="py-24 px-6 bg-amber-50/50">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <Mail className="w-12 h-12 mx-auto mb-6 text-stone-800" />
          
          <h2 className="text-4xl md:text-5xl mb-6 text-stone-900 leading-tight">
            انضم للرحلة
          </h2>
          
          <p className="text-xl text-stone-600 mb-8 leading-relaxed">
            كن من بين الأوائل الذين يقرأونه. احصل على وصول مبكر حصري،
            فصل إضافي، ولمحات من وراء الكواليس في
            عملية الكتابة.
          </p>
          
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 p-6 bg-green-50 border border-green-200 rounded-2xl"
            >
              <Check className="w-6 h-6 text-green-600" />
              <p className="text-lg text-green-800">
                مرحباً بك في الرحلة. تفقد بريدك الإلكتروني قريباً.
              </p>
            </motion.div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
                <Input
                  type="text"
                  placeholder="اسمك (اختياري)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-6 text-lg rounded-full border-stone-300 focus:border-stone-800 text-right"
                  dir="rtl"
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="بريدك@الإلكتروني.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 px-6 py-6 text-lg rounded-full border-stone-300 focus:border-stone-800 text-right"
                    dir="rtl"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="bg-stone-800 hover:bg-stone-900 text-white px-8 py-6 text-lg rounded-full whitespace-nowrap disabled:opacity-50"
                  >
                    {loading ? 'جارٍ الانضمام...' : 'أنا معكم'}
                  </Button>
                </div>
              </form>
              
              {error && (
                <p className="text-sm text-red-600 mt-4">{error}</p>
              )}
            </>
          )}
          
          <p className="text-sm text-stone-500 mt-6">
            لا رسائل مزعجة. فقط قصص، تحديثات، ووصول مبكر. يمكنك إلغاء الاشتراك في أي وقت.
          </p>
        </motion.div>
      </div>
    </section>
  );
}