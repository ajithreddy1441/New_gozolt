import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Cog, Snowflake, Luggage, Check, Info, Loader2 } from 'lucide-react';

const Cars = ({ carsData = [], loading = false, searchParams = {} }) => {
  const navigate = useNavigate();

  // Transform API data to match the expected format
  const transformCarData = (apiCar) => {
    const formatPrice = (price) => (typeof price === 'number' ? price.toFixed(2) : price);

    return {
      id: apiCar.id,
      model: apiCar.model_type || apiCar.name || 'Car',
      category: apiCar.category || 'Standard',
      seats: apiCar.seats || 4,
      transmission: apiCar.transmission_type || 'Automatic',
      airCondition: apiCar.air_conditioning ? 'A/C' : 'No A/C',
      bags: (apiCar.small_suitcase || 0) + (apiCar.large_suitcase || 0),
      imageUrl: apiCar.car_image || null,
      price: formatPrice(apiCar.price),
      originalPrice: formatPrice(apiCar.original_price),
      pricePerDay: formatPrice(apiCar.price / (apiCar.rental_days || 1)),
      currency: apiCar.location?.currency || 'EUR',
      features: apiCar.features || [],
      supplier: apiCar.vendor?.first_name || 'ityGo',
      guaranteedModel: apiCar.guaranteed_model,
      similarText: apiCar.guaranteed_model ? 'Guaranteed Model' : 'Or similar',
      // passthroughs
      drive: apiCar.drive,
      steering: apiCar.steering,
      qty_vehicle: apiCar.qty_vehicle,
      user_id: apiCar.user_id,
      location: apiCar.location,
    };
  };

  const cars = carsData.map(transformCarData);

  const calculateRentalDays = (pickupDate, returnDate) => {
    if (!pickupDate || !returnDate) return 1;
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const diffTime = Math.abs(returnD - pickup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const handleViewDeal = (car) => {
    const locationId = car.location?.id || car.location_id || car.user_id;
    const locationName = car.location?.name || car.location?.location || 'Unknown location';

    navigate('/addons', {
      state: {
        carId: car.id,
        searchParams: {
          location: locationName,
          location_id: locationId,
          pickup_date: searchParams.pickupDate || searchParams.pickup_date,
          return_date: searchParams.returnDate || searchParams.return_date,
          pickup_time: searchParams.pickupTime || searchParams.pickup_time,
          return_time: searchParams.returnTime || searchParams.return_time,
          days: calculateRentalDays(
            searchParams.pickupDate || searchParams.pickup_date,
            searchParams.returnDate || searchParams.return_date
          ),
          price: car.price,
        },
        carData: car,
      },
    });
  };

  const CarCard = ({ car }) => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 w-full flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 flex justify-between items-start">
        <div className="min-h-[40px]">
          <h3 className="text-lg font-bold text-gray-900">{car.model}</h3>
          <p className="text-sm text-gray-600">
            {car.similarText} - {car.category}
          </p>
        </div>
        <button className="text-[#0174b7] hover:text-[#005f8c] text-sm font-semibold flex items-center gap-1">
          <Info className="w-4 h-4" />
          Rental Conditions
        </button>
      </div>

      {/* Image */}
      <div className="w-full h-40 bg-white flex items-center justify-center">
        <img
          src={car.imageUrl || '/car-img.png'}
          alt={car.model}
          className="max-h-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Specs row (fixed vertical height to align across cards) */}
      <div className="p-4 grid grid-cols-4 gap-2 text-gray-700 text-sm border-b border-gray-200 min-h-[48px]">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {car.seats} seats
        </div>
        <div className="flex items-center gap-1">
          <Cog className="w-4 h-4" />
          {car.transmission}
        </div>
        <div className="flex items-center gap-1">
          <Snowflake className="w-4 h-4" />
          {car.airCondition}
        </div>
        <div className="flex items-center gap-1">
          <Luggage className="w-4 h-4" />
          {car.bags} Bags
        </div>
      </div>

      {/* Price (left) + Features (right) */}
      <div className="p-4 flex items-start gap-6 border-b border-gray-200 flex-grow">
        {/* Price column (fixed width) */}
        <div className="shrink-0">
          {car.originalPrice && (
            <div className="text-red-600 text-sm line-through">
              {car.originalPrice} {car.currency}
            </div>
          )}
          <div className="text-xl font-bold">
            {car.price} {car.currency}
          </div>
          <div className="text-xs text-gray-500">
            Price per day: {car.pricePerDay} {car.currency}
          </div>
        </div>

        {/* Features column (fixed width, left-aligned text, dedicated icon column) */}
        <div className="ml-auto w-[260px] shrink-0 text-sm text-gray-800">
          {car.features && car.features.length > 0 ? (
            <ul className="space-y-1 leading-5">
              {car.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  {/* fixed 1rem icon column so wrapped text stays aligned */}
                  <span className="inline-flex w-4 justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-4 h-4 text-green-500" />
                  </span>
                  <span className="flex-1 text-left">{feature}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-400 italic">No extra features</div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 flex justify-between items-center">
        <img
          src="/citygo.png" // replace with vendor logo if available
          alt={car.supplier}
          className="h-6 object-contain"
        />
        <button
          onClick={() => handleViewDeal(car)}
          className="px-6 py-2 bg-[#0174b7] hover:bg-[#005f8c] text-white font-semibold rounded-full transition-colors duration-200"
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
        {/* 3 cards per row on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;
