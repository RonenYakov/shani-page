import { useEffect } from "react";
import SubPageNav from "@/components/SubPageNav";
import ProcessTimeline from "@/components/ProcessTimeline";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import Footer from "@/components/Footer";

const Process = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <SubPageNav label="The Process" />
      <ProcessTimeline />
      <StickyWhatsApp />
      <Footer />
    </div>
  );
};

export default Process;
