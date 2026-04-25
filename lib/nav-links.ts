import type { Route } from "next";

export const navLinks: { href: Route; label: string }[] = [
  { href: "/map", label: "Harta" },
  { href: "/vacation" as Route, label: "Vacanta" },
  { href: "/login", label: "Login" },
  { href: "/favorites", label: "Favorite" },
  { href: "/history", label: "Istoric" },
  { href: "/profile", label: "Cont" },
];
