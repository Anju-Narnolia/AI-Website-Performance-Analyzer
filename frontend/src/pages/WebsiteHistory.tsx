import {
    Globe,
    Zap,
    Search,
    Eye,
    Shield,
    Clock,
    BarChart3,
    Download
} from 'lucide-react';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { ChartSection } from "../components/ChartSection";
import { GoGraph } from "react-icons/go";
import { MetricCard } from '../components/MetricCard';

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
export default function WebsiteHistory() {
    const [data, setData] = useState<WebsiteScore[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { website } = useParams();
    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchWebsiteData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                if (!login) {
                    navigate("/login");
                    return;
                }
                const response = await fetch(`${API}/api/dashboard/scores/${encodeURIComponent(website || '')}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
                setLastUpdated(new Date());
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchWebsiteData();
    }, [API, navigate, login, website,]);

    const latestData = data.length > 0 ? data[data.length - 1].scores : null;

    const exportData = () => {
        const csvContent = [
            ['Date', 'Total Score', 'Performance', 'SEO', 'Accessibility', 'Best Practices'].join(','),
            ...data.map(item => [
                new Date(item.createdAt).toISOString(),
                item.scores.performance,
                item.scores.seo,
                item.scores.accessibility,
                item.scores.bestPractices
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${website}-history.csv`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header Section */}
            <div className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl pt-24 pb-8">
                <div className="flex flex-col gap-4 mx-auto px-10">
                    <div className="text-5xl font-bold text-white tracking-tight flex space-x-2">
                        <h1 className="">Monitoring Dashboard </h1>
                        <GoGraph />
                    </div>
                    <div className="flex justify-between gap-4 py-5 text-md">
                        <div className="flex items-center gap-2 mt-0.5 ">
                            <div className="flex gap-2 p-3 rounded-xl bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20">
                                <Globe className="w-6 h-6 text-cyan-400" />
                                <span className=" text-slate-400 font-medium">{website}</span>
                            </div>
                            <span className="w-1 h-1 rounded-full bg-slate-600" />
                            <span className="text-slate-500">
                                Total {data.length} scans
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {lastUpdated && (
                                <div className="hidden sm:flex items-center gap-2 text-slate-500">
                                    <Clock className="w-3.5 h-3.5" />
                                    Last updated: {lastUpdated.toLocaleTimeString()}
                                </div>
                            )}
                            <button
                                onClick={exportData}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/20 font-medium text-cyan-400 transition-all duration-200"
                            >
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto py-8 flex flex-col gap-10">
                {loading && data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin" />
                            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-400/30 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
                        </div>
                        <p className="text-slate-400 mt-6 font-medium">Loading dashboard data...</p>
                    </div>
                )}
                {!loading && data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 mb-4">
                            <BarChart3 className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-300">No Data Available</h3>
                        <p className="text-sm text-slate-500 mt-1 max-w-md">
                            There are no scan results for this website yet. Run a scan to see your metrics here.
                        </p>
                    </div>
                )}

                {data.length > 0 && (
                    <>
                        <div className='bg-slate-800/40 py-10'>
                            <div className=' max-w-7xl mx-auto'>
                                <h1 className="text-3xl font-bold py-4">Latest Dashboard Data</h1>
                                {/* Metrics Overview */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {latestData && (
                                        <>
                                            <MetricCard
                                                title="Performance"
                                                value={latestData.performance}
                                                icon={Zap}
                                                color="emerald"
                                            />
                                            <MetricCard
                                                title="SEO"
                                                value={latestData.seo}
                                                icon={Search}
                                                color="sky"
                                            />
                                            <MetricCard
                                                title="Accessibility"
                                                value={latestData.accessibility}
                                                icon={Eye}
                                                color="amber"
                                            />
                                            <MetricCard
                                                title="Best Practices"
                                                value={latestData.bestPractices}
                                                icon={Shield}
                                                color="rose"
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='bg-slate-800/40 py-10'>
                            <div className=' max-w-7xl mx-auto'>
                                <h1 className="text-3xl font-bold py-4">Chart</h1>
                                <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <ChartSection
                                        title="Performance"
                                        data={data}
                                        dataKey="performance"
                                        color="#10b981"
                                        icon={Zap}
                                        description="Page load speed and runtime performance"
                                    />
                                    <ChartSection
                                        title="SEO Score"
                                        data={data}
                                        dataKey="seo"
                                        color="#0ea5e9"
                                        icon={Search}
                                        description="Search engine optimization metrics"
                                    />
                                    <ChartSection
                                        title="Accessibility"
                                        data={data}
                                        dataKey="accessibility"
                                        color="#f59e0b"
                                        icon={Eye}
                                        description="WCAG compliance and usability"
                                    />
                                    <ChartSection
                                        title="Best Practices"
                                        data={data}
                                        dataKey="bestPractices"
                                        color="#f43f5e"
                                        icon={Shield}
                                        description="Code quality and security standards"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='bg-slate-800/40 py-10'>
                            <div className=' max-w-7xl mx-auto'>
                                <h1 className="text-3xl font-bold py-4">Data Table</h1>

                                {/* Data Table */}
                                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl overflow-hidden">
                                    <div className="p-6 border-b border-slate-700/50">
                                        <h3 className="text-lg font-bold text-white">Scan History</h3>
                                        <p className="text-sm text-slate-400 mt-1">Detailed breakdown of all scans</p>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-700/50 bg-slate-800/30">
                                                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                                                    <th className="text-center px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</th>
                                                    <th className="text-center px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Performance</th>
                                                    <th className="text-center px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">SEO</th>
                                                    <th className="text-center px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">A11y</th>
                                                    <th className="text-center px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Best Practices</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700/30">
                                                {[...data].reverse().map((item, index) => (
                                                    <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                                                        <td className="px-6 py-4 text-sm text-slate-300">
                                                            {new Date(item.createdAt).toLocaleString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${(item.scores.performance + item.scores.seo + item.scores.accessibility + item.scores.bestPractices) / 4 >= 85 ? 'bg-emerald-500/15 text-emerald-400' :
                                                                (item.scores.performance + item.scores.seo + item.scores.accessibility + item.scores.bestPractices) / 4 >= 70 ? 'bg-amber-500/15 text-amber-400' :
                                                                    'bg-rose-500/15 text-rose-400'
                                                                }`}>
                                                                {(item.scores.performance + item.scores.seo + item.scores.accessibility + item.scores.bestPractices) / 4}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center text-sm text-slate-400 tabular-nums">{item.scores.performance}</td>
                                                        <td className="px-6 py-4 text-center text-sm text-slate-400 tabular-nums">{item.scores.seo}</td>
                                                        <td className="px-6 py-4 text-center text-sm text-slate-400 tabular-nums">{item.scores.accessibility}</td>
                                                        <td className="px-6 py-4 text-center text-sm text-slate-400 tabular-nums">{item.scores.bestPractices}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
                }
            </div >
        </div >
    );
}