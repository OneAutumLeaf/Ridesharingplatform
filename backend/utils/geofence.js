// backend/utils/geofence.js
const haversineDistance = (coords1, coords2) => {
  const toRadians = (value) => (value * Math.PI) / 180;
  const R = 6371e3; // Earth's radius in meters

  const lat1 = toRadians(coords1.latitude);
  const lon1 = toRadians(coords1.longitude);
  const lat2 = toRadians(coords2.latitude);
  const lon2 = toRadians(coords2.longitude);
  // const lat1 = toRad(coords1.latitude);
  // const lat2 = toRad(coords2.latitude);
  // const deltaLat = toRad(coords2.latitude - coords1.latitude);
  // const deltaLon = toRad(coords2.longitude - coords1.longitude);
  const deltaLat = lat2 - lat1;
  const deltaLon = lon2 - lon1;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const isWithinRadius = (currentLocation, destination, radius=500 ) => {
  const distance = haversineDistance(currentLocation, destination);
  return distance <= radius;
};

module.exports = { isWithinRadius };
