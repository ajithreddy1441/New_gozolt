import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Cog, Snowflake, Luggage, Check, Info, Loader2 } from 'lucide-react';

const Cars = ({ carsData = [], loading = false, searchParams = {} }) => {
  const navigate = useNavigate();
  
  // Transform API data to match the expected format
  const transformCarData = (apiCar) => {
    // Format price with two decimal places
    const formatPrice = (price) => {
      if (typeof price === 'number') {
        return price.toFixed(2);
      }
      return price;
    };

    return {
      id: apiCar.id,
      model: apiCar.model_type || apiCar.name || "Car",
      category: apiCar.category || "Standard",
      seats: apiCar.seats || 4,
      transmission: apiCar.transmission_type || "Automatic",
      airCondition: apiCar.air_conditioning ? "A/C" : "No A/C",
      bags: (apiCar.small_suitcase || 0) + (apiCar.large_suitcase || 0),
      imageUrl: apiCar.car_image || null,
      price: formatPrice(apiCar.price),
      originalPrice: formatPrice(apiCar.original_price),
      pricePerDay: formatPrice(apiCar.price / (apiCar.rental_days || 1)),
      currency: apiCar.location?.currency || "€",
      features: apiCar.features || [],
      supplier: apiCar.vendor?.first_name || "ityGo",
      guaranteedModel: apiCar.guaranteed_model,
      similarText: apiCar.guaranteed_model ? "Guaranteed Model" : "Or similar",
      // Additional API fields
      drive: apiCar.drive,
      steering: apiCar.steering,
      qty_vehicle: apiCar.qty_vehicle,
      user_id: apiCar.user_id
    };
  };

  const cars = carsData.map(transformCarData);

  const handleViewDeal = (car) => {
    navigate('/addons', {
      state: {
        carId: car.id,
        searchParams: {
          location: searchParams.location || 'Malta International Airport',
          pickup_date: searchParams.pickupDate,
          return_date: searchParams.returnDate,
          pickup_time: searchParams.pickupTime,
          return_time: searchParams.returnTime,
          days: calculateRentalDays(searchParams.pickupDate, searchParams.returnDate)
        },
        carData: car // Pass the full car data for immediate display
      }
    });
  };

  // Calculate rental days from dates
  const calculateRentalDays = (pickupDate, returnDate) => {
    if (!pickupDate || !returnDate) return 1;
    
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    
    // Calculate difference in days
    const diffTime = Math.abs(returnD - pickup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays || 1;
  };

  const CarCard = ({ car }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 w-full">
      {/* Top Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{car.model}</h3>
            <p className="text-sm text-gray-600">{car.similarText} - {car.category}</p>
          </div>
          <button className="text-[#0174b7] hover:text-[#005f8c]">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Car Image */}
      <div className="w-full h-28 sm:h-32 md:h-40 bg-gray-50 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
        <img 
          src={car.imageUrl || '/car-img.png'} 
          alt={car.model}
          className="w-full h-full object-contain"
          loading="lazy"
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

      {/* Features List */}
      {car.features && car.features.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <div className="text-sm text-gray-700">
            {car.features.map((feature, index) => (
              <div key={index} className="mb-1">
                • {feature}
              </div>
            ))}
          </div>
        </div>
      )}

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

        <button 
          onClick={() => handleViewDeal(car)}
          className="w-full bg-[#0174b7] hover:bg-[#005f8c] text-white font-semibold py-2 rounded-lg transition-colors duration-200"
        >
          View Deal
        </button>
        
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-50 pb-6">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
          <div className="flex justify-center items-center py-20">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#0174b7]" />
              <span className="text-lg text-gray-600">Searching for cars...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="bg-gray-50 pb-6">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or dates.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pb-6">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;