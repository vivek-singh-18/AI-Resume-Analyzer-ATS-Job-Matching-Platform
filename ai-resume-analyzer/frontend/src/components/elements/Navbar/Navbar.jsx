import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import NavMenu from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const { token } = useAuthStore();

  // Reset scroll state on route change
  useEffect(() => {
    setScrolled(false);
  }, [location.pathname]);

  // Scroll listener only on home page
  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-all duration-500 ease-in-out ${
        isHome && !scrolled ? "top-4 px-4" : "top-0 px-0"
      }`}
    >
      <nav
        className={`flex items-center justify-between transition-all duration-500 ease-in-out
          bg-background shadow-sm px-6
          ${
            isHome
              ? scrolled
                ? "rounded-none shadow-md h-14"
                : "rounded-full shadow-sm h-16 mx-4"
              : "rounded-none h-14"
          }
        `}
      >
        {/* Left */}
        <div className="font-semibold tracking-tight text-lg sm:text-xl lg:text-xl truncate">
          <Link to="/" className="hover:text-primary transition-colors">
            AI Document Analyzer
          </Link>
        </div>

        {/* Desktop Menu */}
        {token && (
          <div className="hidden md:flex">
            <NavMenu />
          </div>
        )}

        {/* Right buttons for unauthenticated users */}
          {!token && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="inline-flex rounded-full"
              >
                <Link to="/login">Sign In</Link>
              </Button>
              <Button className="rounded-full">
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          )}

        {token && (
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
