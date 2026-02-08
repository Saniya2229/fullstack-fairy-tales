import React from "react";

const SkeletonJobCard = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
            <div className="flex gap-4 items-start mb-4">
                {/* Logo Skeleton */}
                <div className="w-14 h-14 bg-slate-200 rounded-xl shrink-0" />

                <div className="flex-1 space-y-2">
                    {/* Title Skeleton */}
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    {/* Company Name Skeleton */}
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>

                {/* Heart Skeleton */}
                <div className="w-8 h-8 bg-slate-200 rounded-full" />
            </div>

            {/* Tags Skeleton */}
            <div className="flex gap-2 mb-6">
                <div className="w-20 h-6 bg-slate-200 rounded-full" />
                <div className="w-16 h-6 bg-slate-200 rounded-full" />
            </div>

            {/* Footer Skeleton */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="w-24 h-4 bg-slate-200 rounded" />
                <div className="w-20 h-4 bg-slate-200 rounded" />
            </div>
        </div>
    );
};

export default SkeletonJobCard;
