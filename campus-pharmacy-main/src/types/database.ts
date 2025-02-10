export interface Pharmacy {
  id: string;
  name: string;
  location: string;
  phone: string;
  email: string | null;
  description: string | null;
  image_url: string | null;
  open_hours: string;
  hours: string;
  latitude: number;
  longitude: number;
  available?: boolean;
  created_at: string;
  updated_at: string;
}

export type PharmacyStatus = 'active' | 'approved' | 'suspended' | 'pending';

export interface ActivityLog {
  id: string;
  action_type: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, any>;
  created_at: string;
}
