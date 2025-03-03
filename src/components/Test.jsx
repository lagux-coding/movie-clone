import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Test() {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleWheel = (event) => {
      if (containerRef.current) {
        event.preventDefault();
        containerRef.current.scrollBy({
          left: event.deltaY * 3,
          behavior: "smooth",
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return (
    <div className="w-[800px] overflow-hidden border p-4">
      <motion.div
        ref={containerRef}
        className="flex gap-4 overflow-x-scroll scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <motion.div
            key={index}
            className="w-40 h-40 bg-blue-500 text-white flex items-center justify-center rounded-lg flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            style={{ scrollSnapAlign: "start" }}
          >
            Item {index + 1}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
