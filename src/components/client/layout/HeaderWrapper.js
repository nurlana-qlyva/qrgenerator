"use client";

import { usePathname } from "next/navigation";
import PublicNavbar from "./PublicNavbar.js";

export default function HeaderWrapper() {
  const pathname = usePathname();

  const hideFooterRoutes = ["/login", "/register"];

  if (hideFooterRoutes.includes(pathname)) {
    return null;
  }

  return <PublicNavbar />;
}
