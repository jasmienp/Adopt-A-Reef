import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavigationBarSection } from "./sections/NavigationBarSection";
import { useEffect, useState } from "react";

const socialLinks = [
  {
    alt: "Social links",
    src: "/figmaAssets/social-links.svg",
  },
];

const coralImages = [
  { src: "/figmaAssets/adopt/coral-1.png", alt: "Coral reef sample 1" },
  { src: "/figmaAssets/adopt/coral-2.png", alt: "Coral reef sample 2" },
  { src: "/figmaAssets/adopt/coral-3.png", alt: "Coral reef sample 3" },
];

export const AdoptPage = (): JSX.Element => {
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % coralImages.length);
    }, 3000);
    return () => clearTimeout(id);
  }, [activeIndex]);

  const activeImage = coralImages[activeIndex];

  return (
    <main className="relative w-full overflow-x-hidden bg-black">
      <NavigationBarSection />
      <section
        className="relative flex min-h-dvh items-center justify-center bg-black px-4 pb-10 pt-[120px] sm:px-6 lg:px-12 lg:pb-16"
        aria-label="Adopt a coral"
      >
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center gap-8 lg:flex-row lg:items-center lg:gap-12">
          <div className="grid h-full max-h-[70vh] w-full max-w-[520px] flex-shrink-0 grid-cols-[1fr_2fr] gap-3 lg:max-h-[70vh]">
            <div className="flex h-full min-h-0 flex-col gap-3">
              {coralImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  data-testid={`button-coral-${index + 1}`}
                  className={`flex-1 overflow-hidden rounded-[4.185px] transition-all duration-200 focus:outline-none ${
                    activeIndex === index
                      ? "ring-2 ring-[#21BCEE] ring-offset-2 ring-offset-black"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                    data-testid={`img-coral-${index + 1}`}
                  />
                </button>
              ))}
            </div>
            <div className="flex h-full min-h-0">
              <img
                key={activeImage.src}
                src={activeImage.src}
                alt={activeImage.alt}
                className="h-full w-full rounded-[4.185px] object-cover animate-in fade-in duration-500"
                data-testid="img-coral-featured"
              />
            </div>
          </div>

          <div className="flex w-full max-w-[490px] flex-col gap-3 lg:gap-4">
            <h1
              className="[font-family:'Inter',Helvetica] text-[36px] font-bold leading-tight text-white sm:text-[44px] lg:text-[52px]"
              data-testid="text-adopt-title"
            >
              Adopt a Coral
            </h1>
            <p className="[font-family:'DM_Sans',Helvetica] text-[20px] font-medium text-white sm:text-[24px] lg:text-[28px]">
              Adopt a real coral
            </p>
            <p className="[font-family:'Poppins',Helvetica] text-[14px] font-normal leading-relaxed text-white sm:text-[15px] lg:text-[16px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              non vehicula dolor. Phasellus pharetra laoreet pulvinar. Sed
              eleifend pulvinar consequat.
            </p>

            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="   Amount:"
              data-testid="input-amount"
              className="h-[44px] rounded-[5px] border-2 border-[#052698] bg-white px-4 [font-family:'DM_Sans',Helvetica] text-[18px] font-bold text-black shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="   Price:"
              data-testid="input-price"
              className="h-[44px] rounded-[5px] border-2 border-[#052698] bg-white px-4 [font-family:'DM_Sans',Helvetica] text-[18px] font-bold text-black shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <Button
              type="button"
              data-testid="button-adopt-coral"
              className="h-[46px] w-full max-w-[240px] rounded-[5px] border-2 border-transparent bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] px-6 py-2 [font-family:'DM_Sans',Helvetica] text-[22px] font-bold text-white shadow-[0px_5.09px_20.359px_-2px_rgba(0,0,0,0.25)] transition-colors duration-200 hover:border-[#052698] hover:bg-none hover:bg-white hover:text-[#052698] sm:text-[24px]"
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
