import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Save,
  Building2,
  Phone,
  Mail,
  Share2,
  CheckCircle2,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useSettings } from '../../context/SettingsContext';

const AdminSettingsPage = () => {
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const { register, handleSubmit, reset } = useForm();

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/settings');
      if (res.data.success && res.data.data) {
        const s = res.data.data;
        reset({
          clinicName: s.clinicName || '',
          phone: s.phone || '',
          secondaryPhone: s.secondaryPhone || '',
          whatsapp: s.whatsapp || '',
          email: s.email || '',

          // Social Links
          'socialLinks.facebook': s.socialLinks?.facebook || '',
          'socialLinks.instagram': s.socialLinks?.instagram || '',
          'socialLinks.youtube': s.socialLinks?.youtube || '',
          'socialLinks.linkedin': s.socialLinks?.linkedin || '',
          'socialLinks.twitter': s.socialLinks?.twitter || '',
        });
      }
    } catch (err) {
      setErrorMsg('Failed to load settings from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const onSubmit = async (formData) => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        clinicName: formData.clinicName,
        phone: formData.phone,
        secondaryPhone: formData.secondaryPhone,
        whatsapp: formData.whatsapp,
        email: formData.email,

        socialLinks: {
          facebook: formData['socialLinks.facebook'],
          instagram: formData['socialLinks.instagram'],
          youtube: formData['socialLinks.youtube'],
          linkedin: formData['socialLinks.linkedin'],
          twitter: formData['socialLinks.twitter'],
        },
      };

      const res = await apiClient.put('/settings', payload);
      if (res.data.success) {
        setSuccessMsg('Settings updated successfully!');
        await refreshSettings();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res.data.message || 'Failed to update settings');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error updating clinic settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Loading clinic settings...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General Info', icon: Building2 },
    { id: 'social', label: 'Social Media', icon: Share2 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-slate-900">Hospital Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure clinic contact info and social media links.
          </p>
        </div>
        <Link
          to="/admin/profile"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors shadow-2xs"
        >
          <UserCheck className="w-4 h-4 text-teal-600" />
          <span>Admin Profile &amp; Password</span>
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tab 1: General Info */}
        {activeTab === 'general' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="font-heading font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
              General Clinic Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital / Clinic Name
                </label>
                <input
                  type="text"
                  {...register('clinicName')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Phone
                </label>
                <input
                  type="text"
                  {...register('phone')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Secondary Phone (Optional)
                </label>
                <input
                  type="text"
                  {...register('secondaryPhone')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  {...register('whatsapp')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Social Links */}
        {activeTab === 'social' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="font-heading font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
              Social Media Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram URL</label>
                <input
                  type="url"
                  {...register('socialLinks.instagram')}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook URL</label>
                <input
                  type="url"
                  {...register('socialLinks.facebook')}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">YouTube URL</label>
                <input
                  type="url"
                  {...register('socialLinks.youtube')}
                  placeholder="https://youtube.com/@..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  {...register('socialLinks.linkedin')}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Twitter / X URL</label>
                <input
                  type="url"
                  {...register('socialLinks.twitter')}
                  placeholder="https://twitter.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/20 transition-all cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving changes...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
