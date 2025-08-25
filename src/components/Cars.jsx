import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Cog, Snowflake, Luggage, Check, Info, Loader2, X, 
  CreditCard, Fuel, Shield 
} from 'lucide-react';

const Cars = ({ carsData = [], loading = false, searchParams }) => {
  const navigate = useNavigate();
  const [showVendorTerms, setShowVendorTerms] = useState(false);
  const [vendorTermsContent, setVendorTermsContent] = useState(null);
  const [vendorTermsLoading, setVendorTermsLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

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
      vendor: apiCar.vendor,
      vendor_id: apiCar.vendor_id,
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

  const handleVendorTermsClick = async (car) => {
    setSelectedCar(car);
    setShowVendorTerms(true);
    setVendorTermsLoading(true);
    
    try {
      // Use the correct path based on your car structure
      const vendorId = car?.vendor?.id || car?.vendor_id;

      if (!vendorId) {
        setVendorTermsContent({ error: "No supplier information available." });
        return;
      }
      
      const res = await fetch(`https://api.rentnrides.com/api/get-vendor-terms/${vendorId}`);
      const data = await res.json();
      
      if (data.success) {
        setVendorTermsContent(data.data);
      } else {
        setVendorTermsContent({ error: "Failed to load rental conditions." });
      }
    } catch (err) {
      setVendorTermsContent({ error: "Failed to load supplier rental terms." });
    }
    setVendorTermsLoading(false);
  };

  const CarCard = ({ car }) => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 w-full flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 flex justify-between items-start min-h-32">
        <div className="min-h-[40px]">
          <h3 className="text-lg font-bold text-gray-900">{car.model}</h3>
          <p className="text-sm text-gray-600">
            {car.similarText} - {car.category}
          </p>
        </div>
        <button 
          className="text-[#0174b7] hover:text-[#005f8c] text-sm font-semibold flex items-center gap-1"
          onClick={() => handleVendorTermsClick(car)}
        >
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
      <div className="p-4 flex items-start justify-center flex-col gap-4 border-b border-gray-200">
        {/* Price column (fixed width) */}
        <div className="flex items-start justify-start flex-col w-full">
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
        <div className="w-full text-sm text-gray-800 min-h-[5.7rem]">
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
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
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
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
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
    <>
      <div className="bg-gray-50 pb-6">
        <div className="w-full max-w-7xl mx-auto lg:px-0">
          {/* 3 cards per row on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </div>

      {/* Vendor Terms Modal */}
      {showVendorTerms && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-[#FFC72C] text-white p-4 rounded-t-lg flex justify-between items-center">
              <h2 className="text-xl font-bold">RENTAL CONDITIONS</h2>
              <button 
                onClick={() => setShowVendorTerms(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {vendorTermsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#0174b7]" />
                </div>
              ) : vendorTermsContent?.error ? (
                <div className="text-red-600 text-center py-12">{vendorTermsContent.error}</div>
              ) : vendorTermsContent ? (
                <>
                  {/* Supplier Info */}
                  <div className="mb-6 flex items-center gap-3">
                    {vendorTermsContent.vendor?.profile_image && (
                      <img 
                        src={vendorTermsContent.vendor.profile_image} 
                        alt={vendorTermsContent.vendor.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Supplier: {vendorTermsContent.vendor?.username || 'Unknown'}</h3>
                    </div>
                  </div>

                  {/* Age Requirements */}
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Age Requirements
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="font-semibold min-w-[120px]">Young Drivers:</span>
                        <span>
                          {vendorTermsContent.rules?.young_driver === "Allowed" ? "Allowed" : "Not allowed"}
                          {vendorTermsContent.rules?.yad_driver_minimum_age && 
                            ` (Age ${vendorTermsContent.rules.yad_driver_minimum_age}-${vendorTermsContent.rules.yad_driver_maximum_age})`
                          }
                          {vendorTermsContent.rules?.yad_fee && 
                            ` - Fee: €${vendorTermsContent.rules.yad_fee} per day`
                          }
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold min-w-[120px]">Senior Drivers:</span>
                        <span>
                          {vendorTermsContent.rules?.oad_driver_minimum_age && 
                            `Age ${vendorTermsContent.rules.oad_driver_minimum_age}-${vendorTermsContent.rules.oad_driver_maximum_age}`
                          }
                          {vendorTermsContent.rules?.oad_fee && 
                            ` - Fee: €${vendorTermsContent.rules.oad_fee} per day`
                          }
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold min-w-[120px]">Foreign Drivers:</span>
                        <span>
                          {vendorTermsContent.rules?.allow_foreigners === 1 ? "Allowed" : "Not allowed"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="h-px bg-gray-300 my-6"></div>

                  {/* Fuel Policy */}
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Fuel className="w-5 h-5" />
                      Fuel Policy
                    </h3>
                    <p className="text-sm text-gray-700">
                      {vendorTermsContent.rules?.fuel_policy || "No specific fuel policy information available."}
                    </p>
                  </div>

                  <div className="h-px bg-gray-300 my-6"></div>

                  {/* Payment Methods */}
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Methods
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="flex items-center gap-2">
                        {vendorTermsContent.rules?.use_credit_card === 1 ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        Credit Cards Accepted
                      </li>
                      <li className="flex items-center gap-2">
                        {vendorTermsContent.rules?.use_debit_card === 1 ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        Debit Cards Accepted
                      </li>
                      <li className="flex items-center gap-2">
                        {vendorTermsContent.rules?.use_cash === 1 ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        Cash Payments Accepted
                      </li>
                    </ul>
                  </div>

                  <div className="h-px bg-gray-300 my-6"></div>

                  {/* Insurance Coverage */}
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Insurance Coverage
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="flex items-center gap-2">
                        {vendorTermsContent.rules?.coverage_credit_card === 1 ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        Credit Card Coverage
                      </li>
                      <li className="flex items-center gap-2">
                        {vendorTermsContent.rules?.coverage_rental_cover === 1 ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        Rental Cover Insurance
                      </li>
                    </ul>
                  </div>

                  <div className="h-px bg-gray-300 my-6"></div>

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      Additional Information
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• A security deposit may be required upon vehicle pickup</li>
                      <li>• Valid driver's license held for at least 1 year is required</li>
                      <li>• Credit card in the main driver's name is mandatory</li>
                      <li>• Additional fees may apply for extra drivers</li>
                      {vendorTermsContent.rules?.deadline_cancellation_booking && (
                        <li>• Cancellation deadline: {vendorTermsContent.rules.deadline_cancellation_booking}</li>
                      )}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">No rental conditions available.</div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-100 p-4 rounded-b-lg text-center">
              <button 
                onClick={() => setShowVendorTerms(false)}
                className="bg-[#0174b7] text-white px-6 py-2 rounded-md hover:bg-[#005f8c] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cars;