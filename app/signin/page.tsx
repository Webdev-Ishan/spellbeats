"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import z from "zod";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

const registerSchema = z.object({
  email: z.string(),
  password: z.string().min(6).max(12),
});

export default function SignInForm() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
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
        <button
          className="group/btn py-1 relative transition duration-300 hover:shadow-blue-500 block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <div className="w-full  flex justify-center items-center gap-4">
            <Image
              width={30}
              height={4}
              className="lg:mx-0 mx-auto h-full rounded-3xl object-cover"
              src="data:image/png;base64,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"
              alt="about Us image"
            />
            Login with Google
          </div>
        </button>
        <button
          className="group/btn py-1 mt-4 relative transition duration-300 hover:shadow-blue-500 block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          onClick={() => signIn("github", { callbackUrl: "/" })}
        >
          <div className="w-full  flex justify-center items-center gap-4">
            <Image
              width={30}
              height={4}
              className="lg:mx-0 mx-auto h-full rounded-3xl object-cover"
              src="data:image/png;base64,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"
              alt="about Us image"
            />
            Login with Github
          </div>
        </button>

         <div
          onClick={() => router.push("/register")}
          className="w-full text-blue-500 mt-2 cursor-pointer flex justify-center items-center gap-4"
        >
          Create an account?
        </div>
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
