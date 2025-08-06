"use client";
import React, { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Reviews() {
  const router = useRouter();
  const [topic, settopic] = useState("");
  const [content, setcontent] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/reviews", {
        topic,
        content,
      });

      console.log("Submitted successfully:", response.data);
      toast.success("Submission Completed");
      router.push("/Reviews");
      settopic("");
      setcontent("");
    } catch (error) {
      if (axios.isAxiosError(error) && error.config) {
        const status = error.status;

        if (status === 400) {
          toast.error("Please send valid inputs");
          console.log(error);
        } else if (status == 401) {
          toast.error("Please login first");
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
      setLoading(false);
    }
  };

  return (
    <>
      <div className="shadow-input mx-auto mt-12 mb-12 w-full max-w-md rounded-none bg-slate-800 p-4 md:rounded-2xl md:p-8">
        <h2 className="text-xl font-bold text-green-500">Give us Review</h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-300">
          Help SpellBeats to develop the best user experience
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <LabelInputContainer>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder=""
                type="text"
                value={topic}
                onChange={(e) => settopic(e.target.value)}
              />
            </LabelInputContainer>
          </div>

          <LabelInputContainer className="mb-4 text-white">
            <Label htmlFor="content">Content </Label>
            <Input
              id="content"
              placeholder=""
              type="content"
              value={content}
              onChange={(e) => setcontent(e.target.value)}
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br bg-black font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit →"}
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
    <div className={cn("flex w-full flex-col  space-y-2", className)}>
      {children}
    </div>
  );
};

// Dummy Input and Label Components
const Input = ({
  id,
  placeholder,
  type,
  value,
  onChange,
}: {
  id: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      id={id}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
      className="rounded-md p-2 bg-white text-black"
    />
  );
};

const Label = ({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) => {
  return (
    <label htmlFor={htmlFor} className="text-white text-sm">
      {children}
    </label>
  );
};
