"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Share2,
  Heart,
  MoreHorizontal,
  Shuffle,
  Repeat,
  Eye,
} from "lucide-react";
import Image from "next/image";

export default function CreatorDashboard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(75);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");

  

  const songs = [
    {
      id: 1,
      title: "Midnight Dreams",
      artist: "Your Artist Name",
      album: "Latest Album",
      duration: "4:00",
      thumbnail: "/placeholder.svg?height=300&width=300",
      plays: 125420,
      likes: 8934,
      shares: 1205,
      isCurrentUserSong: true,
    },
    {
      id: 2,
      title: "Electric Nights",
      artist: "Your Artist Name",
      album: "Latest Album",
      duration: "3:45",
      thumbnail: "/placeholder.svg?height=300&width=300",
      plays: 98765,
      likes: 7234,
      shares: 892,
      isCurrentUserSong: true,
    },
    {
      id: 3,
      title: "Ocean Waves",
      artist: "Your Artist Name",
      album: "Previous Album",
      duration: "4:20",
      thumbnail: "/placeholder.svg?height=300&width=300",
      plays: 156789,
      likes: 12456,
      shares: 2134,
      isCurrentUserSong: true,
    },
    {
      id: 4,
      title: "City Lights",
      artist: "Your Artist Name",
      album: "Latest Album",
      duration: "3:30",
      thumbnail: "/placeholder.svg?height=300&width=300",
      plays: 87432,
      likes: 6543,
      shares: 743,
      isCurrentUserSong: true,
    },
    {
      id: 5,
      title: "Summer Breeze",
      artist: "Your Artist Name",
      album: "Summer EP",
      duration: "3:15",
      thumbnail: "/placeholder.svg?height=300&width=300",
      plays: 203456,
      likes: 15678,
      shares: 3421,
      isCurrentUserSong: true,
    },
  ];

  const currentSong = songs[currentSongIndex];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
      setCurrentTime(0);
    }
  };

  const handlePrevious = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
      setCurrentTime(0);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentSong.title} by ${currentSong.artist}`,
          text: `Check out this amazing song on SoundWave!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleSongSelect = (index: number) => {
    setCurrentSongIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen mt-8 bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Player Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Song Player */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Now Playing
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Album Art */}
                  <div className="relative">
                    <Image
                      src={currentSong.thumbnail || "/placeholder.svg"}
                      alt={currentSong.title}
                      width={300}
                      height={300}
                      className="rounded-lg shadow-lg w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        size="lg"
                        onClick={handlePlayPause}
                        className="bg-white/90 text-slate-900 hover:bg-white rounded-full w-16 h-16"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Play className="w-6 h-6 ml-1" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Song Info and Controls */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {currentSong.title}
                      </h3>
                      <p className="text-lg text-slate-600 mb-1">
                        {currentSong.artist}
                      </p>
                      <p className="text-slate-500">{currentSong.album}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <Eye className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-slate-900">
                          {currentSong.plays.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">Plays</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
                        <div className="text-lg font-bold text-slate-900">
                          {currentSong.likes.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">Likes</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <Share2 className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-slate-900">
                          {currentSong.shares.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">Shares</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-500">
                        <span>{formatTime(currentTime)}</span>
                        <span>{currentSong.duration}</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsShuffled(!isShuffled)}
                        className={
                          isShuffled
                            ? "bg-green-50 border-green-600 text-green-600"
                            : ""
                        }
                      >
                        <Shuffle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevious}
                      >
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button
                        size="lg"
                        onClick={handlePlayPause}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleNext}>
                        <SkipForward className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const modes: ("off" | "all" | "one")[] = [
                            "off",
                            "all",
                            "one",
                          ];
                          const currentIndex = modes.indexOf(repeatMode);
                          setRepeatMode(
                            modes[(currentIndex + 1) % modes.length]
                          );
                        }}
                        className={
                          repeatMode !== "off"
                            ? "bg-green-50 border-green-600 text-green-600"
                            : ""
                        }
                      >
                        <Repeat className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center space-x-3">
                      <Volume2 className="w-5 h-5 text-slate-600" />
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={(e) =>
                            setVolumeState(Number(e.target.value))
                          }
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      <span className="text-sm text-slate-600 w-8">
                        {volume}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Queue Section */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Up Next</h3>
                  <Badge variant="outline">{songs.length - 1} songs</Badge>
                </div>

                <div className="space-y-3">
                  {songs.slice(1).map((song, index) => (
                    <div
                      key={song.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                      onClick={() => handleSongSelect(index + 1)}
                    >
                      <div className="relative">
                        <Image
                          src={song.thumbnail || "/placeholder.svg"}
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
                          {song.artist}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1">
                          <span>{song.plays.toLocaleString()} plays</span>
                          <span>{song.duration}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                >
                  Add More Songs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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
