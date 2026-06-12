"use client";

import React, { useEffect, useState } from "react";
import { Users, Mail, Eye, Activity, CalendarDays, TrendingUp, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ 
    messages: 0, 
    unreadMessages: 0, 
    views: 0, 
    unique: 0, 
    engagementRate: "0.0" 
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats({
            messages: data.messages,
            unreadMessages: data.unreadMessages,
            views: data.views,
            unique: data.unique,
            engagementRate: data.engagementRate,
          });
          setChartData(data.chartData);
        }
        
        const actRes = await fetch("/api/admin/activity");
        if (actRes.ok) {
          const actData = await actRes.json();
          setActivities(actData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Dashboard Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">Welcome back. Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3 bg-secondary/50 border border-border rounded-full px-4 py-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-medium text-muted-foreground">System Online</span>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-border relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                <Mail size={18} />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={14} className="mr-1" /> +12%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
              <h3 className="text-2xl font-semibold text-foreground mt-1">
                {loading ? "..." : stats.messages}
              </h3>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-border relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                <Eye size={18} />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={14} className="mr-1" /> +4%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Portfolio Views</p>
              <h3 className="text-2xl font-semibold text-foreground mt-1">
                {stats.views.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-border relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center">
                <Users size={18} />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={14} className="mr-1" /> +18%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
              <h3 className="text-2xl font-semibold text-foreground mt-1">
                {stats.unique.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-border relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center">
                <Activity size={18} />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={14} className="mr-1" /> +2%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
              <h3 className="text-2xl font-semibold text-foreground mt-1">
                {stats.engagementRate}%
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 glass-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary" />
                  Traffic Overview
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Views and unique visitors over the past 7 days</p>
              </div>
              <div className="flex items-center gap-2 text-xs bg-secondary/20 dark:bg-secondary/20 rounded-lg p-1 border border-border">
                <button className="px-3 py-1.5 rounded-md bg-secondary/50 dark:bg-secondary/50 text-foreground font-medium">7D</button>
                <button className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors">30D</button>
                <button className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors">YTD</button>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#ffffff20', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#0891b2" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                  <Area type="monotone" dataKey="unique" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorUnique)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions / Status */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl border border-border p-6">
              <h3 className="font-medium text-foreground mb-4">Inbox Status</h3>
              
              <div className="flex items-center justify-between mb-4 bg-primary/5 p-4 rounded-xl border border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-lg text-primary">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Unread Messages</p>
                    <p className="text-xs text-muted-foreground">Requires your attention</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-primary">
                  {loading ? "-" : stats.unreadMessages}
                </span>
              </div>

              <a href="/admin/inbox" className="w-full flex items-center justify-center gap-2 py-2.5 bg-secondary/50 hover:bg-secondary text-foreground rounded-xl transition-colors text-sm font-medium border border-border">
                Go to Inbox
              </a>
            </div>

            <div className="glass-card rounded-2xl border border-border p-6">
              <h3 className="font-medium text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((item, i) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="mt-0.5 text-primary">
                        <Activity size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.description || item.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent activity.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
