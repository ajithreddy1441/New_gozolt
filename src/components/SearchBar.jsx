import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatDate = (day, currentMonth, currentYear) => {
  if (!day) return '';
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${monthNames[currentMonth]} ${currentYear}`;
};

const formatDateTime = (date, time) => {
  if (!date || !time) return '';
  
  // Parse the date (format: "20 Aug 2025")
  const dateParts = date.split(' ');
  const day = dateParts[0];
  const monthName = dateParts[1];
  const year = dateParts[2];
  
  // Convert month name to number
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIndex = monthNames.indexOf(monthName);
  
  // Create date object and format
  const dateObj = new Date(year, monthIndex, day);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = dayNames[dateObj.getDay()];
  
  // Format to match the API expectation (e.g., "Wed, Aug 20, 2025 10:00")
  return `${dayName}, ${monthName} ${day}, ${year} ${time}`;
};

const SearchBar = ({ onSearchStart, onSearchComplete }) => {
  const [selectedLocation, setSelectedLocation] = useState("Location");
  const [selectedDropoffLocation, setSelectedDropoffLocation] = useState("Location");
  const [selectedLocationCoords, setSelectedLocationCoords] = useState(null);
  const [selectedDropoffLocationCoords, setSelectedDropoffLocationCoords] = useState(null);
  const [returnSameLocation, setReturnSameLocation] = useState(true);
  const [selectedDates, setSelectedDates] = useState({
    pickupDate: "",
    pickupTime: "10:00",
    dropoffDate: "",
    dropoffTime: "10:00",
  });
  const [driverDetails, setDriverDetails] = useState({
    country: "PK",
    age: "25"
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showPickupCalendar, setShowPickupCalendar] = useState(false);
  const [showDropoffCalendar, setShowDropoffCalendar] = useState(false);
  const [showPickupTimePicker, setShowPickupTimePicker] = useState(false);
  const [showDropoffTimePicker, setShowDropoffTimePicker] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);

  const navigate = useNavigate();

  // Google Maps Autocomplete refs
  const locationInputRef = useRef(null);
  const dropoffLocationInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const dropoffAutocompleteRef = useRef(null);

  const countries = [
    { code: "PK", name: "Pakistan" },
    { code: "US", name: "United States" },
    { code: "UK", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "IN", name: "India" },
    { code: "AE", name: "UAE" },
  ];

  const ageRanges = [
    "18-25", "26-30", "31-35", "36-40", "41-45", "46-50", "51-55", "56-60", "60+"
  ];

  useEffect(() => {
    // If Google script already loaded, init autocomplete
    if (window.google && window.google.maps && window.google.maps.places) {
      initAutocomplete();
      return;
    }

    // Avoid adding the script multiple times
    const existing = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existing) {
      // If an existing script is present, hook into its onload or poll until available
      if (window.google && window.google.maps && window.google.maps.places) {
        initAutocomplete();
      } else {
        const onLoad = () => {
          setTimeout(() => {
            try { initAutocomplete(); } catch (e) { console.error('GM init error:', e); }
          }, 100);
        };
        existing.addEventListener('load', onLoad, { once: true });
        // Safety timeout in case 'load' already fired
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
      // Add a small delay to ensure Google Maps is fully loaded
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

    return () => {
      try {
        if (autocompleteRef.current && window.google && window.google.maps) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
        if (dropoffAutocompleteRef.current && window.google && window.google.maps) {
          window.google.maps.event.clearInstanceListeners(dropoffAutocompleteRef.current);
        }
      } catch (error) {
        console.error('Error cleaning up Google Maps listeners:', error);
      }
    };
  }, []);

  const initAutocomplete = () => {
    try {
      // More robust check for Google Maps API
      if (!window.google) {
        console.error('Google Maps API not loaded');
        return;
      }
      
      if (!window.google.maps) {
        console.error('Google Maps not available');
        return;
      }
      
      if (!window.google.maps.places) {
        console.error('Google Maps Places not available');
        return;
      }
      
      if (!window.google.maps.places.Autocomplete) {
        console.error('Google Maps Autocomplete not available');
        return;
      }

      if (locationInputRef.current) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          locationInputRef.current,
          { types: ["geocode", "establishment"] }
        );

        autocompleteRef.current.addListener("place_changed", () => {
          try {
            const place = autocompleteRef.current.getPlace();
            setSelectedLocation(place.name || place.formatted_address || "");
            
            // Extract coordinates
            if (place.geometry && place.geometry.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              setSelectedLocationCoords({ lat, lng });
            }
          } catch (error) {
            console.error('Error handling place selection:', error);
          }
        });
      }

      if (dropoffLocationInputRef.current && !returnSameLocation) {
        dropoffAutocompleteRef.current = new window.google.maps.places.Autocomplete(
          dropoffLocationInputRef.current,
          { types: ["geocode", "establishment"] }
        );

        dropoffAutocompleteRef.current.addListener("place_changed", () => {
          try {
            const place = dropoffAutocompleteRef.current.getPlace();
            setSelectedDropoffLocation(place.name || place.formatted_address || "");
            
            // Extract coordinates
            if (place.geometry && place.geometry.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              setSelectedDropoffLocationCoords({ lat, lng });
            }
          } catch (error) {
            console.error('Error handling dropoff place selection:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
    }
  };

  useEffect(() => {
    try {
      if (!returnSameLocation && dropoffLocationInputRef.current && window.google && window.google.maps && window.google.maps.places) {
        // Clean any previous instance before creating new one
        if (dropoffAutocompleteRef.current) {
          try { window.google.maps.event.clearInstanceListeners(dropoffAutocompleteRef.current); } catch {console.error('Error clearing previous dropoff autocomplete listeners');}
          dropoffAutocompleteRef.current = null;
        }

        dropoffAutocompleteRef.current = new window.google.maps.places.Autocomplete(
          dropoffLocationInputRef.current,
          { types: ["geocode", "establishment"] }
        );

        dropoffAutocompleteRef.current.addListener("place_changed", () => {
          try {
            const place = dropoffAutocompleteRef.current.getPlace();
            setSelectedDropoffLocation(place.name || place.formatted_address || "");
            
            // Extract coordinates
            if (place.geometry && place.geometry.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              setSelectedDropoffLocationCoords({ lat, lng });
            }
          } catch (error) {
            console.error('Error handling dropoff place selection:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error setting up dropoff autocomplete:', error);
    }

    // Cleanup when dependency changes (e.g., toggling back to same location removes input)
    return () => {
      if (dropoffAutocompleteRef.current && window.google && window.google.maps) {
        try { window.google.maps.event.clearInstanceListeners(dropoffAutocompleteRef.current); } catch {console.error('Error clearing dropoff autocomplete listeners');}
        dropoffAutocompleteRef.current = null;
      }
    };
  }, [returnSameLocation]);

  const timeOptions = [
    "00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30",
    "04:00","04:30","05:00","05:30","06:00","06:30","07:00","07:30",
    "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
    "12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
    "16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30",
    "20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30",
  ];

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

    // Additional validation for dates
    if (!selectedDates.pickupDate || selectedDates.pickupDate === "Select Date") {
      alert("Please select a pickup date");
      return;
    }

    if (!selectedDates.dropoffDate || selectedDates.dropoffDate === "Select Date") {
      alert("Please select a dropoff date");
      return;
    }

    if (onSearchStart) onSearchStart();

    // Format datetime strings for API
    const pickupDateTime = formatDateTime(selectedDates.pickupDate, selectedDates.pickupTime || "10:00");
    const dropoffDateTime = formatDateTime(selectedDates.dropoffDate, selectedDates.dropoffTime || "10:00");
    
    // Format location coordinates as JSON strings
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
      // Prepare form data for API call (x-www-form-urlencoded format)
      const formData = new URLSearchParams();
      formData.append('pickup_location', pickupLocationData);
      formData.append('dropoff_location', dropoffLocationData);
      formData.append('pickup_date', pickupDateTime);
      formData.append('dropoff_date', dropoffDateTime);
      formData.append('driver_age', driverDetails.age);
      formData.append('country', driverDetails.country);

      // Make API call
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
      
      // Navigate to search page with the API response data
      navigate(`/search`, { 
        state: { 
          carsData: data.data?.cars || [],
          searchParams: {
            location: selectedLocation,
            pickup_date: selectedDates.pickupDate,
            return_date: selectedDates.dropoffDate,
            pickup_time: selectedDates.pickupTime,
            return_time: selectedDates.dropoffTime,
            days: days,
            driver_age: driverDetails.age,
            country: driverDetails.country,
            pickup_location: pickupLocationData,
            dropoff_location: dropoffLocationData
          }
        }
      });

      if (onSearchComplete) onSearchComplete();
    } catch (error) {
      console.error('Error searching cars:', error);
      
      let errorMessage = 'Failed to search cars. Please try again.';
      if (error.message.includes('CORS')) {
        errorMessage = 'CORS error: Please check if the API allows requests from this domain.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error: Please check your internet connection.';
      }
      
      alert(errorMessage);
      
      // Even if API fails, navigate to search page with empty data
      navigate(`/search`, { 
        state: { 
          carsData: [],
          searchParams: {
            location: selectedLocation,
            pickup_date: selectedDates.pickupDate,
            return_date: selectedDates.dropoffDate,
            pickup_time: selectedDates.pickupTime,
            return_time: selectedDates.dropoffTime,
            days: 1,
            driver_age: driverDetails.age,
            country: driverDetails.country,
            pickup_location: pickupLocationData,
            dropoff_location: dropoffLocationData
          }
        }
      });
      
      if (onSearchComplete) onSearchComplete();
    }
  };

  const handleDateSelect = (day, type) => {
    const formattedDate = formatDate(day, currentMonth, currentYear);
    setSelectedDates((prev) => ({
      ...prev,
      [type]: formattedDate,
    }));

    if (type === "pickupDate") {
      setShowPickupCalendar(false);
    } else {
      setShowDropoffCalendar(false);
    }
  };

  const handleTimeSelect = (time, type) => {
    setSelectedDates((prev) => ({
      ...prev,
      [type]: time,
    }));
    if (type === "pickupTime") {
      setShowPickupTimePicker(false);
    } else {
      setShowDropoffTimePicker(false);
    }
  };

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((prev) => prev - 1);
      } else {
        setCurrentMonth((prev) => prev - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((prev) => prev + 1);
      } else {
        setCurrentMonth((prev) => prev + 1);
      }
    }
  };

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

  const isPastDate = (day) => {
    const today = new Date();
    const selectedDate = new Date(currentYear, currentMonth, day);
    return selectedDate < today.setHours(0, 0, 0, 0);
  };

  const Calendar = ({ onDateSelect, onClose }) => {
    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ];

    return (
      <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 left-0 right-0 md:w-80">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ◀
            </button>
            <h3 className="font-semibold text-gray-900">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth("next")}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ▶
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-lg leading-none"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-600 mb-2">
            <div>Sun</div><div>Mon</div><div>Tue</div>
            <div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => (
              <button
                key={index}
                onClick={() => day && !isPastDate(day) && onDateSelect(day)}
                disabled={!day || isPastDate(day)}
                className={`h-8 w-8 text-sm rounded ${
                  day && !isPastDate(day)
                    ? "hover:bg-blue-100 cursor-pointer text-gray-900"
                    : "text-gray-400 cursor-not-allowed"
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
    <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto md:w-48">
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

  const Dropdown = ({ options, onSelect, displayKey, valueKey }) => (
    <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto w-full">
      <div className="p-2">
        <div className="space-y-1">
          {options.map((option) => (
            <button
              key={valueKey ? option[valueKey] : option}
              onClick={() => onSelect(valueKey ? option[valueKey] : option)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
            >
              {displayKey ? option[displayKey] : option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-2xl rounded-3xl p-4">
      <div className="flex flex-col gap-4">
        {/* First Row */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Pick-up Location */}
          <div className="flex-1 relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pick-up Location
            </label>
            <input
              ref={locationInputRef}
              type="text"
              placeholder="Enter location"
              className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none"
              defaultValue={selectedLocation !== "Location" ? selectedLocation : ""}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                // Clear coordinates when manually typing
                if (e.target.value === "") {
                  setSelectedLocationCoords(null);
                }
                // Set default coordinates for testing if Google Maps fails
                if (e.target.value && !selectedLocationCoords) {
                  setSelectedLocationCoords({ lat: 35.8517424, lng: 14.4863361 });
                }
              }}
            />
          </div>

          {/* Drop-off Location (conditional) */}
          {!returnSameLocation && (
            <div className="flex-1 relative w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Drop-off Location
              </label>
              <input
                ref={dropoffLocationInputRef}
                type="text"
                placeholder="Enter location"
                className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none"
                defaultValue={selectedDropoffLocation !== "Location" ? selectedDropoffLocation : ""}
                onChange={(e) => {
                  setSelectedDropoffLocation(e.target.value);
                  // Set default coordinates for testing if Google Maps fails
                  if (e.target.value && !selectedDropoffLocationCoords) {
                    setSelectedDropoffLocationCoords({ lat: 35.8517424, lng: 14.4863361 });
                  }
                }}
              />
            </div>
          )}

          {/* Pick-up Date */}
          <div className="flex-1 relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedDates.pickupDate ? selectedDates.pickupDate : "Pickup date"}
            </label>
            <div
              className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowPickupCalendar(!showPickupCalendar);
                setShowDropoffCalendar(false);
                setShowPickupTimePicker(false);
                setShowDropoffTimePicker(false);
              }}
            >
              <span className="text-gray-700">
                {selectedDates?.pickupDate || "Select Date"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </div>
            {showPickupCalendar && (
              <Calendar
                onDateSelect={(day) => handleDateSelect(day, "pickupDate")}
                onClose={() => setShowPickupCalendar(false)}
              />
            )}
          </div>

          {/* Pick-up Time */}
          <div className="flex-1 relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedDates.pickupTime ? selectedDates.pickupTime : "Time"}
            </label>
            <div
              className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowPickupTimePicker(!showPickupTimePicker);
                setShowPickupCalendar(false);
                setShowDropoffCalendar(false);
                setShowDropoffTimePicker(false);
              }}
            >
              <span className="text-gray-700">
                {selectedDates?.pickupTime || "10:00"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            {showPickupTimePicker && (
              <TimePicker
                onTimeSelect={(time) => handleTimeSelect(time, "pickupTime")}
                onClose={() => setShowPickupTimePicker(false)}
              />
            )}
          </div>

          {/* Drop-off Date */}
          <div className="flex-1 relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedDates.dropoffDate ? selectedDates.dropoffDate : "Dropoff date"}
            </label>
            <div
              className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowDropoffCalendar(!showDropoffCalendar);
                setShowPickupCalendar(false);
                setShowPickupTimePicker(false);
                setShowDropoffTimePicker(false);
              }}
            >
              <span className="text-gray-700">
                {selectedDates?.dropoffDate || "Select Date"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </div>
            {showDropoffCalendar && (
              <Calendar
                onDateSelect={(day) => handleDateSelect(day, "dropoffDate")}
                onClose={() => setShowDropoffCalendar(false)}
              />
            )}
          </div>

          {/* Drop-off Time */}
          <div className="flex-1 relative w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedDates.dropoffTime ? selectedDates.dropoffTime : "Time"}
            </label>
            <div
              className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setShowDropoffTimePicker(!showDropoffTimePicker);
                setShowPickupCalendar(false);
                setShowDropoffCalendar(false);
                setShowPickupTimePicker(false);
              }}
            >
              <span className="text-gray-700">
                {selectedDates?.dropoffTime || "10:00"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            {showDropoffTimePicker && (
              <TimePicker
                onTimeSelect={(time) => handleTimeSelect(time, "dropoffTime")}
                onClose={() => setShowDropoffTimePicker(false)}
              />
            )}
          </div>

          {/* Search Button */}
          <div className="pt-6">
            <button
              onClick={handleSearch}
              className="bg-[#0174b7] hover:bg-[#005f8c] text-white p-3 rounded-full transition-colors duration-200"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Second Row */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Return car checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="returnSameLocation"
              checked={returnSameLocation}
              onChange={(e) => setReturnSameLocation(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="returnSameLocation" className="text-sm text-gray-700">
              Return car in the same location
            </label>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Driver Details */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Driver's country of residence is</span>
            
            {/* Country Dropdown */}
            <div className="relative">
              <div
                className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-3 py-1 cursor-pointer hover:bg-gray-100 min-w-[80px]"
                onClick={() => {
                  setShowCountryDropdown(!showCountryDropdown);
                  setShowAgeDropdown(false);
                }}
              >
                <span className="text-gray-700 text-sm">{driverDetails.country}</span>
                <ChevronDown className="w-3 h-3 text-gray-500 ml-2" />
              </div>
              {showCountryDropdown && (
                <Dropdown
                  options={countries}
                  onSelect={(countryCode) => {
                    setDriverDetails(prev => ({ ...prev, country: countryCode }));
                    setShowCountryDropdown(false);
                  }}
                  onClose={() => setShowCountryDropdown(false)}
                  displayKey="name"
                  valueKey="code"
                />
              )}
            </div>

            <span className="text-sm text-gray-700">and age is</span>

            {/* Age Dropdown */}
            <div className="relative">
              <div
                className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded px-3 py-1 cursor-pointer hover:bg-gray-100 min-w-[80px]"
                onClick={() => {
                  setShowAgeDropdown(!showAgeDropdown);
                  setShowCountryDropdown(false);
                }}
              >
                <span className="text-gray-700 text-sm">{driverDetails.age}</span>
                <ChevronDown className="w-3 h-3 text-gray-500 ml-2" />
              </div>
              {showAgeDropdown && (
                <Dropdown
                  options={ageRanges}
                  onSelect={(age) => {
                    setDriverDetails(prev => ({ ...prev, age }));
                    setShowAgeDropdown(false);
                  }}
                  onClose={() => setShowAgeDropdown(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;