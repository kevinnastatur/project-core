export interface BannerItemDetail {
  id: number;
  heading: string;
  periode: string;
  status: number;
  image_desktop: string;
  image_mobile: string;
  image: string;
  url: string;
}

export interface AccountItemDetail {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  roles: RolesItem[];
  store_id: string;
  is_active: number;
  stores: StoreItem[];
}

export interface PromoItem {
  id: number;
  heading: string;
  periode: string;
  status: number;
  image_desktop: string;
  image_mobile: string;
  image: string;
  url: string;
}

export interface RolesItem {
  id: string;
  name: string;
}

export interface StoreItem {
  id: string;
  store_id: string;
  store_name: string;
  province: string;
  city: string;
  url: string;
}
