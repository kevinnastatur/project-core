import { IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5";

interface WarrantyStatusBadgeProps {
  /**
   * Whether the warranty is active
   */
  isActive: boolean;
  
  /**
   * The warranty expiration or claimed date
   */
  date: string;
  
  /**
   * Optional custom message for inactive/rejected status
   */
  inactiveMessage?: string;
  
  /**
   * Type of inactive status: 'claimed' or 'rejected'
   */
  inactiveType?: 'claimed' | 'rejected';
}

/**
 * Reusable warranty status badge component
 * 
 * Displays warranty status with appropriate icon, colors, and messages.
 * Matches the design system with white background and dark text.
 * 
 * @example
 * ```tsx
 * // Active warranty
 * <WarrantyStatusBadge 
 *   isActive={true} 
 *   date="1 Januari 2027" 
 * />
 * 
 * // Claimed warranty
 * <WarrantyStatusBadge 
 *   isActive={false} 
 *   date="3 April 2026"
 *   inactiveType="claimed"
 * />
 * 
 * // Rejected warranty
 * <WarrantyStatusBadge 
 *   isActive={false} 
 *   date="1 Januari 2027"
 *   inactiveType="rejected"
 *   inactiveMessage="Custom rejection reason"
 * />
 * ```
 */
export default function WarrantyStatusBadge({ 
  isActive, 
  date, 
  inactiveMessage,
  inactiveType = 'claimed' 
}: WarrantyStatusBadgeProps) {
  if (isActive) {
    return (
      <div className="flex items-start gap-2 bg-white rounded-lg p-4">
        <IoCheckmarkCircle className="text-[#00DF80] text-xl mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-secondary font-semibold">
            Status Garansi Ban Aktif
          </p>
          <p className="text-secondary text-sm">
            Garansi Ban aktif sampai dengan:{" "}
            <span className="font-bold text-secondary">{date}</span>
          </p>
        </div>
      </div>
    );
  }

  // Inactive warranty (claimed or rejected)
  const isClaimed = inactiveType === 'claimed';
  
  return (
    <div className="flex items-start gap-2 bg-white rounded-lg p-4">
      <IoAlertCircle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-secondary font-semibold">
          {isClaimed 
            ? "Garansi Habis! Anda Sudah Melakukan Claim Garansi Ban"
            : "Klaim Ditolak, Anda Tidak Memenuhi Syarat Untuk Melakukan Klaim Garansi Ban"
          }
        </p>
        <p className="text-secondary text-sm">
          {isClaimed ? (
            <>
              Anda sudah melakukan Klaim Garansi ban Anda di:{" "}
              <span className="font-bold text-secondary">{date}</span>
            </>
          ) : (
            <>
              {inactiveMessage || (
                <>
                  Garansi Anda secara otomatis dibatalkan karena tidak mengikuti{" "}
                  <span className="text-secondary underline cursor-pointer">Syarat & Ketentuan</span>
                </>
              )}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
