// lib/animations.js
// ملف مركزي لكل إعدادات الأنيميشن عشان الكود يبقى نظيف

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// أنيميشن قائمة الموبايل (Slide from top)
export const mobileMenuVariants = {
  closed: { 
    opacity: 0, 
    y: "-100%",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  },
  open: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

// أنيميشن اللينكات جوه قائمة الموبايل (تظهر واحد ورا التاني)
export const mobileLinkVariants = {
  closed: { opacity: 0, x: -20 },
  open: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.4 }
  })
};