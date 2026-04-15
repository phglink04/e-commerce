"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type FooterLinkItem = {
  to: string;
  text: string;
};

export default function Footer() {
  const pagesLinks: FooterLinkItem[] = [
    { to: "/", text: "Home" },
    { to: "/about", text: "About" },
    { to: "/shop", text: "Shop" },
    { to: "/blog", text: "Blog" },
    { to: "/contact", text: "Contact" },
  ];

  return (
    <footer className="bg-[#212823] text-white py-10">
      <div className="container mx-auto px-3 md:px-8">
        <div className="flex flex-row items-start justify-between space-y-0">
          <div className="w-1/3 text-left md:text-center">
            <h3 className="text-left md:text-center text-base md:text-xl lg:text-2xl font-semibold mb-2">
              PlantWorld
            </h3>
            <p className="text-[0.7rem] md:text-sm lg:text-base mb-1">
              123 Bang Street, Ahmedabad
            </p>
            <p className="text-[0.7rem] md:text-sm lg:text-base mb-1">
              +911776438935
            </p>
            <p className="text-[0.7rem] md:text-sm lg:text-base">
              info@plantworld.com
            </p>
          </div>

          <div className="w-1/3 text-center">
            <h2 className="text-left md:text-center text-base md:text-xl lg:text-2xl font-semibold mb-2">
              PlantWorld
            </h2>
            <p className="text-center text-[0.7rem] w-[6rem] md:w-auto md:text-sm lg:text-lg">
              The seed of gardening is a love that never dies, but it never
              grows to the enduring happiness that the love of gardening
              provides to nature.
            </p>
          </div>

          <div className="sm:w-1/3 text-center sm:text-left">
            <h3 className="text-center text-base md:text-xl lg:text-2xl font-semibold mb-2">
              Pages
            </h3>
            <FooterLinks links={pagesLinks} />
          </div>
        </div>

        <div className="mt-8 border-t border-[#555] pt-4 text-center text-xs md:text-base lg:text-lg">
          <p>Copyright ©2024 PlantWorld. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ links }: { links: FooterLinkItem[] }) {
  const pathname = usePathname();

  const handleClick = (to: string) => {
    if (pathname === to && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <ul className="md:space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <Link
            href={link.to}
            onClick={() => handleClick(link.to)}
            className="text-xs md:text-base text-white hover:underline transition-colors"
          >
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  );
}
