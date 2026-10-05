import SubPageNav from "@/components/SubPageNav";
import FAQ from "@/components/FAQ";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import Footer from "@/components/Footer";

const Faq = () => {
  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <a href="#main" className="skip-link">דלג לתוכן העיקרי</a>
      <SubPageNav label="Questions" />
      <main id="main">
        <FAQ />
      </main>
      <StickyWhatsApp />
      <Footer />
    </div>
  );
};

export default Faq;
