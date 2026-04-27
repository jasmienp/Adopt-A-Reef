import { Button } from "@/components/ui/button";

const navigationItems = [
  { label: "Home", active: true },
  { label: "Adopt", active: false },
  { label: "Volunteer", active: false },
  { label: "Donate", active: false },
  { label: "Contacts", active: false },
];

export const NavigationBarSection = (): JSX.Element => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex w-full justify-center px-4 py-[27px] sm:px-6 lg:px-[360px]">
      <nav
        aria-label="Primary"
        className="flex w-full max-w-[720px] items-center justify-between rounded-[18px] bg-black px-[18px] py-[9px] backdrop-blur-[39.38px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(39.38px)_brightness(100%)]"
      >
        <a href="#" className="flex items-center gap-[9px]">
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
          {navigationItems.map((item) =>
            item.active ? (
              <Button
                key={item.label}
                type="button"
                variant="secondary"
                className="h-auto rounded-[9px] bg-white px-[13.5px] py-[9px] text-center [font-family:'Inter',Helvetica] text-lg font-medium leading-[26.1px] tracking-[-0.09px] text-black hover:bg-white"
              >
                {item.label}
              </Button>
            ) : (
              <Button
                key={item.label}
                type="button"
                variant="ghost"
                className="h-auto p-0 [font-family:'Inter',Helvetica] text-lg font-medium leading-[26.1px] tracking-[-0.09px] text-white hover:bg-transparent hover:text-white"
              >
                {item.label}
              </Button>
            ),
          )}
        </div>
      </nav>
    </header>
  );
};
