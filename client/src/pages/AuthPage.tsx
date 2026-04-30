import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AUTH_QUERY_KEY, useAuth, type AuthUser } from "@/hooks/use-auth";
import { NavigationBarSection } from "./sections/NavigationBarSection";

const authSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

type Mode = "login" | "signup";

export const AuthPage = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { username: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: async (values: AuthFormValues) => {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const res = await apiRequest("POST", endpoint, values);
      return (await res.json()) as AuthUser;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data);
      toast({
        title: mode === "login" ? "Welcome back" : "Account created",
        description: `Signed in as ${data.username}`,
      });
      setLocation("/");
    },
    onError: (err: Error) => {
      const msg = err.message.replace(/^\d+:\s*/, "");
      let description = msg;
      try {
        const parsed = JSON.parse(msg);
        if (parsed?.message) description = parsed.message;
      } catch {
        // leave as-is
      }
      toast({
        title: mode === "login" ? "Login failed" : "Sign up failed",
        description,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: AuthFormValues) => {
    mutation.mutate(values);
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    form.clearErrors();
  };

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden bg-black"
      data-testid="page-auth"
    >
      <NavigationBarSection />
      <img
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        alt="Coral reef background"
        src="/figmaAssets/image-1.png"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[rgba(17,107,248,0.6)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-32 pb-16 sm:px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/70 p-8 backdrop-blur-md shadow-2xl">
          <div className="mb-6 flex flex-col items-center gap-2 text-center">
            <h1
              className="[font-family:'Inter',Helvetica] text-3xl font-semibold tracking-tight text-white"
              data-testid="text-auth-title"
            >
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-white/70">
              {mode === "login"
                ? "Sign in to keep helping the reef thrive."
                : "Join us in protecting our oceans."}
            </p>
          </div>

          <div
            className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-white/10 p-1"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              data-testid="tab-login"
              onClick={() => mode !== "login" && switchMode()}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                mode === "login"
                  ? "bg-white text-black"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              data-testid="tab-signup"
              onClick={() => mode !== "signup" && switchMode()}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "bg-white text-black"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Sign up
            </button>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              data-testid="form-auth"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="reefkeeper"
                        autoComplete="username"
                        data-testid="input-username"
                        className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/40"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete={
                          mode === "login" ? "current-password" : "new-password"
                        }
                        data-testid="input-password"
                        className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/40"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={mutation.isPending || isLoading}
                data-testid="button-submit-auth"
                className="w-full bg-gradient-to-r from-[#052698] via-[#116bf8] to-[#21bcee] text-base font-medium text-white hover:opacity-95"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "login" ? "Signing in…" : "Creating account…"}
                  </>
                ) : mode === "login" ? (
                  "Log in"
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-white/70">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="font-medium text-white underline-offset-4 hover:underline"
              data-testid="link-switch-mode"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
