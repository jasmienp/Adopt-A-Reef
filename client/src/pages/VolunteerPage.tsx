import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavigationBarSection } from "./sections/NavigationBarSection";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
] as const;

type FormState = Record<(typeof formFields)[number]["id"], string>;

export const VolunteerPage = (): JSX.Element => {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    mobilePhone: "",
    address: "",
  });

  const handleChange = (id: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Thanks for volunteering!",
      description: `We received your registration, ${form.firstName || "friend"}.`,
    });
    setForm({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      mobilePhone: "",
      address: "",
    });
  };

  return (
    <main className="flex h-dvh min-h-[680px] w-full flex-col overflow-hidden bg-black">
      <NavigationBarSection />

      <section
        className="relative flex min-h-0 flex-1 bg-black pt-[100px]"
        aria-label="Volunteer registration"
      >
        <div className="mx-auto grid h-full w-full max-w-[1440px] grid-cols-1 gap-6 px-4 pb-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_550px] lg:gap-0 lg:px-0 lg:pb-0">
          <div className="flex items-center lg:px-[40px]">
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex w-full max-w-[600px] flex-col items-center justify-center gap-3"
            >
              <h1
                className="w-full [font-family:'Inter',Helvetica] text-[32px] font-bold leading-tight text-white sm:text-[40px] lg:text-[44px]"
                data-testid="text-volunteer-title"
              >
                Volunteer Form
              </h1>
              <p className="w-full [font-family:'Poppins',Helvetica] text-[12px] font-normal leading-snug text-white sm:text-[13px]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus non vehicula dolor. Phasellus pharetra laoreet
                pulvinar. Sed eleifend pulvinar consequat. Etiam ipsum dolor,
                ultricies vel ornare ac, molestie a lectus.
              </p>

              {formFields.map((field) => (
                <Input
                  key={field.id}
                  type={field.type}
                  value={form[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={`   ${field.label}:`}
                  data-testid={`input-${field.id}`}
                  className="h-[42px] w-full rounded-[5px] border-2 border-[#052698] bg-white px-4 [font-family:'DM_Sans',Helvetica] text-[14px] font-bold text-black shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              ))}

              <div className="flex w-full justify-start">
                <Button
                  type="submit"
                  data-testid="button-submit-volunteer"
                  className="h-[44px] w-[150px] rounded-[5px] border-2 border-transparent bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] px-6 py-2 [font-family:'DM_Sans',Helvetica] text-[24px] font-bold text-white shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] transition-colors duration-200 hover:border-[#052698] hover:bg-none hover:bg-white hover:text-[#052698] sm:text-[28px]"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>

          <div className="relative hidden h-full w-full overflow-hidden lg:block">
            <img
              src="/figmaAssets/volunteer-hero.png"
              alt="Volunteers cleaning the ocean"
              className="absolute inset-0 h-full w-full object-cover"
              data-testid="img-volunteer-hero"
            />
          </div>
        </div>
      </section>

      <footer
        id="contacts"
        className="shrink-0 bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] shadow-[0px_-4px_10px_#00000040]"
      >
        <div className="mx-auto w-full max-w-[1440px] border-t border-[#00000026] px-[30px] py-4 sm:px-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="[font-family:'Inter',Helvetica] text-lg font-normal leading-tight tracking-[-0.36px] text-white">
              Let&apos;s work together
            </p>
            <nav aria-label="Social media">
              {socialLinks.map((link) => (
                <img
                  key={link.src}
                  className="h-5 w-[100px]"
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
