import { Suspense } from "react";

/**
 * Customer Reviews — real, verified WhatsApp messages from buyers.
 * Server component (SSR) so the quote text is in the HTML for SEO.
 * Images live in /public/images/review-1.jpg ... review-14.jpg
 */

type Review = {
  img: string;
  model: string;
  inQuote: string;
  out: string;
  time: string;
  status: string;
  blur: number;
  grad: string;
};

const REVIEWS: Review[] = [
  { img: "/images/review-1.jpg", model: "Rolex Daytona", inQuote: "Wow! 🤩 Amazing customer service and super fast delivery, and the watch is 10/10 🔥 I'll be ordering again soon!", out: "So happy to hear that bro 🙏 Enjoy it! 😊", time: "09:14", status: "online", blur: 5, grad: "#b08968,#7f5539" },
  { img: "/images/review-2.jpg", model: "Rolex Daytona", inQuote: "She is perfect! 😍 Thank you my friend 🙏", out: "You're welcome bro 😊 Beautiful timepiece! 👌", time: "11:32", status: "last seen today at 12:05", blur: 4, grad: "#6d8a96,#41545c" },
  { img: "/images/review-3.jpg", model: "Rolex Submariner Hulk", inQuote: "Thx bro 🙏 Good quality, 1:1 👍", out: "I told you bro, it's the best one you can ever get 😊👍", time: "15:38", status: "online", blur: 6, grad: "#8a7a9a,#564a66" },
  { img: "/images/review-4.jpg", model: "Rolex Submariner Hulk", inQuote: "Just received it now bro, looks awesome! Thank you 🙏", out: "You're welcome mate 😊 The best edition ever made 👍", time: "11:22", status: "last seen recently", blur: 4.5, grad: "#7a8a6d,#4a543b" },
  { img: "/images/review-5.jpg", model: "Rolex GMT-Master II", inQuote: "Perfect bro 👍 Beautiful watch 🚀", out: "Thank you 😊 Always glad to do business with you ❤️", time: "23:20", status: "online", blur: 5.5, grad: "#96736d,#5c413b" },
  { img: "/images/review-6.jpg", model: "Rolex Deepsea", inQuote: "Thank you brother!!! ✅", out: "You're welcome brother 😊 Looks amazing, beautiful timepiece! 🔥", time: "00:29", status: "last seen today at 00:42", blur: 4, grad: "#6d7d96,#3b475c" },
  { img: "/images/review-7.jpg", model: "Patek Philippe Nautilus", inQuote: "This is perfect 😍", out: "I told you bro 🙏 Enjoy it!", time: "19:26", status: "online", blur: 6, grad: "#7d967d,#3b5c3b" },
  { img: "/images/review-8.jpg", model: "Rolex Daytona", inQuote: "The watch is extraordinary beautiful 🤩 It's my fourth watch from you, always perfect service 🙏", out: "Thank you so much bro ❤️ Big pleasure doing business 😊", time: "10:48", status: "last seen today at 11:20", blur: 5, grad: "#967d6d,#5c463b" },
  { img: "/images/review-9.jpg", model: "Rolex Datejust", inQuote: "Watch quality is very good. Case, size, crown smoothness — perfect 👌", out: "I know 😊 Thank you bro 👍", time: "18:05", status: "online", blur: 4.5, grad: "#6d9690,#3b5c56" },
  { img: "/images/review-10.jpg", model: "Panerai Submersible", inQuote: "The best model! 😍 Beautiful, really very beautiful watch 🔥", out: "Beautiful bro 😎 Enjoy this beast!", time: "15:30", status: "last seen recently", blur: 5.5, grad: "#8a8a6d,#54543b" },
  { img: "/images/review-11.jpg", model: "Patek Aquanaut", inQuote: "I told you bro, amazing choice 🔥 the orange strap made it double amazing 😎", out: "Perfect 😊👌", time: "14:27", status: "online", blur: 6, grad: "#96856d,#5c4a3b" },
  { img: "/images/review-12.jpg", model: "Rolex GMT-Master II", inQuote: "Perfect 😊🚀", out: "Glad to do business with you again 🙏😊", time: "17:08", status: "last seen today at 17:30", blur: 4, grad: "#7d6d96,#473b5c" },
  { img: "/images/review-13.jpg", model: "Rolex Submariner", inQuote: "Received the package bro, that was super fast! 🚀 As promised 👌", out: "Glad you like it bro 😊", time: "13:30", status: "online", blur: 5, grad: "#6d8896,#3b505c" },
  { img: "/images/review-14.jpg", model: "Cartier Santos", inQuote: "Looks beautiful 😊🙏", out: "Blue sweater, blue watch 😊 Looks amazing on you! 👌", time: "10:40", status: "last seen today at 10:55", blur: 4.5, grad: "#6d7596,#3b425c" },
];

const STYLE = `
.wa-grid{display:flex;flex-wrap:wrap;gap:22px;justify-content:center}
.wa-ph{width:300px;border-radius:26px;overflow:hidden;box-shadow:0 14px 45px rgba(0,0,0,.45);border:1px solid #2a2a2a;background:#e5ddd5}
.wa-sb{background:#f6f6f6;display:flex;justify-content:space-between;align-items:center;padding:7px 18px 3px;font-size:13px;font-weight:600;color:#000}
.wa-hdr{background:#f6f6f6;display:flex;align-items:center;gap:8px;padding:5px 11px 9px;border-bottom:.5px solid #d8d8d8}
.wa-bk{color:#1f8aff;font-size:22px}
.wa-av{width:32px;height:32px;border-radius:50%}
.wa-who{flex:1;line-height:1.15}
.wa-who .wa-n{font-size:14px;font-weight:600;color:#000;width:max-content}
.wa-who .wa-s{font-size:11px;color:#8a8a8e}
.wa-ic{color:#1f8aff;font-size:16px;margin-left:8px}
.wa-ch{background:#e5ddd5;background-image:radial-gradient(circle at 15px 15px,rgba(0,0,0,.022) 2px,transparent 0);background-size:32px 32px;padding:13px 9px 16px}
.wa-day{text-align:center;margin:0 0 12px}
.wa-day span{background:#eae6df;color:#5b5a57;font-size:11.5px;padding:4px 10px;border-radius:11px}
.wa-im{background:#fff;padding:4px 4px 3px;border-radius:11px;border-top-left-radius:4px;width:74%;box-shadow:0 1px .6px rgba(0,0,0,.15);position:relative;margin-bottom:8px}
.wa-im img{width:100%;display:block;border-radius:8px}
.wa-im .wa-t{position:absolute;right:9px;bottom:8px;color:#fff;font-size:10px;text-shadow:0 1px 2px rgba(0,0,0,.6)}
.wa-in,.wa-out{border-radius:11px;padding:6px 9px 5px;width:fit-content;max-width:84%;margin-bottom:7px;box-shadow:0 1px .6px rgba(0,0,0,.15);font-size:14px;color:#111b21;line-height:1.4}
.wa-in{background:#fff;border-top-left-radius:3px}
.wa-out{background:#dcf8c6;border-top-right-radius:3px;margin-left:auto}
.wa-tm{float:right;font-size:10px;color:#8696a0;margin:6px 0 -2px 9px}
.wa-tick{color:#53bdeb}
.wa-mdl{text-align:center;font-size:10.5px;color:#5b5a57;margin-top:6px}
`;

export function Testimonials() {
  return (
    <section className="border-y border-line bg-bg-elev">
      <div className="container py-14 md:py-20">
        <style dangerouslySetInnerHTML={{ __html: STYLE }} />
        <div className="text-center mb-10 md:mb-14">
          <p className="chip-gold inline-block mb-4">VERIFIED REVIEWS</p>
          <h2 className="h-serif text-3xl md:text-4xl">What Our Customers Say</h2>
          <p className="text-ink-muted mt-3 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Real, unedited WhatsApp messages from buyers worldwide — every watch delivered discreetly,
            every time. Identities blurred for privacy.
          </p>
        </div>

        <div className="wa-grid">
          {REVIEWS.map((r, i) => (
            <div className="wa-ph" key={i}>
              <div className="wa-sb"><span>9:41</span><span>📶 🔋</span></div>
              <div className="wa-hdr">
                <span className="wa-bk">‹</span>
                <div className="wa-av" style={{ background: `linear-gradient(135deg,${r.grad})`, filter: `blur(${r.blur}px)` }} />
                <div className="wa-who">
                  <div className="wa-n" style={{ filter: `blur(${r.blur + 0.5}px)` }}>{"Customer" + "•".repeat((i % 4) + 1)}</div>
                  <div className="wa-s">{r.status}</div>
                </div>
                <span className="wa-ic">📹</span><span className="wa-ic">📞</span>
              </div>
              <div className="wa-ch">
                <div className="wa-day"><span>Today</span></div>
                <div className="wa-im">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.img} alt={`Verified customer review — ${r.model} super clone`} loading="lazy" />
                  <span className="wa-t">{r.time}</span>
                </div>
                <div className="wa-in">{r.inQuote}<span className="wa-tm">{r.time}</span></div>
                <div className="wa-out">{r.out}<span className="wa-tm">{r.time} <span className="wa-tick">✓✓</span></span></div>
                <div className="wa-mdl">— {r.model} —</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-ink-muted text-sm mb-4">Join hundreds of happy collectors worldwide.</p>
          <a
            href="https://wa.me/905535566422?text=Hi%2C%20I%27d%20like%20to%20order%20a%20watch."
            target="_blank"
            rel="noopener"
            className="btn-gold inline-flex items-center gap-2 text-sm"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

