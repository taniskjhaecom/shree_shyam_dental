import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  HeartPulse,
  BookOpen,
  MessageSquare,
  Image as ImageIcon,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Phone,
  Eye,
  X,
  FileText,
  Stethoscope,
  ExternalLink,
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import Loader from '../../components/common/Loader';

const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [viewingAppt, setViewingAppt] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/dashboard/stats');
      if (res.data.success) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setUpdatingId(appointmentId);
      const res = await apiClient.put(`/appointments/${appointmentId}`, { status: newStatus });
      if (res.data.success) {
        if (viewingAppt && viewingAppt._id === appointmentId) {
          setViewingAppt(res.data.data);
        }
        fetchStats();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const cleanPhone = (phone) => (phone || '').replace(/[^0-9+]/g, '');
  const cleanWhatsApp = (phone) => (phone || '').replace(/[^0-9]/g, '');

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not Specified';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      Pending: {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
      },
      Confirmed: {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
      },
      Completed: {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
      },
      Cancelled: {
        bg: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500',
      },
    };
    const c = config[status] || config.Pending;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${c.bg}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        <span>{status}</span>
      </span>
    );
  };

  if (loading) {
    return <Loader message="Loading dashboard analytics..." />;
  }

  const stats = dashboardData?.stats || {};
  const recentAppointments = dashboardData?.recentAppointments || [];
  const recentMessages = dashboardData?.recentMessages || [];

  const statCards = [
    {
      title: 'Total Appointments',
      value: stats.totalAppointments || 0,
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      iconBg: 'bg-blue-600 text-white',
      link: '/admin/appointments',
    },
    {
      title: 'Pending Requests',
      value: stats.pendingAppointments || 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      iconBg: 'bg-amber-500 text-white',
      link: '/admin/appointments?status=Pending',
    },
    {
      title: 'Confirmed Slots',
      value: stats.confirmedAppointments || 0,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      iconBg: 'bg-emerald-600 text-white',
      link: '/admin/appointments?status=Confirmed',
    },
    {
      title: 'Active Treatments',
      value: stats.totalTreatments || 16,
      icon: HeartPulse,
      color: 'bg-teal-50 text-teal-600 border-teal-100',
      iconBg: 'bg-teal-600 text-white',
      link: '/admin/treatments',
    },
    {
      title: 'Published Blogs',
      value: stats.publishedBlogs || 0,
      icon: BookOpen,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      iconBg: 'bg-purple-600 text-white',
      link: '/admin/blogs',
    },
    {
      title: 'Patient Reviews',
      value: stats.totalTestimonials || 0,
      icon: MessageSquare,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-100',
      iconBg: 'bg-cyan-600 text-white',
      link: '/admin/testimonials',
    },
  ];

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            Hospital Overview & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time appointment bookings, inquiries, and content management.
          </p>
        </div>

        <Link
          to="/admin/appointments"
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Manage All Appointments</span>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              to={card.link}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-200 transition-all hover:-translate-y-0.5 block group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500 font-semibold">{card.title}</span>
                <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center shadow-xs`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className="font-heading font-extrabold text-2xl text-slate-900 block">
                {card.value}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Recent Appointments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-lg text-slate-900">Recent Appointment Bookings</h2>
            <p className="text-xs text-slate-500">Latest online requests submitted through website</p>
          </div>
          <Link
            to="/admin/appointments"
            className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Patient</th>
                <th className="py-3 px-4 font-semibold">Treatment</th>
                <th className="py-3 px-4 font-semibold">Preferred Slot</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{appt.fullName}</span>
                      <span className="text-slate-500 text-[11px] block">{appt.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {appt.treatmentRequired}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="block font-medium text-slate-800">{appt.preferredDate}</span>
                      <span className="text-[11px] text-slate-500">{appt.preferredSlot}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          appt.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : appt.status === 'Completed'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : appt.status === 'Cancelled'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingAppt(appt)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-teal-700 hover:border-teal-300 hover:bg-teal-50/60 transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1.5 font-semibold text-xs"
                          title="Show Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-600" />
                          <span>Show Details</span>
                        </button>
                        <select
                          disabled={updatingId === appt._id}
                          value={appt.status}
                          onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                          className="bg-white border border-slate-300 text-xs rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 cursor-pointer shadow-2xs font-medium"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">
                    No appointments booked yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Show Details Modal (No Email) */}
      {viewingAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-6 shadow-2xl text-left my-8 animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xl border border-teal-200 shadow-2xs">
                  {viewingAppt.fullName?.charAt(0)?.toUpperCase() || 'P'}
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-xl text-slate-900">
                    {viewingAppt.fullName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(viewingAppt.status)}
                    <span className="text-[11px] text-slate-400">
                      Booked: {formatDateTime(viewingAppt.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setViewingAppt(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient & Booking Details Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Contact Card (No Email) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  Contact Information
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Mobile Number</span>
                    <a
                      href={`tel:${cleanPhone(viewingAppt.phone)}`}
                      className="font-bold text-slate-900 text-base hover:text-teal-600 flex items-center gap-1.5 mt-0.5"
                    >
                      <Phone className="w-4 h-4 text-teal-600" />
                      <span>{viewingAppt.phone}</span>
                    </a>
                  </div>

                  {/* Contact Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${cleanPhone(viewingAppt.phone)}`}
                      className="px-3.5 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-2xs hover:bg-teal-700 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/${cleanWhatsApp(viewingAppt.phone)}?text=${encodeURIComponent(
                        `Hello ${viewingAppt.fullName}, this is Shree Shyam Dental Hospital regarding your appointment.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-2xs hover:bg-emerald-700 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Booking Slot Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  Appointment Slot
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Treatment Requested</span>
                    <span className="font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded text-xs inline-block mt-0.5">
                      {viewingAppt.treatmentRequired || 'General Consultation'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Preferred Date</span>
                    <span className="font-semibold text-slate-900 text-sm">
                      {formatDate(viewingAppt.preferredDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Scheduled Slot</span>
                    <span className="font-medium text-slate-800">
                      {viewingAppt.preferredSlot || 'Any Available Slot'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Symptoms / Notes */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-1.5">
              <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                Patient's Symptoms / Notes
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {viewingAppt.notes ? (
                  viewingAppt.notes
                ) : (
                  <span className="text-slate-400 italic">No special symptoms or notes provided.</span>
                )}
              </p>
            </div>

            {/* Doctor / Admin Clinical Notes */}
            {viewingAppt.adminNotes && (
              <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/70 space-y-1.5">
                <h4 className="font-bold text-xs text-teal-900 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                  Doctor / Admin Notes
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {viewingAppt.adminNotes}
                </p>
              </div>
            )}

            {/* Quick Status Update inside Modal */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-700 block">Change Booking Status</span>
                <span className="text-[11px] text-slate-500">Update live status for this patient</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  disabled={updatingId === viewingAppt._id}
                  value={viewingAppt.status}
                  onChange={(e) => handleStatusChange(viewingAppt._id, e.target.value)}
                  className="bg-white border border-slate-300 text-xs font-semibold rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-2xs"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Link
                to="/admin/appointments"
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold inline-flex items-center gap-1.5"
              >
                <span>Manage in Full Appointments Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setViewingAppt(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-900 transition-colors cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
