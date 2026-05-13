import { Calendar } from "lucide-react";

export const CustomTooltip = ({ active, payload, label }: { active: boolean; payload: { color: string; name: string; value: number }[]; label: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-2xl shadow-black/40">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700/50">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-200">
                        {new Date(label).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
                <div className="space-y-2">
                    {payload.map((entry: { color: string; name: string; value: number }, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-sm text-slate-400 capitalize">
                                    {entry.name.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                            </div>
                            <span className="text-sm font-bold text-slate-200 tabular-nums">
                                {entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};
