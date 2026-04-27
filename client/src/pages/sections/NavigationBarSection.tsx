import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "Adopt", path: "/adopt" },
  { label: "Volunteer", path: "/volunteer" },
  { label: "Donate", path: "/donate" },
  { label: "Contacts", path: "#contacts" },
] as const;

export const NavigationBarSection = (): JSX.Element => {
  const [location, setLocation] = useLocation();

  const handleNavClick = (path: string) => {
    if (path === "#contacts") {
      const el = document.getElementById("contacts");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    if (location === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLocation(path);
    window.scrollTo({ top: 0 });
  };

  const isActive = (path: string) => path !== "#contacts" && location === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex w-full justify-center px-4 py-[27px] sm:px-6">
      <nav
        aria-label="Primary"
        className="flex w-full max-w-[820px] items-center justify-between gap-6 rounded-[18px] bg-black px-[18px] py-[9px] backdrop-blur-[39.38px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(39.38px)_brightness(100%)]"
      >
        <button
          type="button"
          onClick={() => handleNavClick("/")}
          className="flex items-center gap-[9px] focus:outline-none"
          data-testid="link-logo"
        >
          <img
            className="h-8 w-8 shrink-0"
            alt="Logo"
            src="/figmaAssets/logo1.svg"
          />
          <span className="[font-family:'Inter',Helvetica] text-[22.5px] font-normal leading-[31.5px] tracking-[-0.45px] text-white whitespace-nowrap">
            Adopt a Reef
          </span>
        </button>
        <div className="flex items-center gap-[27px]">
          {navigationItems.map((item) => {
            const active = isActive(item.path);
            return active ? (
              <Button
                key={item.label}
                type="button"
                variant="secondary"
                onClick={() => handleNavClick(item.path)}
                data-testid={`button-nav-${item.label.toLowerCase()}`}
                className="h-auto rounded-[9px] bg-white px-[13.5px] py-[9px] text-center [font-family:'Inter',Helvetica] text-lg font-medium leading-[26.1px] tracking-[-0.09px] text-black hover:bg-white"
              >
                {item.label}
              </Button>
            ) : (
              <Button
                key={item.label}
                type="button"
                variant="ghost"
                onClick={() => handleNavClick(item.path)}
                data-testid={`button-nav-${item.label.toLowerCase()}`}
                className="h-auto p-0 [font-family:'Inter',Helvetica] text-lg font-medium leading-[26.1px] tracking-[-0.09px] text-white hover:bg-transparent hover:text-white"
              >
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
