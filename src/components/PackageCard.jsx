import React from 'react';

export default function PackageCard({ packageData }) {
  // Ambil paket Single (index 0) untuk ditampilkan di Card depan
  const basePackage = packageData.packages && packageData.packages.length > 0 
    ? packageData.packages[0] 
    : null;

  if (!basePackage) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group flex flex-col h-full">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={packageData.image} 
          alt={packageData.title} 
          className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-xs shadow-md">
          Promo
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{packageData.title}</h3>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">Start from</span>
          <span className="text-gray-400 line-through text-sm">{basePackage.originalPrice}</span>
          <span className="text-2xl font-bold text-emerald-600">{basePackage.discountedPrice}</span>
        </div>
        
        <ul className="space-y-2 mb-6 flex-grow">
          {basePackage.details.slice(0, 3).map((item, index) => (
            <li key={index} className="flex items-start text-sm text-gray-600">
              <span className="text-emerald-500 mr-2">✔</span> {item}
            </li>
          ))}
          <li className="text-sm text-gray-400 italic">...and more</li>
        </ul>
        
        <div className="mt-auto">
          {/* Ini sekarang aman karena tautannya sudah dimodifikasi di index.astro */}
          <a 
            href={packageData.moreInfoUrl}
            className="block w-full text-center border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white font-bold py-2 px-4 rounded-lg transition"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
}