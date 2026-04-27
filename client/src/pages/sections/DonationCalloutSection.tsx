import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const donationAmounts = [
  "₱ 20.00",
  "₱ 50.00",
  "₱ 100.00",
  "₱ 200.00",
  "₱ 500.00",
  "₱ 1000.00",
];

export const DonationCalloutSection = (): JSX.Element => {
  const [donationValue, setDonationValue] = useState("");

  return (
    <section className="relative w-full">
      <div className="mx-auto flex w-full max-w-[721px] flex-col items-center gap-[24px] px-4 py-6 sm:gap-[28px] md:gap-[32px] lg:gap-[36px]">
        <header className="flex w-full justify-center">
          <h2 className="mt-[-1.00px] text-center [font-family:'Inter',Helvetica] text-[72px] font-bold leading-[0.9] tracking-[0] text-black sm:text-[88px] md:text-[104px] lg:text-[117.2px]">
            Donate
          </h2>
        </header>
        <p className="w-full max-w-[593px] text-left [font-family:'Poppins',Helvetica] text-[18.2px] font-normal leading-[normal] tracking-[0] text-black">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non
          vehicula dolor. Phasellus pharetra laoreet pulvinar.
        </p>
        <div className="grid w-full max-w-[593px] grid-cols-2 gap-x-[22px] gap-y-[18px] sm:gap-y-[24px] md:grid-cols-3 md:gap-y-[41px]">
          {donationAmounts.map((amount) => (
            <Card
              key={amount}
              className="relative overflow-hidden rounded-[5px] border-0 bg-white shadow-[0px_5px_20px_-2px_#00000040] before:pointer-events-none before:absolute before:inset-0 before:rounded-[5px] before:p-[1px] before:content-[''] before:[background:linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]"
            >
              <CardContent className="flex h-[50px] items-center justify-center p-0">
                <button
                  type="button"
                  onClick={() => setDonationValue(amount)}
                  data-testid={`button-donation-${amount}`}
                  className="h-full w-full bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] bg-clip-text text-center [font-family:'DM_Sans',Helvetica] text-[26px] font-bold leading-[normal] tracking-[0] text-transparent [-webkit-text-fill-color:transparent] sm:text-[28px] md:text-[32px]"
                >
                  {amount}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="relative w-full max-w-[593px] overflow-hidden rounded-[7.35px] border-0 bg-white shadow-[0px_7.35px_29.41px_-2.94px_#00000040] before:pointer-events-none before:absolute before:inset-0 before:rounded-[7.35px] before:p-[2.94px] before:content-[''] before:[background:linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]">
          <CardContent className="p-0">
            <label htmlFor="donation-input" className="block">
              <Input
                id="donation-input"
                value={donationValue}
                onChange={(e) => setDonationValue(e.target.value)}
                placeholder="Input:"
                data-testid="input-donation-amount"
                className="h-[50px] border-0 bg-transparent px-4 [font-family:'DM_Sans',Helvetica] text-[20.6px] font-bold leading-[normal] tracking-[0] text-black shadow-none outline-none ring-0 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </label>
          </CardContent>
        </Card>
        <Button
          type="button"
          className="h-auto min-h-[50px] w-full max-w-[165px] rounded-[5px] border-0 bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] px-6 py-2 [font-family:'DM_Sans',Helvetica] text-[32px] font-bold leading-[normal] tracking-[0] text-white shadow-[0px_5px_20px_-2px_#00000040] hover:opacity-95"
        >
          Submit
        </Button>
        <p className="w-full max-w-[593px] text-left [font-family:'Poppins',Helvetica] text-base font-medium italic leading-[normal] tracking-[0] text-black">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non vehicula
          dolor. Phasellus pharetra laoreet pulvinar.
        </p>
      </div>
    </section>
  );
};
