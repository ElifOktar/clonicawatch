"use client";

export function FloatingButtons() {
  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/905355430744"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/20 hover:scale-110 hover:shadow-[#25D366]/40 transition-all duration-200 flex items-center justify-center overflow-hidden"
        title="WhatsApp"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logos/social/whatsapp.jpg"
          alt="WhatsApp"
          className="w-8 h-8 rounded-full object-cover"
        />
      </a>

      {/* Telegram Button */}
      <a
        href="https://t.me/+905355430744"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-[#0088cc] shadow-lg shadow-[#0088cc]/20 hover:scale-110 hover:shadow-[#0088cc]/40 transition-all duration-200 flex items-center justify-center overflow-hidden"
        title="Telegram"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logos/social/telegram.jpg"
          alt="Telegram"
          className="w-8 h-8 rounded-full object-cover"
        />
      </a>
    </div>
  );
}
