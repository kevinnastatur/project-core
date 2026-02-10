export const CLAIM_STATUS = {
  PENDING: 0,
  REJECT_ADMIN: 1,
  APPROVE_ADMIN: 2,
  STOCK_READY: 3,
  STOCK_EMPTY: 4,
  APPT_REQ: 5,
  SCHEDULED: 6,
  COMPLETED: 7,
  REJECT_STORE: 8,
} as const;

export type ClaimStatusValue = (typeof CLAIM_STATUS)[keyof typeof CLAIM_STATUS];

export const CLAIM_STATUS_LABEL: Record<ClaimStatusValue, string> = {
  [CLAIM_STATUS.PENDING]: "Verifikasi Principal",
  [CLAIM_STATUS.REJECT_ADMIN]: "Dibatalkan",
  [CLAIM_STATUS.APPROVE_ADMIN]: "Disetujui Principal",
  [CLAIM_STATUS.STOCK_READY]: "Stok Tersedia",
  [CLAIM_STATUS.STOCK_EMPTY]: "Stok Tidak Tersedia",
  [CLAIM_STATUS.APPT_REQ]: "Verifikasi Stok",
  [CLAIM_STATUS.SCHEDULED]: "Dijadwalkan",
  [CLAIM_STATUS.COMPLETED]: "Klaim Selesai",
  [CLAIM_STATUS.REJECT_STORE]: "Dibatalkan Shop",
};
