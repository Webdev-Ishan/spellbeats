"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Heart,
  MoreHorizontal,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import axios from "axios";
import placeholder from "../../../public/logo.png";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ReactPlayer from "react-player";
type upvote = {
  userId: string;
};

type stream = {
  id: string;
  title: string;
  bigImage?: string;
  url: string;
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
  const playerRef = useRef<HTMLVideoElement>(null);

  const [streams, setStreams] = useState<stream[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isLiked, setIsLiked] = useState(false);
  const params = useParams();
  const creatorId = params.creatorId;
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [session, status, router]);

  const skipForward = (seconds: number) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime;
      playerRef.current.currentTime = currentTime + seconds;
    }
  };

  const skipBackward = (seconds: number) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime;
      playerRef.current.currentTime = currentTime - seconds;
    }
  };

  // Fetch all streams
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const result = await axios.get<backendresponse>(
          `/api/streams?creatorId=${creatorId}`
        );
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
  }, [session?.user?.id, creatorId]);

  // Update like state when currentIndex changes
  useEffect(() => {
    if (streams.length > 0 && session?.user?.id) {
      const hasUpvoted = streams[currentIndex].upvotes.some(
        (upvote) => upvote.userId === session.user.id
      );
      setIsLiked(hasUpvoted);
    }
  }, [currentIndex, streams, session?.user?.id]);

  const handlevote = async (id: string | undefined) => {
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
        <div className="container   mx-auto px-10">
          <div className="w-full  max-w-4xl bg-white mt-10 rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative group">
              <Image
                src={pod?.bigImage ?? placeholder}
                alt={pod?.title ?? "Album Art"}
                width={800}
                height={400}
                className="w-full h-[300px] object-cover"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  className="w-16 h-16 bg-white text-black hover:bg-green-500 hover:text-white rounded-full shadow-lg"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-[2px]" />
                  )}
                </Button>
              </div>
            </div>

            <div className="p-6 text-center space-y-4">
              <h1 className="text-2xl font-bold text-slate-900">
                {pod?.title ?? "Unknown Title"}
              </h1>
              <p className="text-lg text-slate-500">
                {pod?.creator.username ?? "Unknown Artist"}
              </p>

              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (currentIndex > 0) {
                      setCurrentIndex(currentIndex - 1);
                    } else {
                      setCurrentIndex(currentIndex);
                    }
                  }}
                >
                  <ChevronsLeft
                    className={`w-10 h-10 font-extrabold text-black`}
                  />
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => handlevote(pod.id)}
                  className={`hover:text-red-600 transition-colors ${isLiked ? "text-red-500" : "text-slate-400"}`}
                >
                  <Heart
                    className={`w-6 h-6 ${isLiked ? "fill-red-500" : ""}`}
                  />
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    if (currentIndex < streams.length - 1) {
                      setCurrentIndex(currentIndex + 1);
                    } else {
                      setCurrentIndex(currentIndex - (streams.length - 1));
                    }
                  }}
                >
                  <ChevronsRight
                    className={`w-10 h-10 font-extrabold text-black`}
                  />
                </Button>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-sm text-slate-600 w-10 text-right">
                  {volume}
                </span>
              </div>
              <Button className=" mr-2 p-4" onClick={() => skipBackward(10)}>
                -10s
              </Button>
              <Button className="ml-2 mr-2 p-4" onClick={() => skipForward(10)}>
                +10s
              </Button>
            </div>
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

        <ReactPlayer
          ref={playerRef}
          src={pod?.url}
          loop={false}
          playing={isPlaying}
          volume={volume / 100}
          width="0px"
          height="0px"
          controls={false}
          onEnded={() => {
            if (currentIndex < streams.length - 1) {
              setCurrentIndex(currentIndex + 1);
            } else {
              setCurrentIndex(currentIndex - (streams.length - 1));
            }
          }}
          style={{ display: "none" }}
        />
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
