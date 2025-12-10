"use client";

import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
} from "date-fns";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Training, Leave, UserInfo } from "@/lib/types";

interface CalendarViewProps {
    trainings: Training[];
    leaves: Leave[];
    selectedDate: Date | undefined;
    onDateSelect: (date: Date | undefined) => void;
    userInfo?: UserInfo;
}

export default function CalendarView({
    trainings,
    leaves,
    selectedDate,
    onDateSelect,
    userInfo,
}: CalendarViewProps) {
    const currentMonth = selectedDate || new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const getDayData = (date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");

        const dayTrainings = trainings.filter((t) => t.date === dateStr);
        const dayLeaves = leaves.filter((l) => l.date === dateStr);

        // Highlight current user's leaves
        const userLeaves = userInfo?.username
            ? dayLeaves.filter((l) =>
                  l.user_name
                      .toLowerCase()
                      .includes(userInfo.username?.toLowerCase() || "")
              )
            : [];

        return { dayTrainings, dayLeaves, userLeaves };
    };

    const handlePreviousMonth = () => {
        const newDate = subMonths(currentMonth, 1);
        onDateSelect(newDate);
    };

    const handleNextMonth = () => {
        const newDate = addMonths(currentMonth, 1);
        onDateSelect(newDate);
    };

    return (
        <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePreviousMonth}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="text-center">
                        <h2 className="text-2xl font-bold">
                            {format(currentMonth, "MMMM yyyy")}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {trainings.length} trainings • {leaves.length} leave
                            days
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNextMonth}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Jump to date
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={onDateSelect}
                            className="rounded-md border"
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                        <div
                            key={day}
                            className="text-center font-medium text-muted-foreground py-2 text-sm"
                        >
                            {day}
                        </div>
                    )
                )}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                    const { dayTrainings, dayLeaves, userLeaves } =
                        getDayData(day);
                    const hasTraining = dayTrainings.length > 0;
                    const hasLeave = dayLeaves.length > 0;
                    const hasUserLeave = userLeaves.length > 0;
                    const isToday = isSameDay(day, new Date());
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                    let bgColor = "bg-background";
                    let borderColor = "border-border";
                    let textColor = "text-foreground";

                    if (isWeekend) {
                        bgColor = "bg-muted/30";
                    }

                    if (hasTraining && hasLeave) {
                        bgColor = "bg-warning/10";
                        borderColor = "border-warning/30";
                    } else if (hasTraining) {
                        bgColor = "bg-primary/10";
                        borderColor = "border-primary/30";
                    } else if (hasLeave) {
                        bgColor = "bg-destructive/10";
                        borderColor = "border-destructive/30";
                    }

                    if (isToday) {
                        borderColor = "border-blue-500 border-2";
                    }

                    return (
                        <div
                            key={day.toString()}
                            className={`${bgColor} ${borderColor} ${textColor} border rounded-lg p-2 min-h-[100px] cursor-pointer hover:shadow-sm transition-all relative`}
                            onClick={() => onDateSelect(day)}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span
                                    className={`font-semibold ${
                                        isToday ? "text-blue-500" : ""
                                    } ${
                                        isWeekend ? "text-muted-foreground" : ""
                                    }`}
                                >
                                    {format(day, "d")}
                                </span>

                                <div className="flex flex-col gap-1 items-end">
                                    {hasTraining && (
                                        <Badge
                                            variant="secondary"
                                            className="bg-primary/20 text-primary-foreground text-xs px-2 py-0"
                                        >
                                            ⚔️ {dayTrainings.length}
                                        </Badge>
                                    )}
                                    {hasLeave && (
                                        <Badge
                                            variant="secondary"
                                            className="bg-destructive/20 text-destructive-foreground text-xs px-2 py-0"
                                        >
                                            👤 {dayLeaves.length}
                                        </Badge>
                                    )}
                                    {hasUserLeave && (
                                        <Badge className="bg-blue-500/20 text-blue-600 text-xs px-2 py-0">
                                            YOU
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Training indicators */}
                            {dayTrainings.slice(0, 1).map((training) => (
                                <div
                                    key={training.id}
                                    className="text-xs text-primary truncate mb-1"
                                >
                                    ⚔️ {training.title}
                                </div>
                            ))}

                            {/* Leave indicators */}
                            {dayLeaves.slice(0, 1).map((leave) => {
                                const isUserLeave = userLeaves.some(
                                    (ul) => ul.id === leave.id
                                );
                                return (
                                    <div
                                        key={leave.id}
                                        className={`text-xs truncate ${
                                            isUserLeave
                                                ? "font-medium text-blue-600"
                                                : "text-destructive"
                                        }`}
                                    >
                                        👤 {leave.user_name.split(" ")[0]}
                                    </div>
                                );
                            })}

                            {/* Show more indicator */}
                            {(dayTrainings.length > 1 ||
                                dayLeaves.length > 1) && (
                                <div className="text-xs text-muted-foreground mt-1">
                                    +
                                    {Math.max(0, dayTrainings.length - 1) +
                                        Math.max(0, dayLeaves.length - 1)}{" "}
                                    more
                                </div>
                            )}

                            {/* Conflict warning */}
                            {hasTraining && hasLeave && (
                                <div className="absolute bottom-1 left-1">
                                    <AlertTriangle className="h-3 w-3 text-warning" />
                                </div>
                            )}

                            {/* Weekend indicator */}
                            {isWeekend && (
                                <div className="absolute top-1 right-1">
                                    <span className="text-xs text-muted-foreground">
                                        🌴
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Empty state */}
            {trainings.length === 0 && leaves.length === 0 && (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground">
                        No Schedule Data
                    </h3>
                    <p className="text-muted-foreground mt-2">
                        No training or leave data available for this period.
                    </p>
                </div>
            )}
        </div>
    );
}
