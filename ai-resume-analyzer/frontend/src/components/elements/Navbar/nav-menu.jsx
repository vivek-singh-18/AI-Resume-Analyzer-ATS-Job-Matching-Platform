import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuthStore } from "@/stores/authStore";
import { Link } from "react-router-dom";

export const NavMenu = ({ orientation = "horizontal", className }) => {
  const { logout, token } = useAuthStore();

  const menuItems = [
    { label: "Home", to: "/" },
    { label: "Upload", to: "/upload" },
    { label: "Profile", to: "/profile" },
    { label: "Dashboard", to: "/dashboard" },
  ];

  if (token) {
    menuItems.push({ label: "Logout", to: "/", onClick: logout });
  }

  return (
    <NavigationMenu orientation={orientation} className={className}>
      <NavigationMenuList
        className={`gap-3 ${
          orientation === "vertical"
            ? "flex-col items-start mt-6"
            : "flex-row items-center "
        }`}
      >
        {menuItems.map(({ label, to, onClick }) => (
          <NavigationMenuItem key={label}>
            <NavigationMenuLink asChild>
              <Link
                to={to}
                onClick={onClick}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavMenu;
