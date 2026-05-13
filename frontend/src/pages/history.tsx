import {
  Search,
  AlertCircle,
  Clock,
  Globe,
  Filter,
  ExternalLink,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { GoGraph } from "react-icons/go";

interface WebsiteHistory {
  id: string;
  url: string;
  name: string;
  createdAt: string;
  scores: {
    performance: number;
    accessibility: number;
    seo: number;
    bestPractices: number;
    testedAt: string;
  } | null;
  metrics: {
    fcp: string,
    lcp: string,
    cls: string,
    tbt: string,
    speedIndex: string,
  } | null;
  reportsCount: number;
}

type SortBy = "score" | "date" | "name";

export default function History() {
  const [websites, setWebsites] = useState<WebsiteHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [filterScore, setFilterScore] = useState<"all" | "excellent" | "good" | "poor">("all");
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleWebsite = (websiteUrl: string) => {
    navigate(`/history/${encodeURIComponent(websiteUrl)}`)
  }
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!login) {
          navigate("/login");
          return;
        }
        const response = await fetch(`${API}/api/dashboard/history`, {
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
        console.log("This is the website data:", result.websites);

        setWebsites(result.websites || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load website history"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [API, navigate, login]);

  // Filter and sort websites
  const processedWebsites = useMemo(() => {
    const filtered = websites.filter((site) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!site.name.toLowerCase().includes(query) && !site.url.toLowerCase().includes(query)) {
          return false;
        }
      }
      // Score filter
      if (site.scores) {
        const avgScore = (site.scores.performance + site.scores.accessibility + site.scores.seo + site.scores.bestPractices) / 4;
        if (filterScore === "excellent" && avgScore < 90) return false;
        if (filterScore === "good" && (avgScore < 70 || avgScore >= 90))
          return false;
        if (filterScore === "poor" && avgScore >= 70) return false;
      }

      return true;
    });
    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      }
      else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      else if (sortBy === "score" && a.scores && b.scores) {
        const aAvg = (a.scores.performance + a.scores.accessibility + a.scores.seo + a.scores.bestPractices) / 4;
        const bAvg = (b.scores.performance + b.scores.accessibility + b.scores.seo + b.scores.bestPractices) / 4;
        return bAvg - aAvg;
      }
      return 0;
    });
    return filtered;
  }, [websites, searchQuery, sortBy, filterScore]);

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };
  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="my-14">
          <h1 className="text-4xl font-bold text-white mb-3">Dashboard</h1>
          <p className="text-slate-400">
            View and manage all your website performance analyses
          </p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <label className="text-sm text-slate-400 mb-2 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by URL or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              >
                <option value="date">Newest First</option>
                <option value="score">Highest Score</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2  flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter by Score
              </label>
              <select
                value={filterScore}
                onChange={(e) =>
                  setFilterScore(
                    e.target.value as
                    | "all"
                    | "excellent"
                    | "good"
                    | "poor"
                  )
                }
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              >
                <option value="all">All Scores</option>
                <option value="excellent">Excellent (90+)</option>
                <option value="good">Good (70-89)</option>
                <option value="poor">Needs Work (&lt;70)</option>
              </select>
            </div>
          </div>
        </div>
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-400">Loading website history...</p>
          </div>
        )}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <h3 className="text-red-400 font-semibold mb-1">Error</h3>
              <p className="text-red-300/80 text-sm">{error}</p>
            </div>
          </div>
        )}
        {!loading && !error && websites.length === 0 && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
            <Globe className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              No websites analyzed yet
            </h3>
            <p className="text-slate-400 mb-6">
              Analyze your first website to get started and see comprehensive
              performance reports
            </p>
            <button
              onClick={() => navigate("/analyze")}
              className="px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25"
            >
              Analyze a Website
            </button>
          </div>
        )}
        {!loading && !error && processedWebsites.length > 0 && (
          <div className="space-y-4">
            {processedWebsites.map((website) => {
              const avgScore = website.scores
                ? (website.scores.performance +
                  website.scores.accessibility +
                  website.scores.seo +
                  website.scores.bestPractices) /
                4
                : 0;
              return (
                <div
                  key={website.createdAt}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Website Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center shrink-0">
                          <Globe className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div className="min-w-0 flex flex-col ">
                          <button onClick={() => {
                            handleWebsite(website.name);
                          }} className="text-lg font-semibold text-white truncate flex items-center gap-1 hover:text-cyan-400 transition-colors cursor-pointer">
                            {website.name}
                            <GoGraph />
                          </button>
                          <a
                            href={website.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-cyan-400 text-sm truncate flex items-center gap-1 transition-colors"
                          >
                            {website.url}
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {website.createdAt ? new Date(website.createdAt).toLocaleString() : "Unknown date"}
                        </span>
                      </div>
                    </div>
                    {website.scores ? (
                      <div className="flex items-center gap-6">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center">
                            <div
                              className={`text-xl font-bold ${getScoreColor(
                                website.scores.performance
                              )}`}
                            >
                              {website.scores.performance.toFixed(0)}
                            </div>
                            <div className="text-xs text-slate-500">
                              Performance
                            </div>
                          </div>
                          <div className="text-center">
                            <div
                              className={`text-xl font-bold ${getScoreColor(
                                website.scores.seo
                              )}`}
                            >
                              {website.scores.seo.toFixed(0)}
                            </div>
                            <div className="text-xs text-slate-500">SEO</div>
                          </div>
                          <div className="text-center">
                            <div
                              className={`text-xl font-bold ${getScoreColor(
                                website.scores.accessibility
                              )}`}
                            >
                              {website.scores.accessibility.toFixed(0)}
                            </div>
                            <div className="text-xs text-slate-500">
                              Accessibility
                            </div>
                          </div>
                          <div className="text-center">
                            <div
                              className={`text-xl font-bold ${getScoreColor(
                                website.scores.bestPractices
                              )}`}
                            >
                              {website.scores.bestPractices.toFixed(0)}
                            </div>
                            <div className="text-xs text-slate-500">
                              Best Practices
                            </div>
                          </div>
                        </div>
                        <div
                          className={`flex items-center justify-center w-20 h-20 rounded-full font-bold text-2xl ${getScoreColor(
                            avgScore
                          )}`}
                        >
                          <span className={getScoreColor(avgScore)}>
                            {avgScore.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 px-6 bg-slate-900/50 rounded-lg">
                        <p className="text-slate-400 text-sm">
                          No analysis results yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}