"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import placeholder from "../../public/logo.png";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type upvote = {
  userId: string;
};

type backendresponse = {
  success: boolean;
  status: number;
  stream: {
    id: string;
    title: string;
    bigImage?: string;
    cloudinaryURL: string;
    creator: {
      username: string;
    };
    upvotes: upvote[];
  };
};

type backendresponse2 = {
  success: boolean;
  status: number;
};

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(245); // fallback duration
  const [volume, setVolume] = useState(75);
  const [isLiked, setIsLiked] = useState(true);
  const [pod, setpod] = useState<backendresponse["stream"] | undefined>();
  const progressRef = useRef<HTMLDivElement>(null);
  const id = useSearchParams().get("id");

  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [session, status, router]);

  const audioRef = useRef<HTMLAudioElement>(null);

  const fetchmusicinfo = async (id: string) => {
    try {
      const result = await axios.post<backendresponse>("/api/player", {
        streamid: id,
      });

      if (result.data && result.data.success) {
        console.log(result);
        setpod(result.data.stream);

        const currentUserId = session?.user.id;
        const hasUpvoted = result.data.stream.upvotes.some(
          (upvote: upvote) => upvote.userId === currentUserId
        );
        setIsLiked(hasUpvoted);
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

  useEffect(() => {
    if (id) {
      fetchmusicinfo(id);
    }
  }, [id,isLiked]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      setCurrentTime(newTime);
    }
  };

  const handleShare = async () => {
    if (!pod) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${pod.title} by ${pod.creator.username}`,
          text: `Check out this track!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Simulate progress when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime((prev) => Math.min(prev + 1, duration));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  const progressPercentage = (currentTime / duration) * 100;

  const hanldevote = async (id: string | undefined) => {
    if (!id) return;
    try {
      let result;
      if (isLiked) {
        // If already liked, call downvote
        result = await axios.post<backendresponse2>("/api/downvote", {
          streamid: id,
        });
        if (result.data && result.data.success) {
          setIsLiked(false);
          fetchmusicinfo(id); // re-fetch to update upvotes
        }
      } else if (!isLiked) {
        // If not liked, call upvote
        result = await axios.post<backendresponse2>("/api/upvote", {
          streamid: id,
        });
        if (result.data && result.data.success) {
          setIsLiked(true);
          fetchmusicinfo(id); // re-fetch to update upvotes
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 409) {
          toast.info("Already liked!");
        } else if (status === 401) {
          toast.error("Please login first!");
        } else if (status === 404) {
          toast.error("User not found!!");
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Music Player */}
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

                {/* Progress Bar */}
                <div className="mb-8">
                  <div
                    ref={progressRef}
                    className="w-full bg-slate-200 rounded-full h-3 cursor-pointer mb-3"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-300 relative"
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-600 rounded-full shadow-md"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Main Controls */}
                <div className="flex items-center justify-center space-x-6 mb-8">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full w-14 h-14 bg-transparent"
                  >
                    <SkipBack className="w-6 h-6" />
                  </Button>
                  <Button
                    size="lg"
                    onClick={play}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-full w-16 h-16"
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7" />
                    ) : (
                      <Play className="w-7 h-7 ml-0.5" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full w-14 h-14 bg-transparent"
                  >
                    <SkipForward className="w-6 h-6" />
                  </Button>
                </div>

                {/* Secondary Controls */}
                <div className="flex items-center justify-between mb-8">
                  <Button
                    variant="ghost"
                    onClick={() => hanldevote(pod?.id)}
                    className={`${isLiked ? "text-red-500" : "text-slate-400"} hover:text-red-500`}
                  >
                    <Heart
                      className={`w-5 h-5 mr-2 ${isLiked ? "fill-green-500" : "fill-red-500"}`}
                    />
                    {isLiked ? "Liked" : "Like"}
                  </Button>

                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      onClick={handleShare}
                      className="text-slate-400 hover:text-green-600"
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Share
                    </Button>
                    <Button variant="ghost" className="text-slate-400">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>
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
