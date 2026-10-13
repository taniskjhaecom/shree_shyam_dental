import React, { useEffect, useState } from 'react';
import { Mail, Phone, Clock, Trash2, CheckCircle2, Inbox, MessageSquare } from 'lucide-react';
import apiClient from '../../api/apiClient';
import Loader from '../../components/common/Loader';

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/contact');
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await apiClient.put(`/contact/${id}`, { status: newStatus, isRead: true });
      fetchMessages();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      await apiClient.delete(`/contact/${id}`);
      fetchMessages();
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            Contact Form Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review general queries and messages submitted by prospective patients.
          </p>
        </div>

        <span className="text-xs bg-teal-50 text-teal-800 font-bold px-3.5 py-1.5 rounded-xl border border-teal-200">
          Total Inquiries: {messages.length}
        </span>
      </div>

      {loading ? (
        <Loader message="Loading messages..." />
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-6 rounded-2xl bg-white border transition-all ${
                msg.isRead ? 'border-slate-200 shadow-xs' : 'border-teal-300 shadow-sm ring-1 ring-teal-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-base text-slate-900">
                      {msg.fullName}
                    </h3>
                    {!msg.isRead && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                        New
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                    <a href={`tel:${msg.phone}`} className="hover:text-teal-700 flex items-center gap-1 font-medium">
                      <Phone className="w-3 h-3 text-teal-600" />
                      {msg.phone}
                    </a>
                    {msg.email && (
                      <a href={`mailto:${msg.email}`} className="hover:text-teal-700 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-cyan-600" />
                        {msg.email}
                      </a>
                    )}
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={msg.status}
                    onChange={(e) => handleStatusChange(msg._id, e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-3 space-y-1 text-xs">
                {msg.subject && (
                  <span className="font-semibold text-teal-800 block">
                    Subject: {msg.subject}
                  </span>
                )}
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-2 shadow-xs">
          <Inbox className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm">No contact inquiries received yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminMessagesPage;
