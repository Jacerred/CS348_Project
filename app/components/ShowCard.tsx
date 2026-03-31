import React from 'react';

interface ShowCardProps {
    title: string;
    viewerCount: number;
    sellerName: string;
    endTime: Date;
}


const ShowCard = ({ title, viewerCount, sellerName, endTime }: ShowCardProps) => {
    return (
        <div className="w-full rounded-lg border bg-white p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600 mb-4">Seller: {sellerName}</p>
            <p className="text-gray-600 mb-4">Viewers: {viewerCount}</p>
            <p className="text-gray-600">Ends at: {endTime.toLocaleString()}</p>
        </div>
    );
};

export default ShowCard;