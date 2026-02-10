"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const USE_DUMMY_DATA = false;

const DUMMY_MASTER_DATA = [
  {
    id: 1,
    claim_submission_code: "CW-123912821",
    warranty_code: "DTW-1239128001",
    name: "Esther Howard",
    plate_number: "B 2022 DUN",
    odometer: 68312,
    status: "1",
    status_label: "Dijadwalkan",
  },
  {
    id: 2,
    claim_submission_code: "CW-123912822",
    warranty_code: "DTW-1239128001",
    name: "Esther Howard",
    plate_number: "B 2022 DUN",
    odometer: 68312,
    status: "2",
    status_label: "Klaim Selesai",
  },
  {
    id: 3,
    claim_submission_code: "CW-123912823",
    warranty_code: "DTW-1239128001",
    name: "Esther Howard",
    plate_number: "B 2022 DUN",
    odometer: 68312,
    status: "3",
    status_label: "Dibatalkan Otomatis",
  },
  {
    id: 4,
    claim_submission_code: "CW-123912824",
    warranty_code: "DTW-1239128001",
    name: "Esther Howard",
    plate_number: "B 2022 DUN",
    odometer: 68312,
    status: "3",
    status_label: "Dibatalkan Otomatis",
  },
  {
    id: 5,
    claim_submission_code: "CW-123912825",
    warranty_code: "DTW-1239128001",
    name: "Esther Howard",
    plate_number: "B 2022 DUN",
    odometer: 68312,
    status: "2",
    status_label: "Klaim Selesai",
  },
  {
    id: 6,
    claim_submission_code: "CW-123912826",
    warranty_code: "DTW-1239128001",
    name: "Esther Howard",
    plate_number: "B 2022 DUN",
    odometer: 68312,
    status: "4",
    status_label: "Verifikasi Principal",
  },
  {
    id: 7,
    claim_submission_code: "CW-123912827",
    warranty_code: "DTW-1239128001",
    name: "Esther Howard",
    plate_number: "B 2022 DUN",
    odometer: 68312,
    status: "4",
    status_label: "Verifikasi Principal",
  },
  {
    id: 8,
    claim_submission_code: "CW-123912828",
    warranty_code: "DTW-1239128001",
    name: "Esther Howard",
    plate_number: "B 2022 DUN",
    odometer: 68312,
    status: "2",
    status_label: "Klaim Selesai",
  },
  {
    id: 9,
    claim_submission_code: "CW-123912829",
    warranty_code: "DTW-1239128001",
    name: "Esther Howard",
    plate_number: "B 2022 DUN",
    odometer: 68312,
    status: "2",
    status_label: "Klaim Selesai",
  },
  {
    id: 10,
    claim_submission_code: "CW-123912830",
    warranty_code: "DTW-1239128001",
    name: "Esther Howard",
    plate_number: "B 2022 DUN",
    odometer: 68312,
    status: "4",
    status_label: "Verifikasi Principal",
  },
  // Adding 5 more to make it 15 total
  {
    id: 11,
    claim_submission_code: "CW-123912831",
    warranty_code: "DTW-1239128001",
    name: "Esther Howard",
    plate_number: "B 2022 DUN",
    odometer: 68312,
    status: "1",
    status_label: "Dijadwalkan",
  },
  {
    id: 12,
    claim_submission_code: "CW-123912832",
    warranty_code: "DTW-1239128001",
    name: "Esther Howard",
    plate_number: "B 2022 DUN",
    odometer: 68312,
    status: "2",
    status_label: "Klaim Selesai",
  },
  {
    id: 13,
    claim_submission_code: "CW-123912833",
    warranty_code: "DTW-1239128001",
    name: "Esther Howard",
    plate_number: "B 2022 DUN",
    odometer: 68312,
    status: "3",
    status_label: "Dibatalkan Otomatis",
  },
  {
    id: 14,
    claim_submission_code: "CW-123912834",
    warranty_code: "DTW-1239128001",
    name: "Esther Howard",
    plate_number: "B 2022 DUN",
    odometer: 68312,
    status: "4",
    status_label: "Verifikasi Principal",
  },
  {
    id: 15,
    claim_submission_code: "CW-123912835",
    warranty_code: "DTW-1239128001",
    name: "Esther Howard",
    plate_number: "B 2022 DUN",
    odometer: 68312,
    status: "2",
    status_label: "Klaim Selesai",
  },
];

const DUMMY_STATS = {
  total_last_30_days: 10,
  total_last_30_days_percentage: -12, // Down 12%
  pending_verification: 25,
  pending_verification_percentage: 0, // No change shown in image, but logic supports it
  completed: 25,
  completed_percentage: 12, // Up 12%
  received: 8,
};

export const getMasterDataIndex = async (
  page: number,
  perpage: number,
  search: string,
  status?: string
) => {
  if (USE_DUMMY_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let filteredData = DUMMY_MASTER_DATA;

    if (search) {
      filteredData = filteredData.filter(item => 
        item.warranty_code.toLowerCase().includes(search.toLowerCase()) ||
        item.claim_submission_code.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Pagination logic
    const start = (page - 1) * perpage;
    const end = start + perpage;
    const paginatedData = filteredData.slice(start, end);

    return {
      success: true,
      data: {
        current_page: page,
        data: paginatedData,
        first_page_url: "...",
        from: start + 1,
        last_page: Math.ceil(filteredData.length / perpage),
        last_page_url: "...",
        links: [],
        next_page_url: null,
        path: "...",
        per_page: perpage,
        prev_page_url: null,
        to: Math.min(end, filteredData.length),
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
    throw new Error("Failed to get master data");
  }

  return res.json();
};

export const getMasterDataStats = async () => {
  if (USE_DUMMY_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: DUMMY_STATS,
      message: "Stats retrieved successfully (Dummy)",
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized: token not found");
  }

  const params = new URLSearchParams({
    filter_total_requests: "30_days",
    filter_completed_claims: "30_days",
  });

  const res = await fetch(
    `${BASE_URL}/claim-warranty/principal/statistic?${params.toString()}`,
    {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get master data stats");
  }

  const result = await res.json();

  if (result?.success && result.data) {
    const stats = result.data;

    return {
      success: true,
      data: {
        total_last_30_days: stats.total_requests?.count ?? 0,
        total_last_30_days_percentage: stats.total_requests?.trend_percentage ?? 0,
        pending_verification: stats.unverified_requests?.count ?? 0,
        pending_verification_percentage: 0,
        completed: stats.completed_claims?.count ?? 0,
        completed_percentage: stats.completed_claims?.trend_percentage ?? 0,
        received: stats.accepted_claims?.count ?? 0,
      },
      message: result.message ?? "Stats retrieved successfully",
    };
  }

  return result;
};
