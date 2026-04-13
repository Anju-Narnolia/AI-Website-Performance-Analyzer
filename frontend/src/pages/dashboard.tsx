import { Gauge, LineChart, Search, Shield, Users, Zap, AlertCircle, TrendingUp, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Stat {
  label: string;
  value: number;
  color: string;
  icon: JSX.Element;
  trend: string;
}

interface DashboardData {
  lighthouse?: {
    performance?: number;
    seo?: number;
    accessibility?: number;
    bestPractices?: number;
    performanceTrend?: string;
    seoTrend?: string;
    accessibilityTrend?: string;
    bestPracticesTrend?: string;
  };
  history?: any[];
  issues?: any[];
  coreWebVitals?: {
    lcp?: string;
    fid?: string;
    cls?: string;
    ttfb?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export default function DashboardPreview() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  
  // State management
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Please log in to view the dashboard");
          setLoading(false);
          return;
        }
        
        const response = await fetch(`${API}/api/dashboard/data`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
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
        setDashboardData(result as DashboardData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, [API, selectedTimeRange, navigate]);

  // Loading state
  if (loading) {
    return (
      <section id="dashboard" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-150">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-400">Loading dashboard data...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="dashboard" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-150">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Failed to load dashboard</h3>
            <p className="text-slate-400 text-sm mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Extract data with fallbacks
  const lighthouse = dashboardData?.lighthouse || {};
  const history = dashboardData?.history || [];
  const issues = dashboardData?.issues || [];
  const vitals = dashboardData?.coreWebVitals || {};
  
  const scores = {
    performance: lighthouse.performance || 94,
    seo: lighthouse.seo || 92,
    accessibility: lighthouse.accessibility || 88,
    bestPractices: lighthouse.bestPractices || 96
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  // const getScoreBg = (score: number): string => {
  //   if (score >= 90) return "bg-green-400";
  //   if (score >= 70) return "bg-yellow-400";
  //   return "bg-red-400";
  // };

  return (
    <section id="dashboard" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15),transparent_50%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
            <TrendingUp className="w-4 h-4" />
            <span>Live Data from Lighthouse</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Powerful{' '}
            <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Analytics Dashboard
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Real-time insights powered by Google Lighthouse. Track performance metrics, monitor trends, and optimize your web application.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-cyan-500/10 bg-slate-900">
          {/* Browser Chrome */}
          <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-slate-900 rounded-md px-4 py-1.5 text-xs text-slate-500 text-center flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                app.webopt.ai/dashboard
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Updated {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6 lg:p-8 bg-slate-900">
            {/* Top Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { 
                  label: 'Performance', 
                  value: scores.performance, 
                  color: getScoreColor(scores.performance), 
                  icon: <Gauge className="w-5 h-5" />,
                  trend: lighthouse.performanceTrend || "+4%"
                },
                { 
                  label: 'SEO', 
                  value: scores.seo, 
                  color: getScoreColor(scores.seo), 
                  icon: <Search className="w-5 h-5" />,
                  trend: lighthouse.seoTrend || "+2%"
                },
                { 
                  label: 'Accessibility', 
                  value: scores.accessibility, 
                  color: getScoreColor(scores.accessibility), 
                  icon: <Users className="w-5 h-5" />,
                  trend: lighthouse.accessibilityTrend || "+1%"
                },
                { 
                  label: 'Best Practices', 
                  value: scores.bestPractices, 
                  color: getScoreColor(scores.bestPractices), 
                  icon: <Shield className="w-5 h-5" />,
                  trend: lighthouse.bestPracticesTrend || "+5%"
                },
              ].map((stat: Stat, idx: number) => (
                <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/30 transition-colors group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs">{stat.label}</span>
                    <div className={`${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-xs ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.trend}
                    </span>
                    <span className="text-xs text-slate-500">from last scan</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chart */}
              <div className="lg:col-span-2 bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-cyan-400" />
                    Performance History
                  </h4>
                  <select 
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-xs text-slate-300 hover:border-cyan-500/50 transition-colors cursor-pointer"
                  >
                    <option value="24h">Last 24 hours</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>
                
                {/* Chart Visualization */}
                <div className="h-48 flex items-end gap-2">
                  {(history.length > 0 ? history : [65, 72, 68, 75, 82, 78, 88, 85, 92, 94, 91, 94] as any[]).map((item: any, i: number) => {
                    const height = typeof item === 'object' ? item.score : item;
                    const date = typeof item === 'object' ? item.date : null;
                    
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="relative w-full">
                          <div
                            className="w-full bg-linear-to-t from-cyan-500/20 to-cyan-500 rounded-t-sm relative transition-all duration-300 group-hover:from-cyan-400/30 group-hover:to-cyan-400"
                            style={{ height: `${height}%` }}
                          >
                            <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity rounded-t-sm" />
                          </div>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Score: {height}
                            {date && <div className="text-slate-400 text-[10px]">{new Date(date).toLocaleDateString()}</div>}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F'][i] || i}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Side Panel */}
              <div className="space-y-4">
                {/* Issues Card */}
                <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Critical Issues
                    {issues.length > 0 && (
                      <span className="ml-auto text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                        {issues.length}
                      </span>
                    )}
                  </h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                    {issues.length > 0 ? issues.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                        <span className="text-slate-300 truncate flex-1 mr-2">{item.title || item.issue}</span>
                        <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                          item.severity === 'High' || item.priority === 'high' 
                            ? 'bg-red-500/20 text-red-400' 
                            : item.severity === 'Medium' || item.priority === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {item.severity || item.priority || 'Low'}
                        </span>
                      </div>
                    )) : (
                      <div className="text-center py-4 text-slate-500 text-sm">
                        No critical issues found
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
                  <h4 className="text-white font-semibold mb-4">Core Web Vitals</h4>
                  <div className="space-y-3">
                    {[
                      { 
                        name: 'LCP', 
                        value: vitals.lcp || '1.2s', 
                        good: parseFloat((vitals.lcp || '1.2s').replace('s', '')) <= 2.5 
                      },
                      { 
                        name: 'FID', 
                        value: vitals.fid || '12ms', 
                        good: parseInt(vitals.fid || '12') <= 100 
                      },
                      { 
                        name: 'CLS', 
                        value: vitals.cls || '0.02', 
                        good: parseFloat(vitals.cls || '0.02') <= 0.1 
                      },
                      { 
                        name: 'TTFB', 
                        value: vitals.ttfb || '0.8s', 
                        good: parseFloat((vitals.ttfb || '0.8s').replace('s', '')) <= 0.8 
                      },
                    ].map((vital: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-sm font-mono">{vital.name}</span>
                          <div className="group relative">
                            <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-500 cursor-help">?</div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                              {vital.name === 'LCP' && 'Largest Contentful Paint'}
                              {vital.name === 'FID' && 'First Input Delay'}
                              {vital.name === 'CLS' && 'Cumulative Layout Shift'}
                              {vital.name === 'TTFB' && 'Time to First Byte'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${vital.good ? 'text-green-400' : 'text-red-400'}`}>
                            {vital.value}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${vital.good ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-5 border border-cyan-500/20">
                  <h4 className="text-white font-semibold mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300 transition-colors text-center">
                      Run New Audit
                    </button>
                    <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300 transition-colors text-center">
                      Export Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </section>
  );
}