"use client";

// BasePath for assets (must match next.config.ts)
const BASE_PATH = "/id/warranty";
export default function WarrantyRegistrationStep1() {
  const {
    name,
    phone,
    brand,
    type,
    anotherType,
    carNumber,
    odometer,
    setField,
    odometerImage,
    setOdometerImage,
  } = useWarrantyStore();

  const { user } = useUserStore();
  const [brandId, setBrandId] = useState<number | null>(null);
  const [brandOptions, setBrandOptions] = useState<any[]>([]);
  const [typeOptions, setTypeOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await getBrand();
        const sort = response.data.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );

        setBrandOptions(sort);
      } catch (err) {
        console.error("Failed to get brand:", err);
      }
    };

    fetchBrand();
  }, []);

  useEffect(() => {
    if (!brandId) return;

    const fetchType = async () => {
      try {
        const response = await getType(brandId);
        const sort = response.data.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        setTypeOptions(sort);
      } catch (err) {
        console.error("Failed to get type:", err);
      }
    };

    fetchType();
  }, [brandId]);

  const isFormValid =
    user?.name !== "" &&
    user?.phone !== "" &&
    brand !== "" &&
    type.trim() !== "" &&
    carNumber.trim() !== "" &&
    odometer.trim() !== "" &&
    odometerImage !== null;
  return (
    <div className="flex flex-col gap-5 font-bold text-sm xl:text-base">
      {/* top */}
      <div className="flex flex-col gap-3">
        <p>Data Diri Anda</p>
        <div className="flex flex-col md:flex-row w-full gap-5 md:justify-between items-center p-5 bg-secondary rounded-lg border border-input-border">
          {/* name */}
          <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
            <label>
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden text-white/80">
              <input
                id={name}
                name={name}
                value={user?.name}
                placeholder=""
                required={true}
                readOnly
                className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
              />
            </div>
          </div>
          {/* phone */}
          <div className="flex flex-col gap-2 w-full text-white font-bold text-sm xl:text-base">
            <label>
              Nomor Telepon <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center bg-input-fill border border-input-border rounded-lg overflow-hidden text-white/80">
              <span className="px-3  font-medium select-none">+62</span>
              <input
                id={phone}
                name={phone}
                value={user?.phone || ""}
                placeholder=""
                maxLength={11}
                required={true}
                readOnly
                className="flex-1 bg-transparent py-3 px-5 font-medium outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      {/* bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5  ">
        {/* left */}
        <div className="flex flex-col gap-3 w-full h-full   ">
          <p>Foto Odometer Kendaraan</p>
          <div className="flex flex-col w-full gap-5 p-5 bg-secondary rounded-lg border border-input-border h-full ">
            <div className=" flex flex-col md:flex-row items-center justify-between gap-5">
              {/* success */}
              <div className="flex items-center relative rounded-lg w-full lg:w-[50%] ">
                <Image
                  src={`${BASE_PATH}/assets/warranty/odometer1.png`}
                  width={9999}
                  height={9999}
                  alt="odometer1"
                  className="w-full h-full object-cover rounded-lg"
                />
                <FaCheckCircle className="absolute top-5 left-5 text-[#00DF80] text-5xl xl:text-7xl" />

                <div className="bg-linear-to-t from-black/90 via-black/85 to-transparent/25 absolute bottom-0 h-50 w-full z-10"></div>

                <div className="absolute bottom-5 flex flex-col px-5 z-10">
                  <p className=" text-lg xl:text-xl">
                    Foto Odometer Yang Direkomendasikan
                  </p>
                  <p className=" text-xs xl:text-sm text-input-placeholder">
                    Odometer harus terlihat jelas dan mudah terbaca.
                  </p>
                </div>
              </div>
              {/* failed */}
              <div className="flex items-center relative rounded-lg w-full lg:w-[50%] ">
                <Image
                  src={`${BASE_PATH}/assets/warranty/odometer2.png`}
                  width={9999}
                  height={9999}
                  alt="odometer1"
                  className="w-full h-full object-cover rounded-lg"
                />
                <IoCloseCircle className="absolute top-5 left-5 text-[#DF3400] text-5xl xl:text-7xl" />

                <div className="bg-linear-to-t from-black/90 via-black/85 to-transparent/25 absolute bottom-0 h-30 md:h-50 w-full z-10"></div>

                <div className="absolute bottom-5 flex flex-col px-5 z-10 w-full">
                  <p className=" text-base xl:text-lg">
                    Foto Odometer Yang Tidak Direkomendasikan
                  </p>
                  <p className=" text-xs xl:text-sm text-input-placeholder">
                    Odometer tidak terlihat jelas dan sulit terbaca.
                  </p>
                </div>
              </div>
            </div>
            <i className="text-primary">
              Harap dicatat bahwa gambar menunjukkan pembacaan odometer, bukan
              nilai untuk Trip A atau Trip B.
            </i>
          </div>
        </div>
        {/* right */}
        <div className="flex flex-col gap-3 w-full h-full  ">
          <p>Data Kendaraan</p>
          <div className="flex flex-col w-full h-full gap-5 p-5 bg-secondary rounded-lg border border-input-border">
            <div className="flex flex-col md:flex-row items-center gap-5 justify-between">
              <DropdownInput
                label="Brand Kendaraan"
                name="brand"
                value={brandId ?? ""}
                placeholder="Pilih Brand Kendaraan Anda"
                options={brandOptions.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                onChange={(e) => {
                  const selectedId = Number(e.target.value);

                  const selectedBrand = brandOptions.find(
                    (item) => item.id === selectedId
                  );

                  if (!selectedBrand) return;

                  setBrandId(selectedId);
                  setField("brand", selectedBrand.name);
                  setField("type", "");
                  setField("anotherType", "");
                }}
                required
              />

              <DropdownInput
                label="Tipe Kendaraan"
                name="type"
                value={type}
                placeholder="Pilih Tipe Kendaraan Anda"
                options={[
                  ...typeOptions.map((item) => ({
                    label: item.name,
                    value: item.slug,
                  })),
                  { label: "Lainnya", value: "lainnya" },
                ]}
                onChange={(e) => setField("type", e.target.value)}
                required
              />
            </div>
            {type === "lainnya" && (
              <GeneralInput
                label="Tipe Kendaraan (Lainnya)"
                name="anotherType"
                type="text"
                placeholder="Masukan Tipe Kendaraan Anda"
                maxLength={64}
                value={anotherType}
                reddot
                onChange={(e) => setField("anotherType", e.target.value)}
              />
            )}

            <GeneralInput
              label="Plat Nomor Kendaraan"
              name="carNumber"
              type="text"
              placeholder="Masukan Plat Nomor Kendaraan Anda"
              maxLength={12}
              value={carNumber}
              reddot
              className="uppercase"
              onChange={(e) => setField("carNumber", e.target.value)}
            />
            <OdometerInput
              label="Odometer Kendaraan"
              placeholder="Masukan Odometer Saat Pembelian"
              name="odometer"
              value={odometer}
              onChange={(e) => setField("odometer", e)}
            />
            <FileInput
              name="odometerImage"
              label="Upload Gambar Odometer Kendaraan Anda"
              description="Upload gambar dalam format .PNG/.JPG"
              required
              multiple={false}
              onChange={(files) => {
                setOdometerImage(files?.[0] ?? null);
              }}
            />
            <i className="text-primary">
              Foto Odometer yang diunggah merupakan foto Odometer pada saat
              pembelian.
            </i>
          </div>
        </div>
      </div>
      <ActionLink
        href="/dashboard/tire-warranty/registration?step=2"
        label="Lanjutkan"
        className="w-full flex justify-center"
        disabled={!isFormValid}
      />
    </div>
  );
}
