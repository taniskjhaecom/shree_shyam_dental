import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Search,
  Trash2,
  Edit3,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Save,
  X,
  RotateCcw,
  Check,
  Eye,
  Stethoscope,
  MessageSquare,
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import Loader from '../../components/common/Loader';
import { useSettings } from '../../context/SettingsContext';

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingAppt, setViewingAppt] = useState(null);
  const [editingAppt, setEditingAppt] = useState(null);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [notification, setNotification] = useState('');
  const { treatments } = useSettings();

  const standardSlots = [
    'Morning (10:00 AM - 01:00 PM)',
    'Afternoon (02:00 PM - 05:00 PM)',
    'Evening (05:00 PM - 08:30 PM)',
    'Any Available Slot',
  ];

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/appointments');
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleQuickStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await apiClient.put(`/appointments/${id}`, { status: newStatus });
      if (res.data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
        );
        if (viewingAppt && viewingAppt._id === id) {
          setViewingAppt((prev) => ({ ...prev, status: newStatus }));
        }
        setNotification(`Status updated to "${newStatus}"`);
        setTimeout(() => setNotification(''), 3500);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingAppt) return;
    setSaving(true);
    try {
      const res = await apiClient.put(`/appointments/${editingAppt._id}`, editingAppt);
      if (res.data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === editingAppt._id ? res.data.data : a))
        );
        if (viewingAppt && viewingAppt._id === editingAppt._id) {
          setViewingAppt(res.data.data);
        }
        setEditingAppt(null);
        setNotification('Appointment details updated successfully.');
        setTimeout(() => setNotification(''), 3500);
      }
    } catch (err) {
      console.error('Error updating appointment:', err);
      alert(err.response?.data?.message || 'Error saving appointment.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this appointment record?')) return;
    try {
      const res = await apiClient.delete(`/appointments/${id}`);
      if (res.data.success) {
        setAppointments((prev) => prev.filter((a) => a._id !== id));
        if (viewingAppt && viewingAppt._id === id) {
          setViewingAppt(null);
        }
        setNotification('Appointment deleted successfully.');
        setTimeout(() => setNotification(''), 3500);
      }
    } catch (err) {
      console.error('Error deleting appointment:', err);
      alert('Failed to delete appointment.');
    }
  };

  const counts = {
    All: appointments.length,
    Pending: appointments.filter((a) => a.status === 'Pending').length,
    Confirmed: appointments.filter((a) => a.status === 'Confirmed').length,
    Completed: appointments.filter((a) => a.status === 'Completed').length,
    Cancelled: appointments.filter((a) => a.status === 'Cancelled').length,
  };

  const filtered = appointments.filter((appt) => {
    const matchesStatus = statusFilter === 'All' || appt.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus;
    const matchesSearch =
      appt.fullName?.toLowerCase().includes(q) ||
      appt.phone?.toLowerCase().includes(q) ||
      appt.treatmentRequired?.toLowerCase().includes(q) ||
      appt.preferredDate?.toLowerCase().includes(q) ||
      appt.preferredSlot?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Confirmed
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
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
    if (!dateStr) return '—';
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

  const cleanPhone = (phone) => (phone || '').replace(/[^0-9+]/g, '');
  const cleanWhatsApp = (phone) => (phone || '').replace(/[^0-9]/g, '');

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-teal-600" />
            <span>Appointment Bookings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage patient appointments, schedule slots, and update booking status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-teal-50 text-teal-800 font-bold px-3.5 py-1.5 rounded-xl border border-teal-200 shadow-2xs">
            Total: {appointments.length}
          </span>
          <span className="text-xs bg-amber-50 text-amber-800 font-bold px-3 py-1.5 rounded-xl border border-amber-200 shadow-2xs">
            Pending: {counts.Pending}
          </span>
          <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
            Confirmed: {counts.Confirmed}
          </span>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification('')}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === status
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{status}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  statusFilter === status
                    ? 'bg-teal-800 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {counts[status] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient, mobile, treatment, slot..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
          />
        </div>
      </div>

      {/* Appointments Table */}
      {loading ? (
        <Loader message="Loading appointments..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-4 px-4 font-bold text-slate-700">Patient Name</th>
                  <th className="py-4 px-4 font-bold text-slate-700">Mobile No.</th>
                  <th className="py-4 px-4 font-bold text-slate-700">Treatment</th>
                  <th className="py-4 px-4 font-bold text-slate-700">Slot</th>
                  <th className="py-4 px-4 font-bold text-slate-700">Status</th>
                  <th className="py-4 px-4 font-bold text-right text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length > 0 ? (
                  filtered.map((appt) => (
                    <tr
                      key={appt._id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* 1. Patient Name (No email) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0 border border-teal-200/60 shadow-2xs">
                            {appt.fullName?.charAt(0)?.toUpperCase() || 'P'}
                          </div>
                          <span className="font-bold text-slate-900 text-sm block">
                            {appt.fullName}
                          </span>
                        </div>
                      </td>

                      {/* 2. Mobile No. */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${cleanPhone(appt.phone)}`}
                            className="inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-teal-600 transition-colors"
                            title="Call patient"
                          >
                            <Phone className="w-3.5 h-3.5 text-teal-600" />
                            <span>{appt.phone}</span>
                          </a>
                          <a
                            href={`https://wa.me/${cleanWhatsApp(appt.phone)}?text=${encodeURIComponent(
                              `Hello ${appt.fullName}, regards from Shree Shyam Dental Hospital concerning your appointment.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="WhatsApp Chat"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* 3. Treatment */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100">
                          <Stethoscope className="w-3 h-3 text-teal-600" />
                          <span>{appt.treatmentRequired || 'General Consultation'}</span>
                        </span>
                      </td>

                      {/* 4. Slot (Date & Slot) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-xs">
                            <Calendar className="w-3.5 h-3.5 text-teal-600" />
                            <span>{formatDate(appt.preferredDate)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{appt.preferredSlot || 'Any Available Slot'}</span>
                          </div>
                        </div>
                      </td>

                      {/* 5. Status (Confirm, Pending, etc. + Quick Dropdown) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <select
                            disabled={updatingId === appt._id}
                            value={appt.status}
                            onChange={(e) => handleQuickStatus(appt._id, e.target.value)}
                            className={`text-xs rounded-xl px-2.5 py-1.5 font-bold tracking-wide border cursor-pointer shadow-2xs transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
                              appt.status === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : appt.status === 'Completed'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : appt.status === 'Cancelled'
                                ? 'bg-rose-50 text-rose-800 border-rose-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="Pending">🟡 Pending</option>
                            <option value="Confirmed">🟢 Confirmed</option>
                            <option value="Completed">🔵 Completed</option>
                            <option value="Cancelled">🔴 Cancelled</option>
                          </select>
                        </div>
                      </td>

                      {/* 6. Action Buttons: Show Details, Edit, Delete */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Show Details Button */}
                          <button
                            onClick={() => setViewingAppt(appt)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors border border-sky-200 cursor-pointer font-semibold text-xs shadow-2xs"
                            title="Show Full Appointment Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Details</span>
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => setEditingAppt(appt)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors border border-teal-200 cursor-pointer font-semibold text-xs shadow-2xs"
                            title="Edit Appointment"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(appt._id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors border border-rose-200 cursor-pointer font-semibold text-xs shadow-2xs"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Calendar className="w-8 h-8 text-slate-300" />
                        <p className="text-sm font-medium">No appointments match your filters.</p>
                        <button
                          onClick={() => {
                            setStatusFilter('All');
                            setSearchQuery('');
                          }}
                          className="text-xs font-semibold text-teal-600 hover:underline cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. SHOW DETAILS MODAL                                          */}
      {/* ============================================================== */}
      {viewingAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-6 shadow-2xl text-left my-8">
            {/* Header */}
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
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient & Booking Details Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Contact Card (No email) */}
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

              {/* Booking Info Card */}
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

            {/* Patient Message / Notes */}
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
            <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/70 space-y-1.5">
              <h4 className="font-bold text-xs text-teal-900 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                Doctor / Admin Notes
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {viewingAppt.adminNotes ? (
                  viewingAppt.adminNotes
                ) : (
                  <span className="text-slate-400 italic">No admin notes added yet. Click "Edit Appointment" to add clinical notes.</span>
                )}
              </p>
            </div>

            {/* Quick Status Update Section */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Quick Change Status
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleQuickStatus(viewingAppt._id, 'Confirmed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewingAppt.status === 'Confirmed'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm / Approve</span>
                </button>

                <button
                  onClick={() => handleQuickStatus(viewingAppt._id, 'Completed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewingAppt.status === 'Completed'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Completed</span>
                </button>

                <button
                  onClick={() => handleQuickStatus(viewingAppt._id, 'Cancelled')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewingAppt.status === 'Cancelled'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel Booking</span>
                </button>

                <button
                  onClick={() => handleQuickStatus(viewingAppt._id, 'Pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewingAppt.status === 'Pending'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Pending</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => handleDelete(viewingAppt._id)}
                className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const toEdit = viewingAppt;
                    setViewingAppt(null);
                    setEditingAppt(toEdit);
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Appointment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingAppt(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. EDIT APPOINTMENT MODAL                                      */}
      {/* ============================================================== */}
      {editingAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl text-left my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    Edit Appointment
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Update patient information, date, slot or status
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingAppt(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              {/* Patient Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAppt.fullName || ''}
                    onChange={(e) =>
                      setEditingAppt({ ...editingAppt, fullName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editingAppt.phone || ''}
                    onChange={(e) =>
                      setEditingAppt({ ...editingAppt, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Treatment */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Treatment Required *
                </label>
                <select
                  value={editingAppt.treatmentRequired || 'General Consultation'}
                  onChange={(e) =>
                    setEditingAppt({ ...editingAppt, treatmentRequired: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 cursor-pointer"
                >
                  <option value="General Consultation">General Consultation</option>
                  {treatments && treatments.length > 0 ? (
                    treatments.map((t) => (
                      <option key={t.slug || t._id} value={t.title}>
                        {t.title}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Dental Implants">Dental Implants</option>
                      <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
                      <option value="E-max Veneers">E-max Veneers</option>
                      <option value="Dental Bridge">Dental Bridge</option>
                      <option value="Digital Smile Design">Digital Smile Design</option>
                      <option value="Composite Bonding">Composite Bonding</option>
                      <option value="Teeth Whitening">Teeth Whitening</option>
                      <option value="Root Canal (RCT)">Root Canal (RCT)</option>
                      <option value="Crowns & Caps">Crowns & Caps</option>
                      <option value="Full-Mouth Rehab">Full-Mouth Rehab</option>
                      <option value="Dentures">Dentures</option>
                      <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                      <option value="Clear Aligners">Clear Aligners</option>
                      <option value="Wisdom Tooth Removal">Wisdom Tooth Removal</option>
                      <option value="Gum Treatment">Gum Treatment</option>
                      <option value="Cleaning & Scaling">Cleaning & Scaling</option>
                    </>
                  )}
                </select>
              </div>

              {/* Date & Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingAppt.preferredDate || ''}
                    onChange={(e) =>
                      setEditingAppt({ ...editingAppt, preferredDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={editingAppt.preferredSlot || standardSlots[0]}
                    onChange={(e) =>
                      setEditingAppt({ ...editingAppt, preferredSlot: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 cursor-pointer"
                  >
                    {standardSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Booking Status *
                </label>
                <select
                  value={editingAppt.status || 'Pending'}
                  onChange={(e) =>
                    setEditingAppt({ ...editingAppt, status: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 cursor-pointer"
                >
                  <option value="Pending">🟡 Pending</option>
                  <option value="Confirmed">🟢 Confirmed</option>
                  <option value="Completed">🔵 Completed</option>
                  <option value="Cancelled">🔴 Cancelled</option>
                </select>
              </div>

              {/* Doctor / Admin Clinical Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Doctor / Admin Clinical Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Confirmed with Dr. Saini for 11:30 AM slot. Patient informed to bring previous dental X-rays."
                  value={editingAppt.adminNotes || ''}
                  onChange={(e) =>
                    setEditingAppt({ ...editingAppt, adminNotes: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAppt(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-70"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointmentsPage;
