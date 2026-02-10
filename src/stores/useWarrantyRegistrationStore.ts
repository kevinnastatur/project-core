import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ================= TIRE ITEM ================= */
export interface TireItem {
  tirestype: string;
  tiresize: string;
  tirebarcode: string;
  tiredotnumber: string;
}

/* ================= FORM STATE ================= */
interface WarrantyFormState {
  // FORM DATA
  name: string;
  phone: string;
  brand: string;
  type: string;
  anotherType: string;
  carNumber: string;
  odometer: string;
  invoiceNumber: string;
  purchaseDate: string;
  store_id: string;

  // TIRES
  tires: TireItem[];

  // FILES (NOT PERSISTED)
  odometerImage: File | null;
  invoice: File | null;

  // GENERIC ACTIONS
  setField: <K extends keyof WarrantyFormState>(
    field: K,
    value: WarrantyFormState[K]
  ) => void;

  setOdometerImage: (file: File | null) => void;
  setInvoice: (file: File | null) => void;

  // TIRE ACTIONS
  addTire: () => void;
  updateTire: <K extends keyof TireItem>(
    index: number,
    field: K,
    value: TireItem[K]
  ) => void;
  removeTire: (index: number) => void;

  resetForm: () => void;
  isFormValid: () => boolean;
}

/* ================= DEFAULT TIRE ================= */
const emptyTire: TireItem = {
  tirestype: "",
  tiresize: "",
  tirebarcode: "",
  tiredotnumber: "",
};

export const useWarrantyStore = create<WarrantyFormState>()(
  persist(
    (set, get) => ({
      /* ================= INITIAL STATE ================= */
      name: "",
      phone: "",
      brand: "",
      type: "",
      anotherType: "",
      carNumber: "",
      odometer: "",
      invoiceNumber: "",
      purchaseDate: "",
      store_id: "",

      // ✅ MINIMAL 2 BAN
      tires: [{ ...emptyTire }, { ...emptyTire }],

      odometerImage: null,
      invoice: null,

      /* ================= GENERIC SETTER ================= */
      setField: (field, value) =>
        set(() => ({
          [field]: value,
        })),

      /* ================= FILE HANDLERS ================= */
      setOdometerImage: (file) => set({ odometerImage: file }),
      setInvoice: (file) => set({ invoice: file }),

      /* ================= TIRE HANDLERS ================= */
      addTire: () =>
        set((state) => {
          if (state.tires.length >= 5) return state;

          const firstTire = state.tires[0];

          return {
            tires: [
              ...state.tires,
              {
                ...emptyTire,
                tirestype: firstTire.tirestype,
                tiresize: firstTire.tiresize,
              },
            ],
          };
        }),

      updateTire: (index, field, value) =>
        set((state) => {
          const updatedTires = [...state.tires];

          // update tire yg diubah
          updatedTires[index] = {
            ...updatedTires[index],
            [field]: value,
          };

          /**
           * AUTO FILL
           * - hanya dari ban pertama
           * - hanya untuk tirestype & tiresize
           * - hanya mengisi kalau ban berikutnya masih kosong
           */
          if (index === 0 && (field === "tirestype" || field === "tiresize")) {
            for (let i = 1; i < updatedTires.length; i++) {
              if (!updatedTires[i][field]) {
                updatedTires[i] = {
                  ...updatedTires[i],
                  [field]: value,
                };
              }
            }
          }

          return { tires: updatedTires };
        }),

      removeTire: (index) =>
        set((state) => {
          if (state.tires.length <= 2) return state; // ⛔ MIN 2
          return {
            tires: state.tires.filter((_, i) => i !== index),
          };
        }),

      /* ================= RESET ================= */
      resetForm: () =>
        set({
          name: "",
          phone: "",
          brand: "",
          type: "",
          anotherType: "",
          carNumber: "",
          odometer: "",
          invoiceNumber: "",
          purchaseDate: "",
          store_id: "",
          odometerImage: null,
          invoice: null,

          tires: [{ ...emptyTire }, { ...emptyTire }],
        }),

      /* ================= VALIDATION ================= */
      isFormValid: () => {
        const {
          name,
          phone,
          brand,
          type,
          carNumber,
          odometer,
          odometerImage,
          invoice,
          tires,
          store_id,
        } = get();

        const isTiresValid =
          tires.length >= 2 &&
          tires.every(
            (tire) =>
              tire.tirestype.trim() !== "" &&
              tire.tiresize.trim() !== "" &&
              tire.tirebarcode.trim() !== "" &&
              tire.tiredotnumber.trim() !== ""
          );

        return (
          name.trim() !== "" &&
          phone.trim() !== "" &&
          brand.trim() !== "" &&
          type.trim() !== "" &&
          store_id !== "" &&
          carNumber.trim() !== "" &&
          odometer.trim() !== "" &&
          odometerImage !== null &&
          invoice !== null &&
          isTiresValid
        );
      },
    }),
    {
      name: "tire-warranty-form",

      /* ================= PERSIST SAFE ================= */
      partialize: (state) => ({
        name: state.name,
        phone: state.phone,
        brand: state.brand,
        type: state.type,
        store_id: state.store_id,
        anotherType: state.anotherType,
        carNumber: state.carNumber,
        odometer: state.odometer,
        invoiceNumber: state.invoiceNumber,
        purchaseDate: state.purchaseDate,
        tires: state.tires,
      }),
    }
  )
);
