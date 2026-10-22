import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

interface LogoProps {
  variant?: "light" | "dark" | "badge";
  size?: "sm" | "md" | "lg";
  withSlogan?: boolean;
  linkToHome?: boolean;
}

export function Logo({
  variant = "light",
  size = "md",
  withSlogan = false,
  linkToHome = true,
}: LogoProps) {
  const sizeMap = {
    sm: { imgW: 36, imgH: 36, text: "text-lg", slogan: "text-[10px]" },
    md: { imgW: 46, imgH: 46, text: "text-xl", slogan: "text-xs" },
    lg: { imgW: 64, imgH: 64, text: "text-2xl", slogan: "text-sm" },
  };

  const { imgW, imgH, text, slogan } = sizeMap[size];

  const content = (
    <div className="flex items-center gap-3 select-none">
      <div className="relative overflow-hidden rounded-xl shadow-md border border-amber-400/20 bg-navy p-1 shrink-0 flex items-center justify-center">
        <Image
          src="/icon.png"
          alt="Logo PA³ English Academy"
          width={imgW}
          height={imgH}
          priority
          className="object-contain rounded-lg"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 font-black tracking-tight leading-tight">
          <span className={variant === "dark" ? "text-white" : "text-[#0B1F42]"}>
            PA<sup className="text-amber-500 font-extrabold text-sm">3</sup>
          </span>
          <span className="text-amber-500 font-extrabold tracking-wide">
            ENGLISH
          </span>
          <span className={variant === "dark" ? "text-slate-200 text-sm font-semibold" : "text-slate-600 text-sm font-semibold"}>
            ACADEMY
          </span>
          <span className="text-xs" title="République Démocratique du Congo">🇨🇩</span>
        </div>

        {withSlogan && (
          <p
            className={`font-semibold tracking-wider uppercase ${slogan} ${
              variant === "dark" ? "text-amber-300/90" : "text-amber-700 font-bold"
            }`}
          >
            {BRAND.slogan}
          </p>
        )}
      </div>
    </div>
  );

  if (linkToHome) {
    return (
      <Link
        href="/"
        className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1 transition-transform hover:scale-[1.02]"
        aria-label="Accueil PA³ English Academy"
      >
        {content}
      </Link>
    );
  }

  return content;
}
