"use client";

import { format } from "date-fns";
import {
    X,
    Clock,
    MapPin,
    Users,
    CheckCircle,
    User,
    Shield,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Training, Leave } from "@/lib/types";

interface DayDetailsProps {
    date: Date;
    trainings: Training[];
    leaves: Leave[];
    isOpen: boolean;
    onClose: () => void;
}

export default function DayDetails({
    date,
    trainings,
    leaves,
    isOpen,
    onClose,
}: DayDetailsProps) {
    const formattedDate = format(date, "EEEE, MMMM d, yyyy");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>{formattedDate}</span>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogTitle>
                    <DialogDescription>
                        {trainings.length} trainings • {leaves.length} personnel
                        on leave
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Trainings Section */}
                    {trainings.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Trainings & Exercises ({trainings.length})
                            </h3>
                            <div className="space-y-3">
                                {trainings.map((training) => (
                                    <div
                                        key={training.id}
                                        className="bg-primary/5 rounded-lg p-4 border border-primary/20"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-primary">
                                                {training.title}
                                            </h4>
                                            <Badge
                                                variant="secondary"
                                                className="capitalize bg-primary/20 text-primary-foreground"
                                            >
                                                {training.type.toLowerCase()}
                                            </Badge>
                                        </div>

                                        {training.description && (
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {training.description}
                                            </p>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            {(training.start_time ||
                                                training.end_time) && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span>
                                                        {training.start_time} -{" "}
                                                        {training.end_time}
                                                    </span>
                                                </div>
                                            )}

                                            {training.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span>
                                                        {training.location}
                                                    </span>
                                                </div>
                                            )}

                                            {training.required_platforms &&
                                                training.required_platforms
                                                    .length > 0 && (
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                                        <span>
                                                            Platforms:{" "}
                                                            {training.required_platforms.join(
                                                                ", "
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Leave Section */}
                    {leaves.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Users className="h-5 w-5 text-destructive" />
                                Personnel on Leave ({leaves.length})
                            </h3>
                            <div className="space-y-3">
                                {leaves.map((leave) => (
                                    <div
                                        key={leave.id}
                                        className="bg-destructive/5 rounded-lg p-4 border border-destructive/20"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    {leave.user_name}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Platform {leave.platform_id}
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        leave.type === "OFF"
                                                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                                            : leave.type ===
                                                              "LEAVE"
                                                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                                                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                                    }
                                                >
                                                    {leave.type}
                                                </Badge>

                                                {leave.time && (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-muted"
                                                    >
                                                        {leave.time}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {leave.details && (
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {leave.details}
                                            </p>
                                        )}

                                        <div className="flex gap-4 mt-3 text-sm">
                                            <div
                                                className={`flex items-center gap-1 ${
                                                    leave.approved_by_ic
                                                        ? "text-green-600"
                                                        : "text-amber-600"
                                                }`}
                                            >
                                                {leave.approved_by_ic ? (
                                                    <CheckCircle className="h-4 w-4" />
                                                ) : (
                                                    <Clock className="h-4 w-4" />
                                                )}
                                                <span>
                                                    IC{" "}
                                                    {leave.approved_by_ic
                                                        ? "Approved"
                                                        : "Pending"}
                                                </span>
                                            </div>
                                            <div
                                                className={`flex items-center gap-1 ${
                                                    leave.approved_by_pc
                                                        ? "text-green-600"
                                                        : "text-amber-600"
                                                }`}
                                            >
                                                {leave.approved_by_pc ? (
                                                    <CheckCircle className="h-4 w-4" />
                                                ) : (
                                                    <Clock className="h-4 w-4" />
                                                )}
                                                <span>
                                                    PC{" "}
                                                    {leave.approved_by_pc
                                                        ? "Approved"
                                                        : "Pending"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Activities */}
                    {trainings.length === 0 && leaves.length === 0 && (
                        <div className="text-center py-8">
                            <div className="text-muted-foreground mb-2">📅</div>
                            <h3 className="text-lg font-semibold text-muted-foreground">
                                No Activities Scheduled
                            </h3>
                            <p className="text-muted-foreground">
                                This day has no trainings or leave applications.
                            </p>
                        </div>
                    )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
