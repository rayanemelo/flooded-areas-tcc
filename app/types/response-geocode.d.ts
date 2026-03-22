export type ResGeocode = {
  results: Result[];
  status: string;
};

type Result = {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  types: string[];
};
