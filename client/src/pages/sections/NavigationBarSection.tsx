import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const navigationItems = [
  { label: "Home", targetId: "home" },
  { label: "Adopt", targetId: "home" },
  { label: "Volunteer", targetId: "adopt" },
  { label: "Donate", targetId: "donate" },
  { label: "Contacts", targetId: "contacts" },
];

export const NavigationBarSection = (): JSX.Element => {
  const [activeId, setActiveId] = useState<string>("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    navigationItems.forEach((item) => {
      const el = document.getElementById(item.targetId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    targetId: string,
  ) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(targetId);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex w-full justify-center px-4 py-[27px] sm:px-6 lg:px-[360px]">
      <nav
        aria-label="Primary"
        className="flex w-full max-w-[720px] items-center justify-between rounded-[18px] bg-black px-[18px] py-[9px] backdrop-blur-[39.38px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(39.38px)_brightness(100%)]"
      >
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "home")}
          className="flex items-center gap-[9px]"
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
        </a>
        <div className="flex items-center gap-[27px]">
          {navigationItems.map((item) => {
            const isActive = activeId === item.targetId;
            return isActive ? (
              <Button
                key={item.label}
                type="button"
                variant="secondary"
                onClick={(e) => handleNavClick(e, item.targetId)}
                data-testid={`button-nav-${item.targetId}`}
                className="h-auto rounded-[9px] bg-white px-[13.5px] py-[9px] text-center [font-family:'Inter',Helvetica] text-lg font-medium leading-[26.1px] tracking-[-0.09px] text-black hover:bg-white"
              >
                {item.label}
              </Button>
            ) : (
              <Button
                key={item.label}
                type="button"
                variant="ghost"
                onClick={(e) => handleNavClick(e, item.targetId)}
                data-testid={`button-nav-${item.targetId}`}
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
