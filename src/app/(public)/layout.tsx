import { Navbar } from "@/components/layout/Navbar";
import { BackToTop } from "@/components/layout/BackToTop";

// This layout wraps all PUBLIC pages with Navbar + BackToTop.
// Admin pages have their own separate layout and will NOT inherit this.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <BackToTop />
    </>
  );
}
