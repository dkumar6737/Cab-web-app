const axios = require('axios');
const captainModel = require('../models/captain.model');


module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.API_KEY;
    const url = `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        if (!address || typeof address !== 'string' || address.trim() === '') {
            throw new Error('Invalid address input');
        }

        const response = await axios.get(url);
        console.log('Geocoding API response:', JSON.stringify(response.data, null, 2));

        if (response.data.status === 'OK' && response.data.results.length > 0) {
            const location = response.data.results[0]?.geometry?.location;

            if (location && typeof location.lat === 'number' && typeof location.lng === 'number') {
                return {
                    lat: location.lat,
                    lng: location.lng,
                };
            } else {
                console.error('Coordinates are invalid or missing in the API response');
                throw new Error('Invalid coordinates in API response');
            }
        } else if (response.data.status === 'ZERO_RESULTS') {
            console.error('No results found for the provided address');
            throw new Error('No coordinates found for the given address');
        } else {
            console.error(
                `Geocoding API error: ${response.data.status} - ${response.data.error_message || 'Unknown error'}`
            );
            throw new Error('Geocoding API error');
        }
    } catch (error) {
        console.error('Error in getAddressCoordinate:', error.message);
        throw new Error(error.message || 'Unable to fetch address coordinates');
    }
};


module.exports.getDistanceTime = async (origin, destination) => {
    const apiKey = process.env.API_KEY;
    const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.rows[0].elements[0].status === 'ZERO_RESULTS') {
            throw new Error('No data found');
        }
        return response.data.rows[0].elements[0];
    } catch (err) {
        console.log(err);
        throw new Error('Unable to fetch distance and time');
    }
}




module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Query is required');
    }

    const apiKey = process.env.API_KEY;
    const url = `https://maps.gomaps.pro/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions;
        } else {
            throw new Error('Unable to fetch suggestions!');
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// module.exports.getCaptainsInTheRadius = async (lat, lng, radius) => {
//     const captainsInRadius = await captainModel.find({
//         location: {
//             $near: {
//                 $geometry: { type: "Point", coordinates: [lng, lat] }, // Use lng and lat directly
//                 $maxDistance: radius * 5000 // convert km to meters
//             }
//         }
//     });

//     console.log('Captains in radius:', captainsInRadius);
//     return captainsInRadius;
// };


module.exports.getCaptainsInTheRadius = async () => {
    console.log("Fetching all active captains...");

    try { 
        const activeCaptains = await captainModel.find({ status: "active" });

        console.log('Active Captains found:', activeCaptains.length);
        return activeCaptains;
    } catch (err) {
        console.error("Error fetching active captains:", err);
        return [];
    }
};
