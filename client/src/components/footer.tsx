import React from "react";
import {
  Cpu,
} from "lucide-react";

interface FooterLink {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  socialLinks?: SocialLink[];
  navLinks?: FooterLink[];
  creatorName?: string;
  creatorUrl?: string;
  brandIcon?: React.ReactNode;
  className?: string;
}

export const Footer = ({
  brandName = "Kaizen",
  brandDescription = "Democratizing technical interview preparation through advanced AI telemetry.",
  socialLinks = [],
  navLinks = [],
  creatorName,
  creatorUrl,
  brandIcon,
  className = "",
}: FooterProps) => {
  return (
    <section className={`relative w-full mt-0 overflow-hidden ${className}`}>
      <footer className="border-t border-zinc-200 bg-zinc-50 relative pb-16">
        <div className="max-w-7xl flex flex-col justify-between mx-auto min-h-[30rem] sm:min-h-[35rem] md:min-h-[40rem] relative p-4 py-10">
          <div className="flex flex-col mb-12 sm:mb-20 md:mb-0 w-full z-20">
            <div className="w-full flex flex-col items-center">
              <div className="space-y-2 flex flex-col items-center flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-950 text-4xl font-extrabold tracking-tight">
                    {brandName}
                  </span>
                </div>
                <p className="text-zinc-500 font-medium text-center w-full max-w-sm sm:w-96 px-4 sm:px-0">
                  {brandDescription}
                </p>
              </div>

              {socialLinks.length > 0 && (
                <div className="flex mb-8 mt-8 gap-6">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="text-zinc-400 hover:text-zinc-900 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="w-6 h-6 hover:scale-110 duration-300">
                        {link.icon}
                      </div>
                      <span className="sr-only">{link.label}</span>
                    </a>
                  ))}
                </div>
              )}

              {navLinks.length > 0 && (
                <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-zinc-500 max-w-full px-4">
                  {navLinks.map((link, index) => (
                    link.onClick ? (
                      <button
                        key={index}
                        onClick={link.onClick}
                        className="hover:text-zinc-950 duration-300 hover:font-bold transition-all"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        key={index}
                        href={link.href}
                        className="hover:text-zinc-950 duration-300 hover:font-bold transition-all"
                      >
                        {link.label}
                      </a>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-20 md:mt-24 flex flex-col gap-2 md:gap-1 items-center justify-center md:flex-row md:items-center md:justify-between px-4 md:px-0 z-20">
            <p className="text-zinc-400 text-center md:text-left font-mono text-xs">
              ©{new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
            {creatorName && creatorUrl && (
              <nav className="flex gap-4">
                <a
                  href={creatorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-zinc-400 hover:text-zinc-900 transition-colors duration-300 hover:font-bold"
                >
                  Crafted by {creatorName}
                </a>
              </nav>
            )}
          </div>
        </div>

        {/* Large background text */}
        <div
          className="bg-gradient-to-b from-zinc-200 via-zinc-100 to-transparent bg-clip-text text-transparent leading-none absolute left-1/2 -translate-x-1/2 bottom-40 md:bottom-32 font-extrabold tracking-tighter pointer-events-none select-none text-center px-4"
          style={{
            fontSize: 'clamp(4rem, 18vw, 14rem)',
            maxWidth: '100vw'
          }}
        >
          {brandName.toUpperCase()}
        </div>

        {/* Bottom logo */}
        <div className="absolute hover:border-zinc-400 duration-500 drop-shadow-[0_0px_20px_rgba(0,0,0,0.05)] bottom-24 md:bottom-20 backdrop-blur-md rounded-3xl bg-white/80 left-1/2 border-2 border-zinc-200 flex items-center justify-center p-3 -translate-x-1/2 z-30">
          <div className="w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl">
            {brandIcon || (
              <Cpu className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-white drop-shadow-md" />
            )}
          </div>
        </div>

        {/* Bottom line */}
        <div className="absolute bottom-32 sm:bottom-34 backdrop-blur-sm h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent w-full left-1/2 -translate-x-1/2 z-20"></div>

        {/* Bottom shadow fade */}
        <div className="bg-gradient-to-t from-zinc-50 via-zinc-50/80 blur-[1em] to-transparent absolute bottom-0 w-full h-32 z-10 pointer-events-none"></div>
      </footer>
    </section>
  );
};
