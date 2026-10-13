import React from 'react';

/**
 * Base Shimmer Skeleton Element
 */
export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`bg-slate-200/80 rounded-xl animate-pulse animate-shimmer relative overflow-hidden ${className}`}
      {...props}
    />
  );
};

/**
 * Single Treatment / Blog / Feature Card Skeleton
 */
export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 animate-pulse">
      {/* Image Thumbnail Placeholder */}
      <div className="w-full h-48 bg-slate-200/80 rounded-xl relative overflow-hidden animate-shimmer" />

      {/* Tag / Category Badge */}
      <div className="w-24 h-5 bg-teal-100/60 rounded-full" />

      {/* Title */}
      <div className="space-y-2">
        <div className="w-3/4 h-6 bg-slate-200 rounded-md" />
        <div className="w-1/2 h-4 bg-slate-200/70 rounded-md" />
      </div>

      {/* Description lines */}
      <div className="space-y-1.5 pt-2">
        <div className="w-full h-3 bg-slate-100 rounded" />
        <div className="w-5/6 h-3 bg-slate-100 rounded" />
        <div className="w-4/6 h-3 bg-slate-100 rounded" />
      </div>

      {/* Footer / CTA Button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="w-20 h-4 bg-slate-200 rounded" />
        <div className="w-24 h-8 bg-teal-100/80 rounded-lg" />
      </div>
    </div>
  );
};

/**
 * Full Page Skeleton (Hero Banner + Cards Grid + CTA Banner)
 * Ideal for Router Suspense Fallbacks and Top-level Route Loading
 */
export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 space-y-10 pb-16 animate-pulse">
      {/* Hero Header Skeleton */}
      <div className="pt-14 pb-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-4">
          <div className="w-36 h-6 bg-teal-100/70 rounded-full" />
          <div className="w-3/4 max-w-xl h-10 bg-slate-200 rounded-xl" />
          <div className="w-2/3 max-w-md h-4 bg-slate-100 rounded-md" />
          <div className="flex gap-3 pt-2">
            <div className="w-32 h-10 bg-teal-200/60 rounded-xl" />
            <div className="w-28 h-10 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter / Search Bar Skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-8 bg-slate-100 rounded-lg" />
            ))}
          </div>
          <div className="w-48 h-9 bg-slate-100 rounded-lg" />
        </div>

        {/* 6-Card Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <CardSkeleton key={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Treatment Detail Page Skeleton
 */
export const TreatmentDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-16 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb skeleton */}
        <div className="w-48 h-4 bg-slate-200 rounded" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main 8-col content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="w-32 h-6 bg-teal-100 rounded-full" />
            <div className="w-3/4 h-10 bg-slate-300 rounded-xl" />
            <div className="w-full h-80 bg-slate-200 rounded-2xl" />
            <div className="space-y-3 pt-4">
              <div className="w-full h-4 bg-slate-200 rounded" />
              <div className="w-5/6 h-4 bg-slate-200 rounded" />
              <div className="w-4/6 h-4 bg-slate-200 rounded" />
            </div>

            {/* Benefits 4-grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-white border border-slate-100 space-y-2">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg" />
                  <div className="w-1/2 h-5 bg-slate-200 rounded" />
                  <div className="w-full h-3 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar 4-col sticky card */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
              <div className="w-1/2 h-6 bg-slate-300 rounded" />
              <div className="w-full h-12 bg-slate-100 rounded-xl" />
              <div className="w-full h-12 bg-slate-100 rounded-xl" />
              <div className="w-full h-12 bg-teal-500/40 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Blog Article Detail Skeleton
 */
export const BlogDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-16 animate-pulse">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="w-36 h-4 bg-slate-200 rounded" />
        <div className="w-28 h-6 bg-teal-100 rounded-full" />
        <div className="w-full h-12 bg-slate-300 rounded-xl" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200" />
          <div className="space-y-1">
            <div className="w-24 h-4 bg-slate-200 rounded" />
            <div className="w-16 h-3 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="w-full h-96 bg-slate-200 rounded-2xl" />
        <div className="space-y-3 pt-4">
          <div className="w-full h-4 bg-slate-200 rounded" />
          <div className="w-full h-4 bg-slate-200 rounded" />
          <div className="w-5/6 h-4 bg-slate-200 rounded" />
          <div className="w-4/6 h-4 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
};

/**
 * Doctor Profile Skeleton
 */
export const DoctorSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 h-80 bg-slate-200 rounded-2xl" />
      <div className="lg:col-span-7 space-y-4">
        <div className="w-28 h-6 bg-teal-100 rounded-full" />
        <div className="w-3/4 h-8 bg-slate-300 rounded-lg" />
        <div className="w-1/2 h-5 bg-teal-600/30 rounded" />
        <div className="space-y-2 pt-2">
          <div className="w-full h-4 bg-slate-100 rounded" />
          <div className="w-full h-4 bg-slate-100 rounded" />
          <div className="w-4/5 h-4 bg-slate-100 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="h-16 bg-slate-50 rounded-xl" />
          <div className="h-16 bg-slate-50 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default {
  Skeleton,
  CardSkeleton,
  PageSkeleton,
  TreatmentDetailSkeleton,
  BlogDetailSkeleton,
  DoctorSkeleton,
};
