type Coordenates = {
  latArea: number;
  lonArea: number;
  latUser: number;
  lonUser: number;
};

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  // Raio da Terra em metros
  const R = 6371000;

  // Converter graus para radianos
  const phi1 = lat1 * (Math.PI / 180);
  const phi2 = lat2 * (Math.PI / 180);
  const deltaPhi = (lat2 - lat1) * (Math.PI / 180);
  const deltaLambda = (lon2 - lon1) * (Math.PI / 180);

  // Fórmula de Haversine
  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distância em metros
  const distance = R * c;
  return distance;
}

export function isWithinRadius(coordenates: Coordenates) {
  const { latArea, lonArea, latUser, lonUser } = coordenates;
  const radius = 100;
  const distance = haversine(latUser, lonUser, latArea, lonArea);
  return distance <= radius;
}
