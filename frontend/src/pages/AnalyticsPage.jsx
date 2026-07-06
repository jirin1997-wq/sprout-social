import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  const [topPosts, setTopPosts] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topRes, platformRes] = await Promise.all([
          axios.get('http://localhost:3000/api/analytics/top-posts'),
          axios.get('http://localhost:3000/api/analytics/platform-breakdown')
        ]);

        setTopPosts(topRes.data);
        setPlatformData(platformRes.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="space-y-6">
      {/* Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Platform Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformData}
                dataKey="impressions"
                nameKey="platform"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Performance by Platform</h3>
          <div className="space-y-3">
            {platformData.map((platform, index) => (
              <div key={platform.platform} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium capitalize">{platform.platform}</span>
                  <span className="text-sm text-gray-600">
                    {platform.impressions || 0} impressions
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-sm text-gray-500">
                  <span>{platform.posts || 0} posts</span>
                  <span>{platform.engagements || 0} engagements</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Posts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="text-green-600" size={20} />
          Top Performing Posts
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Content</th>
                <th className="text-right py-2 px-4">Impressions</th>
                <th className="text-right py-2 px-4">Engagements</th>
                <th className="text-right py-2 px-4">Engagement Rate</th>
              </tr>
            </thead>
            <tbody>
              {topPosts.map(post => {
                const engagementRate = post.impressions
                  ? ((post.engagements / post.impressions) * 100).toFixed(2)
                  : 0;
                return (
                  <tr key={post.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{post.content?.substring(0, 50)}...</td>
                    <td className="text-right py-3 px-4">{post.impressions || 0}</td>
                    <td className="text-right py-3 px-4">{post.engagements || 0}</td>
                    <td className="text-right py-3 px-4 font-medium">{engagementRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
