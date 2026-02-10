export interface WarrantyClaim {
  id: number;
  warranty_id: string;
  claim_warranty_code: string;
  customer_name: string;
  customer_choice: string;
  odometer: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface WarrantyClaimDetail {
  id: number;
  claim_submission_code: string;
  warranty_code: string;
  claim_date: string;
  odometer_beginning: string;
  name: string;
  phone: string | null;
  model: string;
  plate_number: string;
  odometer_cust_now: string | null;
  store_name: string;
  purchase_date: string;
  image_damage_main: string;
  image_damage_side: string;
  image_odometer_beginning: string;
  image_odometer_now: string;
  tire_type: string;
  tire_size: string;
  tire_barcode: string;
  tire_number: string;
  status: number;
  warranty_expired_date?: string;
}

