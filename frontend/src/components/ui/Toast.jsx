import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, type = "error") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`glass pointer-events-auto rounded-xl px-4 py-3 text-sm flex items-start gap-3 animate-fade-up shadow-soft ${
              t.type === "success" ? "border-teal/40" : "border-primary/40"
            }`}
          >
            <span className="mt-0.5 text-base">{t.type === "success" ? "✅" : "⚠️"}</span>
            <span className="text-sand/90 leading-snug">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
