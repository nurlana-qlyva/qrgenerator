"use client";

import { usePathname } from "next/navigation";
import PublicFooter from "./PublicFooter.js";

export default function FooterWrapper() {
  const pathname = usePathname();

  const hideFooterRoutes = ["/login", "/register"];

  if (hideFooterRoutes.includes(pathname)) {
    return null;
  }

  return <PublicFooter />;
}
