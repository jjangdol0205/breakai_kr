"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function DebugPage() {
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
        async function fetchReports() {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);
            if (data) setReports(data);
        }
        fetchReports();
    }, []);

    return (
        <div className="p-10 bg-black text-white font-mono whitespace-pre-wrap">
            <h1>Debug: Last 5 Reports</h1>
            {reports.map((r) => (
                <div key={r.id} className="border border-gray-700 p-4 my-4">
                    <h2>{r.ticker} ({r.created_at})</h2>
                    <p>Has detailed_report column? {r.detailed_report ? 'YES' : 'NO'}</p>
                    <p>detailed_report length: {r.detailed_report?.length}</p>
                    <div className="bg-gray-900 p-2 mt-2 text-xs">
                        {JSON.stringify(r, null, 2)}
                    </div>
                </div>
            ))}
        </div>
    );
}
