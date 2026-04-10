import { useState } from 'react';
import {
    Zap,
    Activity,
    BarChart3,
    Users,
    Search,
    Cpu,
    Globe,
    TrendingUp,
    Clock,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Smartphone
} from 'lucide-react';

// Hero Section
export default function Home() {
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (url) {
            setIsAnalyzing(true);
            setTimeout(() => setIsAnalyzing(false), 2000);
        }
    };

    return (
        <>
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-slate-950">
                    {/* Gradient Orbs */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-purple-500/10 rounded-full blur-[150px]" />

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm mb-8 animate-fade-in-up">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-slate-300">Powered by Advanced AI Technology</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up delay-100">
                        Optimize Your Website
                        <br />
                        <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Performance with AI
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
                        Analyze, Monitor, and Improve your website speed and SEO instantly.
                        Get actionable insights powered by machine learning.
                    </p>

                    {/* URL Input Form */}
                    <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto mb-12 animate-fade-in-up delay-300">
                        <div className="relative flex flex-col sm:flex-row gap-3 p-2 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl">
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
                                className="px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm animate-fade-in-up delay-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                            <span>Free Analysis</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                            <span>No Credit Card Required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                            <span>Instant Results</span>
                        </div>
                    </div>
                </div>

            </section>
            <div>

                <HowItWorks />
                <Features />
                <Benefits />
                <CTA />

            </div>
        </>
    );
};

// Features Section
const Features = () => {
    const features = [
        {
            icon: <Cpu className="w-6 h-6 text-cyan-400" />,
            title: "AI Performance Analysis",
            description: "Deep learning algorithms analyze every aspect of your website's performance, identifying bottlenecks and optimization opportunities with precision."
        },
        {
            icon: <Activity className="w-6 h-6 text-purple-400" />,
            title: "Real-time Monitoring",
            description: "Continuous monitoring of your website's health with instant alerts when performance drops or issues are detected, ensuring 99.9% uptime."
        },
        {
            icon: <Sparkles className="w-6 h-6 text-pink-400" />,
            title: "Smart Optimization Suggestions",
            description: "Receive AI-powered recommendations prioritized by impact. Our system learns from millions of websites to suggest the most effective improvements."
        },
        {
            icon: <BarChart3 className="w-6 h-6 text-green-400" />,
            title: "Competitor Comparison",
            description: "Benchmark your performance against competitors. Understand where you stand in your industry and discover opportunities to outperform rivals."
        }
    ];

    return (
        <section id="features" className="py-24 bg-slate-950 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Powerful Features for{' '}
                        <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Maximum Performance
                        </span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Everything you need to analyze, monitor, and optimize your website's performance in one powerful platform.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10"
                        >
                            {/* Gradient Border Effect */}
                            <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-cyan-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />

                            <div className="relative">
                                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// How It Works Section
const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            icon: <Search className="w-8 h-8 text-cyan-400" />,
            title: "Enter Website URL",
            description: "Simply paste your website URL into our analyzer. No registration required for basic analysis."
        },
        {
            number: "02",
            icon: <Cpu className="w-8 h-8 text-purple-400" />,
            title: "AI Analyzes Performance",
            description: "Our AI engine scans your website across 50+ performance metrics including speed, SEO, and accessibility."
        },
        {
            number: "03",
            icon: <TrendingUp className="w-8 h-8 text-green-400" />,
            title: "Get Optimization Suggestions",
            description: "Receive a detailed report with prioritized recommendations and step-by-step implementation guides."
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-slate-900 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-800/20 via-slate-900 to-slate-900" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        How It{' '}
                        <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Works
                        </span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Get started in minutes. Our streamlined process makes website optimization simple and effective.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-linear-to-r from-cyan-500/50 via-purple-500/50 to-green-500/50" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center group">
                            <div className="relative mb-6">
                                <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 group-hover:border-cyan-500/50 group-hover:scale-110 transition-all duration-300 shadow-xl shadow-black/50">
                                    {step.icon}
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-linear-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {step.number}
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                            <p className="text-slate-400 text-sm max-w-xs">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


// Benefits Section
const Benefits = () => {
    const benefits = [
        {
            icon: <Zap className="w-6 h-6 text-yellow-400" />,
            title: "Improve Speed",
            description: "Reduce load times by up to 70% with AI-optimized caching and resource loading strategies."
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-green-400" />,
            title: "Better SEO Ranking",
            description: "Higher performance scores directly correlate with improved search engine rankings and visibility."
        },
        {
            icon: <Users className="w-6 h-6 text-purple-400" />,
            title: "Enhance User Experience",
            description: "Smooth, fast websites keep users engaged longer and increase conversion rates significantly."
        },
        {
            icon: <Clock className="w-6 h-6 text-cyan-400" />,
            title: "Reduce Bounce Rate",
            description: "Every second of delay increases bounce rate by 7%. Speed up your site to keep visitors."
        }
    ];

    return (
        <section id="benefits" className="py-24 bg-slate-900 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                            Why Choose{' '}
                            <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                WebOpt AI?
                            </span>
                        </h2>
                        <p className="text-slate-400 mb-8 text-lg">
                            Join thousands of developers and businesses who trust WebOpt AI to deliver exceptional web experiences.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex gap-4 group">
                                    <div className="shrink-0 w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 group-hover:border-cyan-500/50 transition-colors">
                                        {benefit.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                                        <p className="text-slate-400 text-sm">{benefit.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="mt-10 pt-10 border-t border-slate-800 grid grid-cols-3 gap-8">
                            <div>
                                <div className="text-3xl font-bold text-white mb-1">50K+</div>
                                <div className="text-slate-500 text-sm">Websites Analyzed</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                                <div className="text-slate-500 text-sm">Uptime Guaranteed</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
                                <div className="text-slate-500 text-sm">User Rating</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
                        <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-linear-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                        <Smartphone className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold text-lg">Mobile Optimized</div>
                                        <div className="text-slate-400 text-sm">Perfect scores on mobile devices</div>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-700" />

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-sm">Page Load Time</span>
                                        <span className="text-green-400 font-semibold">0.8s</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full w-[95%] bg-linear-to-r from-green-400 to-cyan-400 rounded-full" />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-sm">Performance Score</span>
                                        <span className="text-cyan-400 font-semibold">98/100</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full w-[98%] bg-linear-to-r from-cyan-400 to-blue-500 rounded-full" />
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-slate-300 text-sm">Live Monitoring Active</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">Healthy</span>
                                        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full border border-cyan-500/20">Optimized</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// CTA Section
const CTA = () => {
    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-500/10 rounded-full blur-[100px]" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                    Start Optimizing Your Website{' '}
                    <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Today
                    </span>
                </h2>
                <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                    Join over 50,000 developers and businesses who trust WebOpt AI to deliver exceptional web performance.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 group">
                        Get Started Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300 border border-slate-700">
                        View Demo
                    </button>
                </div>

                <p className="mt-6 text-slate-500 text-sm">No credit card required • Free 14-day trial • Cancel anytime</p>
            </div>
        </section>
    );
};