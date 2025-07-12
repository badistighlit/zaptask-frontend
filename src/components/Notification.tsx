import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface NotificationProps {
  message: string;
  type: "success" | "error";
  duration?: number;
}

export default function Notification({ message, type, duration = 3000 }: NotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const styles = {
    success: {
      icon: <CheckCircle className="text-green-500" size={24} />,
      bg: "bg-green-100 text-green-800 border-green-300",
    },
    error: {
      icon: <AlertTriangle className="text-red-500" size={24} />,
      bg: "bg-red-100 text-red-800 border-red-300",
    },
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl border shadow-lg flex items-center space-x-3 ${styles[type].bg}`}
        >
          {styles[type].icon}
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
