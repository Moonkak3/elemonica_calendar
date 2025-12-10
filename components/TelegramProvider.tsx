"use client";

import { useEffect } from "react";
import { initTelegramWebApp } from "@/lib/telegram";

export default function TelegramProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        // Initialize Telegram Web App
        const webApp = initTelegramWebApp();

        if (webApp) {
            // Handle back button
            const handleBackButton = () => {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    webApp.close();
                }
            };

            webApp.BackButton.onClick(handleBackButton);

            // Update back button visibility
            const updateBackButton = () => {
                if (window.history.length > 1) {
                    webApp.BackButton.show();
                } else {
                    webApp.BackButton.hide();
                }
            };

            updateBackButton();
            window.addEventListener("popstate", updateBackButton);

            // Set up theme change listener (optional)
            const handleThemeChange = () => {
                // You can adjust styles based on Telegram theme
                const theme = webApp.colorScheme;
                document.documentElement.classList.toggle(
                    "dark",
                    theme === "dark"
                );
            };

            // Listen for theme changes
            // Note: Telegram Web App doesn't have a direct theme change event
            // We can check on resize or use MutationObserver

            return () => {
                window.removeEventListener("popstate", updateBackButton);
                webApp.BackButton.offClick(handleBackButton);
            };
        }
    }, []);

    return <>{children}</>;
}
