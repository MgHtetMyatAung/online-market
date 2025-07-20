import { useEffect } from "react";

export default function useScrollToTop() {
  useEffect(() => {
    const handleScroll = () => {
      window.scrollTo(0, 0);
    };
    handleScroll();
    return () => {
      handleScroll();
    };
  }, []);
}
