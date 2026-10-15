export type SalonStatus = 'active' | 'pending' | 'incomplete' | 'suspended';

export interface Salon {
  id: string;
  name: string;
  tradeName: string; // Razão Social
  cnpjCpf: string;
  slug: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  category: 'barbearia' | 'salao' | 'estetica' | 'esmalteria' | 'spa';
  status: SalonStatus;
  isVerified: boolean;
  rating: number;
  activeSlotsCount: number;
  totalAppointments: number;
  suspensionReason?: string;
  createdAt: string;
}

export interface LightningSlot {
  id: string;
  salonId: string;
  salonName: string;
  serviceName: string;
  professionalName: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  slotTime: string;
  status: 'available' | 'booked' | 'expired';
}

export interface AppointmentAudit {
  id: string;
  salonId: string;
  salonName: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  professionalName: string;
  scheduledAt: string;
  totalPrice: number;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no_show';
}

export interface InfraCheck {
  service: string;
  target: string;
  status: 'operational' | 'degraded' | 'maintenance';
  latencyMs: number;
  lastChecked: string;
  details: string;
}

export interface TechnicalCommunique {
  id: string;
  code: string;
  title: string;
  scope: 'schema' | 'enum' | 'route' | 'design_system';
  affectedApps: ('pvapp' | 'mnvapp')[];
  impactPvapp: string;
  impactMnvapp: string;
  sqlMigration: string;
  publishedAt: string;
  author: string;
}
