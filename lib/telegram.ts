declare global {
    interface Window {
        Telegram?: {
            WebApp: {
                initData: string;
                initDataUnsafe: any;
                platform: string;
                colorScheme: string;
                themeParams: any;
                expand: () => void;
                ready: () => void;
                close: () => void;
                BackButton: {
                    show: () => void;
                    hide: () => void;
                    onClick: (callback: () => void) => void;
                    offClick: (callback: () => void) => void;
                };
                MainButton: any;
                showPopup: (
                    params: any,
                    callback?: (buttonId: string) => void
                ) => void;
                showAlert: (message: string, callback?: () => void) => void;
                showConfirm: (
                    message: string,
                    callback?: (confirmed: boolean) => void
                ) => void;
                enableClosingConfirmation: () => void;
                disableClosingConfirmation: () => void;
                sendData: (data: string) => void;
                setHeaderColor: (color: string) => void;
                setBackgroundColor: (color: string) => void;
            };
        };
    }
}

// Check if running in Telegram Web App
export function isTelegramWebApp(): boolean {
    if (typeof window === "undefined") return false;
    return !!window.Telegram?.WebApp;
}

// Get Telegram Web App instance
export function getTelegramWebApp() {
    if (typeof window === "undefined") return null;
    return window.Telegram?.WebApp || null;
}

// Get Telegram user info
export function getTelegramUser() {
    const webApp = getTelegramWebApp();
    return webApp?.initDataUnsafe?.user || null;
}

// Get data passed from Telegram bot
export function getTelegramData(): any {
    if (typeof window === "undefined") return null;

    const webApp = getTelegramWebApp();
    if (!webApp) return null;

    // Method 1: Check for data in initData (passed as query params)
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get("data");

    if (encodedData) {
        try {
            return JSON.parse(decodeURIComponent(encodedData));
        } catch (err) {
            console.error("Failed to parse Telegram data:", err);
        }
    }

    // Method 2: Check for start_param (passed when opening Web App)
    const startParam =
        urlParams.get("start_param") || webApp.initDataUnsafe?.start_param;
    if (startParam) {
        try {
            return JSON.parse(startParam);
        } catch (err) {
            console.error("Failed to parse start_param:", err);
            // If it's not JSON, it might be a simple string
            return { startParam };
        }
    }

    // Method 3: Check for data in initDataUnsafe
    if (
        webApp.initDataUnsafe &&
        Object.keys(webApp.initDataUnsafe).length > 0
    ) {
        return webApp.initDataUnsafe;
    }

    return null;
}

// Initialize Telegram Web App
export function initTelegramWebApp() {
    const webApp = getTelegramWebApp();
    if (!webApp) return null;

    // Expand to full height
    webApp.expand();

    // Enable closing confirmation
    webApp.enableClosingConfirmation();

    // Set theme colors
    webApp.setHeaderColor("#27272a"); // Zinc 800
    webApp.setBackgroundColor("#ffffff");

    // Ready signal
    webApp.ready();

    return webApp;
}

// Show Telegram popup
export function showTelegramPopup(title: string, message: string) {
    const webApp = getTelegramWebApp();
    if (!webApp) return;

    webApp.showPopup({
        title,
        message,
        buttons: [{ type: "ok" }],
    });
}
