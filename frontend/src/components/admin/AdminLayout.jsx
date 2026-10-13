import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  HeartPulse,
  Image as ImageIcon,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Settings,
  UserCheck,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronsLeftRight,
  Inbox,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const AdminLayout = () => {
  const { adminUser, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { name: 'Treatments (16)', path: '/admin/treatments', icon: HeartPulse },
    { name: 'Before & After', path: '/admin/before-after', icon: ChevronsLeftRight },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Blogs & Articles', path: '/admin/blogs', icon: BookOpen },
    { name: 'Patient Reviews', path: '/admin/testimonials', icon: MessageSquare },
    { name: 'FAQs CMS', path: '/admin/faqs', icon: HelpCircle },
    { name: 'Contact Inquiries', path: '/admin/messages', icon: Inbox },
    { name: 'Clinic Settings & SEO', path: '/admin/settings', icon: Settings },
    { name: 'My Profile & Security', path: '/admin/profile', icon: UserCheck },
  ];

  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-bold text-sm text-slate-900 block truncate max-w-[140px]">
                  {clinicName}
                </span>
                <span className="text-[10px] text-teal-600 block font-semibold uppercase tracking-wider">
                  Admin CMS Portal
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-600/20'
                      : 'text-slate-600 hover:text-teal-700 hover:bg-teal-50/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-600'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-teal-700 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
              <span>View Live Website</span>
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-heading font-semibold text-sm text-slate-800 hidden sm:inline">
              Hospital Management System
            </span>
          </div>

          <Link
            to="/admin/profile"
            className="flex items-center gap-3 p-1.5 -mr-1.5 rounded-xl hover:bg-slate-100/80 transition-colors group"
            title="Edit Admin Profile & Settings"
          >
            <div className="text-right text-xs">
              <span className="font-bold text-slate-900 group-hover:text-teal-700 block transition-colors">
                {adminUser?.name || 'Administrator'}
              </span>
              <span className="text-teal-600 text-[11px] block font-medium">
                {adminUser?.email || 'admin@shreeshyamdental.com'}
              </span>
            </div>
            {adminUser?.avatar ? (
              <img
                src={adminUser.avatar}
                alt={adminUser.name || 'Admin'}
                className="w-9 h-9 rounded-full object-cover border border-teal-300 shadow-xs ring-2 ring-teal-500/20"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-xs shadow-xs group-hover:bg-teal-600 group-hover:text-white transition-colors">
                {adminUser?.name?.charAt(0) || 'A'}
              </div>
            )}
          </Link>
        </header>

        {/* Dynamic Nested Route Content */}
        <main className="p-4 sm:p-8 flex-1 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
