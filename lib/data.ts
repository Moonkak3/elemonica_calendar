import { Training, Leave, Platform } from "./types";

// Parse data received from Telegram
export function parseTelegramData(telegramData: any): {
    trainings: Training[];
    leaves: Leave[];
    platforms: Platform[];
    userInfo: any;
} {
    // If data is already in correct format
    if (telegramData.trainings && telegramData.leaves) {
        return {
            trainings: telegramData.trainings,
            leaves: telegramData.leaves,
            platforms: telegramData.platforms || [],
            userInfo: telegramData.userInfo || {},
        };
    }

    // If data is passed as a string in start_param
    if (typeof telegramData === "string") {
        try {
            const parsed = JSON.parse(telegramData);
            return {
                trainings: parsed.trainings || [],
                leaves: parsed.leaves || [],
                platforms: parsed.platforms || [],
                userInfo: parsed.userInfo || {},
            };
        } catch (err) {
            console.error("Failed to parse Telegram data string:", err);
        }
    }

    // If data is in initDataUnsafe format
    const userInfo = telegramData.user || {};

    // You can add logic here to extract data from different formats
    // For now, return empty data
    return {
        trainings: [],
        leaves: [],
        platforms: [],
        userInfo,
    };
}

// Example data structure for reference
export const exampleTelegramData = {
    trainings: [
        {
            id: 1,
            title: "Field Training Exercise",
            type: "EXERCISE",
            date: "2025-01-15",
            start_time: "08:00",
            end_time: "17:00",
            location: "Training Area 1",
            description: "Full day field training",
        },
    ],
    leaves: [
        {
            id: 1,
            user_id: 101,
            user_name: "CPL John Tan",
            platform_id: 1,
            type: "OFF",
            date: "2025-01-15",
            time: "AM",
            approved_by_ic: true,
            approved_by_pc: false,
            details: "Medical appointment",
        },
    ],
    platforms: [
        { id: 1, name: "Alpha", personnel_count: 12 },
        { id: 2, name: "Bravo", personnel_count: 10 },
    ],
    userInfo: {
        id: 123456789,
        username: "johntan",
        first_name: "John",
        last_name: "Tan",
        rank: "CPL",
        platform_id: 1,
    },
};
