import React from 'react';

interface CategoryBannerProps {
    label: string;
    backgroundColor: string;
}

const CategoryBanner = ({ label, backgroundColor }: CategoryBannerProps) => {
    return (
        <div
            className={`py-4 px-20 text-white font-titolo text-5xl flex items-center ${backgroundColor} w-full h-40`}
            style={{ backgroundColor }}
        >
            <div className="flex items-center">
                {label}
            </div>
        </div>
    );
};


export default CategoryBanner;
