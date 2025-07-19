"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

type stream = {
  id: string;
  title: string;
  bigImage: string;
};

type backendresponse = {
  success: boolean;
  message?: string;
  status: number;
  exist: {
    username: string;
    email: string;
    Bio: string;
    Sharable: string;
    streams: stream[];
  };
};
import { Calendar, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function UserProfile() {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [session, status, router]);

  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [bio, setbio] = useState("");
  const [sharable, setsharable] = useState("");
  const [playlist, setplaylist] = useState<stream[]>([]);

  const fetchUserinfo = async () => {
    try {
      const userinfo = await axios.get<backendresponse>("/api/profile");

      if (userinfo.data && userinfo.data.success) {
        setusername(userinfo.data.exist.username);
        setemail(userinfo.data.exist.email);
        setbio(userinfo.data.exist.Bio);
        setplaylist(userinfo.data.exist.streams.slice(0, 3));
        setsharable(userinfo.data.exist.Sharable);
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
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-500 text-white">
      {/* Header Section */}
      <section className="relative bg-black py-16 px-4 md:px-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          You are Important to Us.
        </h1>
        <p className="text-lg text-green-300 max-w-xl">
          Your profile represents your voice on our platform.
        </p>
      </section>

      {/* Profile Info Card */}
      <div className="container mx-auto px-4 md:px-8 mt-16">
        <div className="bg-white text-black rounded-xl shadow-lg p-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Left: Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-green-600 mb-2">
              {username}
            </h2>
            <p className="text-gray-700 mb-4">{bio}</p>
            <div className="text-sm flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                Joined by:{" "}
                <span className="text-green-700 font-medium">{email}</span>
              </span>
            </div>
          </div>

          {/* Right: Buttons & Share */}
          <div className="flex flex-col gap-4">
            <div className="text-sm text-gray-700">
              <span className="mr-2">Share:</span>
              <span className="text-blue-600 font-semibold">{sharable}</span>
            </div>
            <Button
              onClick={() => router.push("/editprofile")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Playlist Section */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        <Card className="shadow-xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-green-500">My Playlist</h2>
              <Button
                onClick={() => router.push("/add-stream")}
                className="bg-green-500 hover:bg-black text-white"
              >
                Add to Playlist
              </Button>
              <Button
                onClick={() => router.push("/all-streams")}
                className="bg-green-500 hover:bg-black text-white"
              >
                View Playlist
              </Button>
            </div>

            {playlist.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {playlist.map((playlist, idx) => (
                  <Card
                    key={idx}
                    onClick={() => router.push("/dashboard")}
                    className="hover:shadow-lg p-4 border-2 border-black hover:border-green-500 rounded-lg transition-shadow "
                  >
                    <CardContent>
                      <Image
                        src={playlist.bigImage || "/placeholder.svg"}
                        alt={playlist.title}
                        width={100}
                        height={100}
                        quality={100}
                        onClick={() => router.push("/dashboard")}
                        className="rounded-md border-1 border-green-500 w-full aspect-square object-cover mb-3"
                      />
                      <h3
                        onClick={() => router.push("/dashboard")}
                        className="font-semibold bg-black text-white text-center pb-1 border rounded-lg mb-1"
                      >
                        {playlist.title}
                      </h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No items in your playlist yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
