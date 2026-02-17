// ═══════════════════════════════════════════════════
// APP CONFIGURATION
// ═══════════════════════════════════════════════════

const isDev = import.meta.env.DEV;

export const CONFIG = {
    // Backend API URL — production'da gerçek domain olacak
    API_URL: isDev ? "http://localhost:5000" : (import.meta.env.VITE_API_URL || ""),

    // OTP
    OTP_LENGTH: 6,
    OTP_RESEND_COOLDOWN: 60, // saniye

    // App Info
    APP_NAME: "Yangın Alarm Sistemi",
    APP_DESCRIPTION: "Deneyap Teknoloji Atölyeleri tarafından geliştirilen akıllı yangın algılama ve bildirim platformu.",

    // Contact
    CONTACT_EMAIL: "destekbolibolingolimbombo@gmail.com",
    GITHUB_URL: "https://github.com/ScRien/project-deneyap",
};
