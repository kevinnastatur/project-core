export type WarrantyStatus = 0 | 1 | 2 | 3;

export interface WarrantyItem {
  id: string;
  warranty_id: string;
  warranty_code: string;
  plate_number: string;
  warranty_date: string;
  purchase_date: string;
  status: WarrantyStatus;
}

export interface Tire {
  id: number;
  tire_type: string;
  tire_size: string;
  barcode: string;
  tire_number: string;
}

export interface WarrantyRegisterData {
  storeid: number;

  brand: string;
  model: string;
  plate_number: string;
  odometer: string;
  store_id: number;
  purchase_date: string;
  invoice_number: string;
  invoice: File;
  image_odometer: File;
  tires: Tire[];
}

export interface WarrantyItemDetail {
  id: number;
  name: string;
  email: string;
  warranty_id: string;
  warranty_date: string;
  warranty_code: string;
  status: WarrantyStatus;
  brand: string;
  model: string;
  reason: string;
  plate_number: string;
  odometer: string;
  store_id: string;
  store_name: string;
  purchase_date: string;
  invoice_number: string;
  invoice: File;
  image_odometer_url: string;
  image_odometer_file: File;
  image_odometer: File;
  tires: Tire[];
  tire_warranties: Tire[];
  editable_fields: string[];
  role: string;
  roles: {
    id: number;
    name: string;
  }[];

  user: {
    name: string;
    phone: string;
  };
  store: {
    store_id: string;
    store_name: string;
  };

  is_active: number;
  created_at: string;
  updated_at: string;
}
