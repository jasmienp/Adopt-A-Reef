import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavigationBarSection } from "./sections/NavigationBarSection";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const socialLinks = [
  {
    alt: "Social links",
    src: "/figmaAssets/social-links.svg",
  },
];

const formFields = [
  { id: "firstName", label: "First Name", type: "text" },
  { id: "middleName", label: "Middle Name", type: "text" },
  { id: "lastName", label: "Last Name", type: "text" },
  { id: "email", label: "Email", type: "email" },
  { id: "mobilePhone", label: "Mobile Phone", type: "tel" },
  { id: "address", label: "Address", type: "text" },
  { id: "paymentMethod", label: "Payment Method", type: "text" },
] as const;

type FormState = Record<(typeof formFields)[number]["id"], string>;

export const DonatePage = (): JSX.Element => {
  const { toast } = useToast();
  const [location] = useLocation();
  const [amount, setAmount] = useState("");
  const [form, setForm] = useState<FormState>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    mobilePhone: "",
    address: "",
    paymentMethod: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amountParam = params.get("amount");
    if (amountParam) setAmount(amountParam);
  }, [location]);

  const handleChange = (id: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Thank you for your donation!",
      description: `Your contribution of ${amount || "your selected amount"} helps protect our reefs, ${form.firstName || "friend"}.`,
    });
    setAmount("");
    setForm({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      mobilePhone: "",
      address: "",
      paymentMethod: "",
    });
  };

  return (
    <main className="relative w-full overflow-x-hidden bg-black">
      <NavigationBarSection />

      <section
        className="relative flex min-h-dvh bg-black pt-[120px]"
        aria-label="Donation form"
      >
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[600px_minmax(0,1fr)] lg:gap-0 lg:px-0 lg:pb-0">
          <div className="relative hidden w-full overflow-hidden lg:block">
            <img
              src="/figmaAssets/donate-hero.png"
              alt="Coral reef"
              className="absolute inset-0 h-full w-full object-cover"
              data-testid="img-donate-hero"
            />
          </div>

          <div className="flex items-center justify-center lg:px-[40px]">
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex w-full max-w-[560px] flex-col items-center justify-center gap-2.5"
            >
              <h1
                className="w-full text-center [font-family:'Inter',Helvetica] text-[36px] font-bold leading-tight text-white sm:text-[44px] lg:text-[48px]"
                data-testid="text-donate-title"
              >
                Donation Form
              </h1>
              <p className="w-full text-center [font-family:'Poppins',Helvetica] text-[13px] font-normal leading-snug text-white sm:text-[14px]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus non vehicula dolor. Phasellus pharetra laoreet
                pulvinar. Sed eleifend pulvinar consequat.
              </p>

              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="   Amount:"
                data-testid="input-donation-amount"
                className="h-[42px] w-full rounded-[5px] border-0 bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] px-4 [font-family:'DM_Sans',Helvetica] text-[15px] font-bold text-white shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] placeholder:text-white/90 focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              {formFields.map((field) => (
                <Input
                  key={field.id}
                  type={field.type}
                  value={form[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={`   ${field.label}:`}
                  data-testid={`input-${field.id}`}
                  className="h-[42px] w-full rounded-[5px] border-2 border-[#052698] bg-white px-4 [font-family:'DM_Sans',Helvetica] text-[15px] font-bold text-black shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              ))}

              <div className="flex w-full justify-center">
                <Button
                  type="submit"
                  data-testid="button-submit-donation"
                  className="h-[46px] w-[160px] rounded-[5px] border-2 border-transparent bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] px-6 py-2 [font-family:'DM_Sans',Helvetica] text-[26px] font-bold text-white shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] transition-colors duration-200 hover:border-[#052698] hover:bg-none hover:bg-white hover:text-[#052698] sm:text-[28px]"
                >
                  Submit
                </Button>
              </div>
            </form>
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
