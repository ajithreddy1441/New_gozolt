import React, { useState } from 'react';
import { 
  MapPin, Search, ChevronUp, Car, Users, Settings, CreditCard, Euro, 
  Building2, Filter, X, ChevronDown, Plane, Fuel, Navigation, Umbrella, 
  Route, Ban, UserPlus, Coins 
} from 'lucide-react';

const HeaderSearch = ({ 
  selectedLocation = 'Malta International Airport',
  setSelectedLocation,
  selectedDates = {
    pickupDate: '',
    dropoffDate: '',
    time: ''
  },
  setSelectedDates,
  currentMonth = new Date().getMonth(),
  setCurrentMonth,
  currentYear = new Date().getFullYear(),
  setCurrentYear
}) => {
  // Search component states
  const [showPickupCalendar, setShowPickupCalendar] = useState(false);
  const [showDropoffCalendar, setShowDropoffCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  
  // Filter states
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    carType: '',
    fuelPolicy: [],
    pickupLocation: [],
    transmission: [],
    seats: [],
    mileage: [],
    cancellation: [],
    additionalDriver: [],
    debitCard: [],
    deposit: []
  });
  const [expandedMobileSection, setExpandedMobileSection] = useState(null);

  // Data
  const locations = [
    'Malta International Airport',
    'Valletta Cruise Port',
    'Gozo Ferry Terminal',
    'Sliema Ferries',
    'St. Julian\'s',
    'Bugibba'
  ];

  const timeOptions = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
    '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];

  // Filter data from the images
  const filterOptions = {
    carType: [
      { label: 'Small Cars', price: '$44.59' },
      { label: 'Medium Cars', price: '$44.59' },
      { label: 'Large Cars', price: '$80.33' },
      { label: 'Estate Cars', price: '$95.24' },
      { label: 'SUVs Popular', price: '$82.53' },
      { label: 'People carriers', price: '$103.21' },
      { label: 'Premium', price: '$136.25' }
    ],
    fuelPolicy: [
      { label: 'Full / Empty', price: '$121.44' },
      { label: 'Full / Full Recommended', price: '$52.42' }
    ],
    pickupLocation: [
      { label: 'On airport', price: '$52.42' },
      { label: 'Free Shuttle', price: '$44.59' }
    ],
    transmission: [
      { label: 'Automatic', price: '$65.41' },
      { label: 'Manual', price: '$44.59' }
    ],
    seats: [
      { label: '7 seats', price: '$194.24' },
      { label: '9 seats', price: '$195.71' }
    ],
    mileage: [
      { label: 'Unlimited', price: '$44.59' }
    ],
    cancellation: [
      { label: 'Free cancellation', price: '$44.59' }
    ],
    additionalDriver: [
      { label: 'Add price of additional driver' }
    ],
    debitCard: [
      { label: 'Accepts Debit Card', price: '$58.19' }
    ],
    deposit: [
      { label: 'Less than $500', price: '$98.87' },
      { label: 'Less than $750', price: '$93.43' }
    ]
  };

  const mobileFilterSections = [
    { id: 'carType', title: 'Car type', icon: Car },
    { id: 'fuelPolicy', title: 'Fuel Policy', icon: Fuel },
    { id: 'pickupLocation', title: 'Pick-up Location', icon: Navigation },
    { id: 'transmission', title: 'Transmission', icon: Settings },
    { id: 'seats', title: 'Number of Seats', icon: Users },
    { id: 'mileage', title: 'Mileage', icon: Route },
    { id: 'cancellation', title: 'Cancellation', icon: Ban },
    { id: 'additionalDriver', title: 'Additional driver', icon: UserPlus },
    { id: 'debitCard', title: 'Debit Card', icon: CreditCard },
    { id: 'deposit', title: 'Deposit on Pick-up', icon: Coins }
  ];

  // Helper functions
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
        setCurrentYear(prev => prev - 1);
      } else {
        setCurrentMonth(prev => prev - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(prev => prev + 1);
      } else {
        setCurrentMonth(prev => prev + 1);
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

  // Filter functions
  const handleFilterChange = (category, value) => {
    if (category === 'carType') {
      setSelectedFilters(prev => ({
        ...prev,
        [category]: prev[category] === value ? '' : value
      }));
    } else {
      setSelectedFilters(prev => ({
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter(item => item !== value)
          : [...prev[category], value]
      }));
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedFilters.carType) count++;
    count += selectedFilters.fuelPolicy.length;
    count += selectedFilters.pickupLocation.length;
    count += selectedFilters.transmission.length;
    count += selectedFilters.seats.length;
    count += selectedFilters.mileage.length;
    count += selectedFilters.cancellation.length;
    count += selectedFilters.additionalDriver.length;
    count += selectedFilters.debitCard.length;
    count += selectedFilters.deposit.length;
    return count;
  };

  const toggleMobileSection = (section) => {
    setExpandedMobileSection(prev => prev === section ? null : section);
  };

  // Components
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

  return (
    <div className="space-y-4">
      {/* Search Component */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        {/* Mobile view */}
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
                  {selectedDates?.pickupDate || 'Select Date'}
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
                  {selectedDates?.dropoffDate || 'Select Date'}
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
                  {selectedDates?.time || 'Time'}
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

        {/* Tablet view */}
        <div className="hidden md:flex lg:hidden items-center justify-center gap-3">
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
                {selectedDates?.pickupDate || 'Select Date'}
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
                {selectedDates?.dropoffDate || 'Select Date'}
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
                {selectedDates?.time || 'Time'}
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

        {/* Desktop view */}
        <div className="hidden lg:flex items-center justify-center gap-4">
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
                {selectedDates?.pickupDate || 'Select Date'}
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
                {selectedDates?.dropoffDate || 'Select Date'}
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
                {selectedDates?.time || 'Time'}
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

      {/* Mobile Filter Bar */}
      <div className="lg:hidden bg-gray-100 p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-700">All Filters</span>
          <span className="text-sm text-gray-500">Popular filters</span>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm font-medium whitespace-nowrap"
          >
            <Filter className="w-3 h-3" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
          
          <button
            onClick={() => handleFilterChange('pickupLocation', 'On airport')}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedFilters.pickupLocation.includes('On airport')
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            <Plane className="w-3 h-3" />
            On airport
          </button>
          
          <button
            onClick={() => handleFilterChange('transmission', 'Automatic')}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedFilters.transmission.includes('Automatic')
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            Automatic
          </button>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="bg-white h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-slate-800">
              <h2 className="text-base font-semibold text-white">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Sections */}
            <div className="flex-1 overflow-y-auto">
              {mobileFilterSections.map((section) => (
                <div key={section.id} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleMobileSection(section.id)}
                    className="flex items-center justify-between w-full py-3 px-4 text-left"
                  >
                    <div className="flex items-center gap-2">
                      {section.icon && <section.icon className="w-4 h-4 text-gray-600" />}
                      <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${expandedMobileSection === section.id ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedMobileSection === section.id && (
                    <div className="px-4 pb-3 bg-gray-50">
                      <div className="space-y-2">
                        {filterOptions[section.id]?.map((option) => (
                          <label 
                            key={option.label} 
                            className="flex items-center justify-between py-2 px-2 cursor-pointer hover:bg-gray-100 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={
                                  section.id === 'carType' 
                                    ? selectedFilters.carType === option.label
                                    : selectedFilters[section.id]?.includes(option.label)
                                }
                                onChange={() => handleFilterChange(section.id, option.label)}
                                className="w-4 h-4 text-[#0174b7] border-gray-300 rounded focus:ring-[#0174b7]"
                              />
                              <span className="text-sm text-gray-700">{option.label}</span>
                            </div>
                            {option.price && (
                              <span className="text-sm font-medium text-gray-900">{option.price}</span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Apply Filters Button */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-2.5 bg-[#0174b7] hover:bg-[#005f8c] text-white font-medium rounded-lg transition-colors duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderSearch;