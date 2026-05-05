import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NavigationBarSection } from "./sections/NavigationBarSection";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

const socialLinks = [{ alt: "Social links", src: "/figmaAssets/social-links.svg" }];

const donationFormSchema = z.object({
  amount: z.string()
    .min(1, "Donation amount is required")
    .refine((v) => {
      const n = Number(v.replace(/[^0-9.]/g, ""));
      return !isNaN(n) && n >= 1;
    }, "Minimum donation is $1")
    .refine((v) => {
      const n = Number(v.replace(/[^0-9.]/g, ""));
      return n <= 100000;
    }, "Maximum donation is $100,000"),
  firstName: z.string().trim().min(1, "First name is required"),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  mobilePhone: z
    .string()
    .trim()
    .min(1, "Mobile phone is required")
    .regex(/^[\d\s\-\+\(\)]{7,20}$/, "Enter a valid phone number"),
  address: z.string().trim().min(1, "Address is required"),
  paymentMethod: z.string().trim().min(1, "Payment method is required"),
});

type DonationFormValues = z.infer<typeof donationFormSchema>;

const inputClass =
  "h-[42px] w-full rounded-[5px] border-2 border-[#052698] bg-white px-4 [font-family:'DM_Sans',Helvetica] text-[15px] font-bold text-black shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0";

export const DonatePage = (): JSX.Element => {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      amount: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      mobilePhone: "",
      address: "",
      paymentMethod: "",
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amountParam = params.get("amount");
    if (amountParam) form.setValue("amount", amountParam);
  }, [location]);

  const donateMutation = useMutation({
    mutationFn: async (values: DonationFormValues) => {
      const numeric = Math.round(Number(values.amount.replace(/[^0-9.]/g, "")));
      const donorName = [values.firstName, values.middleName, values.lastName]
        .filter(Boolean)
        .join(" ");
      await apiRequest("POST", "/api/donations", {
        amount: numeric,
        donorName,
        donorEmail: values.email,
      });
    },
    onSuccess: (_, values) => {
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/expense-breakdown"] });
      toast({
        title: "Thank you for your donation!",
        description: `Your contribution helps protect our reefs, ${values.firstName}.`,
      });
      form.reset();
    },
    onError: (err: Error) => {
      toast({ title: "Donation failed", description: err.message, variant: "destructive" });
    },
  });

  const onSubmit = (values: DonationFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in to donate",
        description: "Create an account or log in so we can record your donation.",
      });
      setLocation("/auth");
      return;
    }
    donateMutation.mutate(values);
  };

  return (
    <main className="relative w-full overflow-x-hidden bg-black animate-in fade-in duration-500">
      <NavigationBarSection />

      <section
        className="relative flex min-h-dvh bg-black pt-[120px]"
        aria-label="Donation form"
      >
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-6 px-4 pb-10 sm:px-6 md:grid-cols-[360px_minmax(0,1fr)] md:gap-0 md:px-0 md:pb-0 lg:grid-cols-[600px_minmax(0,1fr)]">
          <div className="relative hidden w-full overflow-hidden md:block">
            <img
              src="/figmaAssets/donate-hero.png"
              alt="Coral reef"
              className="absolute inset-0 h-full w-full object-cover"
              data-testid="img-donate-hero"
            />
          </div>

          <div className="flex items-start justify-center lg:px-[40px] pt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mx-auto flex w-full max-w-[560px] flex-col items-center justify-center gap-2.5"
                data-testid="form-donate"
              >
                <h1
                  className="w-full text-center [font-family:'Inter',Helvetica] text-[36px] font-bold leading-tight text-white sm:text-[44px] lg:text-[48px]"
                  data-testid="text-donate-title"
                >
                  Donation Form
                </h1>
                <p className="w-full text-center [font-family:'Poppins',Helvetica] text-[13px] font-normal leading-snug text-white sm:text-[14px] mb-2">
                  Support reef conservation. Every dollar makes a difference.
                </p>

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="   Amount (e.g. 50):"
                          data-testid="input-donation-amount"
                          className="h-[42px] w-full rounded-[5px] border-0 bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] px-4 [font-family:'DM_Sans',Helvetica] text-[15px] font-bold text-white shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] placeholder:text-white/90 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="   First Name:" data-testid="input-firstName" className={inputClass} />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="   Middle Name:" data-testid="input-middleName" className={inputClass} />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input {...field} placeholder="   Last Name:" data-testid="input-lastName" className={inputClass} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input {...field} type="email" placeholder="   Email:" data-testid="input-email" className={inputClass} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobilePhone"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input {...field} type="tel" placeholder="   Mobile Phone:" data-testid="input-mobilePhone" className={inputClass} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input {...field} placeholder="   Address:" data-testid="input-address" className={inputClass} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input {...field} placeholder="   Payment Method (e.g. Credit Card):" data-testid="input-paymentMethod" className={inputClass} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <div className="flex w-full justify-center mt-2">
                  <Button
                    type="submit"
                    disabled={donateMutation.isPending}
                    data-testid="button-submit-donation"
                    className="h-[46px] w-[160px] rounded-[5px] border-2 border-transparent bg-[linear-gradient(90deg,rgba(5,38,152,1)_0%,rgba(17,107,248,1)_50%,rgba(33,188,238,1)_100%)] px-6 py-2 [font-family:'DM_Sans',Helvetica] text-[22px] font-bold text-white shadow-[0px_5px_20px_-2px_rgba(0,0,0,0.25)] transition-colors duration-200 hover:border-[#052698] hover:bg-none hover:bg-white hover:text-[#052698]"
                  >
                    {donateMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
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
                <img key={link.src} className="h-6 w-[120px]" alt={link.alt} src={link.src} />
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
};
