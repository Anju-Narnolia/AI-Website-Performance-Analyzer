import { useState, useCallback, useMemo } from 'react';
import {
    Globe,
    ArrowRight,
    Zap,
    CheckCircle2,
    AlertCircle,
    XCircle,
    TrendingUp,
    Layout,
    Search,
    Shield,
    Sparkles,
    RefreshCw,
} from 'lucide-react';
import CircularProgress from './components/CircularProgress';

export default function Analyze() {
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [activeTab, setActiveTab] = useState<CategoryKey>('performance');
    const [loadingSuggestions, setLoadingSuggestions] = useState<CategoryKey | null>(null);
    const [error, setError] = useState<string | null>(null);
    const API_URL = import.meta.env.VITE_API_URL;
    const [suggestions, setSuggestions] = useState<Record<CategoryKey, string | null>>({
        performance: null,
        seo: null,
        accessibility: null,
        bestPractices: null
    });

    const handleAnalyze = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setIsAnalyzing(true);
        setResult(null);
        setError(null);
        setSuggestions({ performance: null, seo: null, accessibility: null, bestPractices: null });

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found. Please log in first.");
            }
            const res = await fetch(`${API_URL}/api/analyze/url`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to analyze URL");
            setResult(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to analyze URL");
        } finally {
            setIsAnalyzing(false);
        }
    }, [url, API_URL]);

    const handleGetSuggestions = useCallback(async (category: CategoryKey) => {
        if (!result) return;
        try {
            setLoadingSuggestions(category);
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found. Please log in first.");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to get suggestions");
        } finally {
            setLoadingSuggestions(null);
        }
    }, [result]);

    const clearSuggestion = useCallback((category: CategoryKey) => {
        setSuggestions(prev => ({ ...prev, [category]: null }));
    }, []);

    // Calculate overall score
    const overallScore = useMemo(() => {
        if (!result) return 0;
        return Math.round(
            (result.performance.score + result.seo.score + result.accessibility.score + result.bestPractices.score) / 4
        );
    }, [result]);

    const categoryConfig = {
        performance: { icon: TrendingUp, color: 'text-green-800', title: 'Performance' },
        accessibility: { icon: Layout, color: 'text-blue-700', title: 'Accessibility' },
        bestPractices: { icon: Shield, color: 'text-purple-700', title: 'Best Practices' },
        seo: { icon: Search, color: 'text-yellow-700', title: 'SEO' }
    };

    // const Icon = categoryConfig[key].icon;
    return (
        <div className="min-h-screen bg-slate-900">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-slate-900">
                    <div className="absolute inset-0 bg-linear-to-b from-cyan-500/10 via-transparent to-transparent" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {/* Header */}
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

                    {/* URL Input Form */}
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

                    {/* Error Message */}
                    {error && (
                        <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-fade-in">
                            <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Results */}
                    {result && (
                        <div className="space-y-8 animate-fade-in-up">
                            {/* Overall Score Card */}
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
                                {(Object.keys(categoryConfig) as CategoryKey[]).map((key) => {
                                    const Icon = categoryConfig[key].icon;
                                    return (
                                        <button
                                            onClick={() => setActiveTab(key)}
                                            className={`p-4 rounded-xl border transition-all duration-300 text-left group ${activeTab == key
                                                ? 'bg-slate-700/50 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                                                : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">

                                                <Icon
                                                    className={`w-10 h-10 ${categoryConfig[key].color} border-slate-700 rounded-full border-2 p-2`}
                                                />
                                                {/* <categoryConfig[key].icon className={`w-10 h-10 ${categoryConfig[key].color} border-slate-700 rounded-full border-2 p-2`} /> */}
                                                <CircularProgress score={result[key].score} size={70} strokeWidth={5} />
                                            </div>
                                            <p className="text-slate-400 text-sm font-medium">{categoryConfig[key].title}</p>
                                            <p className={`text-lg font-bold ${getScoreColor(result[key].score)}`}>{result[key].score.toFixed(0)}%</p>
                                        </button>
                                    )
                                })}
                            </div>
                            <div className="space-y-6">
                                {activeTab === 'performance' && (
                                    <DetailSection
                                        title="Performance"
                                        score={result.performance.score}
                                        icon={TrendingUp}
                                        color="text-green-400"
                                        issues={[]}
                                        suggestions={suggestions.performance}
                                        loadingSuggestions={loadingSuggestions === 'performance'}
                                        onGetSuggestions={() => handleGetSuggestions('performance')}
                                        onClearSuggestions={() => clearSuggestion('performance')}
                                    >
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                            {[
                                                { label: 'FCP', value: result.performance.fcp, desc: 'First Contentful Paint' },
                                                { label: 'LCP', value: result.performance.lcp, desc: 'Largest Contentful Paint' },
                                                { label: 'TBT', value: result.performance.tbt, desc: 'Total Blocking Time' },
                                                { label: 'CLS', value: result.performance.cls, desc: 'Cumulative Layout Shift' },
                                                { label: 'Speed Index', value: result.performance.speedIndex, desc: 'Speed Index' }
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
                                        score={result.accessibility.score}
                                        icon={Layout}
                                        color="text-blue-400"
                                        issues={result.accessibility.issues}
                                        suggestions={suggestions.accessibility}
                                        loadingSuggestions={loadingSuggestions === 'accessibility'}
                                        onGetSuggestions={() => handleGetSuggestions('accessibility')}
                                        onClearSuggestions={() => clearSuggestion('accessibility')}
                                    />
                                )}
                                {activeTab === 'bestPractices' && (
                                    <DetailSection
                                        title="Best Practices"
                                        score={result.bestPractices.score}
                                        icon={Shield}
                                        color="text-purple-400"
                                        issues={result.bestPractices.issues}
                                        suggestions={suggestions.bestPractices}
                                        loadingSuggestions={loadingSuggestions === 'bestPractices'}
                                        onGetSuggestions={() => handleGetSuggestions('bestPractices')}
                                        onClearSuggestions={() => clearSuggestion('bestPractices')}
                                    />
                                )}
                                {activeTab === 'seo' && (
                                    <DetailSection
                                        title="SEO"
                                        score={result.seo.score}
                                        icon={Search}
                                        color="text-yellow-400"
                                        issues={result.seo.issues}
                                        suggestions={suggestions.seo}
                                        loadingSuggestions={loadingSuggestions === 'seo'}
                                        onGetSuggestions={() => handleGetSuggestions('seo')}
                                        onClearSuggestions={() => clearSuggestion('seo')}
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


interface MetricData {
    score: number;
    issues: string[];
}

interface PerformanceData {
    score: number;
    fcp: string;
    lcp: string;
    tbt: string;
    cls: string;
    speedIndex: string;
}

interface AnalysisResult {
    performance: PerformanceData;
    seo: MetricData;
    accessibility: MetricData;
    bestPractices: MetricData;
}

type CategoryKey = 'performance' | 'seo' | 'accessibility' | 'bestPractices';

const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-700';
    return 'text-red-500';
};

const getScoreBg = (score: number): string => {
    if (score >= 90) return 'bg-green-500/20 border-green-500/30';
    if (score >= 70) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
};




// Detail Section Component
const DetailSection = ({
    title,
    score,
    icon: Icon,
    issues,
    suggestions,
    loadingSuggestions,
    onGetSuggestions,
    onClearSuggestions,
    children
}: {
    title: string;
    score: number;
    icon: React.ElementType;
    color: string;
    issues: string[];
    suggestions: string | null;
    loadingSuggestions: boolean;
    onGetSuggestions: () => void;
    onClearSuggestions: () => void;
    children?: React.ReactNode;
}) => {

    return (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden transition-all duration-300 hover:border-slate-600/50">
            {/* Header */}
            <button
                className="w-full p-6 flex items-center justify-between bg-linear-to-r from-slate-800/50 to-transparent hover:from-slate-700/30 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${getScoreBg(score)}`}>
                        <Icon className={`w-6 h-6 ${getScoreColor(score)}`} />
                    </div>
                    <div className="text-left">
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <CircularProgress score={score} size={60} strokeWidth={6} />
                </div>
            </button>
            <div className="p-6 pt-0 border-t border-slate-700/50 animate-fade-in">
                {children}
                <div className="mt-6">
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-slate-400" />
                        Issues Found ({issues.length})
                    </h4>
                    {issues.length > 0 ? (
                        <ul className="space-y-2">
                            {issues.map((issue, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800/50 hover:border-slate-700/50 transition-colors"
                                >
                                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <span className="text-slate-300 text-sm leading-relaxed">{issue}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center gap-2 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 text-sm font-medium">No issues found! Great job!</span>
                        </div>
                    )}
                </div>
                <div className="mt-6">
                    {!suggestions ? (
                        <button
                            onClick={onGetSuggestions}
                            disabled={loadingSuggestions}
                            className= " cursor-pointer w-full px-4 py-3 bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 disabled:from-slate-700 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                        >
                            {loadingSuggestions ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Generating AI Suggestions...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Get AI-Powered Suggestions
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="bg-linear-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/20 overflow-hidden">
                            <div className="px-4 py-3 bg-purple-500/10 border-b border-purple-500/20 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-purple-400" />
                                    <span className="text-purple-300 text-sm font-semibold">AI Suggestions</span>
                                </div>
                                <button
                                    onClick={onClearSuggestions}
                                    className="text-slate-400 hover:text-white text-xs transition-colors"
                                >
                                    Clear
                                </button>
                            </div>
                            <div className="p-4">
                                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                                    {suggestions}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};