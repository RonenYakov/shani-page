import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import "./Testimonials.css";

const EASE: [number, number, number, number] = [0.35, 0, 0, 1];

// Real WhatsApp messages from happy clients — transcribed, no names.
type Chat = { time: string; lines: string[] };

const CHATS: Chat[] = [
  {
    time: "12:17",
    lines: [
      "יוווו תקשיביייי",
      "כל תמונה יותר יפה מהשנייה",
      "והסרטונים יצאו מושלמים",
      "איזה כיףףף",
      "את נדירה נדירה",
    ],
  },
  {
    time: "18:25",
    lines: ["אמאלהההה מושלם בטירוף", "וואו את ממש מוכשרת", "תקשיבי… נדיר"],
  },
  {
    time: "17:04",
    lines: ["בואנה איזה זריזות", "הסרטון ממש יפה"],
  },
];

/** One conversation column: typing dots, then the real messages cascade in like a live chat. */
const ChatColumn = ({ chat, index }: { chat: Chat; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => setRevealed(true), 650 + index * 520);
    return () => clearTimeout(timer);
  }, [inView, index]);

  return (
    <div className="st-chat" ref={ref}>
      <motion.div
        className="st-who"
        dir="rtl"
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: index * 0.16, ease: EASE }}
      >
        <div className="st-avatar" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 21s-6.7-4.35-9.33-8.07C.9 10.3 1.5 6.9 4.2 5.6c2-.97 4.2-.2 5.3 1.5l.5.78.5-.78c1.1-1.7 3.3-2.47 5.3-1.5 2.7 1.3 3.3 4.7 1.53 7.33C18.7 16.65 12 21 12 21z" />
          </svg>
        </div>
        <div>
          <div className="st-name">לקוחה מרוצה</div>
          <div className="st-role">   WhatsApp</div>
        </div>
      </motion.div>

      <div className="st-msgs" dir="rtl">
        <AnimatePresence mode="wait">
          {inView && !revealed && (
            <motion.div
              className="st-typing"
              key="typing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <i /><i /><i />
            </motion.div>
          )}
        </AnimatePresence>

        {revealed &&
          chat.lines.map((line, li) => (
            <motion.div
              className="st-bubble"
              key={li}
              dir="rtl"
              initial={{ opacity: 0, scale: 0.86, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 26, delay: li * 0.28 }}
            >
              <p>{line}</p>
              {li === chat.lines.length - 1 && (
                <span className="st-time">
                  {chat.time} <span className="ticks">✓✓</span>
                </span>
              )}
            </motion.div>
          ))}
      </div>
    </div>
  );
};

const Testimonials = () => {
  const headRef = useRef<HTMLHeadingElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-60px" });

  return (
    <section className="shani-testimonials" id="testimonials">
      <div className="st-grain" aria-hidden="true" />
      <div className="st-inner">
        {/* ── header ── */}
        <div className="st-head">
          <div className="st-top">
            <motion.div
              className="st-labelwrap"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <i className="st-cross" />
              <div className="st-label">
                What clients
                <br />
                keep saying
              </div>
            </motion.div>
            <motion.p
              className="st-lead"
              dir="rtl"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            >
              אין פרסומת טובה יותר מהודעה   שקיבלתי מלקוח מרוצה אחרי שהתוכן עלה, בדיוק כמו שהן הגיעו.
            </motion.p>
          </div>

          <h2 className="st-giant" ref={headRef}>
            {["Word", "of", "Mouth"].map((word, i) => (
              <span className="st-word" key={word}>
                <motion.span
                  className={i === 2 ? "ac" : undefined}
                  initial={{ y: "110%" }}
                  animate={headInView ? { y: 0 } : {}}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h2>
        </div>

        {/* ── real chat conversations ── */}
        <div className="st-chats">
          {CHATS.map((chat, i) => (
            <ChatColumn key={i} chat={chat} index={i} />
          ))}
        </div>

        <p className="st-note">
          <span className="dot">◆</span>
        </p>
      </div>
    </section>
  );
};

export default Testimonials;
