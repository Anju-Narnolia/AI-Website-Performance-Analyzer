
// interface WebsiteScore {
//     name: string;
//     url: string;
//     scores: {
//         performance: number;
//         accessibility: number;
//         bestPractices: number;
//         seo: number;
//     };
//     createdAt: string;
// }
interface MetricCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
}
export const MetricCard = ({ title, value, icon: Icon, color }: MetricCardProps) => {
    return (
        <div
            className={`relative group rounded-2xl border border-${color}-500/20 bg-slate-900/60 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
        >
            <div className={`absolute inset-0 bg-linear-to-br from-${color}-500/20  opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
                        <Icon className={`w-5 h-5 text-${color}-400`} />
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-3xl font-bold text-${color}-400 tabular-nums`}>
                            {value}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
