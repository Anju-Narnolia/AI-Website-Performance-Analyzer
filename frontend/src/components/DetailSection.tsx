import {
    XCircle,
    CheckCircle2,
    ChevronRight,
    Sparkles,
    AlertCircle,
    Copy,
    Check,
    Lightbulb,
    Maximize2,
    Minimize2,
    Terminal
} from 'lucide-react';
import CircularProgress from "./CircularProgress";
import { useState, useCallback } from 'react';

const getScoreColor = (score: number): { text: string; bg: string; border: string; glow: string } => {
    if (score >= 90) return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        glow: 'shadow-emerald-500/20'
    };
    if (score >= 70) return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        glow: 'shadow-amber-500/20'
    };
    return {
        text: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        glow: 'shadow-rose-500/20'
    };
};

const getSeverityStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
        case 'high':
            return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
        case 'medium':
            return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
        case 'low':
        default:
            return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    }
};

interface SuggestionData {
    category: string;
    issue: string;
    severity: 'high' | 'medium' | 'low' | string;
    fix: string;
    code?: string;
}

interface DetailSectionProps {
    title: string;
    score: number;
    icon: React.ElementType;
    color?: string;
    suggestions?: SuggestionData[] | null;
    children?: React.ReactNode;
    description?: string;
}

const CodeBlock = ({ code }: { code: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [code]);

    return (
        <div className="relative group mt-3">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-slate-950/80 rounded-lg border border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-900/50 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs font-medium text-slate-500">Suggested Fix</span>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-all duration-200 text-xs font-medium"
                    >
                        {copied ? (
                            <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
                <pre className="p-4 overflow-x-auto">
                    <code className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre">
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
};

const DetailSection = ({
    title,
    score,
    icon: Icon,
    color = 'blue',
    suggestions,
    children,
    description
}: DetailSectionProps) => {
    const suggestionsList = suggestions || [];
    console.log("🚀Suggestions:", suggestionsList.length);
    const scoreColors = getScoreColor(score);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [isSectionExpanded, setIsSectionExpanded] = useState(true);

    const toggleSuggestion = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="relative group">
            {/* Ambient Glow Effect - Fixed gradient classes */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-${color}-500/20 via-purple-500/20 to-${color}-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-500`} />

            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl shadow-black/20">
                {/* Header */}
                <button
                    onClick={() => setIsSectionExpanded(!isSectionExpanded)}
                    className="w-full p-6 flex items-center justify-between bg-gradient-to-r from-slate-800/30 via-transparent to-slate-800/30 hover:from-slate-800/50 hover:to-slate-800/50 transition-all duration-300 border-b border-slate-700/30"
                >
                    <div className="flex items-center gap-5">
                        <div className={`relative p-3.5 rounded-2xl ${scoreColors.bg} border ${scoreColors.border} shadow-lg ${scoreColors.glow}`}>
                            <Icon className={`w-7 h-7 ${scoreColors.text}`} />
                            <div className={`absolute inset-0 rounded-2xl ${scoreColors.bg} blur-xl opacity-50`} />
                        </div>

                        <div className="text-left">
                            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                            {description && (
                                <p className="text-sm text-slate-400 mt-0.5 font-medium">{description}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end gap-1">
                            <span className={`text-2xl font-bold ${scoreColors.text} tabular-nums`}>
                                {score}
                            </span>
                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                                Score
                            </span>
                        </div>

                        <div className="relative">
                            <CircularProgress score={score} size={64} strokeWidth={5} />
                        </div>

                        <div className={`
                            p-2 rounded-full bg-slate-800/50 border border-slate-700/50 transition-transform duration-300
                            ${isSectionExpanded ? 'rotate-90' : ''}
                        `}>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                </button>

                {/* Content Section */}
                <div className={`
                    overflow-hidden transition-all duration-500 ease-in-out
                    ${isSectionExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
                `}>
                    <div className="p-6 space-y-6">
                        {/* Custom Content */}
                        {children && (
                            <div className="pb-4 border-b border-slate-700/30">
                                {children}
                            </div>
                        )}

                        {/* Issues Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                        <AlertCircle className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-200">
                                            Issues Found
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            {suggestionsList.length === 0
                                                ? 'No issues detected'
                                                : `${suggestionsList.length} issue${suggestionsList.length !== 1 ? 's' : ''} require${suggestionsList.length === 1 ? 's' : ''} attention`
                                            }
                                        </p>
                                    </div>
                                </div>

                                {suggestionsList.length > 0 && (
                                    <span className="text-xs font-medium text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                                        {suggestionsList.length} items
                                    </span>
                                )}
                            </div>

                            {suggestionsList.length > 0 ? (
                                <div className="space-y-3">
                                    {suggestionsList.map((suggestion, index) => (
                                        <div key={index} className="group relative">
                                            <div
                                                className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${expandedIndex === index
                                                    ? 'bg-slate-800/60 border-slate-600/50 shadow-lg shadow-black/20'
                                                    : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/40'
                                                    }`}
                                            >
                                                <button
                                                    onClick={() => toggleSuggestion(index)}
                                                    className="w-full p-4 flex items-center gap-4 text-left"
                                                >
                                                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getSeverityStyles((suggestion as SuggestionData).severity)}`}>
                                                        <XCircle className={`w-5 h-5 ${(suggestion as SuggestionData).severity === 'high' ? 'text-rose-400' : (suggestion as SuggestionData).severity === 'medium' ? 'text-amber-400' : 'text-blue-400'}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getSeverityStyles((suggestion as SuggestionData).severity)}`}>
                                                                {(suggestion as SuggestionData).severity.toUpperCase()}
                                                            </span>
                                                            <span className="text-xs text-slate-500 font-medium">{(suggestion as SuggestionData).category}</span>
                                                        </div>
                                                        <p className="text-sm text-slate-200 font-medium leading-snug line-clamp-2">
                                                            {(suggestion as SuggestionData).issue}
                                                        </p>
                                                    </div>
                                                    <div className="shrink-0 flex items-center gap-2">
                                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${expandedIndex === index
                                                            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                                            : 'bg-slate-700/50 text-slate-400 group-hover:bg-violet-500/10 group-hover:text-violet-300 border border-transparent group-hover:border-violet-500/20'
                                                            }`}>
                                                            <Sparkles className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedIndex === index ? 'rotate-12' : ''}`} />
                                                            <span>{expandedIndex === index ? 'Hide' : 'Fix'}</span>
                                                            {expandedIndex === index ? (
                                                                <Minimize2 className="w-3 h-3 ml-1" />
                                                            ) : (
                                                                <Maximize2 className="w-3 h-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>

                                                {/* Expanded Solution Section */}
                                                <div className={`overflow-hidden transition-all duration-500 ease-out ${expandedIndex === index ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <div className="border-t border-slate-700/50 bg-gradient-to-b from-slate-800/20 to-transparent">
                                                        <div className="p-4 pt-5">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center">
                                                                    <Lightbulb className="w-4 h-4 text-violet-300" />
                                                                </div>
                                                                <div>
                                                                    <h5 className="text-sm font-semibold text-violet-200">AI Solution</h5>
                                                                    <p className="text-xs text-slate-500">Recommended approach to resolve this issue</p>
                                                                </div>
                                                            </div>

                                                            {/* Fix Description */}
                                                            <div className="mb-4">
                                                                <p className="text-sm text-slate-300 leading-relaxed">
                                                                    {(suggestion as SuggestionData).fix}
                                                                </p>
                                                            </div>
                                                            {!((suggestion as SuggestionData).code) && (
                                                                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-800/50 border border-slate-700/50 text-slate-400 text-xs font-medium">
                                                                    <Terminal className="w-3.5 h-3.5" />
                                                                    No code fix provided
                                                                </div>
                                                            )}
                                                            {(suggestion as SuggestionData).code && <CodeBlock code={(suggestion as SuggestionData).code!} />}
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 p-6">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                    <div className="relative flex items-center gap-4">
                                        <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-emerald-400 font-semibold">All Clear!</p>
                                            <p className="text-sm text-slate-400 mt-0.5">No issues found in this section. Great job maintaining quality standards.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailSection;