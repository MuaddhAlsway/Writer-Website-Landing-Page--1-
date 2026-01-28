import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

export function LaunchCountdown() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Launch date: 3 months from now (April 18, 2026)
  const launchDate = new Date('2026-04-18T00:00:00');
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' }
  ];

  return (
    <section ref={ref} className="py-24 px-6 bg-stone-900 text-stone-50">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Calendar className="w-12 h-12 mx-auto mb-6 text-amber-200" />
          
          <h2 className="text-4xl md:text-5xl mb-4 leading-tight">
            The Story Arrives Soon
          </h2>
          
          <p className="text-xl text-stone-400 mb-12">
            April 18, 2026
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {timeUnits.map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                className="bg-stone-800 rounded-2xl p-6 border border-stone-700"
              >
                <div className="text-4xl md:text-5xl text-amber-200 mb-2">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-sm text-stone-400 uppercase tracking-wider">
                  {unit.label}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-stone-400 mt-12 italic text-lg">
            Every great story is worth the wait. This one will be worth yours.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
