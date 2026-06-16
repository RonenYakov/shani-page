import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import faqData from "@/content/faq.json";
import "./FAQ.css";

const EASE: [number, number, number, number] = [0.35, 0, 0, 1];

type FaqItem = { id: string; question: { he: string; en: string }; answer: { he: string; en: string } };

const FaqRow = ({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      className={`fq-row${isOpen ? " open" : ""}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: EASE }}
    >
      <button
        className="fq-q"
        onClick={onToggle}
        dir="rtl"
        style={{ textAlign: "right", ["--fq-shift" as string]: "-6px" }}
        aria-expanded={isOpen}
      >
        <span className="fq-num" style={{ direction: "ltr" }}>{num}</span>
        <span className="fq-qtext">{item.question.he}</span>
        <span className="fq-toggle">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <line x1="5" y1="0" x2="5" y2="10" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="0" y1="5" x2="10" y2="5" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div className="fq-body" style={{ height: `${height}px` }}>
        <div
          ref={bodyRef}
          className="fq-abody"
          dir="rtl"
          style={{ textAlign: "right" }}
        >
          <p className="fq-a">{item.answer.he}</p>
        </div>
      </div>
    </motion.div>
  );
};

const FAQ = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const headRef = useRef<HTMLHeadingElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-60px" });

  return (
    <section className="shani-faq" id="faq">
      {/* ── header ── */}
      <div className="fq-top">
        <motion.div
          className="fq-labelwrap"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <i className="fq-cross" />
          <div className="fq-label">
            Before
            <br />
            you ask
          </div>
        </motion.div>
        <motion.p
          className="fq-lead"
          dir="rtl"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
        >
          כל מה שחשוב לדעת לפני שמתחילים — <b>תהליך, התחייבות ותוצאות</b>. לא מצאתם תשובה?
          שלחו הודעה.
        </motion.p>
      </div>

      <h2 className="fq-giant" ref={headRef}>
        <span className="fq-word">
          <motion.span
            initial={{ y: "110%" }}
            animate={headInView ? { y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
          >
            Questions
          </motion.span>
        </span>
        <span className="fq-word">
          <motion.span
            className="ac"
            initial={{ y: "110%" }}
            animate={headInView ? { y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.14, ease: EASE }}
          >
            ?
          </motion.span>
        </span>
      </h2>

      {/* ── accordion ── */}
      <div className="fq-list">
        {(faqData as FaqItem[]).map((item, i) => (
          <FaqRow
            key={item.id}
            item={item}
            index={i}
            isOpen={openId === item.id}
            onToggle={() => setOpenId(openId === item.id ? null : item.id)}
          />
        ))}
      </div>

      <p className="fq-note">
        <span className="dot">◆</span>{" "}
        יש לכם שאלה נוספת? שלחו לי הודעה
      </p>
    </section>
  );
};

export default FAQ;
