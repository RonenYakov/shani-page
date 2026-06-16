import { useEffect } from "react";
import SubPageNav from "@/components/SubPageNav";
import FAQ from "@/components/FAQ";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import Footer from "@/components/Footer";

const Faq = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <SubPageNav label="Questions" />
      <FAQ />
      <StickyWhatsApp />
      <Footer />
    </div>
  );
};

export default Faq;
