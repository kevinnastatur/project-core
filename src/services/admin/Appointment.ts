"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const USE_DUMMY_DATA = false; // Toggle this to false to use real API

// Dummy Data Store
const DUMMY_APPOINTMENTS = [
  {
    id: 1,
    claim_submission_code: "CW-123912821",
    warranty_code: "DTW-1239128001",
    name: "Esther Howard",
    plate_number: "B 2022 DUN",
    odometer_cust_now: 68312,
    status: "4", // Stock Ready
    status_label: "Konfirmasi Stok",
    store_name: "MPN Kharisma",
    claim_date: "3 April 2026",
    details: {
      phone: "+62 8121455663437",
      model: "Innova Zenix Q",
      odometer_beginning: "10000",
      purchase_date: "1 Januari 2026",
      warranty_expired_date: "1 Januari 2027",
      tire_type: "SP Sport Maxx 050",
      tire_size: "205/65 R16",
      tire_barcode: "3420048103",
      tire_number: "DOT 45664",
      image_damage_main: null,
      image_damage_side: null,
      image_odometer_beginning: null,
      image_odometer_now: null,
    }
  },
  {
    id: 2,
    claim_submission_code: "CW-123912822",
    warranty_code: "DTW-1239128002",
    name: "Marvin McKinney",
    plate_number: "D 1234 ABC",
    odometer_cust_now: 45000,
    status: "3",
    status_label: "Konfirmasi Stok",
    store_name: "Dunlop Shop Bandung",
    claim_date: "4 April 2026",
    details: {
      phone: "+62 81234567890",
      model: "Pajero Sport",
      odometer_beginning: "5000",
      purchase_date: "1 Feb 2026",
      warranty_expired_date: "1 Feb 2027",
      tire_type: "Grandtrek AT5",
      tire_size: "265/60 R18",
      tire_barcode: "3420048104",
      tire_number: "DOT 12345",
      image_damage_main: null,
      image_damage_side: null,
      image_odometer_beginning: null,
      image_odometer_now: null,
    }
  }
];

export const getAppointmentIndex = async (
  page: number,
  perpage: number,
  search: string,
  status?: string
) => {
  if (USE_DUMMY_DATA) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Filter logic simulation
    let filteredData = DUMMY_APPOINTMENTS;
    if (search) {
      filteredData = filteredData.filter(item => 
        item.warranty_code.toLowerCase().includes(search.toLowerCase()) ||
        item.claim_submission_code.toLowerCase().includes(search.toLowerCase())
      );
    }

    return {
      success: true,
      data: {
        current_page: page,
        data: filteredData,
        first_page_url: "...",
        from: 1,
        last_page: 1,
        last_page_url: "...",
        links: [],
        next_page_url: null,
        path: "...",
        per_page: perpage,
        prev_page_url: null,
        to: filteredData.length,
        total: filteredData.length,
      },
      message: "Data retrieved successfully (Dummy)"
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const params = new URLSearchParams({
    page: String(page),
    perpage: String(perpage),
  });

  if (search) {
    params.append("search", search);
  }

  if (status !== undefined && status !== "") {
    params.append("status", status);
  }

  const res = await fetch(
    `${BASE_URL}/claim-warranty/principal/index?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get appointments");
  }

  return res.json();
};

export const getAppointmentDetail = async (id: string) => {
  if (USE_DUMMY_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const item = DUMMY_APPOINTMENTS.find(d => d.id.toString() === id);
    if (item) {
        // Flatten the structure for detail view as expected
        const detailData = {
            ...item,
            ...item.details
        };
        return {
            success: true,
            data: detailData,
            message: "Detail retrieved successfully (Dummy)"
        };
    }
    return { success: false, message: "Not found" };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const res = await fetch(
    `${BASE_URL}/claim-warranty/principal/detail/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get appointment detail");
  }

  return res.json();
};

export const updateAppointmentStatus = async (
  id: string,
  data: { note_principal: string; status: string }
) => {
  if (USE_DUMMY_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
        success: true,
        message: "Status updated successfully (Dummy)",
        data: data
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const formData = new FormData();
  formData.append("note_principal", data.note_principal);
  formData.append("status", data.status);

  const res = await fetch(
    `${BASE_URL}/claim-warranty/principal/update/${id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update appointment status");
  }

  return res.json();
};
