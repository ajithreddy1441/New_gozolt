import React, { useState } from 'react';
import { MapPin, Calendar, Users, Settings, Shield, Navigation, ChevronDown, Phone, Mail, AlertCircle, Check, X } from 'lucide-react';

const CarRentalBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [addons, setAddons] = useState({
    additionalDriver: false,
    childSeat: false,
    gps: false
  });
  
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

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    country: 'United States',
    zip: ''
  });

  const toggleAddon = (addonKey) => {
    setAddons(prev => ({
      ...prev,
      [addonKey]: !prev[addonKey]
    }));
  };

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

  const basePrice = 29.75;
  const days = 2;
  const addonPrices = {
    additionalDriver: 5.00,
    childSeat: 9.99,
    gps: 9.99
  };

  const calculateTotal = () => {
    let total = basePrice * days;
    Object.keys(addons).forEach(key => {
      if (addons[key]) {
        total += addonPrices[key] * days;
      }
    });
    return total;
  };

  const navigateToStep = (step) => {
    setCurrentStep(step);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Progress Steps */}
      <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
        <button 
          onClick={() => navigateToStep(1)}
          className={`w-full sm:w-auto px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2 ${
            currentStep === 1 ? 'bg-[#0174b4] text-white' : 'bg-[#005f8c] text-white'
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
            className={`w-full sm:w-auto px-4 py-2 rounded-full text-sm font-medium ${
              currentStep === 2 ? 'bg-[#0174b4] text-white' : 'bg-gray-300 text-gray-600'
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
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <img 
                    src="/car-img.png" 
                    alt="Fiat Panda" 
                    className="w-full sm:w-40 h-24 sm:h-20 object-contain rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Fiat Panda</h3>
                    <p className="text-gray-600 mb-3 text-sm sm:text-base">Or similar • Small Cars</p>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                      29.75 € <span className="text-sm sm:text-base font-normal text-gray-600">/ per day</span>
                    </div>
                    <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>4 seats</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                        <span>Automatic</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>21+ Years</span>
                      </div>
                      <div className="text-gray-500">27-35 mpg</div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4" />
                      <div>
                        <div className="font-medium">PICKUP</div>
                        <div>Malta International Airport</div>
                        <div>Sunday, 27 July 10:00 AM</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-4">
                      <MapPin className="w-4 h-4" />
                      <div>
                        <div className="font-medium">RETURN</div>
                        <div>Malta International Airport</div>
                        <div>Tuesday, 29 July 10:00 AM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add-ons */}
              <div className="space-y-4">
                {/* Additional Driver */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center justify-between">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-[#0174b4]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Additional Driver</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Add a driver to your booking</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">$ 5.00/day</span>
                      <button
                        onClick={() => toggleAddon('additionalDriver')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          addons.additionalDriver ? 'bg-[#0174b4]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            addons.additionalDriver ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Child Seat */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center justify-between">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-[#0174b4]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Child Seat</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Child Seat, Universal</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">$ 9.99/day</span>
                      <button
                        onClick={() => toggleAddon('childSeat')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          addons.childSeat ? 'bg-[#0174b4]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            addons.childSeat ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* GPS */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center justify-between">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Navigation className="w-6 h-6 text-[#0174b4]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">GPS</h4>
                        <p className="text-xs sm:text-sm text-gray-600">GPS tracker</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">$ 9.99/day</span>
                      <button
                        onClick={() => toggleAddon('gps')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          addons.gps ? 'bg-[#0174b4]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            addons.gps ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="w-full lg:w-96">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                {/* Total */}
                <div className="mb-6">
                  <div className="text-right mb-4">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">Total: $ {calculateTotal().toFixed(2)}</div>
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
                      src="/car-img.png" 
                      alt="Fiat Panda" 
                      className="w-20 sm:w-15 h-12 sm:h-10 object-contain rounded"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Fiat Panda</div>
                      <div className="text-xs sm:text-sm text-gray-600">Small Car</div>
                      <div className="text-xs sm:text-sm font-semibold">29.75 € / per day</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                      <div>
                        <div className="font-medium">PICKUP</div>
                        <div className="text-gray-600">Malta International Airport Sun, 27 Jul 10:00 AM</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                      <div>
                        <div className="font-medium">RETURN</div>
                        <div className="text-gray-600">Malta International Airport Tue, 29 Jul 10:00 AM</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Details */}
                <div className="border-t pt-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Price details</h4>
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price for 2 day(s)</span>
                      <span className="font-medium">29.75 €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hourly for 0 hour(s)</span>
                      <span className="font-medium">$ 0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Fees & taxes</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">29.75 €</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
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
                      className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={driverDetails.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent"
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
                    className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent"
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Email"
                        value={driverDetails.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4] focus:border-transparent"
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
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">Total: $ {calculateTotal().toFixed(2)}</div>
                  </div>
                  <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-[#0174b4] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#005f8c] transition-colors"
                  >
                    Book Now
                  </button>
                </div>

                {/* Car Summary */}
                <div className="border-t pt-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src="/car-img.png" 
                      alt="Fiat Panda" 
                      className="w-20 sm:w-15 h-12 sm:h-10 object-contain rounded"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Fiat Panda</div>
                      <div className="text-xs sm:text-sm text-gray-600">Small Car</div>
                      <div className="text-xs sm:text-sm font-semibold">29.75 € / per day</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                      <div>
                        <div className="font-medium">PICKUP</div>
                        <div className="text-gray-600">Malta International Airport Sun, 27 Jul 10:00 AM</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                      <div>
                        <div className="font-medium">RETURN</div>
                        <div className="text-gray-600">Malta International Airport Tue, 29 Jul 10:00 AM</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Details */}
                <div className="border-t pt-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Price details</h4>
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price for 2 day(s)</span>
                      <span className="font-medium">29.75 €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hourly for 0 hour(s)</span>
                      <span className="font-medium">$ 0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Fees & taxes</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">29.75 €</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
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
                <div className="flex flex-col sm:flex-row border border-gray-300 rounded-t-md focus-within:ring-2 focus-within:ring-[#0174b4] bg-white">
                  <input
                    type="text"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => handlePaymentChange('cardNumber', formatCardNumber(e.target.value))}
                    className="flex-1 px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-300 outline-none text-xs sm:text-sm placeholder-gray-400"
                    placeholder="1234 1234 1234 1234"
                    maxLength={19}
                    aria-label="Card number"
                  />
                  <div className="flex items-center justify-center gap-2 px-3 py-2 sm:border-l border-gray-300 bg-white">
                    <img src="/car.png" alt="Visa" className="h-4 sm:h-5" />
                    <img src="/car.png" alt="Mastercard" className="h-4 sm:h-5" />
                    <img src="/car.png" alt="American Express" className="h-4 sm:h-5" />
                    <img src="/car.png" alt="Discover" className="h-4 sm:h-5" />
                  </div>
                </div>
                <div className="flex border border-t-0 border-gray-300 rounded-b-md">
                  <input
                    type="text"
                    value={paymentDetails.expiryDate}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    className="w-1/2 px-3 py-2 border-r border-gray-300 outline-none text-xs sm:text-sm placeholder-gray-400"
                    placeholder="MM / YY"
                    maxLength={5}
                    aria-label="Expiry date"
                  />
                  <div className="relative w-1/2">
                    <input
                      type="text"
                      value={paymentDetails.cvc}
                      onChange={(e) => handlePaymentChange('cvc', e.target.value.replace(/\D/g, ''))}
                      className="w-full pr-12 px-3 py-2 outline-none text-xs sm:text-sm placeholder-gray-400"
                      placeholder="CVC"
                      maxLength={4}
                      aria-label="CVC"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg
                        width="40"
                        height="24"
                        viewBox="0 0 40 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 sm:h-6"
                        aria-hidden="true"
                      >
                        <rect width="40" height="24" rx="3" fill="gray" />
                        <rect x="4" y="6" width="22" height="6" rx="1" fill="#e5e7eb" />
                        <text x="36" y="16" fontSize="9" fontFamily="Arial" textAnchor="end" fill="black">
                          123
                        </text>
                      </svg>
                    </div>
                  </div>
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

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Country or region</label>
                <select
                  value={paymentDetails.country}
                  onChange={(e) => handlePaymentChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4]"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">ZIP</label>
                <input
                  type="text"
                  value={paymentDetails.zip}
                  onChange={(e) => handlePaymentChange('zip', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0174b4]"
                  placeholder="Postal code"
                />
              </div>

              <button
                className="w-full bg-[#0174b4] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#005f8c] transition-colors mt-4"
                onClick={() => {
                  setShowPaymentModal(false);
                }}
              >
                Pay
              </button>

              <p className="text-xs text-gray-500 mt-2 text-center">
                By clicking Pay, you agree to the <a href="#" className="text-[#0174b4]">Terms</a> and <a href="#" className="text-[#0174b4]">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarRentalBooking;