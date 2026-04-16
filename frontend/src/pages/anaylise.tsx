import { useState, useMemo } from 'react';
import {
    Globe,
    ArrowRight,
    XCircle,
    TrendingUp,
    Layout,
    Search,
    Shield,
    Sparkles,
    RefreshCw,
} from 'lucide-react';
import CircularProgress from './components/CircularProgress';
import DetailSection from './components/DetailSection';
interface MetricsData {
    fcp: string;
    lcp: string;
    tbt: string;
    cls: string;
    speedIndex: string;
}
interface scores {
    performance: number;
    seo: number;
    accessibility: number;
    bestPractices: number;
}
interface SuggestionData {
    category: string;
    issue: string;
    severity: 'high' | 'medium' | 'low' | string;
    fix: string;
    code?: string;
    explanation?: string;
}
interface AnalysisResult {
    scores: scores;
    metrics: MetricsData;
    aiSuggestions?: SuggestionData[];
}

type CategoryKey = 'performance' | 'seo' | 'accessibility' | 'bestPractices';
export default function Analyze() {
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [activeTab, setActiveTab] = useState<CategoryKey>('performance');
    const [error, setError] = useState<string | null>(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    const getScoreColor = (score: number): string => {
        if (score >= 90) return 'text-green-500';
        if (score >= 70) return 'text-yellow-400';
        return 'text-red-500';
    };
    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        setIsAnalyzing(true);
        setResult(null);
        setError(null);
        try {
            if (!token) {
                throw new Error("No authentication token found. Please log in first.");
            }
            const fetchUrl = `${API_URL}/api/analyze/url`;
            const res = await fetch(fetchUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ url }),
            });
            const data = await res.json();
            console.log("🔍 Analysis response:", data);
            if (!res.ok) throw new Error(data.message || "Failed to analyze URL");
            if (!data) {
                throw new Error("No result data received from server");
            }
            setResult(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to analyze URL");
        } finally {
            setIsAnalyzing(false);
        }
    };
    const overallScore = useMemo(() => {
        if (!result || !result.scores) return 0;
        return Math.round(
            (result.scores.performance + result.scores.seo + result.scores.accessibility + result.scores.bestPractices) / 4
        );
    }, [result]);

    const categoryConfig = {
        performance: { icon: TrendingUp, color: 'text-green-800', title: 'Performance' },
        accessibility: { icon: Layout, color: 'text-blue-700', title: 'Accessibility' },
        bestPractices: { icon: Shield, color: 'text-purple-700', title: 'Best Practices' },
        seo: { icon: Search, color: 'text-yellow-700', title: 'SEO' }
    };
    return (
        <div className="min-h-screen bg-slate-900">
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900">
                    <div className="absolute inset-0 bg-linear-to-b from-cyan-500/10 via-transparent to-transparent" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                            <span className="text-slate-300 text-sm">Powered by AI</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Analyze Your Website
                            <br />
                            <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                                Performance with AI
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                            Enter your website URL and let our AI analyze its performance, SEO, accessibility, and best practices. Get actionable insights to optimize your site.
                        </p>
                    </div>
                    <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto mb-16">
                        <div className="relative flex flex-col sm:flex-row gap-3 p-2 bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-cyan-500/10">
                            <div className="flex-1 relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="url"
                                    placeholder="Enter website URL (e.g., https://example.com)"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isAnalyzing}
                                className="px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-70 hover:scale-105 active:scale-95"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Analyze Now
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    {error && (
                        <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-fade-in">
                            <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}
                    {result && (
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8 text-center">
                                <h2 className="text-4xl font-bold text-white mb-6">Overall Score</h2>
                                <div className="flex justify-center mb-6">
                                    <CircularProgress score={overallScore} size={120} strokeWidth={10} />
                                </div>
                                <p className={`text-4xl font-bold ${getScoreColor(overallScore)} mb-2`}>
                                    {overallScore >= 90 ? 'Excellent!' : overallScore >= 70 ? 'Good' : 'Needs Work'}
                                </p>
                                <p className="text-slate-400 text-xl">Your website scores {overallScore}/100 across all metrics</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {(Object.keys(result.scores || {}) as CategoryKey[]).map((key) => {
                                    const Icon = categoryConfig[key].icon;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setActiveTab(key)}
                                            className={`p-4 rounded-xl border transition-all duration-300 text-left group ${activeTab == key
                                                ? 'bg-linear-to-r from-slate-700/50 to-blue-500/50 border-cyan-500 shadow-lg shadow-cyan-500/10'
                                                : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <Icon
                                                    className={`w-10 h-10 ${categoryConfig[key].color} border-slate-700 rounded-full border-2 p-2`}
                                                /><CircularProgress score={result.scores[key]} size={70} strokeWidth={5} />
                                            </div>
                                            <p className="text-slate-400 text-sm font-medium">{categoryConfig[key].title}</p>
                                            <p className={`text-lg font-bold ${getScoreColor(result.scores[key])}`}>{result.scores[key].toFixed(0)}%</p>
                                        </button>
                                    )
                                })}
                            </div>
                            <div className="space-y-6">
                                {activeTab == 'performance' && (
                                    <DetailSection
                                        title="Performance"
                                        score={result.scores?.performance || 0}
                                        icon={TrendingUp}
                                        color="green-400"
                                        suggestions={result.aiSuggestions?.filter(suggestion => suggestion.category == 'performance') || null}
                                    >
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                            {[
                                                { label: 'FCP', value: result.metrics?.fcp || 'N/A', desc: 'First Contentful Paint' },
                                                { label: 'LCP', value: result.metrics?.lcp || 'N/A', desc: 'Largest Contentful Paint' },
                                                { label: 'TBT', value: result.metrics?.tbt || 'N/A', desc: 'Total Blocking Time' },
                                                { label: 'CLS', value: result.metrics?.cls || 'N/A', desc: 'Cumulative Layout Shift' },
                                                { label: 'Speed Index', value: result.metrics?.speedIndex || 'N/A', desc: 'Speed Index' }
                                            ].map((metric) => (
                                                <div key={metric.label} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/50 text-center group hover:border-slate-700/50 transition-colors">
                                                    <p className="text-slate-500 text-xs mb-1">{metric.label}</p>
                                                    <p className="text-white font-semibold text-sm">{metric.value}</p>
                                                    <p className="text-slate-600 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{metric.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </DetailSection>
                                )}
                                {activeTab === 'accessibility' && (
                                    <DetailSection
                                        title="Accessibility"
                                        score={result.scores?.accessibility || 0}
                                        icon={Layout}
                                        color="blue-400"
                                        suggestions={result.aiSuggestions?.filter(suggestion => suggestion.category == 'accessibility') || null}
                                    />
                                )}
                                {activeTab === 'bestPractices' && (
                                    <DetailSection
                                        title="Best Practices"
                                        score={result.scores?.bestPractices || 0}
                                        icon={Shield}
                                        color="purple-400"
                                        suggestions={result.aiSuggestions?.filter(suggestion => suggestion.category === 'bestPractices') || null}
                                    />
                                )}
                                {activeTab === 'seo' && (
                                    <DetailSection
                                        title="SEO"
                                        score={result.scores?.seo || 0}
                                        icon={Search}
                                        color="yellow-400"
                                        suggestions={result.aiSuggestions?.filter(suggestion => suggestion.category === 'seo') || null}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}






