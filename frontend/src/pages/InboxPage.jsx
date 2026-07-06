import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Check, X } from 'lucide-react';

export default function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/messages/inbox');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await axios.put(`http://localhost:3000/api/messages/${messageId}/read`);
      fetchMessages();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Message List */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold">Messages</h3>
            <p className="text-sm text-gray-500">{messages.length} new messages</p>
          </div>

          <div className="divide-y max-h-96 overflow-y-auto">
            {messages.map(message => (
              <button
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                  selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <MessageCircle size={16} className="mt-1 flex-shrink-0 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{message.sender_name}</p>
                    <p className="text-xs text-gray-500 truncate">{message.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{message.platform}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message Detail */}
      <div className="lg:col-span-2">
        {selectedMessage ? (
          <div className="bg-white rounded-lg shadow p-6">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{selectedMessage.sender_name}</h3>
                  <p className="text-sm text-gray-500">
                    From {selectedMessage.account_name} • {selectedMessage.platform}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedMessage.status === 'new'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedMessage.status}
                </span>
              </div>
            </div>

            {/* Message Content */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900">{selectedMessage.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(selectedMessage.created_at).toLocaleString()}
              </p>
            </div>

            {/* Sentiment if available */}
            {selectedMessage.sentiment && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Sentiment:</span>{' '}
                  <span className={`capitalize ${
                    selectedMessage.sentiment === 'positive'
                      ? 'text-green-600'
                      : selectedMessage.sentiment === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {selectedMessage.sentiment}
                  </span>
                </p>
              </div>
            )}

            {/* Quick Reply */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Reply</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                rows="3"
                placeholder="Type your reply..."
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleMarkAsRead(selectedMessage.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Check size={16} /> Mark as Read
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
            <p>Select a message to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
