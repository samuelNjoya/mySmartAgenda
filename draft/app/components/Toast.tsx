import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Attend la fin de l'animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === "success" ? "#28a745" : "#dc3545";

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      backgroundColor: bgColor,
      color: "white",
      padding: "15px 25px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      zIndex: 10000,
      display: "flex",
      alignItems: "center",
      gap: "10px",
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(-20px)",
      transition: "all 0.3s ease"
    }}>
      <span style={{ fontSize: "20px" }}>
        {type === "success" ? "✓" : "✕"}
      </span>
      <span style={{ fontWeight: "500" }}>{message}</span>
    </div>
  );
}