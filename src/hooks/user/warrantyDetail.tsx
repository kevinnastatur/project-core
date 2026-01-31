"use client";

import { useParams } from "next/navigation";
import { WarrantyItemDetail } from "@/types/warranty";
import { getWarrantyDetail } from "@/services/Warranty";
import { useEffect, useState } from "react";

export default function useUserWarrantyHook() {
  const { id } = useParams<{ id: string }>();

  const [alertTop, setAlertTop] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<WarrantyItemDetail | null>(null);

  const isEditable = (field?: string) => {
    if (!Array.isArray(data?.editable_fields)) return false;
    if (!field) return true;
    return data.editable_fields.includes(field);
  };

  useEffect(() => {
    if (!id) return;

    const fetchWarrantyDetail = async () => {
      try {
        setLoading(true);
        const response = await getWarrantyDetail(id);
        setData(response.data ?? null);
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWarrantyDetail();
  }, [id]);

  return {
    alertTop,
    setAlertTop,
    loading,
    data,
    setData,
    isEditable,
  };
}
