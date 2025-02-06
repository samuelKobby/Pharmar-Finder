export interface Pharmacy {
  id: string;
  name: string;
  location: string;
  contact: string;
  medications: string[]; // Array of medication IDs
  openingHours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}