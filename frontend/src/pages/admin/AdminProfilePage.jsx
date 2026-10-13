import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Camera,
  Save,
  Lock,
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';

const AdminProfilePage = () => {
  const { adminUser, updateUser, refreshProfile } = useAuth();
  const fileInputRef = useRef(null);

  // Profile Information Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState({ public_id: '', secure_url: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Sync state when adminUser loads or updates
  useEffect(() => {
    if (adminUser) {
      setName(adminUser.name || '');
      setEmail(adminUser.email || '');
      setPhone(adminUser.phone || '');
      const secureUrl = adminUser.avatar || adminUser.avatarObj?.secure_url || '';
      const publicId = adminUser.avatarObj?.public_id || '';
      setAvatar({ public_id: publicId, secure_url: secureUrl });
    }
  }, [adminUser]);

  // Handle Image Upload via file input
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileError('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileError('Image file size must be less than 5MB.');
      return;
    }

    setUploadingImage(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'admin_avatars');

      const res = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success && res.data.data?.secure_url) {
        const newAvatarData = {
          public_id: res.data.data.public_id || '',
          secure_url: res.data.data.secure_url,
        };
        setAvatar(newAvatarData);
        setProfileSuccess('Profile image uploaded! Click "Save Profile Changes" to apply.');
      } else {
        setProfileError(res.data.message || 'Failed to upload image.');
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      setProfileError(err.response?.data?.message || 'Error uploading profile image to cloud storage.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Remove Avatar
  const handleRemoveAvatar = () => {
    setAvatar({ public_id: '', secure_url: '' });
    setProfileSuccess('Profile image cleared. Click "Save Profile Changes" to confirm.');
  };

  // Submit Profile Information Changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError('');
    setProfileSuccess('');

    if (!name.trim()) {
      setProfileError('Admin name cannot be empty.');
      setSavingProfile(false);
      return;
    }

    if (!email.trim()) {
      setProfileError('Email address cannot be empty.');
      setSavingProfile(false);
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        avatar: avatar,
      };

      const res = await apiClient.put('/auth/profile', payload);

      if (res.data.success) {
        setProfileSuccess('Admin profile updated successfully!');
        updateUser(res.data.data, res.data.data.token);
        setTimeout(() => setProfileSuccess(''), 4000);
      } else {
        setProfileError(res.data.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Error updating admin profile:', err);
      setProfileError(err.response?.data?.message || 'Error updating profile details.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Submit Password Change
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (!newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation password do not match.');
      return;
    }

    setSavingPassword(true);

    try {
      const payload = {
        currentPassword,
        newPassword,
      };

      const res = await apiClient.put('/auth/profile', payload);

      if (res.data.success) {
        setPasswordSuccess('Password changed successfully! Keep your new password safe.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        updateUser(res.data.data, res.data.data.token);
        setTimeout(() => setPasswordSuccess(''), 5000);
      } else {
        setPasswordError(res.data.message || 'Failed to update password.');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      setPasswordError(err.response?.data?.message || 'Error changing password.');
    } finally {
      setSavingPassword(false);
    }
  };

  // Calculate Password Strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: '', percent: 0, color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { label: 'Weak', percent: 33, color: 'bg-amber-500' };
    if (score <= 4) return { label: 'Medium', percent: 66, color: 'bg-blue-500' };
    return { label: 'Strong', percent: 100, color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
              <Shield className="w-3.5 h-3.5" />
              Account Management
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Admin Profile &amp; Security Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Update your display profile name, profile photo avatar, and manage your account password.
          </p>
        </div>
      </div>

      {/* Admin Profile Overview Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar display */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-white/10 border-2 border-white/30 shadow-lg flex items-center justify-center">
              {avatar.secure_url ? (
                <img
                  src={avatar.secure_url}
                  alt={name || 'Admin'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-heading font-black text-3xl sm:text-4xl text-white">
                  {name ? name.charAt(0).toUpperCase() : 'A'}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-white text-teal-800 shadow-md hover:bg-slate-100 transition-colors cursor-pointer"
              title="Upload new profile photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Quick Info */}
          <div className="text-center sm:text-left flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                {name || 'Administrator'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-teal-500/30 border border-teal-300/40 text-teal-100">
                {adminUser?.role || 'superadmin'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-teal-100 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{email || 'admin@shreeshyamdental.com'}</span>
            </p>

            {adminUser?.lastLogin && (
              <p className="text-[11px] text-teal-200/80 flex items-center justify-center sm:justify-start gap-1">
                <Clock className="w-3 h-3" />
                <span>Last Login: {new Date(adminUser.lastLogin).toLocaleString()}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Form 1 Profile Info & Form 2 Password Security */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Profile Details & Avatar (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Profile Details &amp; Display Photo
              </h3>
              <p className="text-xs text-slate-500">
                Change your display name, contact email, and profile avatar image.
              </p>
            </div>
          </div>

          {/* Alert messages for profile */}
          {profileSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{profileError}</span>
            </div>
          )}

          {/* Avatar Management Subsection */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Display Profile Picture (Avatar)
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 shadow-inner">
                {avatar.secure_url ? (
                  <img
                    src={avatar.secure_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-heading font-black text-xl text-slate-500">
                    {name ? name.charAt(0).toUpperCase() : 'A'}
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload New Photo'}</span>
                  </button>

                  {avatar.secure_url && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  PNG, JPG, or WebP up to 5MB. Automatically optimized with Cloudinary.
                </p>
              </div>
            </div>
          </div>

          {/* Profile Form Inputs */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Display Profile Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Jitendra Saini (Administrator)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                This name is displayed in the admin top bar and audit activity.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Admin Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shreeshyamdental.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Used for administrator authentication and portal access.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Admin Phone / Mobile (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Account Privilege Role
              </label>
              <div className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 flex items-center justify-between">
                <span className="capitalize">{adminUser?.role || 'Super Administrator'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                  Full Access
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Change Password & Security (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Change Password
              </h3>
              <p className="text-xs text-slate-500">
                Update your login password for enhanced security.
              </p>
            </div>
          </div>

          {/* Alert messages for password */}
          {passwordSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Strength:</span>
                    <span className="font-bold text-slate-700">{passwordStrength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${passwordStrength.percent}%` }}
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={savingPassword}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                <span>{savingPassword ? 'Updating Password...' : 'Update Password'}</span>
              </button>
            </div>
          </form>

          {/* Security Notice Box */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-1 text-xs text-amber-900">
            <span className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Security Best Practices
            </span>
            <p className="text-[11px] text-amber-800/90 leading-relaxed">
              Use a combination of uppercase letters, numbers, and symbols. Never share your admin credentials with unauthorized personnel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
