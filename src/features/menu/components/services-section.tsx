'use client';

import { motion } from 'framer-motion';
import { useLanguage } from './language-context';
import {
  Truck,
  PartyPopper,
  ChefHat,
  Users,
  Gift,
  Wifi,
  UtensilsCrossed,
  Building2,
} from 'lucide-react';

export function ServicesSection() {
  const { language } = useLanguage();

  const services = language === 'ar'
    ? [
        {
          icon: Truck,
          title: 'خدمة التوصيل',
          desc: 'نوفر خدمة توصيل سريعة إلى منزلك أو مكتبك. اطلب طعامك المفضل واستمتع به في أي مكان.',
          highlight: 'توصيل مجاني للطلبات فوق 100 ر.س',
        },
        {
          icon: Building2,
          title: 'الحجوزات والمناسبات',
          desc: 'نستقبل حجوزات المناسبات الخاصة وحفلات الزفاف والمؤتمرات مع قوائم طعام مخصصة حسب رغبتك.',
          highlight: 'تواصل معنا للاستفسار',
        },
        {
          icon: ChefHat,
          title: 'طبخ خاص',
          desc: 'نقدم خدمة الطبخ الخاص في مناسباتكم مع طباخين محترفين يقدمون أطباقاً فريدة من نوعها.',
          highlight: 'طباخين خبرة أكثر من 15 عام',
        },
        {
          icon: PartyPopper,
          title: 'حفلات ومؤتمرات',
          desc: 'ننظم حفلاتكم الكبيرة والصغيرة مع تشكيلة واسعة من الأطباق العربية والعالمية.',
          highlight: 'من 10 إلى 500 شخص',
        },
        {
          icon: Gift,
          title: 'عروض وخصومات',
          desc: 'استمتع بعروضنا الأسبوعية والخصومات الموسمية على مجموعة واسعة من الأطباق والمشروبات.',
          highlight: 'خصم 20% على الطلب الأول',
        },
        {
          icon: Wifi,
          title: 'واي فاي مجاني',
          desc: 'استمتع بتجربة طعام مميزة مع إنترنت مجاني عالي السرعة لجميع عملائنا.',
          highlight: 'متاح في جميع الفروع',
        },
      ]
    : [
        {
          icon: Truck,
          title: 'Delivery Service',
          desc: 'Fast delivery to your home or office. Order your favorite food and enjoy it anywhere.',
          highlight: 'Free delivery on orders over 100 SAR',
        },
        {
          icon: Building2,
          title: 'Reservations & Events',
          desc: 'We accept private event bookings, weddings, and conferences with custom menus tailored to your preferences.',
          highlight: 'Contact us for inquiries',
        },
        {
          icon: ChefHat,
          title: 'Private Catering',
          desc: 'We offer private catering services with professional chefs who prepare unique and exquisite dishes.',
          highlight: 'Chefs with 15+ years experience',
        },
        {
          icon: PartyPopper,
          title: 'Parties & Conferences',
          desc: 'We organize your big and small events with a wide selection of Arabic and international dishes.',
          highlight: 'From 10 to 500 guests',
        },
        {
          icon: Gift,
          title: 'Offers & Discounts',
          desc: 'Enjoy our weekly deals and seasonal discounts on a wide range of dishes and beverages.',
          highlight: '20% off your first order',
        },
        {
          icon: Wifi,
          title: 'Free Wi-Fi',
          desc: 'Enjoy a premium dining experience with high-speed free Wi-Fi for all our customers.',
          highlight: 'Available at all branches',
        },
      ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl font-bold text-foreground mb-2">
          {language === 'ar' ? 'خدماتنا المميزة' : 'Our Premium Services'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {language === 'ar'
            ? 'نقدم لكم مجموعة متكاملة من الخدمات لتجربة طعام لا تُنسى'
            : 'We offer a comprehensive set of services for an unforgettable dining experience'}
        </p>
      </motion.div>

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#3e2723]/10 to-[#d4af37]/10 flex items-center justify-center group-hover:from-[#3e2723]/15 group-hover:to-[#d4af37]/15 transition-all">
                  <service.icon className="size-5.5 text-[#3e2723]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-foreground mb-1.5">{service.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{service.desc}</p>
                  <span className="inline-flex items-center text-[11px] font-semibold text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded-full">
                    {service.highlight}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#3e2723] to-[#5d4037] p-6 sm:p-8 text-center"
      >
        <div className="absolute top-0 start-0 w-16 h-16 border-t-2 border-s-2 border-[#d4af37]/40 rounded-tl-2xl" />
        <div className="absolute bottom-0 end-0 w-16 h-16 border-b-2 border-e-2 border-[#d4af37]/40 rounded-br-2xl" />

        <div className="relative z-10">
          <UtensilsCrossed className="size-8 text-[#d4af37] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">
            {language === 'ar' ? 'هل لديك مناسبة خاصة؟' : 'Have a Special Occasion?'}
          </h3>
          <p className="text-sm text-white/70 mb-4 max-w-md mx-auto">
            {language === 'ar'
              ? 'تواصل معنا وسنساعدك في اختيار القائمة المثالية لمناسبتك'
              : 'Contact us and we\'ll help you choose the perfect menu for your event'}
          </p>
          <a
            href="https://wa.me/201100475722"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#d4af37] text-[#3e2723] font-bold text-sm px-6 py-2.5 rounded-full hover:bg-[#e8cc6e] transition-colors shadow-lg shadow-[#d4af37]/30"
          >
            <Users className="size-4" />
            {language === 'ar' ? 'تواصل معنا الآن' : 'Contact Us Now'}
          </a>
        </div>
      </motion.div>
    </div>
  );
}
