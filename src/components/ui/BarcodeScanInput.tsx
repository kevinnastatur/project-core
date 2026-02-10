"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { FaTrash, FaBarcode } from "react-icons/fa";
import { MdOutlinePhotoCamera, MdClose } from "react-icons/md";
import GeneralInput from "./GeneralInput";

interface BarcodeScanInputProps {
  label: string;
  description?: string;
  name: string;
  required?: boolean;
  value?: string;
  disabled?: boolean;
  onChange: (value: string | null) => void;
}

export default function BarcodeScanInput({
  label,
  description = "Scan Code Barcode Pada Ban",
  required = false,
  value,
  disabled = false,
  onChange,
}: BarcodeScanInputProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const scanSessionRef = useRef<number>(0);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [result, setResult] = useState<string | null>(null);
  const [manualValue, setManualValue] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      setResult(value);
      setManualValue(value);
    } else {
      setResult(null);
      setManualValue("");
    }
  }, [value]);

  useEffect(() => {
    if (disabled) {
      stopScan();
    }
  }, [disabled]);

  const startScan = async () => {
    if (disabled || isScanning) return;

    setError(null);
    setIsScanning(true);

    const sessionId = Date.now();
    scanSessionRef.current = sessionId;

    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });

      if (!videoRef.current) return;

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      scanTimeoutRef.current = setTimeout(() => {
        if (scanSessionRef.current === sessionId) {
          setError("Barcode tidak terdeteksi. Silakan isi manual.");
          stopScan();
        }
      }, 10_000);

      reader.decodeFromVideoElement(videoRef.current, (scanResult) => {
        if (scanSessionRef.current !== sessionId) return;
        if (!scanResult) return;

        const text = scanResult.getText();

        clearTimeout(scanTimeoutRef.current!);
        scanSessionRef.current = 0;

        setResult(text);
        onChange(text);
        stopScan();
      });
    } catch (e) {
      console.error(e);
      setError("Gagal mengakses kamera");
      stopScan();
    }
  };

  const stopScan = () => {
    scanSessionRef.current = 0;

    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }

    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((track) => track.stop());

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    readerRef.current = null;
    setIsScanning(false);
  };

  const handleRemove = () => {
    if (disabled) return;
    stopScan();
    setResult(null);
    setManualValue("");
    onChange(null);
  };

  useEffect(() => {
    return () => stopScan();
  }, []);

  return (
    <div
      className={`w-full flex flex-col gap-3 text-white ${
        disabled ? "opacity-50" : ""
      }`}
    >
      {!error && (
        <>
          <p>
            {label} {required && <span className="text-red-500">*</span>}
          </p>

          <button
            type="button"
            disabled={disabled}
            onClick={startScan}
            className={`bg-input rounded-lg border-2 border-dashed p-4
              border-input-border flex items-center justify-between
              ${disabled ? "cursor-not-allowed" : "hover:border-primary"}
            `}
          >
            {result ? (
              <div className="flex items-center gap-2">
                <FaBarcode className="text-primary" />
                <p className="text-sm truncate">{result}</p>
              </div>
            ) : (
              <>
                <p className="text-input-border text-sm">{description}</p>
                <MdOutlinePhotoCamera />
              </>
            )}
          </button>
        </>
      )}

      {isScanning && !disabled && (
        <div className="relative w-full rounded-lg overflow-hidden border">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover bg-black"
            muted
            autoPlay
            playsInline
          />
          <button
            type="button"
            onClick={stopScan}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2"
          >
            <MdClose />
          </button>
        </div>
      )}

      {error && (
        <>
          <GeneralInput
            label="Kode Barcode Ban (Manual Fill)"
            name="barcode_manual"
            value={manualValue}
            placeholder="Masukan Kode Barcode Ban"
            maxLength={16}
            required
            reddot
            disabled={disabled}
            onChange={(e) => {
              if (disabled) return;
              setManualValue(e.target.value);
              onChange(e.target.value);
            }}
          />
          <p className="text-red-500 text-xs">{error}</p>
        </>
      )}

      {result && !disabled && (
        <button
          type="button"
          onClick={handleRemove}
          className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg flex items-center gap-2 justify-center"
        >
          <FaTrash /> Hapus Barcode
        </button>
      )}
    </div>
  );
}
