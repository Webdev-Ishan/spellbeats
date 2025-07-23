"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import z from "zod";
import { toast } from "react-toastify";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

const registerSchema = z.object({
  url: z.string(),
  streamid: z.string(),
  active: z.boolean(),
});

type backendresponse = {
  success: boolean;
  message: string;
  status: number;
};

export default function SignInForm() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [session, status, router]);

  const streamid = useSearchParams().get("streamid");
  if (!streamid) {
    toast.error("No id for this stream");
  }

  const [url, seturl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedbody = registerSchema.safeParse({
      url,
      streamid,
      active: true,
    });

    if (!parsedbody.success) {
      const errors = parsedbody.error.flatten().fieldErrors;
      toast.error(errors.url?.[0] || "Invalid input");
      console.log(errors);
      seturl("");

      return;
    }

    try {
      const response = await axios.put<backendresponse>("/api/streams", {
        url,
        streamid,
        active: true, // or bind to state
      });

      if (response.data && response.data.success) {
        toast.success("Updation successfull");
        router.push("/profile");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 400) {
          toast.error("Please login first");
          console.log(error);
        } else if (status === 401) {
          toast.error("Wrong input");
          console.log(error);
        } else if (status === 402) {
          toast.error("Invalid url or id");
          console.log(error);
        } else if (status === 409) {
          toast.error("Stream already exists");
          console.log(error);
        } else {
          toast.error("Something went wrong");
          console.log(error);
        }
      } else {
        if (error instanceof Error) {
          toast.error(error.message);
          console.log(error);
        }
      }
    } finally {
      seturl("");
    }
  };
  return (
    <>
      <div className="shadow-input mx-auto mb-6 mt-10 w-full max-w-md rounded-none bg-slate-800 p-4 md:rounded-2xl md:p-8 ">
        <h2 className="text-xl font-bold text-green-500">Update the Stream</h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-300">
          Provide the url and id for the vedio
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2"></div>
          <LabelInputContainer className="mb-4 text-white">
            <Label htmlFor="url"> Youtube URL</Label>
            <Input
              id="url"
              placeholder="url of the vedio"
              type="url"
              value={url}
              onChange={(e) => seturl(e.target.value)}
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br bg-black font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Update &rarr;
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
