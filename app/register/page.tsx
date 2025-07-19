"use client";
import React, { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import z from "zod";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";

type backendresponse = {
  message: string;
  success: boolean;
};

const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string(),
  password: z.string().min(6).max(12),
  bio: z.string().min(6).max(150),
});

export default function SignupForm() {
  const router = useRouter();

  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [bio, setbio] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedbody = registerSchema.safeParse({
      username,
      email,
      password,
      bio,
    });

    if (!parsedbody.success) {
      const errors = parsedbody.error.flatten().fieldErrors;
      toast.error(errors.username?.[0] || "Invalid input");
      console.log(errors);
      setemail("");
      setpassword("");
      setusername("");
      setbio("");
      return;
    }

    try {
      const response = await axios.post<backendresponse>(
        "/api/auth/register",
        parsedbody.data,
        {
          withCredentials: true,
        }
      );

      if (response.data && response.data.success) {
        toast.success("Registration Successfull!!");
        router.push("/");
      } else {
        toast.error("OOps try again");
        console.log(response);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.config) {
        const status = error.status;

        if (status === 401) {
          toast.error("Please send valid inputs");
          console.log(error);
        } else if (status === 409) {
          toast.error("User with this email already exists");
        } else {
          toast.error("Something went wrong");
          console.log(error);
        }
      } else {
        if (error instanceof Error) {
          toast.error("Unexpected Error");
          console.log(error);
        }
      }
    } finally {
      setemail("");
      setusername("");
      setpassword("");
      setbio("");
    }
  };
  return (
    <>
      <div className="shadow-input p-4 mx-auto mb-12 mt-10 w-full max-w-md rounded-none bg-slate-800  md:rounded-2xl md:p-8 ">
        <h2 className="text-xl font-bold text-green-500">
          Welcome to SpellBeats
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-300">
          Subscribe to SpellBeats for best user experience
        </p>

        <form className="my-12" onSubmit={handleSubmit}>
          <div className="mb-12 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <LabelInputContainer>
              <Label htmlFor="firstname">Username</Label>
              <Input
                id="firstname"
                placeholder="Tyler"
                type="text"
                value={username}
                onChange={(e) => setusername(e.target.value)}
              />
            </LabelInputContainer>
          </div>
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

          <LabelInputContainer className="mb-4">
            <Label htmlFor="Bio">Bio</Label>
            <Input
              id="bio"
              placeholder="I am ...."
              type="text"
              value={bio}
              onChange={(e) => setbio(e.target.value)}
            />
          </LabelInputContainer>
          <button
            className="group/btn relative block h-10 mb-4 w-full rounded-md bg-gradient-to-br bg-black font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>
        </form>
        
         <div
          onClick={() => router.push("/signin")}
          className="w-full text-blue-500 mt-4 cursor-pointer flex justify-center items-center gap-4"
        >
          Already have an account?
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
