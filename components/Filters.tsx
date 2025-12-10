"use client";

import { Users, Filter, Clock } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Platform, FilterType } from "@/lib/types";

interface FiltersProps {
    filters: FilterType;
    onFilterChange: (filters: FilterType) => void;
    platforms: Platform[];
}

export default function Filters({
    filters,
    onFilterChange,
    platforms,
}: FiltersProps) {
    const handleFilterChange = (key: keyof FilterType, value: string) => {
        onFilterChange({
            ...filters,
            [key]: value,
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <Users className="inline h-4 w-4 mr-2" />
                    Platform
                </label>
                <Select
                    value={filters.platform}
                    onValueChange={(value) =>
                        handleFilterChange("platform", value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="All Platforms" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        {platforms.map((platform) => (
                            <SelectItem
                                key={platform.id}
                                value={platform.id.toString()}
                            >
                                {platform.name || `Platform ${platform.id}`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <Filter className="inline h-4 w-4 mr-2" />
                    Leave Type
                </label>
                <Select
                    value={filters.leaveType}
                    onValueChange={(value) =>
                        handleFilterChange("leaveType", value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="OFF">OFF</SelectItem>
                        <SelectItem value="LEAVE">LEAVE</SelectItem>
                        <SelectItem value="OLEAVE">OLEAVE</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <Clock className="inline h-4 w-4 mr-2" />
                    Time
                </label>
                <Select
                    value={filters.timeFilter}
                    onValueChange={(value) =>
                        handleFilterChange("timeFilter", value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="All Day" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Day</SelectItem>
                        <SelectItem value="AM">AM Only</SelectItem>
                        <SelectItem value="PM">PM Only</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
