// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <p className="fs-3">
        <span className="text-danger">אופס!</span> הדף שחיפשת לא קיים.
      </p>
      <p className="lead">
        אולי הקישור שגוי או שהעמוד הועבר למקום אחר.
      </p>
      <Link to="/" className="btn btn-primary btn-lg mt-3 shadow-sm">
        חזרה לעמוד הראשי
      </Link>
    </div>
  );
}
