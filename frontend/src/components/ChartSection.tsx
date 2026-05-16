import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    AreaChart,
    Area,
    ReferenceLine
} from "recharts";
import { useState, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { CustomTooltip } from "./CustomTooltip";
interface WebsiteScore {
    name: string;
    url: string;
    scores: {
        performance: number;
        accessibility: number;
        bestPractices: number;
        seo: number;
    };
    createdAt: string;
}
export const ChartSection = ({
    title,
    data,
    dataKey,
    color,
    icon: Icon,
    description
}: {
    title: string;
    data: WebsiteScore[];
    dataKey: string;
    color: string;
    icon: React.ElementType;
    description?: string;
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const avgScore = useMemo(() => {
        if (data.length === 0) return 0;
        const sum = data.reduce((acc, item) => acc + (item.scores[dataKey as keyof typeof item.scores] as number), 0);
        return Math.round(sum / data.length);
    }, [data, dataKey]);

    const latestScore = data.length > 0 ? data[data.length - 1].scores[dataKey as keyof typeof data[0]['scores']] as number : 0;

    return (
        <div className="relative group rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-slate-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
                            <Icon className={`w-5 h-5 text-${color}-400`} />
                        </div>
                        <div className="text-left">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-bold text-white">{title}</h3>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold bg-${color}-500/15 text-${color}-400 border border-${color}-500/20`}>
                                    Latest: {latestScore}
                                </span>
                            </div>
                            {description && (
                                <p className="text-sm text-slate-400 mt-0.5">{description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Average</p>
                            <p className={`text-xl font-bold text-${color}-400 tabular-nums`}>{avgScore}</p>
                        </div>
                        <div className={`p-2 rounded-full bg-slate-800/50 border border-slate-700/50 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                </button>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-6 pb-6">
                        <div className="h-75 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id={`area-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                    <XAxis
                                        dataKey="createdAt"
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        stroke="#475569"
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        stroke="#475569"
                                    />
                                    <Tooltip content={<CustomTooltip active={true} payload={[{ color: "red", name: "hii", value: 10 }]}  label=""/>} />
                                    <ReferenceLine y={90} stroke="#10b981" strokeDasharray="5 5" opacity={0.5} label={{ value: 'Excellent', fill: '#10b981', fontSize: 10, position: 'right' }} />
                                    <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="5 5" opacity={0.5} label={{ value: 'Good', fill: '#f59e0b', fontSize: 10, position: 'right' }} />
                                    <Area
                                        type="monotone"
                                        dataKey={`scores.${dataKey}`}
                                        stroke={color}
                                        strokeWidth={3}
                                        fill={`url(#area-${dataKey})`}
                                        dot={{ fill: color, strokeWidth: 2, r: 4, stroke: '#0f172a' }}
                                        activeDot={{ r: 6, strokeWidth: 0, fill: color }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};