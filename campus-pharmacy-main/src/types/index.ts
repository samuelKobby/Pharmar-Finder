export interface Medication {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  availability: boolean;
}

export interface Pharmacy {
  id: string;
  name: string;
  location: string;
  contact: string;
  medications: string[]; // Array of medication IDs
}