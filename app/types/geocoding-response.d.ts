export interface GeocodingResponse {
  plus_code: PlusCode;
  results: Result[];
  status: string;
}

export interface PlusCode {
  compound_code: string;
  global_code: string;
}

export interface Result {
  address_components: any[];
  formatted_address: string;
  geometry: Geometry[];
  navigation_points?: any[];
  place_id: string;
  plus_code?: Geometry[];
  types: any[];
}

export interface Geometry {}
