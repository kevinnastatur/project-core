"use client";

import { useState } from "react";
import { MdOutlineArrowRight } from "react-icons/md";
import Image from "next/image";

type SubmitOverlayProps = {
  show?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export default function SubmitOverlay({
  show = false,
  disabled = false,
  onClick,
}: SubmitOverlayProps) {
  const [agreed, setAgreed] = useState(false);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm font-light">
      <div className="bg-white p-5 rounded-lg flex flex-col gap-3 w-125 max-w-[90%]">
        {/* CONTENT  */}
        <div className="text-[#A3A3A3] text-xs xl:text-sm flex flex-col gap-3 overflow-y-auto h-80 pr-2 font-light text-justify">
          <p className="text-sm xl:text-base text-secondary font-bold">
            Syarat & Ketentuan Garansi Blue Response TG
          </p>
          {/* Pasal 1 */}
          <div className="flex flex-col gap-3">
            <p>
              {" "}
              PT Sumi Rubber Indonesia adalah perusahaan yang memproduksi dan
              memasarkan produk ban Dunlop untuk kendaraan bermotor roda empat
              dan roda dua dengan memilki salah satu nama produk Blue Response
              TG yang masuk dalam cakupan syarat dan ketentuan garansi ini.
              Produk ini didistribusikan melalui jaringan penjualan melalui
              distributor resmi serta beberapa jaringan penjualan ban di seluruh
              wilayah Indonesia. Produsen memberikan jaminan bagi konsumen untuk
              pengguna Blue Response TG, dengan Syarat dan Ketentuan Garansi
              yang berlaku sebagai berikut:
            </p>{" "}
            <b className="font-bold text-background text-center">Pasal 1</b>
            <div>
              <p>
                {" "}
                Produsen memberikan garansi produk Blue Response sebagai
                berikut:
              </p>
              <ol className="list-[lower-alpha] pl-5">
                <li>
                  <span className="font-bold">
                    {" "}
                    Garansi Ban adalah 1 (satu) tahun atau 24.000 (dua puluh
                    empat ribu) km,
                  </span>{" "}
                  dengan ketentuan mana yang lebih dahulu dicapai.
                </li>
                <li>
                  <span className="font-bold">
                    {" "}
                    Biaya* yang timbul disebabkan penggantian garansi kerusakan
                    ban garansi akan dibebankan kepada pelanggan,
                  </span>{" "}
                  besaran biaya jasa penggantian ban disesuaikan dengan
                  kebijakan masing-masing toko/bengkel.
                  <span className=" italic">
                    * Biaya jasa bongkar-pasang ban, balancing, spooring serta
                    biaya kerusakan lain pada komponen kendaraan yang mungkin
                    terdampak dari terjadinya ban yang rusak.
                  </span>
                </li>
              </ol>
            </div>
          </div>
          {/* Pasal 2 */}
          <div className="flex flex-col gap-3">
            <b className="font-bold text-background text-center">Pasal 2</b>
            <div>
              <p>
                Produsen memberikan garansi berupa penggantian ban dalam syarat
                dan kurun waktu yang ditentukan karena mengalami kerusakan
                akibat pemakaian seperti:
              </p>
              <ol className="list-[lower-alpha] pl-5">
                <li>Kesalahan proses produksi.</li>
                <li>Kesalahan bahan atau material produk.</li>
                <li>Kesalahan konstruksi. </li>
                <li>Kerusakan pada ban akibat kondisi jalan.</li>
              </ol>
            </div>
          </div>
          {/* Pasal 3 */}
          <div className="flex flex-col gap-3">
            <b className="font-bold text-background text-center">Pasal 3</b>
            <div>
              <p>
                Klaim garansi ban dilakukan dengan syarat dan ketentuan sebagai
                berikut:
              </p>
              <ol className="list-[lower-alpha] pl-5">
                <li>
                  Pelanggan melakukan pendaftaran akun personal di website{" "}
                  <a
                    href="https://www.dunlop.co.id/id"
                    className="text-background"
                  >
                    www.dunlop.co.id.
                  </a>
                </li>
                <li>
                  Pembelian dilakukan di toko/bengkel yang ditunjuk oleh
                  produsen.
                </li>
                <li>
                  Pembelian minimal 2 (dua) ban Dunlop Blue Response TG dalam 1
                  (satu) kali transaksi untuk mendaftarkan garansi.{" "}
                </li>
                <li>
                  Pelanggan wajib mendaftarkan garansi ban Dunlop Blue Response
                  TG via website{" "}
                  <a
                    href="https://www.dunlop.co.id/id"
                    className="text-background"
                  >
                    www.dunlop.co.id.
                  </a>
                </li>
                <li>
                  Garansi hanya berlaku untuk ban Dunlop Blue Response TG yang
                  dirawat secara berkala serta tercatat oleh toko/bengkel yang
                  ditunjuk produsen di seluruh Indonesia, Jadwal Perawatan
                  Berkala sesuai dengan panduan yang berlaku.
                </li>
                <li>
                  Pelanggan wajib mengajukan klaim garansi ban yang mengalami
                  kerusakan via website{" "}
                  <a
                    href="https://www.dunlop.co.id/id"
                    className="text-background"
                  >
                    www.dunlop.co.id.
                  </a>
                </li>
                <li>
                  Keputusan garansi serta informasi ketersediaan stok ban
                  pengganti akan diberikan menunggu hasil informasi dan
                  verifikasi oleh pihak produsen.
                </li>
                <li>
                  Keputusan atas penerimaan atau penolakan klaim merupakan hak
                  penuh dari produsen (PT Sumi Rubber Indonesia) sesuai dengan
                  ketentuan yang berlaku.
                </li>
                <li>
                  Penggantian ban garansi hanya dapat dilakukan di toko /bengkel
                  yang ditunjuk oleh produsen di seluruh wilayah Indonesia
                  dengan menunjukan Identitas garansi pelanggan.
                </li>
                <li>
                  Penggantian ban garansi akan di berikan dengan produk yang
                  sama (merek, tipe, dan ukuran ban).
                </li>
                <li>
                  Ban pengganti harus dipasang sesuai dengan data kendaraan yang
                  terdaftar disaat pendaftaran program ini.
                </li>
                <li>
                  Penggantian ban klaim diberikan maksimal 1 (satu) kali dari
                  setiap individu ban yang dibeli dan didaftarkan didalam
                  program ini.
                </li>
              </ol>
            </div>
          </div>
          {/* Pasal 4 */}
          <div className="flex flex-col gap-3">
            <b className="font-bold text-background text-center">Pasal 4</b>
            <div>
              <p>
                Garansi ban Dunlop Blue Response TG tidak berlaku pada kondisi –
                kondisi seperti dibawah ini:
              </p>
              <ol className="list-[lower-alpha] pl-5">
                <li>
                  Konsumen yang belum memilki akun serta belum mendaftarkan
                  produk kedalam program garansi via website.
                </li>
                <li>
                  Tidak melakukan perawatan secara berkala dan/atau tercatat di
                  toko/bengkel yang ditunjuk/berpartisipasi dalam program ini.
                </li>
                <li>
                  Terjadi kerusakan akibat proses penyimpanan, pemindahan,
                  dan/atau pengiriman produk baik dari produsen, distributor
                  dan/atau antar jaringan penjualan.
                </li>
                <li>
                  Terjadi kerusakan akibat proses pemasangan/pelepasan, serta
                  pemilihan ukuran ban yang tidak sesuai.
                </li>
                <li>
                  Terjadi kerusakan yang disebabkan kegagalan fungsi kendaraan
                  seperti fungsi rem, suspensi, kemudi, dan/atau kaki-kaki
                  kendaraan.
                </li>
                <li>
                  Terjadi kerusakan akibat perawatan (tekanan angin yang tidak
                  sesuai, penggunaan semir ban berlebih, balancing dan/atau
                  spooring yang tidak sesuai).
                </li>
                <li>
                  Terjadi kerusakan yang masih bisa diperbaiki atau akibat
                  perbaikan (penggunaan cairan ban anti bocor yang tidak
                  sesuai,dan/atau penambalan yang tidak sesuai).
                </li>
                <li>
                  Terjadi kerusakan dalam penggunaan, yang disebabkan hal-hal
                  berikut ini:{" "}
                  <div>
                    <ol className="list-disc pl-5">
                      <li>Kerusakan karena unsur kesengajaan.</li>
                      <li>
                        Kerusakan karena penggunaan yang tidak sesuai seperti;
                        olah raga balap, pengangkutan berat yang diatas
                        kapasitas kemampuan produk, pengunaan di medan off-road.
                      </li>
                    </ol>
                  </div>
                </li>
                <li>
                  Terjadi kerusakan yang diakibatkan oleh sebab-sebab lain
                  seperti:{" "}
                  <div>
                    <ol className="list-disc pl-5">
                      <li>Kebakaran.</li>
                      <li>
                        Terkena: bahan kimia, kotoran burung, getah pohon,
                        garam, air laut.
                      </li>
                      <li>
                        Hal-hal yang termasuk kategori bencana alam, serta
                        kehilangan.
                      </li>
                    </ol>
                  </div>
                </li>
                <li>
                  Timbulnya gejala-gejala normal sesuai standar pabrikan,
                  seperti: suara; getaran (bukan dari faktor ban yang dapat
                  dihilangkan dengan proses balancing) ; perubahan warna
                  (terjadi karena proses alami yang disebut blooming pewarnaan);
                  sepanjang hal-hal tersebut tidak mempengaruhi kualitas, fungsi
                  dan keselamatan penggunaan ban Dunlop Blue Response TG.
                </li>
                <li>
                  Pembelian ban Blue Response TG yang tidak segera/langsung
                  dipakai oleh pembeli sampai melewati ketentuan masa garansi.
                </li>
                <li>
                  Produk ban yang sudah berpindah tangan, baik kendaraan yang
                  sudah berganti kepemilikan dan/atau ban yang sudah
                  diperjual-belikan kepada orang lain.
                </li>
                <li>
                  Kerugian dalam bentuk waktu dan biaya-biaya, seperti: biaya
                  telepon (komunikasi), sewa mobil/motor, biaya penginapan dan
                  lain sebagainya; selama waktu tunggu konsumen melakukan proses
                  klaim garansi ban.
                </li>
              </ol>
            </div>
          </div>
          <p className="text-sm xl:text-base text-secondary font-bold">
            Perawatan Secara Berkala & Teratur
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <p>
                Sebagai salah satu persyaratan penting untuk mendapatkan
                pelayanan garansi, Anda harus melaksanakan perawatan ban secara
                teratur sesuai jadwal pelaksanaan dari PT Sumi Rubber Indonesia.
                Untuk membiasakan Anda dalam melaksanakan perwatan teratur, maka
                PT Sumi Rubber Indonesia menentukan 4 kali Perawatan Berkala
                untuk produk Dunlop Blue Response TG yang Anda miliki pada jarak
                tempuh dan waktu tertentu, berdasarkan syarat dan kondisi yang
                berlaku, yaitu:
              </p>
              <p>
                Tabel Perawatan Berkala (TPB) mana yang tercapai lebih dahulu.
              </p>
              <div className="flex flex-col gap-3 py-3">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/warranty/tabel.jpeg`}
                  width={1200}
                  height={800}
                  alt="table-1"
                  className="object-contain w-full"
                />
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/warranty/tabel2.jpeg`}
                  width={1200}
                  height={800}
                  alt="table-1"
                  className="object-contain w-full"
                />
              </div>
            </div>
            <div>
              <p>
                Untuk melaksanakan Perawatan Berkala ini, Konsumen dapat
                mengunjungi di toko/bengkel yang ditunjuk oleh produsen yang
                ter- dekat dengan Anda di seluruh Indonesia, daftar toko/bengkel
                dapat dilihat di website{" "}
                <a
                  href="https://www.dunlop.co.id/id"
                  className="text-background"
                >
                  www.dunlop.co.id.
                </a>
              </p>

              <ol className="list-[number] pl-5">
                <li>
                  Sebelum melakukan perawatan ban secara berkala, konsumen wajib
                  mendaftarkan secara mandiri melalui website{" "}
                  <a
                    href="https://www.dunlop.co.id/id"
                    className="text-background"
                  >
                    www.dunlop.co.id.
                  </a>
                </li>
                <li>
                  Pemeriksaan tekanan angin dan kondisi ban akan diberikan
                  secara gratis dan dilakukan oleh mekanik terlatih dari
                  toko/bengkel yang ditunjuk oleh produsen.
                </li>
                <li>
                  Tekanan angin diberikan secara gratis dalam bentuk angin biasa
                  (bukan nitrogen atau sejenisnya).
                </li>
                <li>
                  Setiap urutan Perawatan Berkala hanya berlaku dalam jarak
                  tempuh (m), yang ditunjukkan oleh odometer kendaraan dan/atau
                  umur kendaraan (Bulan), terhitung sejak pembelian ban Dunlop
                  Blue Response TG sesuai dengan bukti pembelian dari toko, yang
                  tercantum dalam Tabel Perawatan Berkala (TPB), tergantung mana
                  yang tercapai lebih dahulu.{" "}
                </li>
                <li>
                  Setelah melaksanakan perawatan berkala, pihak toko akan
                  melakukan pendataan mengenai proses perawatan tersebut.
                </li>
                <li>
                  Apabila pelayanan program garansi dan perawatan ini kurang
                  memuaskan bagi Anda, tulislah keluhan Anda dan kirimkan kepada
                  PT Sumi Rubber Indonesia melalui nomor WhatsApp “Dunlop Tyres
                  Indonesia”{" "}
                  <a href="https://wa.me/6281295507273"> +62 812-9550-7273.</a>{" "}
                  Kami senantiasa akan memperhatikan keluhan Anda.
                </li>
                <li>
                  Meskipun pelaksanaan perawatan teratur selanjutnya adalah atas
                  prakarsa dan tanggungan Anda sendiri, tetapi demi keawetan,
                  kenyamanan dan keamanan Anda mengendarai, kami mengharapkan
                  agar Anda tetap melaksanakannya untuk menghindari timbulnya
                  kerusakan dan kerugian yang besar.{" "}
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* AGREEMENT */}
        <div className="flex items-start gap-2 text-[#A3A3A3] text-xs xl:text-sm">
          <input
            type="checkbox"
            className="mt-1 cursor-pointer"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <p>
            Dengan mencentang ini, saya menyetujui syarat dan ketentuan Garansi
            Ban Dunlop.
          </p>
        </div>

        {/* ACTION */}
        <button
          type="button"
          disabled={!agreed || disabled}
          onClick={onClick}
          className={`
           bg-primary
        border border-primary
        text-secondary
        font-bold
        py-3 px-5
        rounded-lg
        transition-all
        duration-300
        ease-out
        w-full
        flex items-center justify-center
            ${
              !agreed || disabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer   hover:opacity-90 "
            }
          `}
        >
          Submit Pendaftaran Garansi
          <MdOutlineArrowRight />
        </button>
      </div>
    </div>
  );
}
