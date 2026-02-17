import { useState, useEffect, createContext, useContext, useCallback, useMemo } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

const ToastContext = createContext(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within <ToastProvider>");
    return context;
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "info", duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useMemo(() => ({
        success: (msg, dur) => addToast(msg, "success", dur),
        error: (msg, dur) => addToast(msg, "error", dur),
        warning: (msg, dur) => addToast(msg, "warning", dur),
        info: (msg, dur) => addToast(msg, "info", dur),
    }), [addToast]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

const TOAST_STYLES = {
    success: {
        border: "border-green-500/30",
        icon: <FaCheckCircle className="text-green-400" />,
        glow: "shadow-green-500/10",
    },
    error: {
        border: "border-red-500/30",
        icon: <FaTimesCircle className="text-red-400" />,
        glow: "shadow-red-500/10",
    },
    warning: {
        border: "border-amber-500/30",
        icon: <FaExclamationTriangle className="text-amber-400" />,
        glow: "shadow-amber-500/10",
    },
    info: {
        border: "border-blue-500/30",
        icon: <FaInfoCircle className="text-blue-400" />,
        glow: "shadow-blue-500/10",
    },
};

function ToastItem({ toast, onClose }) {
    const [exiting, setExiting] = useState(false);
    const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(onClose, 300);
        }, toast.duration);
        return () => clearTimeout(timer);
    }, [toast.duration, onClose]);

    const handleClose = () => {
        setExiting(true);
        setTimeout(onClose, 300);
    };

    return (
        <div
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl border ${style.border} bg-[var(--color-dark-card)] backdrop-blur-xl shadow-xl ${style.glow} min-w-[280px] max-w-[420px] transition-all duration-300 ${exiting
                    ? "opacity-0 translate-x-10"
                    : "opacity-100 translate-x-0 animate-[fadeInRight_0.3s_ease]"
                }`}
        >
            <span className="flex-shrink-0 text-sm">{style.icon}</span>
            <span className="flex-1 text-sm text-slate-200">{toast.message}</span>
            <button
                onClick={handleClose}
                className="flex-shrink-0 text-slate-600 hover:text-slate-300 transition-colors p-1"
                aria-label="Kapat"
            >
                <FaTimes className="text-xs" />
            </button>
        </div>
    );
}
