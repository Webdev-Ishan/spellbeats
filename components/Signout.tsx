import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignOut() {
  const [isloggedin, setisloggedin] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setisloggedin(true);
    } else {
      setisloggedin(false);
    }
  }, [session, status]);

  const handlesubmit = async () => {
    await signOut({ callbackUrl: "/" });
    setisloggedin(false);
  };

  return (
    <div className="flex flex-wrap items-center   md:flex-row">
      {isloggedin ? (
        <Button
          variant={"destructive"}
          onClick={handlesubmit}
          className="bg-white text-black px-2 text-xs"
        >
          Logut
        </Button>
      ) : (
        <Button
          variant={"default"}
          onClick={() => router.push("/signin")}
          className="bg-white hover:bg-blue-600 px-2 text-black text-xs"
        >
          Login
        </Button>
      )}
    </div>
  );
}
