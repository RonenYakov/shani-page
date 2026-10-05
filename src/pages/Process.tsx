import SubPageNav from "@/components/SubPageNav";
import ProcessTimeline from "@/components/ProcessTimeline";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import Footer from "@/components/Footer";

const Process = () => {
  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <a href="#main" className="skip-link">דלג לתוכן העיקרי</a>
      <SubPageNav label="The Process" />
      <main id="main">
        <ProcessTimeline />
      </main>
      <StickyWhatsApp />
      <Footer />
    </div>
  );
};

export default Process;
