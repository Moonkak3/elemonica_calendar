"use client";

import { useState, useEffect } from "react";
import {
    Calendar,
    Filter,
    User,
    Users,
    AlertTriangle,
    Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CalendarView from "@/components/CalendarView";
import Filters from "@/components/Filters";
import DayDetails from "@/components/DayDetails";
import { Training, Leave, Platform } from "@/lib/types";
import {
    getTelegramData,
    isTelegramWebApp,
    getTelegramUser,
} from "@/lib/telegram";
import { parseTelegramData } from "@/lib/data";

export default function Home() {
    const [data, setData] = useState<{
        trainings: Training[];
        leaves: Leave[];
        platforms: Platform[];
        userInfo: any;
    } | null>(null);
    const [filters, setFilters] = useState({
        platform: "all",
        leaveType: "all",
        timeFilter: "all",
    });
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            // Check if opened in Telegram
            if (!isTelegramWebApp()) {
                setError(
                    "Please open this app from Telegram to view your schedule."
                );
                setLoading(false);
                return;
            }

            try {
                // Get data from Telegram
                const telegramData = getTelegramData();

                if (!telegramData) {
                    setError(
                        "No schedule data available. Please use the /calendar command in Telegram."
                    );
                    setLoading(false);
                    return;
                }

                // Parse the data from Telegram
                const parsedData = parseTelegramData(telegramData);
                setData(parsedData);
            } catch (err) {
                console.error("Failed to load data:", err);
                setError("Failed to load schedule data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    // Filter leaves based on selected filters
    const filteredLeaves =
        data?.leaves.filter((leave) => {
            if (
                filters.platform !== "all" &&
                leave.platform_id.toString() !== filters.platform
            )
                return false;
            if (filters.leaveType !== "all" && leave.type !== filters.leaveType)
                return false;
            if (
                filters.timeFilter !== "all" &&
                leave.time !== filters.timeFilter
            )
                return false;
            return true;
        }) || [];

    // Get today's data for summary
    const today = new Date().toISOString().split("T")[0];
    const todayTrainings =
        data?.trainings.filter((t) => t.date === today).length || 0;
    const todayLeaves = filteredLeaves.filter((l) => l.date === today).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">
                        Loading schedule data...
                    </p>
                </div>
            </div>
        );
    }

    // if (error) {
    //     return (
    //         <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
    //             <Card className="w-full max-w-md">
    //                 <CardHeader>
    //                     <div className="flex items-center justify-center mb-4">
    //                         <Shield className="h-12 w-12 text-muted-foreground" />
    //                     </div>
    //                     <CardTitle className="text-center">
    //                         Telegram Required
    //                     </CardTitle>
    //                 </CardHeader>
    //                 <CardContent>
    //                     <div className="text-center space-y-4">
    //                         <p className="text-muted-foreground">{error}</p>
    //                         <Badge variant="outline" className="mx-auto">
    //                             <User className="h-3 w-3 mr-2" />
    //                             Telegram Mini App
    //                         </Badge>
    //                         <p className="text-sm text-muted-foreground">
    //                             This app only works when opened from the
    //                             Telegram bot.
    //                         </p>
    //                     </div>
    //                 </CardContent>
    //             </Card>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">
                                    MEC Calendar
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {data?.userInfo?.name
                                        ? `Viewing as ${data.userInfo.name}`
                                        : "Schedule Viewer"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {todayTrainings > 0 && (
                                <Badge
                                    variant="secondary"
                                    className="bg-primary/10"
                                >
                                    ⚔️ {todayTrainings}
                                </Badge>
                            )}
                            {todayLeaves > 0 && (
                                <Badge
                                    variant="secondary"
                                    className="bg-destructive/10"
                                >
                                    👤 {todayLeaves}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-0 py-6">
                {/* Calendar View */}
                <CalendarView
                    trainings={data?.trainings || []}
                    leaves={filteredLeaves}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    userInfo={data?.userInfo}
                />

                {/* Legend */}
                <div className="my-6 p-4 bg-muted rounded-lg border">
                    <h3 className="font-medium mb-3 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Color Legend
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-primary/10 border border-primary/30 rounded"></div>
                            <span className="text-sm">Training Day</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-destructive/10 border border-destructive/30 rounded"></div>
                            <span className="text-sm">Leave Day</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-warning/10 border border-warning/30 rounded"></div>
                            <span className="text-sm">Conflict (Both)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500/10 border-2 border-blue-500/30 rounded"></div>
                            <span className="text-sm">Today</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <Filter className="h-5 w-5 mr-2" />
                            Filter View
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Filters
                            filters={filters}
                            onFilterChange={setFilters}
                            platforms={data?.platforms || []}
                        />
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Total Trainings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data?.trainings.length || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Scheduled this month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                Leave Days
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {filteredLeaves.length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Filtered by current settings
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                                <Filter className="h-4 w-4 mr-2" />
                                Platforms
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data?.platforms.length || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Active units
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <footer className="mt-8 py-4 border-t text-center text-sm text-muted-foreground">
                <p>Elemonica Calendar • Data from Telegram</p>
                <p className="mt-1">Use filters to customize your view</p>
            </footer>

            {/* Day Details Dialog */}
            {selectedDate && data && (
                <DayDetails
                    date={selectedDate}
                    trainings={data.trainings.filter(
                        (t) =>
                            t.date === selectedDate.toISOString().split("T")[0]
                    )}
                    leaves={filteredLeaves.filter(
                        (l) =>
                            l.date === selectedDate.toISOString().split("T")[0]
                    )}
                    isOpen={!!selectedDate}
                    onClose={() => setSelectedDate(undefined)}
                />
            )}
        </div>
    );
}
