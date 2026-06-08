export interface AppUser {
  id: string;
  username: string;
  password: string;
  full_name: string;
  role: string;
  email: string;
  avatar: string;
  department: string;
  permissions: string[];
}

export const ROLES = {
  SEAFARER: 'Seafarer',
  LOGISTICS_OPERATOR: 'Logistics Operator',
  VESSEL_OWNER: 'Vessel Owner',
  ADMIN: 'System Administrator',
};

export const mockAppUsers: AppUser[] = [
  // Seafarer
  {
    id: 'SF-2024-0001', username: 'abebe.girma', password: 'seafarer123',
    full_name: 'Abebe Girma', role: ROLES.SEAFARER, avatar: 'AG',
    email: 'abebe.g@email.com', department: 'Seafarer Portal',
    permissions: ['view_own_profile', 'submit_applications', 'upload_documents', 'view_status', 'download_certificates'],
  },
  {
    id: 'SF-2024-0002', username: 'tigist.haile', password: 'seafarer123',
    full_name: 'Tigist Haile', role: ROLES.SEAFARER, avatar: 'TH',
    email: 'tigist.h@email.com', department: 'Seafarer Portal',
    permissions: ['view_own_profile', 'submit_applications', 'upload_documents', 'view_status', 'download_certificates'],
  },

  // Vessel Owner
  {
    id: 'OWN-001', username: 'vessel.owner', password: 'owner123',
    full_name: 'Lake Tana Transport PLC', role: ROLES.VESSEL_OWNER, avatar: 'LT',
    email: 'info@laketana.et', department: 'Vessel Owner Portal',
    permissions: ['manage_owner_profile', 'register_vessels', 'upload_vessel_documents', 'request_inspections', 'apply_permits', 'apply_licenses', 'request_transfers', 'request_vessel_services', 'view_status'],
  },

  // Logistics Operator
  {
    id: 'LOG-2024-001', username: 'logistics.operator', password: 'operator123',
    full_name: 'Ethiopian Freight Forwarders Ltd', role: ROLES.LOGISTICS_OPERATOR, avatar: 'EF',
    email: 'info@eff.et', department: 'Logistics Operator Portal',
    permissions: ['manage_operator_profile', 'register_company', 'upload_company_documents', 'update_company_information', 'apply_registration_approval', 'apply_license_renewal', 'view_status'],
  },

  // System Administrator
  {
    id: 'USR-001', username: 'admin', password: 'admin123',
    full_name: 'System Administrator', role: ROLES.ADMIN, avatar: 'SA',
    email: 'admin@mlms.gov.et', department: 'IT Administration',
    permissions: ['*'],
  },
];
