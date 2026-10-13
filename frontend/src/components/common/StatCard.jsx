import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Users, CheckCircle2, ShieldCheck, HeartPulse, Activity } from 'lucide-react';

const iconMap = {
  Award,
  Users,
  CheckCircle2,
  ShieldCheck,
  HeartPulse,
  Activity,
};

const AnimatedCounter = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const str = String(value || '');
    const rawNumberStr = str.replace(/[^0-9.]/g, '');
    const targetNumber = parseFloat(rawNumberStr);

    if (isNaN(targetNumber)) {
      setDisplayValue(str);
      return;
    }

    const hasComma = str.includes(',');
    const suffix = str.replace(/[0-9.,]/g, '');

    let startTime = null;
    const duration = 2000;

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentVal = Math.round(targetNumber * easeOutQuart(progress));

      const formattedNumber = hasComma
        ? currentVal.toLocaleString('en-US')
        : currentVal.toString();

      setDisplayValue(`${formattedNumber}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        const finalFormatted = hasComma
          ? targetNumber.toLocaleString('en-US')
          : targetNumber.toString();
        setDisplayValue(`${finalFormatted}${suffix}`);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, value]);

  return <span ref={ref}>{displayValue}</span>;
};

const StatCard = ({ stat, index = 0 }) => {
  const IconComponent = iconMap[stat.icon] || Award;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-100 transition-all duration-300 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-50 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-50 to-cyan-50 border border-teal-100/80 text-teal-600 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-teal-600 group-hover:to-cyan-600 group-hover:text-white transition-all duration-300 shadow-xs">
          <IconComponent className="w-6 h-6" />
        </div>
        <div>
          <span className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight block">
            <AnimatedCounter value={stat.value} />
          </span>
        </div>
      </div>

      <h3 className="font-heading font-bold text-slate-800 text-base mb-1">
        {stat.label}
      </h3>
      <p className="text-xs text-slate-500 leading-relaxed">
        {stat.subtext}
      </p>
    </motion.div>
  );
};

export default StatCard;
