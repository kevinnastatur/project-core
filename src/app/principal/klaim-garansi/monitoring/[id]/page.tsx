"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type ClaimStatusOption = "menunggu_persetujuan" | "tolak_pengajuan" | "terima_pengajuan";
type StockConfirmationOption = "konfirmasi_stok" | "stock_tidak_tersedia" | "stock_tersedia";

type ClaimDetail = {
  id: string;
  claimId: string;
  warrantyId: string;
  tanggalKlaim: string;
  odometerSaatIni: string;
  namaLengkap: string;
  nomorTelepon: string;
  tipeKendaraan: string;
  platKendaraan: string;
  odometerAwal: string;
  tokoPembelian: string;
  tanggalPembelian: string;
  fotoKerusakanDepan: string;
  fotoKerusakanPinggir: string;
  fotoOdometerAwal: string;
  fotoOdometerPengajuan: string;
  tipeBan: string;
  ukuranBan: string;
  kodeBarcode: string;
  dotTireNumber: string;
  statusGaransiAktifHingga: string;
  status: "menunggu_persetujuan" | "verifikasi_principal" | "ditolak_principal" | "konfirmasi_stok" | "stok_konfirm" | "stok_tidaktersedia";
  keterangan?: string;
};

const MOCK_DETAILS: Record<string, ClaimDetail> = {
  "1": {
    id: "1",
    claimId: "CW-123912821",
    warrantyId: "DTW-1239128001",
    tanggalKlaim: "3 April 2026",
    odometerSaatIni: "68312",
    namaLengkap: "Esther Howard",
    nomorTelepon: "+62 81234565437",
    tipeKendaraan: "Innova Zenix Q",
    platKendaraan: "B 2022 DUN",
    odometerAwal: "68312",
    tokoPembelian: "MPN Khatisima",
    tanggalPembelian: "1 Januari 2026",
    fotoKerusakanDepan: "/assets/warranty/bukti-kerusakan-depan.png",
    fotoKerusakanPinggir: "/assets/warranty/bukti-kerusakan-pinggir.png",
    fotoOdometerAwal: "/assets/warranty/bukti-odometer-1.png",
    fotoOdometerPengajuan: "/assets/warranty/bukti-odometer-2.png",
    tipeBan: "SP Sport Maxx 050",
    ukuranBan: "205/45 R16",
    kodeBarcode: "542064881053",
    dotTireNumber: "DOT 45644",
    statusGaransiAktifHingga: "1 Januari 2027",
    status: "menunggu_persetujuan",
  },
  "2": {
    id: "2",
    claimId: "CW-123912822",
    warrantyId: "DTW-1239128002",
    tanggalKlaim: "3 April 2026",
    odometerSaatIni: "68312",
    namaLengkap: "Esther Howard",
    nomorTelepon: "+62 81234565437",
    tipeKendaraan: "Innova Zenix Q",
    platKendaraan: "B 2022 DUN",
    odometerAwal: "68312",
    tokoPembelian: "MPN Khatisima",
    tanggalPembelian: "1 Januari 2026",
    fotoKerusakanDepan: "/assets/warranty/bukti-kerusakan-depan.png",
    fotoKerusakanPinggir: "/assets/warranty/bukti-kerusakan-pinggir.png",
    fotoOdometerAwal: "/assets/warranty/bukti-odometer-1.png",
    fotoOdometerPengajuan: "/assets/warranty/bukti-odometer-2.png",
    tipeBan: "SP Sport Maxx 050",
    ukuranBan: "205/45 R16",
    kodeBarcode: "542064881053",
    dotTireNumber: "DOT 45644",
    statusGaransiAktifHingga: "1 Januari 2027",
    status: "verifikasi_principal",
    keterangan: "Klaim telah diverifikasi dan diterima. Selanjutnya customer akan dihubungi untuk proses appointment.",
  },
  "3": {
    id: "3",
    claimId: "CW-123912823",
    warrantyId: "DTW-1239128003",
    tanggalKlaim: "3 April 2026",
    odometerSaatIni: "68312",
    namaLengkap: "Esther Howard",
    nomorTelepon: "+62 81234565437",
    tipeKendaraan: "Innova Zenix Q",
    platKendaraan: "B 2022 DUN",
    odometerAwal: "68312",
    tokoPembelian: "MPN Khatisima",
    tanggalPembelian: "1 Januari 2026",
    fotoKerusakanDepan: "/assets/warranty/bukti-kerusakan-depan.png",
    fotoKerusakanPinggir: "/assets/warranty/bukti-kerusakan-pinggir.png",
    fotoOdometerAwal: "/assets/warranty/bukti-odometer-1.png",
    fotoOdometerPengajuan: "/assets/warranty/bukti-odometer-2.png",
    tipeBan: "SP Sport Maxx 050",
    ukuranBan: "205/45 R16",
    kodeBarcode: "542064881053",
    dotTireNumber: "DOT 45644",
    statusGaransiAktifHingga: "1 Januari 2027",
    status: "ditolak_principal",
    keterangan: "Copy Yang Merupakan Pendataan Claim Garansi",
  },
  "4": {
    id: "4",
    claimId: "CW-123912824",
    warrantyId: "DTW-1239128004",
    tanggalKlaim: "3 April 2026",
    odometerSaatIni: "68312",
    namaLengkap: "Esther Howard",
    nomorTelepon: "+62 81234565437",
    tipeKendaraan: "Innova Zenix Q",
    platKendaraan: "B 2022 DUN",
    odometerAwal: "68312",
    tokoPembelian: "MPN Khatisima",
    tanggalPembelian: "1 Januari 2026",
    fotoKerusakanDepan: "/assets/warranty/bukti-kerusakan-depan.png",
    fotoKerusakanPinggir: "/assets/warranty/bukti-kerusakan-pinggir.png",
    fotoOdometerAwal: "/assets/warranty/bukti-odometer-1.png",
    fotoOdometerPengajuan: "/assets/warranty/bukti-odometer-2.png",
    tipeBan: "SP Sport Maxx 050",
    ukuranBan: "205/45 R16",
    kodeBarcode: "542064881053",
    dotTireNumber: "DOT 45644",
    statusGaransiAktifHingga: "1 Januari 2027",
    status: "konfirmasi_stok",
    keterangan: "",
  },
  "5": {
    id: "5",
    claimId: "CW-123912825",
    warrantyId: "DTW-1239128005",
    tanggalKlaim: "3 April 2026",
    odometerSaatIni: "68312",
    namaLengkap: "Esther Howard",
    nomorTelepon: "+62 81234565437",
    tipeKendaraan: "Innova Zenix Q",
    platKendaraan: "B 2022 DUN",
    odometerAwal: "68312",
    tokoPembelian: "MPN Khatisima",
    tanggalPembelian: "1 Januari 2026",
    fotoKerusakanDepan: "/assets/warranty/bukti-kerusakan-depan.png",
    fotoKerusakanPinggir: "/assets/warranty/bukti-kerusakan-pinggir.png",
    fotoOdometerAwal: "/assets/warranty/bukti-odometer-1.png",
    fotoOdometerPengajuan: "/assets/warranty/bukti-odometer-2.png",
    tipeBan: "SP Sport Maxx 050",
    ukuranBan: "205/45 R16",
    kodeBarcode: "542064881053",
    dotTireNumber: "DOT 45644",
    statusGaransiAktifHingga: "1 Januari 2027",
    status: "stok_konfirm",
    keterangan: "",
  },
  "6": {
    id: "6",
    claimId: "CW-123912826",
    warrantyId: "DTW-1239128006",
    tanggalKlaim: "3 April 2026",
    odometerSaatIni: "68312",
    namaLengkap: "Esther Howard",
    nomorTelepon: "+62 81234565437",
    tipeKendaraan: "Innova Zenix Q",
    platKendaraan: "B 2022 DUN",
    odometerAwal: "68312",
    tokoPembelian: "MPN Khatisima",
    tanggalPembelian: "1 Januari 2026",
    fotoKerusakanDepan: "/assets/warranty/bukti-kerusakan-depan.png",
    fotoKerusakanPinggir: "/assets/warranty/bukti-kerusakan-pinggir.png",
    fotoOdometerAwal: "/assets/warranty/bukti-odometer-1.png",
    fotoOdometerPengajuan: "/assets/warranty/bukti-odometer-2.png",
    tipeBan: "SP Sport Maxx 050",
    ukuranBan: "205/45 R16",
    kodeBarcode: "542064881053",
    dotTireNumber: "DOT 45644",
    statusGaransiAktifHingga: "1 Januari 2027",
    status: "stok_tidaktersedia",
    keterangan: "Stok ban tidak tersedia di lokasi. Claim garansi ini akan ditunda sampai stok tersedia.",
  },
};

export default function PrincipalClaimMonitoringDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";
  const [status, setStatus] = useState<ClaimStatusOption>("menunggu_persetujuan");
  const [stockStatus, setStockStatus] = useState<StockConfirmationOption>("konfirmasi_stok");
  const [notes, setNotes] = useState("");
  const [showToast, setShowToast] = useState(false);

  const claim = useMemo(() => MOCK_DETAILS[id], [id]);

  const isReadOnly = claim?.status === "verifikasi_principal" || claim?.status === "ditolak_principal" || claim?.status === "stok_konfirm" || claim?.status === "stok_tidaktersedia";
  const isRejected = claim?.status === "ditolak_principal";
  const isStockConfirmation = claim?.status === "konfirmasi_stok";
  const isStockConfirmed = claim?.status === "stok_konfirm";
  const isStockNotAvailable = claim?.status === "stok_tidaktersedia";

  useEffect(() => {
    if (!id) return;
    if (!MOCK_DETAILS[id]) {
      router.replace("/principal/klaim-garansi/monitoring");
    }
  }, [id, router]);

  useEffect(() => {
    if (claim?.keterangan) {
      setNotes(claim.keterangan);
    }
  }, [claim?.keterangan]);

  const handleSubmit = () => {
    setShowToast(true);
    setTimeout(() => {
      router.push(isStockConfirmation ? "/principal/klaim-garansi/pengajuan" : "/principal/klaim-garansi/monitoring");
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-background p-5 flex flex-col gap-6 text-sm xl:text-base relative">
      <div className="text-text-secondary text-sm flex items-center gap-2">
        <span>Klaim Garansi</span>
        <span>/</span>
        <span className="text-primary">Pengajuan Klaim Garansi</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/principal/klaim-garansi/monitoring")}
          className="bg-[#111] border border-input-border text-white px-5 py-2 rounded-lg font-semibold hover:bg-secondary/20 transition"
        >
          Kembali
        </button>
        <h1 className="text-white text-lg xl:text-xl font-bold">Detail Pengajuan Klaim Garansi</h1>
      </div>

      {isReadOnly && (
        <div className={`rounded-lg px-4 py-3 font-semibold ${
          isRejected 
            ? "bg-[#DF3400] text-white" 
            : isStockNotAvailable
            ? "bg-[#DFAB00] text-black"
            : "bg-[#00DF80] text-black"
        }`}>
          {isRejected 
            ? "Claim Garansi dengan ID ini Ditolak."
            : isStockNotAvailable
            ? "Stok Ban Tidak Tersedia. Claim Garansi ini akan ditunda sampai stok tersedia. Selanjutnya akan diteruskan ke Customer."
            : isStockConfirmed
            ? "Stok Ban Konfirmasi. Claim Garansi ini akan diteruskan ke Customer untuk Dunlop Shop."
            : "Pengajuan Klaim Berhasil Diterima. Selanjutnya akan diteruskan ke Customer untuk proses Appointment."
          }
        </div>
      )}

      <div className="grid grid-cols-1 gap-5">
        <Section title="Informasi Klaim Garansi">
          <div className="grid md:grid-cols-4 gap-4">
            <ReadOnlyField label="ID Klaim Garansi" value={claim.claimId} />
            <ReadOnlyField label="ID Warranty" value={claim.warrantyId} />
            <ReadOnlyField label="Tanggal Klaim" value={claim.tanggalKlaim} />
            <ReadOnlyField label="Odometer Saat Ini" value={`${claim.odometerSaatIni} km`} />
          </div>
        </Section>

        <Section title="Informasi Pengguna">
          <div className="grid md:grid-cols-4 gap-4">
            <ReadOnlyField label="Nama Lengkap" value={claim.namaLengkap} />
            <ReadOnlyField label="Nomor Telepon" value={claim.nomorTelepon} />
            <ReadOnlyField label="Tipe Kendaraan" value={claim.tipeKendaraan} />
            <ReadOnlyField label="Plat Nomor Kendaraan" value={claim.platKendaraan} />
            <ReadOnlyField label="Odometer Awal Kendaraan" value={`${claim.odometerAwal} km`} />
            <ReadOnlyField label="Toko Pembelian" value={claim.tokoPembelian} />
            <ReadOnlyField label="Tanggal Pembelian" value={claim.tanggalPembelian} />
          </div>
        </Section>

        <Section title="Bukti Kerusakan Ban">
          <div className="grid md:grid-cols-2 gap-4">
            <ImagePreview label="Foto Kerusakan Tampak Depan" src={claim.fotoKerusakanDepan} />
            <ImagePreview label="Foto Kerusakan Tampak Pinggir" src={claim.fotoKerusakanPinggir} />
          </div>
        </Section>

        <Section title="Bukti Odometer Kendaraan">
          <div className="grid md:grid-cols-2 gap-4">
            <ImagePreview label="Foto Odometer Awal" src={claim.fotoOdometerAwal} />
            <ImagePreview label="Foto Odometer Pengajuan" src={claim.fotoOdometerPengajuan} />
          </div>
        </Section>

        <Section title="Informasi Ban">
          <div className="flex flex-col gap-4">
            <div className="bg-[#0f1a0f] border border-[#1f2d1f] rounded-lg px-4 py-3 text-white flex items-start gap-3">
              <span className="mt-1 text-[#00DF80] text-lg">●</span>
              <div className="flex flex-col">
                <span className="font-semibold">Status Garansi Ban Aktif</span>
                <span className="text-text-secondary">
                  Garansi ban aktif sampai dengan: {claim.statusGaransiAktifHingga}
                </span>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <ReadOnlyField label="Tipe Ban" value={claim.tipeBan} />
              <ReadOnlyField label="Ukuran Ban" value={claim.ukuranBan} />
              <ReadOnlyField label="Kode Barcode Ban" value={claim.kodeBarcode} />
              <ReadOnlyField label="DOT Tire Number" value={claim.dotTireNumber} />
            </div>
          </div>
        </Section>

        <Section title="Masukan Keterangan Klaim Garansi">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-white font-semibold" htmlFor="notes">
                Keterangan Klaim Garansi
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => !isReadOnly && setNotes(e.target.value)}
                placeholder="Masukkan catatan atau keterangan klaim garansi"
                disabled={isReadOnly}
                className="bg-input border border-input-border rounded-lg text-white px-4 py-3 min-h-[140px] placeholder:text-input-placeholder focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-[#111] border border-input-border rounded-lg p-4 flex flex-col gap-3">
                <p className="text-white font-semibold">Konfirmasi Registrasi</p>
                {!isStockConfirmation ? (
                  <>
                    <RadioOption
                      label="Menunggu Persetujuan"
                      value="menunggu_persetujuan"
                      checked={status === "menunggu_persetujuan"}
                      onChange={setStatus}
                      disabled={isReadOnly}
                    />
                    <RadioOption
                      label="Tolak Pengajuan"
                      value="tolak_pengajuan"
                      checked={status === "tolak_pengajuan"}
                      onChange={setStatus}
                      disabled={isReadOnly}
                    />
                    <RadioOption
                      label="Terima Pengajuan"
                      value="terima_pengajuan"
                      checked={status === "terima_pengajuan" || (isReadOnly && !isRejected)}
                      onChange={setStatus}
                      disabled={isReadOnly}
                    />
                  </>
                ) : (
                  <>
                    <StockRadioOption
                      label="Konfirmasi Stok"
                      value="konfirmasi_stok"
                      checked={stockStatus === "konfirmasi_stok"}
                      onChange={setStockStatus}
                    />
                    <StockRadioOption
                      label="Stock Tidak Tersedia"
                      value="stock_tidak_tersedia"
                      checked={stockStatus === "stock_tidak_tersedia"}
                      onChange={setStockStatus}
                    />
                    <StockRadioOption
                      label="Stock Tersedia"
                      value="stock_tersedia"
                      checked={stockStatus === "stock_tersedia"}
                      onChange={setStockStatus}
                    />
                  </>
                )}
              </div>

              {(!isReadOnly || isStockConfirmation) && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isStockConfirmation ? !stockStatus : !status}
                  className={`w-full rounded-lg py-3 font-bold text-black transition ${
                    isStockConfirmation ? "bg-primary hover:opacity-90" : (status ? "bg-primary hover:opacity-90" : "bg-primary/40 cursor-not-allowed")
                  }`}
                >
                  {isStockConfirmation ? "Update Appointment" : "Update Pengajuan Klaim"}
                </button>
              )}
            </div>
          </div>
        </Section>
      </div>

      {showToast && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
          <div className="bg-black/50 backdrop-blur-sm absolute inset-0" />
          <div className="relative bg-white text-black rounded-lg shadow-lg p-4 w-full max-w-md flex gap-3">
            <div className="text-green-500 text-xl">●</div>
            <div className="flex-1">
              <p className="font-semibold">Perubahan Status Klaim Berhasil</p>
              <p className="text-sm text-gray-700">
                Status klaim dengan ID {claim.claimId} berhasil diperbarui.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              className="text-gray-500 hover:text-black"
              onClick={() => setShowToast(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="box-container flex flex-col gap-4">
      <h2 className="text-white font-semibold text-base xl:text-lg">{title}</h2>
      {children}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-text-secondary text-sm">{label}</label>
      <div className="bg-input border border-input-border rounded-lg text-white px-4 py-3 min-h-[48px] flex items-center">
        {value}
      </div>
    </div>
  );
}

function ImagePreview({ label, src }: { label: string; src: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-white font-semibold text-sm">{label}</p>
      <div className="bg-input border border-input-border rounded-lg p-3 flex items-center justify-center min-h-[220px]">
        <img src={src} alt={label} className="h-full max-h-72 w-full object-contain rounded" />
      </div>
    </div>
  );
}

function RadioOption({
  label,
  value,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  value: ClaimStatusOption;
  checked: boolean;
  onChange: (val: ClaimStatusOption) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`flex items-center gap-3 text-white ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
      <input
        type="radio"
        name="konfirmasi-registrasi"
        value={value}
        checked={checked}
        onChange={() => !disabled && onChange(value)}
        disabled={disabled}
        className="w-4 h-4 accent-primary disabled:cursor-not-allowed"
      />
      <span>{label}</span>
    </label>
  );
}

function StockRadioOption({
  label,
  value,
  checked,
  onChange,
}: {
  label: string;
  value: StockConfirmationOption;
  checked: boolean;
  onChange: (val: StockConfirmationOption) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-white cursor-pointer">
      <input
        type="radio"
        name="stock-confirmation"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="w-4 h-4 accent-primary"
      />
      <span>{label}</span>
    </label>
  );
}