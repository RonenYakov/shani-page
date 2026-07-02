import SubPageNav from "@/components/SubPageNav";
import FAQ from "@/components/FAQ";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import Footer from "@/components/Footer";

const Faq = () => {
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
