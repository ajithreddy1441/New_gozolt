import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Cog, Snowflake, Luggage, Check, Info } from 'lucide-react';

const Cars = () => {
  const navigate = useNavigate();
  
  const [selectedLocation] = useState('Malta International Airport');

  const cars = [
    {
      id: 1,
      model: "Fiat Panda",
      category: "Or similar - Small Cars",
      seats: 4,
      transmission: "Automatic",
      airCondition: "A/C",
      bags: 2,
      price: "59.5",
      originalPrice: "77.95",
      pricePerDay: "29.75",
      currency: "€",
      features: [
        "Free Cancellation",
        "Theft Protection", 
        "Free Amendments",
        "Full Insurance"
      ],
      supplier: "ityGo"
    },
    {
      id: 2,
      model: "Fiat Panda",
      category: "Or similar - Small Cars", 
      seats: 4,
      transmission: "Automatic",
      airCondition: "A/C",
      bags: 2,
      price: "59.5",
      originalPrice: "77.95", 
      pricePerDay: "29.75",
      currency: "€",
      features: [
        "Free Cancellation",
        "Theft Protection",
        "Free Amendments", 
        "Full Insurance"
      ],
      supplier: "ityGo"
    },
    {
      id: 3,
      model: "Fiat Panda",
      category: "Or similar - Small Cars",
      seats: 4,
      transmission: "Automatic",
      airCondition: "Air Condition",
      bags: 2,
      price: "59.5",
      originalPrice: "77.95",
      pricePerDay: "29.75", 
      currency: "€",
      features: [
        "Free Cancellation",
        "Theft Protection",
        "Free Amendments",
        "Full Insurance"
      ],
      supplier: "ityGo"
    },
    {
      id: 4,
      model: "Fiat Panda", 
      category: "Or similar - Small Cars",
      seats: 4,
      transmission: "Automatic", 
      airCondition: "A/C",
      bags: 2,
      price: "59.5",
      originalPrice: "77.95",
      pricePerDay: "29.75",
      currency: "€",
      features: [
        "Free Cancellation",
        "Theft Protection",
        "Free Amendments",
        "Full Insurance"
      ],
      supplier: "ityGo"
    },
    {
      id: 5,
      model: "Fiat Panda",
      category: "Or similar - Small Cars",
      seats: 4, 
      transmission: "Automatic",
      airCondition: "A/C",
      bags: 2,
      price: "59.5",
      originalPrice: "77.95",
      pricePerDay: "29.75",
      currency: "€", 
      features: [
        "Free Cancellation",
        "Theft Protection", 
        "Free Amendments",
        "Full Insurance"
      ],
      supplier: "ityGo"
    },
    {
      id: 6,
      model: "Fiat Panda",
      category: "Or similar - Small Cars",
      seats: 4,
      transmission: "Automatic",
      airCondition: "Air Condition", 
      bags: 2,
      price: "59.5",
      originalPrice: "77.95",
      pricePerDay: "29.75",
      currency: "€",
      features: [
        "Free Cancellation", 
        "Theft Protection",
        "Free Amendments",
        "Full Insurance"
      ],
      supplier: "ityGo"
    },
    {
      id: 7,
      model: "Fiat Panda",
      category: "Or similar - Small Cars",
      seats: 4,
      transmission: "Automatic",
      airCondition: "A/C",
      bags: 2,
      price: "59.5",
      originalPrice: "77.95",
      pricePerDay: "29.75",
      currency: "€",
      features: [
        "Free Cancellation",
        "Theft Protection", 
        "Free Amendments",
        "Full Insurance"
      ],
      supplier: "ityGo"
    },
    {
      id: 8,
      model: "Fiat Panda",
      category: "Or similar - Small Cars", 
      seats: 4,
      transmission: "Automatic",
      airCondition: "A/C",
      bags: 2,
      price: "59.5",
      originalPrice: "77.95", 
      pricePerDay: "29.75",
      currency: "€",
      features: [
        "Free Cancellation",
        "Theft Protection",
        "Free Amendments", 
        "Full Insurance"
      ],
      supplier: "ityGo"
    },
    {
      id: 9,
      model: "Fiat Panda",
      category: "Or similar - Small Cars",
      seats: 4,
      transmission: "Automatic",
      airCondition: "A/C",
      bags: 2,
      price: "59.5",
      originalPrice: "77.95",
      pricePerDay: "29.75", 
      currency: "€",
      features: [
        "Free Cancellation",
        "Theft Protection",
        "Free Amendments",
        "Full Insurance"
      ],
      supplier: "ityGo"
    },
    {
      id: 10,
      model: "Fiat Panda", 
      category: "Or similar - Small Cars",
      seats: 4,
      transmission: "Automatic", 
      airCondition: "A/C",
      bags: 2,
      price: "59.5",
      originalPrice: "77.95",
      pricePerDay: "29.75",
      currency: "€",
      features: [
        "Free Cancellation",
        "Theft Protection",
        "Free Amendments",
        "Full Insurance"
      ],
      supplier: "ityGo"
    },
    {
      id: 11,
      model: "Fiat Panda",
      category: "Or similar - Small Cars",
      seats: 4, 
      transmission: "Automatic",
      airCondition: "A/C",
      bags: 2,
      price: "59.5",
      originalPrice: "77.95",
      pricePerDay: "29.75",
      currency: "€", 
      features: [
        "Free Cancellation",
        "Theft Protection", 
        "Free Amendments",
        "Full Insurance"
      ],
      supplier: "ityGo"
    },
    {
      id: 12,
      model: "Fiat Panda",
      category: "Or similar - Small Cars",
      seats: 4,
      transmission: "Automatic",
      airCondition: "A/C", 
      bags: 2,
      price: "59.5",
      originalPrice: "77.95",
      pricePerDay: "29.75",
      currency: "€",
      features: [
        "Free Cancellation", 
        "Theft Protection",
        "Free Amendments",
        "Full Insurance"
      ],
      supplier: "ityGo"
    }
  ];

  const handleViewDeal = (car) => {
    navigate('/Addons', { 
      state: { 
        selectedCar: car,
        pickupLocation: selectedLocation
      } 
    });
  };

  const CarCard = ({ car }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 w-full">
      {/* Top Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{car.model}</h3>
            <p className="text-sm text-gray-600">{car.category}</p>
          </div>
          <button className="text-[#0174b7] hover:text-[#005f8c]">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="w-full h-28 sm:h-32 md:h-40 bg-gray-50 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
          <img 
            src="/car-img.png" 
            alt={car.model}
            className="w-full h-full object-contain"
          />
        </div>

      {/* Middle Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{car.seats} seats</span>
          </div>
          <div className="flex items-center gap-2">
            <Cog className="w-4 h-4 text-gray-500" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <Snowflake className="w-4 h-4 text-gray-500" />
            <span>{car.airCondition}</span>
          </div>
          <div className="flex items-center gap-2">
            <Luggage className="w-4 h-4 text-gray-500" />
            <span>{car.bags} Bags</span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-red-600 text-sm line-through">{car.originalPrice} {car.currency}</div>
            <div className="text-xl font-bold">{car.price} {car.currency}</div>
            <div className="text-xs text-gray-500">Price per day: {car.pricePerDay} {car.currency}</div>
          </div>
          <div className="bg-orange-100 px-2 py-1 rounded text-orange-600 text-xs font-bold">
            {car.supplier.substring(0, 3).toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 text-xs text-gray-700 mb-4">
          {car.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-1">
              <Check className="w-3 h-3 text-green-500 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => handleViewDeal(car)}
          className="w-full bg-[#0174b7] hover:bg-[#005f8c] text-white font-semibold py-2 rounded-lg transition-colors duration-200"
        >
          View Deal
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 pb-6">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;