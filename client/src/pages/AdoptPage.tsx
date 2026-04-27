import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavigationBarSection } from "./sections/NavigationBarSection";
import { useState } from "react";

const socialLinks = [
  {
    alt: "Social links",
    src: "/figmaAssets/social-links.svg",
  },
];

export const AdoptPage = (): JSX.Element => {
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");

  return (
    <main className="relative w-full overflow-x-hidden bg-black">
      <NavigationBarSection />
      <section
        className="relative bg-black px-4 pb-24 pt-32 sm:px-6 md:pt-36 lg:px-12 lg:pb-32"
        aria-label="Adopt a coral"
      >
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-[81px]">
          <div className="grid w-full max-w-[680px] grid-cols-2 gap-4 sm:gap-6 lg:w-auto lg:flex-shrink-0">
            <div className="flex flex-col gap-4 sm:gap-6">
              <img
                src="/figmaAssets/adopt/coral-1.png"
                alt="Coral reef sample 1"
                className="aspect-square w-full rounded-[4.185px] object-cover"
                data-testid="img-coral-1"
              />
              <img
                src="/figmaAssets/adopt/coral-2.png"
                alt="Coral reef sample 2"
                className="aspect-square w-full rounded-[4.185px] object-cover"
                data-testid="img-coral-2"
              />
              <img
                src="/figmaAssets/adopt/coral-3.png"
                alt="Coral reef sample 3"
                className="aspect-square w-full rounded-[4.185px] object-cover"
                data-testid="img-coral-3"
              />
            </div>
            <div className="flex">
              <img
                src="/figmaAssets/adopt/coral-4.png"
                alt="Featured coral reef"
                className="h-full w-full rounded-[4.185px] object-cover"
                data-testid="img-coral-featured"
              />
            </div>
          </div>

          <div className="flex w-full max-w-[490px] flex-col gap-7">
            <h1
              className="[font-family:'Inter',Helvetica] text-[44px] font-bold leading-tight text-white sm:text-[56px] lg:text-[64px]"
              data-testid="text-adopt-title"
            >
              Adopt a Coral
            </h1>
            <p className="[font-family:'DM_Sans',Helvetica] text-[28px] font-medium text-white sm:text-[34px] lg:text-[39.799px]">
              Adopt a real coral
            </p>
            <p className="[font-family:'Poppins',Helvetica] text-[18px] font-normal leading-relaxed text-white sm:text-[20px] lg:text-[23.216px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              non vehicula dolor. Phasellus pharetra laoreet pulvinar. Sed
              eleifend pulvinar consequat. Etiam ipsum dolor, ultricies vel
              ornare ac, molestie a lectus. Mauris nisl arcu.
            </p>

            <div className="relative w-full">
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="   Amount:"
                data-testid="input-amount"
                className="h-[50px] rounded-[5px] border-2 border-[#052698] bg-white px-4 [font-family:'DM_Sans',Helvetica] text-[24px] font-bold text-black shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="relative w-full">
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="   Price:"
                data-testid="input-price"
                className="h-[50px] rounded-[5px] border-2 border-[#052698] bg-white px-4 [font-family:'DM_Sans',Helvetica] text-[24px] font-bold text-black shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <Button
              type="button"
              data-testid="button-adopt-coral"
              className="h-[51px] w-full max-w-[261px] rounded-[5px] border-0 bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] px-6 py-2 [font-family:'DM_Sans',Helvetica] text-[28px] font-bold text-white shadow-[0px_5.09px_20.359px_-2px_rgba(0,0,0,0.25)] hover:opacity-95 sm:text-[32.57px]"
            >
              Adopt a Coral
            </Button>
          </div>
        </div>
      </section>

      <footer
        id="contacts"
        className="bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] shadow-[0px_-4px_10px_#00000040] scroll-mt-24"
      >
        <div className="mx-auto w-full max-w-[1440px] border-t border-[#00000026] px-[30px] py-16 sm:px-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="[font-family:'Inter',Helvetica] text-2xl font-normal leading-[28.8px] tracking-[-0.48px] text-white">
              Let&apos;s work together
            </p>
            <nav aria-label="Social media">
              {socialLinks.map((link) => (
                <img
                  key={link.src}
                  className="h-6 w-[120px]"
                  alt={link.alt}
                  src={link.src}
                />
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
};
