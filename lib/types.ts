export interface Training {
    id: number;
    title: string;
    type: "EXERCISE" | "TRAINING" | "MAINTENANCE" | "ADMIN";
    date: string; // YYYY-MM-DD
    start_time?: string;
    end_time?: string;
    location?: string;
    required_platforms?: number[];
    description?: string;
}

export interface Leave {
    id: number;
    user_id: number;
    user_name: string;
    platform_id: number;
    type: "OFF" | "LEAVE" | "OLEAVE";
    date: string;
    time?: "AM" | "PM";
    approved_by_ic: boolean;
    approved_by_pc: boolean;
    details?: string;
}

export interface Platform {
    id: number;
    name?: string;
    personnel_count: number;
}

export interface UserInfo {
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    rank?: string;
    platform_id?: number;
    is_ic?: boolean;
    is_pc?: boolean;
}

export interface FilterType {
    platform: string;
    leaveType: string;
    timeFilter: string;
}
