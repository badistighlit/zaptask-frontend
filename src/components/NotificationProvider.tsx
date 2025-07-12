"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertTriangle } from "lucide-react";

type NotificationType = "success" | "error";

type Notification = {
  id: number;
  message: string;
  type: NotificationType;
};

type NotificationContextType = {
  notify: (message: string, type: NotificationType) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

let idCounter = 0;

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((message: string, type: NotificationType) => {
    const id = idCounter++;
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const styles = {
    success: {
      icon: <CheckCircle className="text-green-500" size={20} />,
      bg: "bg-white border border-green-200 text-green-800",
    },
    error: {
      icon: <AlertTriangle className="text-red-500" size={20} />,
      bg: "bg-white border border-red-200 text-red-800",
    },
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2 pointer-events-none">
        <AnimatePresence initial={false}>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className={`w-fit max-w-sm px-4 py-2 rounded-xl shadow-md flex items-center gap-2 ${styles[n.type].bg} pointer-events-auto`}
            >
              {styles[n.type].icon}
              <span className="text-sm font-medium">{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotify = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotify must be used within a NotificationProvider");
  return ctx.notify;
};
