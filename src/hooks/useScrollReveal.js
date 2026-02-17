import { useEffect, useRef } from "react";

/**
 * Custom hook: Intersection Observer ile scroll reveal animasyonu.
 * Kullanım: const ref = useScrollReveal();
 *           <div ref={ref} className="reveal"> ... </div>
 */
export function useScrollReveal(options = {}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add("visible");
                    observer.unobserve(el);
                }
            },
            {
                threshold: options.threshold ?? 0.15,
                rootMargin: options.rootMargin ?? "0px 0px -50px 0px",
            }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return ref;
}

/**
 * Bir container içindeki tüm .reveal, .reveal-left, .reveal-right, .reveal-scale
 * elemanlarını otomatik olarak gözlemler.
 */
export function useScrollRevealAll(containerRef) {
    useEffect(() => {
        const container = containerRef?.current;
        if (!container) return;

        const elements = container.querySelectorAll(
            ".reveal, .reveal-left, .reveal-right, .reveal-scale"
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [containerRef]);
}
