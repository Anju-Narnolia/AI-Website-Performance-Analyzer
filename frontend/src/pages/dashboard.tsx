import { Gauge, LineChart, Search, Shield, Users, Zap } from "lucide-react";

// Dashboard Preview Section
export default function DashboardPreview() {
  return (
    <section id="dashboard" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Powerful{' '}
            <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Analytics Dashboard
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Get comprehensive insights with our intuitive dashboard. Track performance metrics, monitor trends, and take action.
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
              <div className="bg-slate-900 rounded-md px-4 py-1.5 text-xs text-slate-500 text-center">
                app.webopt.ai/dashboard
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6 lg:p-8 bg-slate-900">
            {/* Top Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Performance Score', value: '94', color: 'text-green-400', icon: <Gauge className="w-5 h-5" /> },
                { label: 'SEO Score', value: '92', color: 'text-cyan-400', icon: <Search className="w-5 h-5" /> },
                { label: 'Accessibility', value: '88', color: 'text-purple-400', icon: <Users className="w-5 h-5" /> },
                { label: 'Best Practices', value: '96', color: 'text-blue-400', icon: <Shield className="w-5 h-5" /> },
              ].map((stat, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs">{stat.label}</span>
                    {stat.icon}
                  </div>
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-1">+4% from last week</div>
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
                  <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-xs text-slate-300">
                    <option>Last 7 days</option>
                  </select>
                </div>
                {/* Chart Visualization */}
                <div className="h-48 flex items-end gap-2">
                  {[65, 72, 68, 75, 82, 78, 88, 85, 92, 94, 91, 94].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-linear-to-t from-cyan-500/20 to-cyan-500 rounded-t-sm relative group"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity rounded-t-sm" />
                      </div>
                      <span className="text-[10px] text-slate-500">{['M','T','W','T','F','S','S','M','T','W','T','F'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side Panel */}
              <div className="space-y-4">
                {/* Issues Card */}
                <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Critical Issues
                  </h4>
                  <div className="space-y-3">
                    {[
                      { issue: 'Large JavaScript bundles', severity: 'High' },
                      { issue: 'Unoptimized images', severity: 'Medium' },
                      { issue: 'Render-blocking resources', severity: 'High' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{item.issue}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.severity === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {item.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
                  <h4 className="text-white font-semibold mb-4">Core Web Vitals</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'LCP', value: '1.2s', good: true },
                      { name: 'FID', value: '12ms', good: true },
                      { name: 'CLS', value: '0.02', good: true },
                    ].map((vital, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">{vital.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{vital.value}</span>
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                        </div>
                      </div>
                    ))}
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