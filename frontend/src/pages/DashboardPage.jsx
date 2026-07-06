import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, MessageSquare, Eye } from 'lucide-react';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, perfRes] = await Promise.all([
          axios.get('http://localhost:3000/api/analytics/dashboard'),
          axios.get('http://localhost:3000/api/analytics/performance?days=30')
        ]);

        setMetrics(metricsRes.data);
        setPerformanceData(perfRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Followers"
          value={metrics?.totalFollowers || 0}
          icon={<Users className="text-blue-600" size={24} />}
        />
        <MetricCard
          title="Total Impressions"
          value={metrics?.totalImpressions || 0}
          icon={<Eye className="text-green-600" size={24} />}
        />
        <MetricCard
          title="Total Engagements"
          value={metrics?.totalEngagements || 0}
          icon={<MessageSquare className="text-purple-600" size={24} />}
        />
        <MetricCard
          title="Engagement Rate"
          value={`${(metrics?.avgEngagementRate || 0).toFixed(2)}%`}
          icon={<TrendingUp className="text-orange-600" size={24} />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Trend (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="impressions" stroke="#3b82f6" />
              <Line type="monotone" dataKey="engagements" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Posts Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Posts Published</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="posts_count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Connected Accounts</p>
            <p className="text-2xl font-bold">{metrics?.totalAccounts || 0}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Posts</p>
            <p className="text-2xl font-bold">{metrics?.totalPosts || 0}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Avg Engagement</p>
            <p className="text-2xl font-bold">{(metrics?.avgEngagementRate || 0).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-start gap-4">
      <div className="flex-1">
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      {icon}
    </div>
  );
}
