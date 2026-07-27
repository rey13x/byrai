import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const PageTransitionSplash: React.FC = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const initialLoad = useRef(true);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 2000);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className={`page-transition-splash${visible ? " active" : ""}`}>
      <div className="page-transition-content">
        <span className="page-transition-text">Loading...</span>
      </div>
    </div>
  );
};

export default PageTransitionSplash;
