"use client";

import { useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";

export default function FreeReportUnlocker({ reportId }: { reportId: string }) {
    useEffect(() => {
        const markFreeReportAsUsed = async () => {
            const supabase = createClient();

            // We use updateUser to save non-sensitive metadata in the user's Auth object
            const { error } = await supabase.auth.updateUser({
                data: {
                    free_report_used: true,
                    free_report_id_viewed: reportId,
                    free_report_viewed_at: new Date().toISOString()
                }
            });

            if (error) {
                console.error("Failed to update free report metadata:", error);
            }
        };

        markFreeReportAsUsed();
    }, [reportId]);

    return (
        <div className="mb-8 p-4 bg-emerald-900/20 border border-red-500/30 rounded-xl flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <p className="text-red-400 text-sm font-bold font-sans">
                You are currently viewing your <span className="text-white">1 Free Full Report</span>. Future reports will require a Pro subscription.
            </p>
        </div>
    );
}
