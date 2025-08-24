import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Snowflake, Luggage, Users, Settings, Shield, Navigation, ChevronDown, Phone, Mail, AlertCircle, Check, X } from 'lucide-react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import emailjs from '@emailjs/browser';

const CarRentalBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { carId, searchParams, carData } = location.state || {};

  const [carDetail, setCarDetail] = useState(carData || null);
  const [carLoading, setCarLoading] = useState(false);
  const [carError, setCarError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [driverDetails, setDriverDetails] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipcode: '',
    bookingComments: '',
    agreeToMarketing: false
  });

  const [driverErrors, setDriverErrors] = useState({});

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    country: 'United States',
    zip: ''
  });

  const [extras, setExtras] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState({});

  const [showTerms, setShowTerms] = useState(false);
  const [termsLoading, setTermsLoading] = useState(false);
  const [termsContent, setTermsContent] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [privacyLoading, setPrivacyLoading] = useState(false);
  const [privacyContent, setPrivacyContent] = useState("");

  const [showVendorTerms, setShowVendorTerms] = useState(false);
  const [vendorTermsLoading, setVendorTermsLoading] = useState(false);
  const [vendorTermsContent, setVendorTermsContent] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  // If no carId or searchParams are passed, redirect back to search
  useEffect(() => {
    if (!carId || !searchParams) {
      navigate('/search');
    }
  }, [carId, searchParams, navigate]);

  useEffect(() => {
    const fetchCar = async () => {
      // If we already have car data from the previous page, use it
      // console.log(carData);
      if (carData) {
        setCarDetail(carData);
        return;
      }

      if (!carId) return;
      console.log('Fetching car details for ID:', carId);
      setCarLoading(true);
      setCarError(null);
      try {
        console.log('Fetching car details for ID:', carId);
        const url = `https://api.rentnrides.com/api/get-car-detail/${carId}`;

        // Add headers to ensure proper content type handling
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        console.log('API Response status:', res.status);

        let data = null;
        try {
          data = await res.json();
          console.log('API Response data:', data);
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          throw new Error('Invalid JSON response from server');
        }

        if (!res.ok) {
          const apiMessage = (data && (data.message || data.error)) ||
            (data && data.errors ? JSON.stringify(data.errors) : null) ||
            `HTTP ${res.status}: ${res.statusText}`;
          throw new Error(apiMessage);
        }

        // Handle different response structures
        const carDetailData = (data && data.data && (data.data.car || data.data)) || data;

        if (!carDetailData) {
          throw new Error('No car data found in response');
        }

        setCarDetail(carDetailData);
      } catch (e) {
        console.error('Error fetching car details:', e);
        setCarError(e.message || 'Failed to fetch car details');

        // If API fails but we have carData from the search page, use that
        if (carData) {
          setCarDetail(carData);
          setCarError('API failed but using cached data: ' + e.message);
        }
      } finally {
        setCarLoading(false);
      }
    };

    fetchCar();
  }, [carId, carData]);

  // Fetch extras from API
  useEffect(() => {
    const fetchExtras = async () => {
      if (!carId || !searchParams?.days) return;
      try {
        const res = await fetch(
          `https://api.rentnrides.com/api/get-car-extras/${carId}?rental_days=${searchParams.days}`
        );
        const data = await res.json();
        if (data.success && data.data && Array.isArray(data.data.extras)) {
          setExtras(data.data.extras);
        }
      } catch (e) {
        console.error('Error fetching extras:', e);
        setExtras([]);
      }
    };
    fetchExtras();
  }, [carId, searchParams?.days]);

  const handleInputChange = (field, value) => {
    setDriverDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleExpiryChange = (value) => {
    const formattedValue = value
      .replace(/\D/g, '')
      .replace(/^(\d{2})/, '$1/')
      .substring(0, 5);
    handlePaymentChange('expiryDate', formattedValue);
  };

  const basePrice = useMemo(() => {
    if (carDetail?.price) return Number(carDetail.price) || 0;
    if (searchParams?.price) return Number(searchParams.price) || 0;
    return 29.75;
  }, [carDetail?.price, searchParams?.price]);

  const days = useMemo(() => {
    return Number(searchParams?.days) || 1;
  }, [searchParams?.days]);

  // Use only extras and selectedExtras for calculation
  const calculateTotal = () => {
    let total = basePrice * days;
    extras.forEach(extra => {
      if (selectedExtras[extra.name]) {
        total += Number(extra.fee);
      }
    });
    return total;
  };

  const navigateToStep = (step) => {
    setCurrentStep(step);
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      // Handle different date formats that might come from the API
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If it's not a valid date string, try to parse it differently
        return dateString;
      }
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const toggleExtra = (name) => {
    setSelectedExtras(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const validateDriverForm = () => {
    const errors = {};
    if (!driverDetails.firstName) errors.firstName = true;
    if (!driverDetails.lastName) errors.lastName = true;
    if (!driverDetails.dateOfBirth) errors.dateOfBirth = true;
    if (!driverDetails.phoneNumber) errors.phoneNumber = true;
    if (!driverDetails.email) errors.email = true;
    if (!driverDetails.address) errors.address = true;
    // Add more fields if needed
    return errors;
  };

  const handleTermsClick = async () => {
    setShowTerms(true);
    setTermsLoading(true);
    try {
      const res = await fetch("https://api.rentnrides.com/api/get-terms-conditions");
      const data = await res.json();
      setTermsContent(data?.data?.terms || "No terms found.");
    } catch (err) {
      setTermsContent("Failed to load terms & conditions.");
    }
    setTermsLoading(false);
  };

  const handlePrivacyClick = async () => {
    setShowPrivacy(true);
    setPrivacyLoading(true);
    try {
      const res = await fetch("https://api.rentnrides.com/api/get-privacy-policy");
      const data = await res.json();
      setPrivacyContent(data?.data?.privacy_policy || "No privacy policy found.");
    } catch (err) {
      setPrivacyContent("Failed to load privacy policy.");
    }
    setPrivacyLoading(false);
  };

  const handleVendorTermsClick = async () => {
    setShowVendorTerms(true);
    setVendorTermsLoading(true);
    try {
      // DEBUG: Log carDetail to see its structure
      console.log("carDetail for vendor terms:", carDetail);

      // Use the correct path based on your carDetail structure
      const vendorId = carDetail?.vendor?.id || carDetail?.vendor_id;
      console.log("Using vendorId:", vendorId);

      if (!vendorId) throw new Error("No vendor ID found.");
      const res = await fetch(`https://api.rentnrides.com/api/get-vendor-terms/${vendorId}`);
      const data = await res.json();
      setVendorTermsContent(data?.data || null);
    } catch (err) {
      setVendorTermsContent({ error: "Failed to load supplier rental terms." });
    }
    setVendorTermsLoading(false);
  };

  // Update your handleBookCar function
  const handleBookCar = async () => {
    // First check if we have location_id in searchParams
    let locationId = searchParams?.location_id;

    // If not, try to get it from carDetail
    if (!locationId && carDetail?.location?.id) {
      locationId = carDetail.location.id;
      console.log("Using location ID from carDetail:", locationId);
    }

    // If still no location ID, try to get it from the original carData
    if (!locationId && carData?.location?.id) {
      locationId = carData.location.id;
      console.log("Using location ID from carData:", locationId);
    }

    // If still no location ID, try to get it from vendor info
    if (!locationId && carDetail?.vendor?.id) {
      locationId = carDetail.vendor.id;
      console.log("Using vendor ID as fallback location ID:", locationId);
    }

    // If still no location ID, show detailed error
    if (!locationId) {
      alert("Location information is missing. Please try selecting the car again.");
      console.error("Location ID missing from all sources:");
      console.log("searchParams:", searchParams);
      console.log("carDetail:", carDetail);
      console.log("carData:", carData);

      // Add more detailed debugging
      console.log("carDetail location:", carDetail?.location);
      console.log("carData location:", carData?.location);
      console.log("carDetail vendor:", carDetail?.vendor);

      return;
    }


    // Format dates properly for the API (YYYY-MM-DD HH:MM format)
    const formatDateForAPI = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = '10'; // Default to 10:00 as per your email template
      const minutes = '00';

      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const payload = {
      car_id: parseInt(carId), // Convert to integer
      location_id: parseInt(locationId), // Use the locationId variable
      pickup_date: formatDateForAPI(searchParams.pickup_date),
      dropoff_date: formatDateForAPI(searchParams.return_date),
      pickup_location: searchParams.location || carDetail?.location?.name || 'Unknown location',
      dropoff_location: searchParams.location || carDetail?.location?.name || 'Unknown location',
      driver_age: driverDetails.dateOfBirth ?
        Math.floor((new Date() - new Date(driverDetails.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) : null,
      country: driverDetails.country || null,
      first_name: driverDetails.firstName,
      last_name: driverDetails.lastName,
      email: driverDetails.email,
      phone: driverDetails.phoneNumber,
      // Add optional fields if available
      address: driverDetails.address || null,
      city: driverDetails.city || null,
      state: driverDetails.state || null,
      zipcode: driverDetails.zipcode || null,
      extras: Object.keys(selectedExtras).filter(key => selectedExtras[key]),
      total_price: calculateTotal(),
    };

    // Log the payload for debugging
    console.log("Booking payload:", JSON.stringify(payload, null, 2));

    try {
      const res = await fetch('https://api.rentnrides.com/api/book-car', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Booking API response:', data);

      if (res.ok && data.success) {
        alert('Booking successful!');

        console.log(searchParams, carDetail, driverDetails);
        // Send email via EmailJS (simplified version)
        emailjs.send(
          'service_p3qxdg9',
          'template_axb3od8',
          {
            to_email: driverDetails.email,
            to_name: `${driverDetails.firstName} ${driverDetails.lastName}`,
            car_model: carDetail?.model || 'Car',
            pickup_location: searchParams.location || carDetail?.location?.name || 'Unknown location',
            pickup_date: searchParams.pickup_date,
            return_date: searchParams.return_date,
            total_price: calculateTotal(),
            reservation_no: data.reservation_no || data.data?.booking_id || 'N/A',
          },
          'cphBYQUzdfIEB2wTF'
        ).then(() => {
          console.log('Email sent!');
        }).catch((err) => {
          console.error('EmailJS error:', err);
        });
      } else {
        // Show detailed error message from server
        const errorMsg = data.message ||
          (data.errors ? JSON.stringify(data.errors) : 'Booking failed');
        alert(`Booking failed: ${errorMsg}`);
      }
    } catch (err) {
      alert('Booking failed: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Progress Steps */}
      <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => navigateToStep(1)}
          className={`w-full sm:w-auto px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2 ${currentStep === 1 ? 'bg-[#0174b4] text-white' : 'bg-[#005f8c] text-white'
            }`}
        >
          {currentStep === 2 && <Check className="w-4 h-4" />}
          <span>Selection & Addons</span>
        </button>

        {currentStep === 1 ? (
          <div className="w-full sm:w-auto px-4 py-2 rounded-full text-sm font-medium bg-gray-300 text-gray-600 text-center">
            02. Driver Details
          </div>
        ) : (
          <button
            onClick={() => navigateToStep(2)}
            className={`w-full sm:w-auto px-4 py-2 rounded-full text-sm font-medium ${currentStep === 2 ? 'bg-[#0174b4] text-white' : 'bg-gray-300 text-gray-600'
              }`}
          >
            02. Driver Details
          </button>
        )}
      </div>

      {currentStep === 1 ? (
        <>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Step 1. Selection & Add-ons</h1>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Column - Car Selection and Add-ons */}
            <div className="flex-1">
              {/* Car Selection */}
              <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 shadow-sm">
                <div className="flex flex-col items-start gap-4">
                  <div className='flex items-center justify-center sm:items-start sm:justify-start gap-5 flex-col sm:flex-row w-full'>
                    <div className='flex items-center sm:items-start justify-center sm:basis-[65%] flex-col'>
                      <div className='flex items-center sm:items-start justify-center flex-col sm:flex-row'>
                        <img
                          src={carDetail?.imageUrl || '/car-img.png'}
                          alt={carDetail?.model_type || carDetail?.model || 'Selected car'}
                          className="w-full sm:w-40 h-24 sm:h-20 object-contain rounded"
                          onError={(e) => {
                            e.target.src = '/car-img.png';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="text-center sm:text-left text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                            {carDetail?.model_type || carDetail?.model || 'Car'}
                          </h3>
                          <p className="text-center sm:text-left text-gray-600 mb-3 text-sm sm:text-base">
                            {carDetail?.category ? `Category: ${carDetail.category}` : 'Selected car'}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center justify-center sm:items-start flex-col gap-0'>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                          {basePrice.toFixed(2)} € <span className="text-sm sm:text-base font-normal text-gray-600">/ per day</span>
                        </div>
                        <div className="flex flex-row flex-wrap items-center justify-center sm:grid sm:grid-cols-4 gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{carDetail?.seats ? `${carDetail.seats} seats` : '—'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Settings className="w-4 h-4" />
                            <span>{carDetail?.transmission_type || carDetail?.transmission || '—'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Snowflake className="w-4 h-4 text-gray-500" />
                            <span>{carDetail?.air_conditioning ? `${carDetail.air_conditioning}` : "A/C"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Luggage className="w-4 h-4 text-gray-500" />
                            <span>{carDetail?.bags || 0} Bags</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center sm:items-end sm:justify-end flex-wrap gap-5 text-left sm:text-right sm:basis-[35%]">
                      <div className="flex items-start flex-col gap-2 text-xs sm:text-sm text-gray-600 mb-1">
                        <div className='flex items-center justify-start gap-2'>
                          <MapPin className="w-4 h-4" />
                          <div className="font-medium">PICKUP</div>
                        </div>
                        <div>
                          <div>{searchParams?.location || 'Selected location'}</div>
                          <div>{searchParams?.pickup_date ? searchParams.pickup_date + ", " + searchParams.pickup_time : ''}</div>
                        </div>
                      </div>
                      <div className="flex items-start flex-col gap-2 text-xs sm:text-sm text-gray-600">
                        <div className='flex items-center justify-start gap-2'>
                          <MapPin className="w-4 h-4" />
                          <div className="font-medium">RETURN</div>
                        </div>
                        <div>
                          <div>{searchParams?.location || 'Selected location'}</div>
                          <div>{searchParams?.return_date ? searchParams.return_date + ", " + searchParams.return_time : ''}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {carLoading && <div className="text-sm text-gray-500 mt-2">Loading car details...</div>}
                {carError && (
                  <div className="text-sm text-red-600 mt-2 p-2 bg-red-50 rounded">
                    {carError}
                    <button
                      onClick={() => window.location.reload()}
                      className="ml-2 text-blue-600 underline"
                    >
                      Try again
                    </button>
                  </div>
                )}
              </div>

              {/* Add-ons */}
              <div className="space-y-4">
                {extras.length > 0 ? (
                  extras.map(extra => (
                    <div key={extra.name} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {/* Icon selection based on extra name */}
                          {extra.name.toLowerCase().includes('gps') ? (
                            <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-[#0174b4]" />
                          ) : extra.name.toLowerCase().includes('driver') ? (
                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#0174b4]" />
                          ) : (
                            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#0174b4]" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{extra.name}</h4>
                          <p className="text-xs sm:text-base text-gray-600">
                            {extra.quantity ? `Available: ${extra.quantity}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                          € {extra.fee} rental period
                        </span>
                        <button
                          onClick={() => toggleExtra(extra.name)}
                          className={`relative inline-flex h-6 w-11 min-w-[44px] flex-shrink-0 items-center rounded-full transition-colors ${selectedExtras[extra.name] ? 'bg-[#0174b4]' : 'bg-gray-300'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${selectedExtras[extra.name] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No add-ons available for this car.</div>
                )}
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="w-full lg:w-96">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                {/* Total */}
                <div className="mb-6">
                  <div className="text-right mb-4">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">Total: € {calculateTotal().toFixed(2)}</div>
                  </div>
                  <button
                    onClick={() => navigateToStep(2)}
                    className="w-full bg-[#0174b4] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#005f8c] transition-colors"
                  >
                    Continue
                  </button>
                </div>

                {/* Car Summary */}
                <div className="border-t pt-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={carDetail?.imageUrl || carDetail?.car_image || '/car-img.png'}
                      alt={carDetail?.model_type || carDetail?.model || 'Selected car'}
                      className="w-20 sm:w-15 h-12 sm:h-10 object-contain rounded"
                      onError={(e) => {
                        e.target.src = '/car-img.png';
                      }}
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{carDetail?.model_type || carDetail?.model || 'Car'}</div>
                      <div className="text-xs sm:text-sm text-gray-600">{carDetail?.category || ''}</div>
                      <div className="text-xs sm:text-sm font-semibold">{basePrice.toFixed(2)} € / per day</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                      <div>
                        <div className="font-medium">PICKUP</div>
                        <div className="text-gray-600">
                          {searchParams?.location || 'Selected location'} - {searchParams?.pickup_date ? searchParams.pickup_date + ", " + searchParams.pickup_time : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                      <div>
                        <div className="font-medium">RETURN</div>
                        <div className="text-gray-600">
                          {searchParams?.location || 'Selected location'} - {searchParams?.return_date ? searchParams.return_date + ", " + searchParams.return_time : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Details */}
                <div className="border-t pt-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Price details</h4>
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price for {days} day(s)</span>
                      <span className="font-medium">{(basePrice * days).toFixed(2)} €</span>
                    </div>
                    {extras.filter(extra => selectedExtras[extra.name]).map(extra => (
                      <div className="flex justify-between" key={extra.name}>
                        <span className="text-gray-600">{extra.name}</span>
                        <span className="font-medium">{extra.fee} €</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Discount Code */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Discount Code</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent"
                    />
                    <button className="px-4 py-2 text-[#0174b4] border border-[#0174b4] rounded-md text-xs sm:text-sm font-medium hover:bg-blue-50 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Step 2. Driver Details</h1>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Column - Driver Form */}
            <div className="flex-1">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                {/* First name & Last name */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">First name & Last name</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First name"
                      value={driverDetails.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`px-4 py-3 border ${driverErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent`}
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={driverDetails.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`px-4 py-3 border ${driverErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent`}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs sm:text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>The cardholder's name must match the driver's name. The payment cards need to be presented at the counter.</span>
                  </div>
                </div>

                {/* Date of birth */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Date of birth</h3>
                  <input
                    type="text"
                    placeholder="MM/DD/YYYY"
                    value={driverDetails.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className={`w-full sm:w-1/2 px-4 py-3 border ${driverErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent`}
                  />
                  <div className="flex items-center gap-2 mt-3 text-xs sm:text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Additional charges may apply for underage drivers</span>
                  </div>
                </div>

                {/* Phone number & Email */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Phone number & Email</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={driverDetails.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border ${driverErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent`}
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Email"
                        value={driverDetails.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border ${driverErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent`}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="flex items-start gap-2 text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        checked={driverDetails.agreeToMarketing}
                        onChange={(e) => handleInputChange('agreeToMarketing', e.target.checked)}
                        className="mt-0.5 rounded border-gray-300 text-[#0174b4] focus:ring-[#0174b4]"
                      />
                      <span className="text-gray-700">I agree to receive communications, including marketing and promotional materials, via SMS and emails</span>
                    </label>
                  </div>
                </div>

                {/* Personal information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal information</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Address"
                      value={driverDetails.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full px-4 py-3 border ${driverErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent`}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Country"
                        value={driverDetails.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={driverDetails.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={driverDetails.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Zipcode"
                        value={driverDetails.zipcode}
                        onChange={(e) => handleInputChange('zipcode', e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Booking comments */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking comments</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">We will take into account all your wishes, what are your wishes for renting a car?</p>
                  <textarea
                    placeholder="This field is optional"
                    rows={4}
                    value={driverDetails.bookingComments}
                    onChange={(e) => handleInputChange('bookingComments', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="w-full lg:w-96">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                {/* Total */}
                <div className="mb-6">
                  <div className="text-right mb-4">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">Total: € {calculateTotal().toFixed(2)}</div>
                  </div>
                  <button
                    onClick={() => {
                      const errors = validateDriverForm();
                      setDriverErrors(errors);
                      if (Object.keys(errors).length === 0) {
                        setShowPaymentModal(true);
                      }
                    }}
                    className="w-full bg-[#0174b4] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#005f8c] transition-colors"
                  >
                    Book Now
                  </button>
                </div>

                {/* Car Summary */}
                <div className="border-t pt-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={carDetail?.imageUrl || '/car-img.png'}
                      alt={carDetail?.model_type || carDetail?.model || 'Selected car'}
                      className="w-20 sm:w-15 h-12 sm:h-10 object-contain rounded"
                      onError={(e) => {
                        e.target.src = '/car-img.png';
                      }}
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{carDetail?.model_type || carDetail?.model || 'Car'}</div>
                      <div className="text-xs sm:text-sm text-gray-600">{carDetail?.category || ''}</div>
                      <div className="text-xs sm:text-sm font-semibold">{basePrice.toFixed(2)} € / per day</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                      <div>
                        <div className="font-medium">PICKUP</div>
                        <div className="text-gray-600">
                          {searchParams?.location || 'Selected location'} - {searchParams?.pickup_date ? searchParams.pickup_date + ", " + searchParams.pickup_time : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                      <div>
                        <div className="font-medium">RETURN</div>
                        <div className="text-gray-600">
                          {searchParams?.location || 'Selected location'} - {searchParams?.return_date ? searchParams.return_date + ", " + searchParams.return_time : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Details */}
                <div className="border-t pt-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Price details</h4>
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price for {days} day(s)</span>
                      <span className="font-medium">{(basePrice * days).toFixed(2)} €</span>
                    </div>
                    {extras.filter(extra => selectedExtras[extra.name]).map(extra => (
                      <div className="flex justify-between" key={extra.name}>
                        <span className="text-gray-600">{extra.name}</span>
                        <span className="font-medium">{extra.fee} €</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Discount Code */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Discount Code</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent"
                    />
                    <button className="px-4 py-2 text-[#0174b4] border border-[#0174b4] rounded-md text-xs sm:text-sm font-medium hover:bg-blue-50 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-none flex items-center justify-center z-50">
          <div className="bg-white shadow-2xl rounded-lg p-4 sm:p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Payment</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4]"
                  placeholder="Your email address"
                />
              </div>

              {/* Card information */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Card information</label>
                <div className="border border-gray-300 rounded-md p-2 bg-white">
                  <CardElement options={{ hidePostalCode: true }} />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Cardholder name</label>
                <input
                  type="text"
                  value={paymentDetails.cardholderName}
                  onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4]"
                  placeholder="Full name on card"
                />
              </div>

              <button
                className="w-full bg-[#0174b4] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#005f8c] transition-colors mt-4"
                onClick={async () => {
                  if (!stripe || !elements) return; // Prevent running if not ready

                  const res = await fetch('http://localhost:5000/api/create-payment-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: Math.round(calculateTotal() * 100) }),
                  });
                  const { clientSecret } = await res.json();

                  const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                      card: elements.getElement(CardElement),
                      billing_details: {
                        name: paymentDetails.cardholderName,
                        email: driverDetails.email,
                      },
                    },
                  });

                  if (result.error) {
                    alert(result.error.message);
                  } else if (result.paymentIntent.status === 'succeeded') {
                    setShowPaymentModal(false);
                    await handleBookCar();
                  }
                }}
              >
                Pay
              </button>

              <p className="text-xs text-gray-500 mt-2 text-center">
                By clicking Pay, you agree to the{" "}
                <button
                  type="button"
                  className="text-[#0174b4] underline"
                  onClick={handleTermsClick}
                >
                  Terms & Conditions
                </button>
                {" and "}
                <button
                  type="button"
                  className="text-[#0174b4] underline"
                  onClick={handleVendorTermsClick}
                >
                  Supplier Rental Terms
                </button>
                {" and "}
                <button
                  type="button"
                  className="text-[#0174b4] underline"
                  onClick={handlePrivacyClick}
                >
                  Privacy Policy
                </button>
                .
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-[100] bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-2">
            <div className="flex items-center justify-between px-6 py-4 rounded-t-xl" style={{ background: "#FFC72C" }}>
              <span className="text-lg sm:text-xl font-bold text-white tracking-wide">TERMS & CONDITIONS</span>
              <button
                className="text-white text-2xl font-bold hover:text-gray-800"
                onClick={() => setShowTerms(false)}
              >
                &times;
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {termsLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: termsContent }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-[100] bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-2">
            <div className="flex items-center justify-between px-6 py-4 rounded-t-xl" style={{ background: "#FFC72C" }}>
              <span className="text-lg sm:text-xl font-bold text-white tracking-wide">PRIVACY POLICY</span>
              <button
                className="text-white text-2xl font-bold hover:text-gray-800"
                onClick={() => setShowPrivacy(false)}
              >
                &times;
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {privacyLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: privacyContent }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Vendor Terms Modal */}
      {showVendorTerms && (
        <div className="fixed inset-0 z-[100] bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-2">
            <div className="flex items-center justify-between px-6 py-4 rounded-t-xl" style={{ background: "#FFC72C" }}>
              <span className="text-lg sm:text-xl font-bold text-white tracking-wide">RENTAL CONDITIONS</span>
              <button
                className="text-white text-2xl font-bold hover:text-gray-800"
                onClick={() => setShowVendorTerms(false)}
              >
                &times;
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {vendorTermsLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : vendorTermsContent?.error ? (
                <div className="text-red-600">{vendorTermsContent.error}</div>
              ) : vendorTermsContent ? (
                <div>
                  {/* Supplier */}
                  <div className="mb-4 border rounded p-3 flex items-center gap-2">
                    <span className="text-[#0174b4]">
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="7" rx="2" /><path d="M5 18v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" /><circle cx="7.5" cy="16.5" r="1.5" /><circle cx="16.5" cy="16.5" r="1.5" /></svg>
                    </span>
                    <span className="font-semibold">Supplier: {vendorTermsContent.vendor?.username || "N/A"}</span>
                  </div>
                  {/* Age Requirements */}
                  <div className="mb-4 border rounded p-3">
                    <div className="flex items-center gap-2 mb-2 font-semibold text-[#0174b4]">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="16" height="16" rx="2" /><path d="M8 7h4M8 11h4M8 15h4" /></svg>
                      Age Requirements
                    </div>
                    <div className="text-gray-700 text-sm">
                      {vendorTermsContent.rules?.yad_driver_minimum_age && (
                        <div>
                          Minimum rental age is <b>{vendorTermsContent.rules.yad_driver_minimum_age}</b> years.<br />
                          A young driver fee applies to drivers under the age of <b>{vendorTermsContent.rules.yad_driver_maximum_age}</b>.<br />
                          Young driver fee: <b>€{vendorTermsContent.rules.yad_fee}</b>
                        </div>
                      )}
                      {vendorTermsContent.rules?.oad_driver_minimum_age && (
                        <div className="mt-2">
                          A senior driver fee applies to drivers over the age of <b>{vendorTermsContent.rules.oad_driver_minimum_age}</b>.<br />
                          Senior driver fee: <b>€{vendorTermsContent.rules.oad_fee}</b>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Fuel Policy */}
                  <div className="mb-4 border rounded p-3">
                    <div className="flex items-center gap-2 mb-2 font-semibold text-[#0174b4]">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="14" height="14" rx="2" /><path d="M7 7h6M7 11h6" /></svg>
                      Fuel Policy
                    </div>
                    <div className="text-gray-700 text-sm">
                      {vendorTermsContent.rules?.fuel_policy || "N/A"}
                    </div>
                  </div>
                  {/* Add more sections as needed, e.g. payment methods, insurance, etc. */}
                </div>
              ) : (
                <div>No supplier rental terms found.</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CarRentalBooking;