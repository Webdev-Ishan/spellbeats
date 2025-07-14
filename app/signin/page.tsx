"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import z from "zod";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const registerSchema = z.object({
  email: z.string(),
  password: z.string().min(6).max(12),
});

export default function SignInForm() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/Profile");
    }
  }, [session, status, router]);

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedbody = registerSchema.safeParse({
      email,
      password,
    });

    if (!parsedbody.success) {
      const errors = parsedbody.error.flatten().fieldErrors;
      toast.error(errors.email?.[0] || "Invalid input");
      console.log(errors);
      setemail("");
      setpassword("");

      return;
    }

    try {
      const response = await signIn("credentials", {
        email: parsedbody.data.email,
        password: parsedbody.data.password,
        redirect: false,
      });

      if (response?.ok) {
        toast.success("Login Successfull!!");
        router.push("/");
      } else {
        toast.error("OOps try again");
        console.log(response);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Something went wrong");
        console.log(error);
      }
    } finally {
      setemail("");
      setpassword("");
    }
  };
  return (
    <>
      <div className="shadow-input mx-auto mt-10 w-full max-w-md rounded-none bg-slate-800 p-4 md:rounded-2xl md:p-8 ">
        <h2 className="text-xl font-bold text-green-500">
          Welcome to SpellBeats
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-300">
          Login to SpellBeats for best user experience
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2"></div>
          <LabelInputContainer className="mb-4 text-white">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br bg-black font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Login &rarr;
            <BottomGradient />
          </button>
        </form>
      </div>
    </>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
