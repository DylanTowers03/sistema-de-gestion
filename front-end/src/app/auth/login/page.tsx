"use client";

import React from "react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

import { signIn } from "next-auth/react";

// Improved schema with additional validation rules
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [errorOrSuccess, setErrorOrSuccess] = React.useState<string | null>(
    null
  );
  const router = useRouter();

  const [progress, setProgress] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);

  // Simulación visual del progreso animado
  React.useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return prev + 5;
        clearInterval(interval); // Para en 90 hasta que el login termine
        return prev;
      });
    }, 200); // velocidad de animación

    return () => clearInterval(interval);
  }, [isAnimating]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsAnimating(true); // inicia la animación
    setErrorOrSuccess(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        correo: values.email,
        password: values.password,
      });

      if (result?.ok) {
        setIsAnimating(false); // detener animación
        setProgress(100); // terminar progreso
        setTimeout(() => {
          setProgress(0);
          router.push("/dashboard");
        }, 1000);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Form submission error", error);
      setProgress(100);
      setIsAnimating(false);
      setErrorOrSuccess("error");
      setTimeout(() => {
        setProgress(0);
      }, 1500);
    }
  }

  return (
    <>
      <div className="flex flex-col min-h-[50vh] h-full w-full items-center justify-center px-4">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email and password to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="johndoe@mail.com"
                            type="email"
                            autoComplete="email"
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
                      <FormItem className="grid gap-2">
                        <div className="flex justify-between items-center">
                          <FormLabel htmlFor="password">Password</FormLabel>
                          <Link
                            href="#"
                            className="ml-auto inline-block text-sm underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            placeholder="******"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full cursor-pointer">
                    Login
                  </Button>
                </div>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="register" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      {progress > 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-4"
          >
            <Progress value={progress} className="w-full" />
          </motion.div>
        </AnimatePresence>
      )}
      {errorOrSuccess && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`mt-4 p-4 rounded-md ${
              errorOrSuccess === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            <p>
              {errorOrSuccess === "error"
                ? "An error occurred while sing in "
                : "Login successful"}
            </p>
          </motion.div>
        </AnimatePresence>
      )}{" "}
    </>
  );
}
