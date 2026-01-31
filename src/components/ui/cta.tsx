import { MdOutlineArrowRight, MdOutlineHeadphones } from "react-icons/md";
import Link from "next/link";
export default function BannerCTA() {
  return (
    <div className="w-full h-full py-5 px-5">
      <div
        className="w-full h-full flex flex-col lg:flex-row lg:justify-between  rounded-lg font-bold text-xl md:text-2xl xl:text-3xl "
        style={{
          backgroundImage: "url('/assets/cta.svg')",
          backgroundSize: "cover",
        }}
      >
        <div className="w-full flex justify-between gap-5 bg-primary/80 md:px-20 md:py-12 p-5 rounded-lg">
          <div className="flex items-center gap-2 ">
            <MdOutlineHeadphones />
            <p>Butuh Bantuan?</p>
          </div>
          <Link
            href={"https://www.dunlop.co.id/id/contact"}
            className="flex items-center gap-2 bg-[#E83D23] px-3 md:px-5 py-3 rounded-lg text-sm md:text-lg xl:text-xl  text-white"
          >
            <p>Hubungi Kami</p>
            <MdOutlineArrowRight className="text-base xl:text-lg " />
          </Link>
        </div>
      </div>
    </div>
  );
}
