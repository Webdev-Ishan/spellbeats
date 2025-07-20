"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, Heart, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import axios from "axios";
import placeholder from "../../public/logo.png";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type upvote = {
  userId: string;
};

type stream = {
  id: string;
  title: string;
  bigImage?: string;
  cloudinaryURL: string;
  creator: {
    username: string;
  };
  upvotes: upvote[];
};

type backendresponse = {
  success: boolean;
  status: number;
  streams: stream[];
};

type backendresponse2 = {
  success: boolean;
  status: number;
};

export default function PlayerPage() {
  const [streams, setStreams] = useState<stream[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [session, status, router]);

  // Fetch all streams
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const result = await axios.get<backendresponse>("/api/streams");
        if (result.data && result.data.success) {
          setStreams(result.data.streams);
          // Set initial like state for first stream
          if (result.data.streams.length > 0 && session?.user?.id) {
            const hasUpvoted = result.data.streams[0].upvotes.some(
              (upvote) => upvote.userId === session.user.id
            );
            setIsLiked(hasUpvoted);
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const status = error.response.status;

          if (status === 401) {
            toast.error("Please login first!");
          } else if (status === 404) {
            toast.error("User not found!!");
          } else if (status === 400) {
            toast.error("Ids not found!!");
          } else if (status == 500) {
            toast.error("Something went wrong");
            console.log(error);
          }
        } else {
          if (error instanceof Error) {
            toast.error(error.message);
            console.log(error);
          }
        }
      }
    };
    fetchStreams();
  }, [session?.user?.id]);

  // Update like state when currentIndex changes
  useEffect(() => {
    if (streams.length > 0 && session?.user?.id) {
      const hasUpvoted = streams[currentIndex].upvotes.some(
        (upvote) => upvote.userId === session.user.id
      );
      setIsLiked(hasUpvoted);
    }
  }, [currentIndex, streams, session?.user?.id]);

  const play = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const hanldevote = async (id: string | undefined) => {
    if (!id) return;
    try {
      let result;
      if (isLiked) {
        // Downvote
        result = await axios.post<backendresponse2>("/api/downvote", {
          streamid: id,
        });
        if (result.data && result.data.success) {
          setIsLiked(false);
          // Refresh upvotes for current stream
          refreshStream(id);
        }
      } else {
        // Upvote
        result = await axios.post<backendresponse2>("/api/upvote", {
          streamid: id,
        });
        if (result.data && result.data.success) {
          setIsLiked(true);
          refreshStream(id);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;

        if (status === 401) {
          toast.error("Please login first!");
        } else if (status === 404) {
          toast.error("User not found!!");
        } else if (status === 400) {
          toast.error("Ids not found!!");
        } else if (status == 500) {
          toast.error("Something went wrong");
          console.log(error);
        }
      } else {
        if (error instanceof Error) {
          toast.error(error.message);
          console.log(error);
        }
      }
    }
  };

  // Refresh upvotes for a single stream after voting
  const refreshStream = async (id: string) => {
    try {
      const result = await axios.post<{ success: boolean; stream: stream }>(
        "/api/player",
        {
          streamid: id,
        }
      );
      if (result.data && result.data.success) {
        setStreams((prev) =>
          prev.map((s) => (s.id === id ? result.data.stream : s))
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;

        if (status === 401) {
          toast.error("Please login first!");
        } else if (status === 404) {
          toast.error("User not found!!");
        } else if (status === 400) {
          toast.error("Ids not found!!");
        } else if (status == 500) {
          toast.error("Something went wrong");
          console.log(error);
        }
      } else {
        if (error instanceof Error) {
          toast.error(error.message);
          console.log(error);
        }
      }
    }
  };

  if (streams.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const pod = streams[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="py-12 ">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-1 border-black shadow-2xl bg-gradient-to-br from-white to-slate-50">
              <CardContent className="p-12">
                {/* Song Info Header */}
                <div className="text-center border-1 border-black p-3 rounded-lg mb-8">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mb-4">
                    Now Playing
                  </Badge>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    {pod?.title ?? "Unknown Title"}
                  </h1>
                  <p className="text-xl text-green-500 mb-1">
                    {pod?.creator.username ?? "Unknown Artist"}
                  </p>
                </div>

                {/* Album Art */}
                <div className="relative mb-8 p-4">
                  <div className="aspect-square max-w-md mx-auto border-1 border-black p-4 rounded-lg relative group">
                    <Image
                      src={pod?.bigImage ?? placeholder}
                      alt={pod?.title ?? "Album Art"}
                      fill
                      className="rounded-2xl shadow-xl object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <audio ref={audioRef} src={pod?.cloudinaryURL} />
                      <Button
                        size="lg"
                        onClick={play}
                        className="bg-white/90 text-slate-900 hover:bg-white rounded-full w-20 h-20 shadow-lg"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8" />
                        ) : (
                          <Play className="w-8 h-8 ml-1" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Like Button */}
                <div className="flex items-center justify-center mb-8">
                  <Button
                    variant="ghost"
                    size={"lg"}
                    onClick={() => hanldevote(pod?.id)}
                    className={`${isLiked ? "text-red-500" : "text-slate-400"} hover:text-red-500`}
                  >
                    <Heart
                      className={`w-10 h-10 mr-2 ${isLiked ? "fill-green-500" : "fill-red-500"}`}
                    />
                    {isLiked ? "Liked" : "Like"}
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-4">
                  <Volume2 className="w-5 h-5 text-slate-600" />
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <span className="text-sm text-slate-600 w-8">{volume}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Queue Section */}
          <div className="max-w-2xl mx-auto mt-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Up Next</h3>
                  <Badge variant="outline">{streams.length - 1} songs</Badge>
                </div>
                <div className="space-y-3">
                  {streams.map((song, idx) => (
                    <div
                      key={song.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group ${
                        idx === currentIndex ? "bg-green-50" : ""
                      }`}
                      onClick={() => setCurrentIndex(idx)}
                    >
                      <div className="relative">
                        <Image
                          src={song.bigImage ?? placeholder}
                          alt={song.title}
                          width={50}
                          height={50}
                          className="rounded-md"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 truncate">
                          {song.title}
                        </h4>
                        <p className="text-sm text-slate-600 truncate">
                          {song.creator.username}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #16a34a;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #16a34a;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
