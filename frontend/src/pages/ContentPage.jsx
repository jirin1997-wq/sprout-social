import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Send } from 'lucide-react';

export default function ContentPage() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState('');
  const [selectedNetworks, setSelectedNetworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const networks = ['facebook', 'instagram', 'twitter', 'linkedin'];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/posts', {
        content,
        accountIds: selectedNetworks,
        status: 'draft'
      });
      setContent('');
      setSelectedNetworks([]);
      setShowModal(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handlePublish = async (postId) => {
    try {
      await axios.post(`http://localhost:3000/api/posts/${postId}/publish`);
      fetchPosts();
    } catch (error) {
      console.error('Error publishing post:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Delete this post?')) {
      try {
        await axios.delete(`http://localhost:3000/api/posts/${postId}`);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Content Calendar</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> New Post
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{post.content.substring(0, 100)}...</p>
                <p className="text-sm text-gray-500 mt-1">
                  Status: <span className="font-semibold">{post.status}</span>
                </p>
                {post.published_at && (
                  <p className="text-sm text-gray-500">
                    Published: {new Date(post.published_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {post.status === 'draft' && (
                  <button
                    onClick={() => handlePublish(post.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Send size={16} /> Publish
                  </button>
                )}
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">Create New Post</h3>

              <form onSubmit={handleCreatePost} className="space-y-4">
                {/* Content */}
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                    rows="4"
                    placeholder="What's on your mind?"
                    required
                  />
                </div>

                {/* Networks */}
                <div>
                  <label className="block text-sm font-medium mb-2">Networks</label>
                  <div className="space-y-2">
                    {networks.map(network => (
                      <label key={network} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedNetworks.includes(network)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedNetworks([...selectedNetworks, network]);
                            } else {
                              setSelectedNetworks(selectedNetworks.filter(n => n !== network));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="capitalize">{network}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
