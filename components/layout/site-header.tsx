"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/nav-links";
import ThemeToggle from "@/components/theme/theme-toggle";

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-logo" href="/map">
          <span className="site-logo__mark" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.5 19C4.01 19 2 16.99 2 14.5C2 12.5 3.4 10.8 5.28 10.22C5.57 7.35 8 5.1 11 5.1C13.39 5.1 15.42 6.5 16.39 8.53C16.59 8.51 16.79 8.5 17 8.5C19.76 8.5 22 10.74 22 13.5C22 16.26 19.76 18.5 17 18.5H16" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M13 13L10.5 18H14L11.5 23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" className="site-logo__bolt"/>
            </svg>
          </span>
          <span className="site-logo__text">StormTalk</span>
        </Link>

        <div className="site-header__actions">
          <nav className="site-nav" aria-label="Navigatie principala">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/" ? pathname === link.href : pathname.startsWith(link.href);

              return (
                <Link
                  className={isActive ? "site-nav__link is-active" : "site-nav__link"}
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
