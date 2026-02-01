# Pilot Task: Dunlop Warranty Claim System UI Slice

## Original Problem Statement
- Brownfield frontend slicing pilot
- Implement UI frames for warranty claim functionality

## Implementation History

### Pilot 1 (Completed)
**Scope:** Riwayat Klaim Garansi (List Page)
**Files:** `src/app/dashboard/klaim-garansi/page.tsx`, `src/components/common/StatusBadge.tsx`

### Pilot 2 (Completed)
**Scope:** 3-Step Claim Submission Wizard
**Files:** `src/app/dashboard/klaim-garansi/daftar/page.tsx`

### Pilot 3 (Completed)
**Scope:** Claim Submission Success State
**Files:** Modified `src/app/dashboard/klaim-garansi/daftar/page.tsx`

### Pilot 4 (Completed - Superseded by Pilot 6)
**Scope:** Initial Claim Detail Page (waiting/rejected states)
**Files:** `src/app/dashboard/klaim-garansi/[id]/page.tsx`

### Pilot 5 (Completed)
**Scope:** Ajukan Penjadwalan Klaim Garansi (Customer Flow)
**Files:** `src/app/dashboard/klaim-garansi/jadwal/page.tsx`

### Pilot 6 (Completed)
**Scope:** Detail Klaim Dijadwalkan / Verifikasi Stok (Customer View)
**Route:** `/dashboard/klaim-garansi/[id]`

**Files Modified:**
- `src/app/dashboard/klaim-garansi/[id]/page.tsx` (Complete rewrite - 18KB)

**Features Implemented:**

**3-Step Progress Stepper:**
1. Verifikasi Stok (Step 1) - Yellow active circle
2. Klaim Garansi Dijadwalkan (Step 2) - Scheduled state
3. Klaim Garansi Selesai (Step 3) - All steps completed with checkmarks

**Status Variants (ID-based mock data):**
- ID `1` → verifikasi_stok: Progress at Step 1, notes empty
- ID `3` → dijadwalkan: Progress at Step 2, notes empty  
- ID `4` → selesai: Progress at Step 3, completion notes shown
- ID `2` → rejected: No stepper, red banner, rejection reason

**Page Sections:**
1. Status Progress Stepper (read-only, 3 steps)
2. Informasi Klaim Garansi (ID, Warranty ID, Store, Date, Time, Odometer)
3. Informasi Pengguna (User details)
4. Bukti Kerusakan Ban (Tire damage image previews)
5. Bukti Odometer Kendaraan (Odometer image previews)
6. Detail Informasi Garansi Ban (Warranty status card + tire specs)
7. Catatan Klaim Garansi (Notes section)
8. Help Section ("Butuh Bantuan?")

**Warranty Status Cards:**
- Active: Green checkmark, warranty end date
- Claimed/Selesai: Red alert, claim date shown
- Rejected: Red alert, Syarat & Ketentuan link

**New Tire Info (for completed claims):**
- Shows new barcode and DOT number after replacement

## Status
- TypeScript: ✅ No errors in target files
- Visual: Matches Figma designs
- Scope: Within pilot boundaries

## Scope Compliance Checklist
- ✅ Only modified allowed file
- ✅ Pure read-only UI
- ✅ Mock data only (no API)
- ✅ No edit/mutation actions
- ✅ Desktop-only layout
- ✅ No new dependencies
- ✅ No legacy code modified outside scope
- ✅ Minimal diff, merge-ready
