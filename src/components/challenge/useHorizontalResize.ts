import { useRef, useState, useEffect } from "react";

export function useHorizontalResize({
  minPx = 280,
  maxPx = 900,
  initialPercent = 0.5,
} = {}) {
  const [leftWidth, setLeftWidth] = useState(initialPercent); // percent (0-1)
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let newLeft = (e.clientX - rect.left) / rect.width;
      newLeft = Math.max(
        minPx / rect.width,
        Math.min(newLeft, maxPx / rect.width)
      );
      setLeftWidth(newLeft);
    };
    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = "";
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [minPx, maxPx]);

  return { leftWidth, handleMouseDown, containerRef };
}
