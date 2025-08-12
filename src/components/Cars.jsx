import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Cog, Snowflake, Luggage, Check, Info, ChevronDown, Search } from 'lucide-react';

const CarRentalCards = () => {
  const navigate = useNavigate();
  const [showPickupCalendar, setShowPickupCalendar] = useState(false);
  const [showDropoffCalendar, setShowDropoffCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedDates, setSelectedDates] = useState({
    pickupDate: '',
    dropoffDate: '',
    time: ''
  });
  const [selectedLocation, setSelectedLocation] = useState('Malta International Airport');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const locations = [
    'Malta International Airport',
    'Valletta Cruise Port',
    'Gozo Ferry Terminal',
    'Sliema Ferries',
    'St. Julian\'s',
    'Bugibba'
  ];

  const cars = [
    {
      id: 1,
      model: "Fiat Panda",
      category: "Or similar - Small Cars",
      seats: 4,
      transmission: "Automatic",
      airCondition: "Air Condition",
      bags: 3,
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
      supplier: "Europcar"
    },
    {
      id: 2,
      model: "Fiat Panda",
      category: "Or similar - Small Cars", 
      seats: 4,
      transmission: "Automatic",
      airCondition: "Air Condition",
      bags: 3,
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
      supplier: "Hertz"
    },
    {
      id: 3,
      model: "Fiat Panda",
      category: "Or similar - Small Cars",
      seats: 4,
      transmission: "Automatic",
      airCondition: "Air Condition",
      bags: 3,
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
      supplier: "Avis"
    },
    {
      id: 4,
      model: "Fiat Panda", 
      category: "Or similar - Small Cars",
      seats: 4,
      transmission: "Automatic", 
      airCondition: "Air Condition",
      bags: 3,
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
      supplier: "Budget"
    },
    {
      id: 5,
      model: "Fiat Panda",
      category: "Or similar - Small Cars",
      seats: 4, 
      transmission: "Automatic",
      airCondition: "Air Condition",
      bags: 3,
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
      supplier: "Sixt"
    },
    {
      id: 6,
      model: "Fiat Panda",
      category: "Or similar - Small Cars",
      seats: 4,
      transmission: "Automatic",
      airCondition: "Air Condition", 
      bags: 3,
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
      supplier: "Enterprise"
    },
    {
      id: 7,
      model: "Fiat Panda",
      category: "Or similar - Small Cars",
      seats: 4,
      transmission: "Automatic",
      airCondition: "Air Condition",
      bags: 3,
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
      supplier: "Europcar"
    },
    {
      id: 8,
      model: "Fiat Panda",
      category: "Or similar - Small Cars", 
      seats: 4,
      transmission: "Automatic",
      airCondition: "Air Condition",
      bags: 3,
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
      supplier: "Hertz"
    },
    {
      id: 9,
      model: "Fiat Panda",
      category: "Or similar - Small Cars",
      seats: 4,
      transmission: "Automatic",
      airCondition: "Air Condition",
      bags: 3,
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
      supplier: "Avis"
    },
    {
      id: 10,
      model: "Fiat Panda", 
      category: "Or similar - Small Cars",
      seats: 4,
      transmission: "Automatic", 
      airCondition: "Air Condition",
      bags: 3,
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
      supplier: "Budget"
    },
    {
      id: 11,
      model: "Fiat Panda",
      category: "Or similar - Small Cars",
      seats: 4, 
      transmission: "Automatic",
      airCondition: "Air Condition",
      bags: 3,
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
      supplier: "Sixt"
    },
    {
      id: 12,
      model: "Fiat Panda",
      category: "Or similar - Small Cars",
      seats: 4,
      transmission: "Automatic",
      airCondition: "Air Condition", 
      bags: 3,
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
      supplier: "Enterprise"
    }
  ];

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDate = (day) => {
    if (!day) return '';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${monthNames[currentMonth]} ${currentYear}`;
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const isPastDate = (day) => {
    const today = new Date();
    const selectedDate = new Date(currentYear, currentMonth, day);
    return selectedDate < today.setHours(0, 0, 0, 0);
  };

  const handleDateSelect = (day, type) => {
    const formattedDate = formatDate(day);
    setSelectedDates(prev => ({
      ...prev,
      [type]: formattedDate
    }));
    
    if (type === 'pickupDate') {
      setShowPickupCalendar(false);
    } else {
      setShowDropoffCalendar(false);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedDates(prev => ({
      ...prev,
      time: time
    }));
    setShowTimePicker(false);
  };

  const handleViewDeal = (car) => {
    navigate('/Addons', { 
      state: { 
        selectedCar: car,
        pickupLocation: selectedLocation,
        pickupDate: selectedDates.pickupDate,
        dropoffDate: selectedDates.dropoffDate,
        pickupTime: selectedDates.time
      } 
    });
  };

  const timeOptions = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
    '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];

  const Calendar = ({ onDateSelect, onClose }) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    return (
      <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 left-0 right-0 md:left-auto md:right-auto md:w-80">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="font-semibold text-gray-900">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigateMonth('next')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg leading-none">
                ✕
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-600 mb-2">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => (
              <button
                key={index}
                onClick={() => day && !isPastDate(day) && onDateSelect(day)}
                disabled={!day || isPastDate(day)}
                className={`h-8 w-8 text-sm rounded hover:bg-blue-50 ${
                  day ? 'text-gray-900' : ''
                } ${
                  day && isPastDate(day)
                    ? 'text-gray-400 cursor-not-allowed' 
                    : day ? 'hover:bg-blue-100 cursor-pointer' : ''
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const TimePicker = ({ onTimeSelect, onClose }) => (
    <div className="absolute top-full left-0 right-0 md:left-0 md:right-auto md:w-48 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
      <div className="p-2">
        <div className="flex items-center justify-between mb-2 px-2">
          <h3 className="font-semibold text-gray-900">Select Time</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div className="space-y-1">
          {timeOptions.map((time) => (
            <button
              key={time}
              onClick={() => onTimeSelect(time)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const LocationPicker = ({ onSelect, onClose }) => (
    <div className="absolute top-full left-0 right-0 md:left-0 md:right-auto md:w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
      <div className="p-2">
        <div className="flex items-center justify-between mb-2 px-2">
          <h3 className="font-semibold text-gray-900">Select Location</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div className="space-y-1">
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => {
                onSelect(location);
                onClose();
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
            >
              {location}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const CarCard = ({ car }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-3 sm:p-4 pb-1 sm:pb-2">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1">{car.model}</h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{car.category}</p>
        <button className="flex items-center gap-1 text-[#0174b7] text-xs sm:text-sm hover:text-[#005f8c]">
          <Info className="w-3 h-3 sm:w-4 sm:h-4" />
          Rental Conditions
        </button>
      </div>

      {/* Car Image */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="w-full h-28 sm:h-32 md:h-40 bg-gray-50 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
          <img 
            src="/car-img.png" 
            alt={car.model}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Car Features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 mb-3 sm:mb-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{car.seats} seats</span>
          </div>
          <div className="flex items-center gap-1">
            <Cog className="w-3 h-3" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <Snowflake className="w-3 h-3" />
            <span>{car.airCondition}</span>
          </div>
          <div className="flex items-center gap-1">
            <Luggage className="w-3 h-3" />
            <span>{car.bags} Bags</span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-3 sm:p-4 pt-0 mt-auto">
        <div className="md:flex md:justify-between md:items-start">
          {/* Left side - Price and Features */}
          <div className="flex-1 mb-3 sm:mb-4 md:mb-0">
            <div className="mb-2 sm:mb-3">
              <div className="text-red-600 font-medium text-xs sm:text-sm line-through mb-1">
                {car.originalPrice} {car.currency}
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                {car.price} {car.currency}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Price per day: {car.pricePerDay} {car.currency}
              </div>
            </div>
            
            <div className="space-y-1">
              {car.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Supplier and Button */}
          <div className="md:ml-2 lg:ml-4 flex flex-col items-end">
            <div className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-blue-100 text-[#0174b7] mb-2 sm:mb-3">
              {car.supplier}
            </div>
            
            <button 
              onClick={() => handleViewDeal(car)}
              className="bg-[#0174b7] hover:bg-[#005f8c] text-white font-semibold px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg transition-colors duration-200 w-full md:w-auto text-center text-sm sm:text-base"
            >
              View Deal
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header with Location and Date Selectors */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        {/* Mobile: Stack all elements vertically */}
        <div className="block md:hidden space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pick-up Location
            </label>
            <div 
              className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowLocationPicker(!showLocationPicker);
                setShowPickupCalendar(false);
                setShowDropoffCalendar(false);
                setShowTimePicker(false);
              }}
            >
              <span className="text-gray-700 text-sm truncate">
                {selectedLocation}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </div>
            {showLocationPicker && (
              <LocationPicker 
                onSelect={(location) => setSelectedLocation(location)}
                onClose={() => setShowLocationPicker(false)}
              />
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pick-up Date
              </label>
              <div 
                className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setShowPickupCalendar(!showPickupCalendar);
                  setShowDropoffCalendar(false);
                  setShowTimePicker(false);
                  setShowLocationPicker(false);
                }}
              >
                <span className="text-gray-700 text-sm truncate">
                  {selectedDates.pickupDate || 'Select Date'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
              </div>
              {showPickupCalendar && (
                <Calendar 
                  onDateSelect={(day) => handleDateSelect(day, 'pickupDate')}
                  onClose={() => setShowPickupCalendar(false)}
                />
              )}
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Drop-Off Date
              </label>
              <div 
                className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setShowDropoffCalendar(!showDropoffCalendar);
                  setShowPickupCalendar(false);
                  setShowTimePicker(false);
                  setShowLocationPicker(false);
                }}
              >
                <span className="text-gray-700 text-sm truncate">
                  {selectedDates.dropoffDate || 'Select Date'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
              </div>
              {showDropoffCalendar && (
                <Calendar 
                  onDateSelect={(day) => handleDateSelect(day, 'dropoffDate')}
                  onClose={() => setShowDropoffCalendar(false)}
                />
              )}
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <div 
                className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setShowTimePicker(!showTimePicker);
                  setShowPickupCalendar(false);
                  setShowDropoffCalendar(false);
                  setShowLocationPicker(false);
                }}
              >
                <span className="text-gray-700">
                  {selectedDates.time || 'Time'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
              {showTimePicker && (
                <TimePicker 
                  onTimeSelect={handleTimeSelect}
                  onClose={() => setShowTimePicker(false)}
                />
              )}
            </div>
            
            <button className="bg-[#0174b7] hover:bg-[#005f8c] text-white p-3 rounded-lg transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tablet: Compact horizontal layout */}
        <div className="hidden md:flex lg:hidden items-center gap-3">
          <div className="flex-1 relative min-w-[160px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Pick-up Location</label>
            <div 
              className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-2 py-1.5 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowLocationPicker(!showLocationPicker);
                setShowPickupCalendar(false);
                setShowDropoffCalendar(false);
                setShowTimePicker(false);
              }}
            >
              <span className="text-gray-700 text-sm truncate">
                {selectedLocation}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
            </div>
            {showLocationPicker && (
              <LocationPicker 
                onSelect={(location) => setSelectedLocation(location)}
                onClose={() => setShowLocationPicker(false)}
              />
            )}
          </div>
          
          <div className="flex-1 relative min-w-[120px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Pick-up Date</label>
            <div 
              className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-2 py-1.5 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowPickupCalendar(!showPickupCalendar);
                setShowDropoffCalendar(false);
                setShowTimePicker(false);
                setShowLocationPicker(false);
              }}
            >
              <span className="text-gray-700 text-sm truncate">
                {selectedDates.pickupDate || 'Select Date'}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
            </div>
            {showPickupCalendar && (
              <Calendar 
                onDateSelect={(day) => handleDateSelect(day, 'pickupDate')}
                onClose={() => setShowPickupCalendar(false)}
              />
            )}
          </div>
          
          <div className="flex-1 relative min-w-[120px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Drop-Off Date</label>
            <div 
              className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-2 py-1.5 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowDropoffCalendar(!showDropoffCalendar);
                setShowPickupCalendar(false);
                setShowTimePicker(false);
                setShowLocationPicker(false);
              }}
            >
              <span className="text-gray-700 text-sm truncate">
                {selectedDates.dropoffDate || 'Select Date'}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
            </div>
            {showDropoffCalendar && (
              <Calendar 
                onDateSelect={(day) => handleDateSelect(day, 'dropoffDate')}
                onClose={() => setShowDropoffCalendar(false)}
              />
            )}
          </div>
          
          <div className="relative min-w-[80px]">
            <div className="h-4 invisible">Time</div>
            <div 
              className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-2 py-1.5 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowTimePicker(!showTimePicker);
                setShowPickupCalendar(false);
                setShowDropoffCalendar(false);
                setShowLocationPicker(false);
              }}
            >
              <span className="text-gray-700 text-sm">
                {selectedDates.time || 'Time'}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </div>
            {showTimePicker && (
              <TimePicker 
                onTimeSelect={handleTimeSelect}
                onClose={() => setShowTimePicker(false)}
              />
            )}
          </div>
          
          <div className="pt-5">
            <button className="bg-[#0174b7] hover:bg-[#005f8c] text-white p-2 rounded-lg transition-colors duration-200">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop: Full horizontal layout */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex-1 lg:flex-[1.5] relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Location</label>
            <div 
              className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowLocationPicker(!showLocationPicker);
                setShowPickupCalendar(false);
                setShowDropoffCalendar(false);
                setShowTimePicker(false);
              }}
            >
              <span className="text-gray-700 truncate">
                {selectedLocation}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </div>
            {showLocationPicker && (
              <LocationPicker 
                onSelect={(location) => setSelectedLocation(location)}
                onClose={() => setShowLocationPicker(false)}
              />
            )}
          </div>
          
          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date</label>
            <div 
              className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowPickupCalendar(!showPickupCalendar);
                setShowDropoffCalendar(false);
                setShowTimePicker(false);
                setShowLocationPicker(false);
              }}
            >
              <span className="text-gray-700 text-sm md:text-base">
                {selectedDates.pickupDate || 'Select Date'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </div>
            {showPickupCalendar && (
              <Calendar 
                onDateSelect={(day) => handleDateSelect(day, 'pickupDate')}
                onClose={() => setShowPickupCalendar(false)}
              />
            )}
          </div>
          
          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Drop-Off Date</label>
            <div 
              className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowDropoffCalendar(!showDropoffCalendar);
                setShowPickupCalendar(false);
                setShowTimePicker(false);
                setShowLocationPicker(false);
              }}
            >
              <span className="text-gray-700 text-sm md:text-base">
                {selectedDates.dropoffDate || 'Select Date'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </div>
            {showDropoffCalendar && (
              <Calendar 
                onDateSelect={(day) => handleDateSelect(day, 'dropoffDate')}
                onClose={() => setShowDropoffCalendar(false)}
              />
            )}
          </div>
          
          <div className="flex-1 lg:flex-[0.8] relative">
            <div className="h-6 invisible">Time</div>
            <div 
              className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowTimePicker(!showTimePicker);
                setShowPickupCalendar(false);
                setShowDropoffCalendar(false);
                setShowLocationPicker(false);
              }}
            >
              <span className="text-gray-700">
                {selectedDates.time || 'Time'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            {showTimePicker && (
              <TimePicker 
                onTimeSelect={handleTimeSelect}
                onClose={() => setShowTimePicker(false)}
              />
            )}
          </div>
          
          <div className="pt-6 lg:pt-0 lg:pl-2">
            <button className="bg-[#0174b7] hover:bg-[#005f8c] text-white p-3 rounded-full transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Car Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {cars.map((car) => (
          <div key={car.id} className="w-full">
            <CarCard car={car} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarRentalCards;