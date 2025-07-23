"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

type stream = {
  id: string;
  title: string;
  bigImage: string;
};

type backendresponse = {
  success: boolean;
  message: string;
  streams: stream[];
};

export default function AllStreams() {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [session, status, router]);

  const [playlist, setplaylist] = useState<stream[]>([]);

  const fetchUserinfo = async () => {
    try {
      const userinfo = await axios.get<backendresponse>("/api/streams");

      if (userinfo.data && userinfo.data.success) {
        setplaylist(userinfo.data.streams);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;

        if (status === 401) {
          toast.error("Please login first!");
        } else if (status === 404) {
          toast.error("User not found!!");
        } else if (status == 500) {
          toast.error("Soemthing went wrong");
        }
      } else {
        if (error instanceof Error) {
          toast.error(error.message);
          console.log(error);
        }
      }
    }
  };

  useEffect(() => {
    fetchUserinfo();
  }, []);

  return (
    <div className="min-h-screen bg-black  text-white px-4 py-8">
      {playlist.length > 0 ? (
        <div className="grid grid-cols-1 mt-8 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlist.map((playlist, idx) => (
            <Card
              key={idx}
              className=" rounded-xl shadow-md p-4 transition-all duration-300"
            >
              <CardContent className="p-2">
                <Image
                  src={playlist?.bigImage}
                  alt={playlist?.title ?? "Album Art"}
                  width={800}
                  height={400}
                  className="w-full mb-6 h-[300px] border-2 rounded-lg hover:border-green-500 object-cover"
                />
                <h3
                  onClick={() =>
                    router.push(
                      `/player/?id=${encodeURIComponent(playlist.id)}`
                    )
                  }
                  className="font-semibold bg-black hover:bg-slate-900 text-white text-center py-2 px-4 rounded-lg text-sm truncate"
                >
                  {playlist.title}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-white text-center text-base mt-20">
          No items in your playlist yet.
        </p>
      )}
    </div>
  );
}
