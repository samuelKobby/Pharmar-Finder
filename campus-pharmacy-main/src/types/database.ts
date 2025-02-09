export interface Pharmacy {
  id: string;
  name: string;
  location: string;
  phone: string;
  email: string | null;
  description: string | null;
  image_url: string | null;
  operating_hours: {
    hours: string;
  };
  coordinates: {
    latitude: number | null;
    longitude: number | null;
  };
  created_at: string;
  updated_at: string;
}

export type PharmacyStatus = 'pending' | 'approved' | 'rejected';

export interface ActivityLog {
  id: string;
  action_type: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, any>;
  created_at: string;
}
