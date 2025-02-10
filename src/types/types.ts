export enum PharmacyStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export interface Pharmacy {
  id: string;
  name: string;
  location: string;
  hours: string;
  open_hours: string;
  status: PharmacyStatus;
  latitude: number;
  longitude: number;
  email: string;
  phone: string;
  address: string;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  quantity: number;
  image_url?: string;
  pharmacy_id: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}
