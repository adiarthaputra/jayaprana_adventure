import React from 'react';
// 1. Impor ikon yang ingin digunakan dari react-icons/fa
import { FaMapMarkerAlt } from 'react-icons/fa';

const AddressCard = () => {
  return (
    <div className="address-card"> {/* Disarankan membungkus semuanya dalam satu div induk */}
      <div className="address-heading">
        {/* 2. Tambahkan komponen ikon di sebelah teks */}
        <FaMapMarkerAlt /> 
        <h4>Workshop Address</h4>
      </div>

      <div className="address-body">
        <p>
          Jl. Raya Legian, Kuta, Kec. Kuta, Kabupaten Badung, Bali 80361
        </p>
      </div>
    </div>
  );
};

export default AddressCard;