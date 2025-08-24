import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const HeaderSearch = ({
  // selectedLocation,
  // setSelectedLocation,
  // selectedDropoffLocation,
  // setSelectedDropoffLocation,
  // selectedDates,
  // setSelectedDates,
  // currentMonth,
  // setCurrentMonth,
  // currentYear,
  // setCurrentYear,
  setCarsData,
  pickupInputRef,
  dropoffInputRef,
}) => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDropoffLocation, setSelectedDropoffLocation] = useState("");
  const [selectedDates, setSelectedDates] = useState({
    pickupDate: "",
    pickupTime: "",
    dropoffDate: "",
    dropoffTime: "",
  });
  const [selectedLocationCoords, setSelectedLocationCoords] = useState(null);
  const [selectedDropoffLocationCoords, setSelectedDropoffLocationCoords] = useState(null);
  const [returnSameLocation, setReturnSameLocation] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showPickupCalendar, setShowPickupCalendar] = useState(false);
  const [showDropoffCalendar, setShowDropoffCalendar] = useState(false);
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
  const [showDropoffTimePicker, setShowDropoffTimePicker] = useState(false);

  // --- Google Places Autocomplete Setup ---
  useEffect(() => {
    function initAutocomplete() {
      if (window.google && pickupInputRef.current) {
        const autocompletePickup = new window.google.maps.places.Autocomplete(pickupInputRef.current);
        autocompletePickup.addListener('place_changed', () => {
          const place = autocompletePickup.getPlace();
          setSelectedLocation(place.formatted_address || place.name || "");
        });
      }
      if (window.google && dropoffInputRef.current) {
        const autocompleteDropoff = new window.google.maps.places.Autocomplete(dropoffInputRef.current);
        autocompleteDropoff.addListener('place_changed', () => {
          const place = autocompleteDropoff.getPlace();
          setSelectedDropoffLocation(place.formatted_address || place.name || "");
        });
      }
    }

    // Avoid adding the script multiple times
    const existing = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existing) {
      if (window.google && window.google.maps && window.google.maps.places) {
        initAutocomplete();
      } else {
        const onLoad = () => {
          setTimeout(() => {
            try { initAutocomplete(); } catch (e) { console.error('GM init error:', e); }
          }, 100);
        };
        existing.addEventListener('load', onLoad, { once: true });
        setTimeout(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            onLoad();
          }
        }, 300);
      }
      return;
    }

    // Load script dynamically
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAJ-WXNgyWkKtAzSQuiwnCoSiFQ4tNK_j0&libraries=places";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setTimeout(() => {
        try {
          initAutocomplete();
        } catch (error) {
          console.error('Error initializing Google Maps Autocomplete:', error);
        }
      }, 100);
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps API');
    };
    document.body.appendChild(script);
  }, [pickupInputRef, dropoffInputRef, setSelectedLocation, setSelectedDropoffLocation]);
  // --- End Google Places Autocomplete Setup ---

  // Removed static locations array

  // Removed static timeOptions array, define it inline for TimePicker
  const timeOptions = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
    '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];

  // Helper functions (unchanged)
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);
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
    if (type === 'pickupDate') setShowPickupCalendar(false);
    else setShowDropoffCalendar(false);
  };

  const handleTimeSelect = (time, type) => {
    setSelectedDates(prev => ({
      ...prev,
      [type]: time
    }));
    if (type === 'pickupTime') setShowPickupTimePicker(false);
    else setShowDropoffTimePicker(false);
  };

  // Components
  const Calendar = ({ onDateSelect, onClose, showDays = true }) => {
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
          {showDays && (
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((day, index) => (
                <button
                  key={index}
                  onClick={() => day && !isPastDate(day) && onDateSelect(day)}
                  disabled={!day || isPastDate(day)}
                  className={`h-8 w-8 text-sm rounded ${day && !isPastDate(day)
                    ? "hover:bg-blue-100 cursor-pointer text-gray-900"
                    : "text-gray-400 cursor-not-allowed"
                    }`}
                >
                  {day}
                </button>
              ))}
            </div>
          )}
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

  // API call
  const formatDateTime = (date, time) => {
    if (!date || !time) return '';
    const dateParts = date.split(' ');
    const day = dateParts[0];
    const monthName = dateParts[1];
    const year = dateParts[2];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = monthNames.indexOf(monthName);
    const dateObj = new Date(year, monthIndex, day);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[dateObj.getDay()];
    return `${dayName}, ${monthName} ${day}, ${year} ${time}`;
  };

  const onSearchStart = () => { };
  const onSearchComplete = () => { };

  const handleSearch = async () => {
    if (
      !selectedLocation ||
      selectedLocation === "Location" ||
      !selectedLocationCoords ||
      (!returnSameLocation && (!selectedDropoffLocation || selectedDropoffLocation === "Location" || !selectedDropoffLocationCoords)) ||
      !selectedDates.pickupDate ||
      !selectedDates.dropoffDate
    ) {
      alert("Please fill in all search fields");
      return;
    }

    if (!selectedDates.pickupDate || selectedDates.pickupDate === "Select Date") {
      alert("Please select a pickup date");
      return;
    }

    if (!selectedDates.dropoffDate || selectedDates.dropoffDate === "Select Date") {
      alert("Please select a dropoff date");
      return;
    }

    onSearchStart();

    const pickupDateTime = formatDateTime(selectedDates.pickupDate, selectedDates.pickupTime || "10:00");
    const dropoffDateTime = formatDateTime(selectedDates.dropoffDate, selectedDates.dropoffTime || "10:00");

    const pickupLocationData = JSON.stringify({
      lat: selectedLocationCoords.lat,
      lng: selectedLocationCoords.lng
    });

    const dropoffLocationData = returnSameLocation
      ? JSON.stringify({
        lat: selectedLocationCoords.lat,
        lng: selectedLocationCoords.lng
      })
      : JSON.stringify({
        lat: selectedDropoffLocationCoords.lat,
        lng: selectedDropoffLocationCoords.lng
      });

    try {
      const formData = new URLSearchParams();
      formData.append('pickup_location', pickupLocationData);
      formData.append('dropoff_location', dropoffLocationData);
      formData.append('pickup_date', pickupDateTime);
      formData.append('dropoff_date', dropoffDateTime);
      formData.append('driver_age', "");
      formData.append('country', "");

      const response = await fetch('https://api.rentnrides.com/api/search-car', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      // Calculate rental days
      const pickupDate = new Date(pickupDateTime);
      const dropoffDate = new Date(dropoffDateTime);
      const diffTime = Math.abs(dropoffDate - pickupDate);
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Pass data to parent if needed
      if (setCarsData) setCarsData(data.data?.cars || []);

      onSearchComplete();
    } catch (error) {
      console.error('Error searching cars:', error);

      let errorMessage = 'Failed to search cars. Please try again.';
      if (error.message.includes('CORS')) {
        errorMessage = 'CORS error: Please check if the API allows requests from this domain.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error: Please check your internet connection.';
      }

      alert(errorMessage);

      if (setCarsData) setCarsData([]);
      onSearchComplete();
    }
  };
  // const handleSearch = async () => {
  //   if (
  //     !selectedLocation ||
  //     selectedLocation === "Location" ||
  //     !selectedLocationCoords ||
  //     (!returnSameLocation && (!selectedDropoffLocation || selectedDropoffLocation === "Location" || !selectedDropoffLocationCoords)) ||
  //     !selectedDates.pickupDate ||
  //     !selectedDates.dropoffDate
  //   ) {
  //     alert("Please fill in all search fields");
  //     return;
  //   }

  //   // Additional validation for dates
  //   if (!selectedDates.pickupDate || selectedDates.pickupDate === "Select Date") {
  //     alert("Please select a pickup date");
  //     return;
  //   }

  //   if (!selectedDates.dropoffDate || selectedDates.dropoffDate === "Select Date") {
  //     alert("Please select a dropoff date");
  //     return;
  //   }

  //   if (onSearchStart) onSearchStart();

  //   // Format datetime strings for API
  //   const pickupDateTime = formatDateTime(selectedDates.pickupDate, selectedDates.pickupTime || "10:00");
  //   const dropoffDateTime = formatDateTime(selectedDates.dropoffDate, selectedDates.dropoffTime || "10:00");

  //   // Format location coordinates as JSON strings
  //   const pickupLocationData = JSON.stringify({
  //     lat: selectedLocationCoords.lat,
  //     lng: selectedLocationCoords.lng
  //   });

  //   const dropoffLocationData = returnSameLocation
  //     ? JSON.stringify({
  //       lat: selectedLocationCoords.lat,
  //       lng: selectedLocationCoords.lng
  //     })
  //     : JSON.stringify({
  //       lat: selectedDropoffLocationCoords.lat,
  //       lng: selectedDropoffLocationCoords.lng
  //     });

  //   try {
  //     // Prepare form data for API call (x-www-form-urlencoded format)
  //     const formData = new URLSearchParams();
  //     formData.append('pickup_location', pickupLocationData);
  //     formData.append('dropoff_location', dropoffLocationData);
  //     formData.append('pickup_date', pickupDateTime);
  //     formData.append('dropoff_date', dropoffDateTime);
  //     formData.append('driver_age', "");
  //     formData.append('country', "");

  //     // Make API call
  //     const response = await fetch('https://api.rentnrides.com/api/search-car', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       body: formData.toString()
  //     });

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       console.error('API Error Response:', errorText);
  //       throw new Error(`HTTP ${response.status}: ${errorText}`);
  //     }

  //     const data = await response.json();

  //     // Calculate rental days
  //     const pickupDate = new Date(pickupDateTime);
  //     const dropoffDate = new Date(dropoffDateTime);
  //     const diffTime = Math.abs(dropoffDate - pickupDate);
  //     const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  //     if (onSearchComplete) onSearchComplete();
  //   } catch (error) {
  //     console.error('Error searching cars:', error);

  //     let errorMessage = 'Failed to search cars. Please try again.';
  //     if (error.message.includes('CORS')) {
  //       errorMessage = 'CORS error: Please check if the API allows requests from this domain.';
  //     } else if (error.message.includes('Network')) {
  //       errorMessage = 'Network error: Please check your internet connection.';
  //     }

  //     alert(errorMessage);
  //   }
  // };

  return (
    <div className="space-y-4 mb-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">

        {/* Desktop view */}
        <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-4">

          <div className="flex-1 lg:flex-[1.5] relative">
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Location</label> */}
            <input
              ref={pickupInputRef}
              type="text"
              className="w-full bg-white border border-gray-300 rounded-full px-3 py-2 text-gray-700 focus:outline-none"
              placeholder="Enter pick-up location"
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="flex-1 lg:flex-[1.5] relative">
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">Drop-off Location</label> */}
            <input
              ref={dropoffInputRef}
              type="text"
              className="w-full bg-white border border-gray-300 rounded-full px-3 py-2 text-gray-700 focus:outline-none"
              placeholder="Enter drop-off location"
              value={selectedDropoffLocation}
              onChange={e => setSelectedDropoffLocation(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="flex-1 relative">
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">Pick-u Date</label> */}
            <div
              className="flex items-center justify-between bg-white border border-gray-300 rounded-full px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowPickupCalendar(!showPickupCalendar);
                setShowDropoffCalendar(false);
                setShowPickupTimePicker(false);
                setShowDropoffTimePicker(false);
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

          <div className="flex-1 lg:flex-[0.8] relative">
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">Time</label> */}
            <div
              className="flex items-center justify-between bg-white border border-gray-300 rounded-full px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowPickupTimePicker(!showPickupTimePicker);
                setShowPickupCalendar(false);
                setShowDropoffCalendar(false);
                setShowDropoffTimePicker(false);
              }}
            >
              <span className="text-gray-700">
                {selectedDates?.pickupTime || 'Select Time'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            {showPickupTimePicker && (
              <TimePicker
                onTimeSelect={(time) => handleTimeSelect(time, 'pickupTime')}
                onClose={() => setShowPickupTimePicker(false)}
              />
            )}
          </div>

          <div className="flex-1 relative">
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">Drop-off Date</label> */}
            <div
              className="flex items-center justify-between bg-white border border-gray-300 rounded-full px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowDropoffCalendar(!showDropoffCalendar);
                setShowPickupCalendar(false);
                setShowPickupTimePicker(false);
                setShowDropoffTimePicker(false);
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
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">Time</label> */}
            <div
              className="flex items-center justify-between bg-white border border-gray-300 rounded-full px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowDropoffTimePicker(!showDropoffTimePicker);
                setShowPickupCalendar(false);
                setShowDropoffCalendar(false);
                setShowPickupTimePicker(false);
              }}
            >
              <span className="text-gray-700">
                {selectedDates?.dropoffTime || 'Select Time'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            {showDropoffTimePicker && (
              <TimePicker
                onTimeSelect={(time) => handleTimeSelect(time, 'dropoffTime')}
                onClose={() => setShowDropoffTimePicker(false)}
              />
            )}
          </div>

          <div></div>
          <div></div>
          <div className='hidden xl:block'></div>
          <div className="pt-6 lg:pt-0 lg:pl-2 flex items-end justify-end">
            <button className="w-full lg:w-min bg-[#0174b7] hover:bg-[#005f8c] text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              onClick={handleSearch}
            >
              <Search className="w-5 h-5" />
              <span className='lg:hidden'>Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSearch;