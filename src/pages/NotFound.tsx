import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => (
  <main className="shani-404">
    <div className="nf-labelwrap">
      <i className="nf-cross" aria-hidden="true" />
      <span className="nf-label">Page not found</span>
    </div>

    <h1 className="nf-giant">
      4<span className="ac">0</span>4
    </h1>

    <p className="nf-sub" dir="rtl">
      העמוד שחיפשתם לא נמצא כאן — אולי הקישור השתנה, ואולי הוא פשוט עוד בעריכה.
    </p>

    <Link to="/" className="nf-home">
      Back to Home
    </Link>
  </main>
);

export default NotFound;
