import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Loader() {
  const [dots, setDots] = useState("...");
  const [shrinking, setShrinking] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setDots((prev) => {
        if (shrinking) {
          const next = prev.slice(0, -1);
          if (next.length === 0) setShrinking(false);
          return next;
        } else {
          const next = prev + ".";
          if (next.length === 3) setShrinking(true);
          return next;
        }
      });
    }, 400);

    return () => clearInterval(id);
  }, [shrinking]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AiOutlineLoading3Quarters
        size={28}
        className="animate-spin text-green-600 mb-2"
      />
      <span className="text-sm text-green-600 font-medium">
        Loading{dots}
      </span>
    </div>
  );
}
