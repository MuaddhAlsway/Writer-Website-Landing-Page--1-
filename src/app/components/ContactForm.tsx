import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Mail, Send, Check, AlertCircle } from 'lucide-react';

export function ContactForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setLoading(true);
    setError('');

    try {
      // Send to backend API instead of Formspree
      const response = await fetch('http://localhost:3001/make-server-53bed28f/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name || 'Anonymous',
          email,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitted(true);
      setEmail('');
      setName('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      console.error('Contact form error:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={ref} className="py-24 px-6 bg-stone-100">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <Mail className="w-12 h-12 mx-auto mb-6 text-stone-800" />
          
          <h2 className="text-4xl md:text-5xl mb-6 text-stone-900 leading-tight">
            Get in Touch
          </h2>
          
          <p className="text-xl text-stone-600 mb-8 leading-relaxed">
            Have a question or want to connect? Send me a message and I'll get back to you soon.
          </p>
          
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 p-6 bg-green-50 border border-green-200 rounded-2xl"
            >
              <Check className="w-6 h-6 text-green-600" />
              <p className="text-lg text-green-800">
                Message sent! I'll be in touch soon.
              </p>
            </motion.div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
                <Input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 text-lg rounded-lg border-stone-300 focus:border-stone-800"
                />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-6 py-4 text-lg rounded-lg border-stone-300 focus:border-stone-800"
                />
                <Textarea
                  placeholder="Your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full px-6 py-4 text-lg rounded-lg border-stone-300 focus:border-stone-800 min-h-[150px]"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-stone-800 hover:bg-stone-900 text-white px-8 py-6 text-lg rounded-lg disabled:opacity-50"
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
              
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
