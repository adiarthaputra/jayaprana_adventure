import React from 'react';

const PackageCard = ({ packageData }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-60 overflow-hidden group">
        <img 
          src={packageData.image} 
          alt={packageData.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-xs shadow-md">
          Promo
        </div>
      </div>
      
      <div className="p-6 text-left flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{packageData.title}</h3>
        
        <div className="flex items-center gap-3 mb-4">
          <span className="text-gray-400 line-through text-sm">{packageData.originalPrice}</span>
          <span className="text-xl font-bold text-emerald-600">{packageData.discountedPrice}</span>
        </div>

        {/* INI DIA KONTEN DETAIL YANG SEMPAT HILANG */}
        <ul className="space-y-2 mb-6 flex-1">
          {packageData.details && packageData.details.map((detail, index) => (
            <li key={index} className="flex items-start text-sm text-gray-600">
              <span className="text-emerald-500 mr-2">✔</span>
              {detail}
            </li>
          ))}
        </ul>
        
        {/* Tombol yang sudah TANPA target="_blank" */}
        <div className="mt-auto">
          <a 
            href={packageData.moreInfoUrl} 
            className="block w-full text-center bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold py-3 px-4 rounded-lg transition"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;