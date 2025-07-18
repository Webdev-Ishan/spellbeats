"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Users,
  Music,
  Clock,
  Calendar,
  MapPin,
  Settings,
  Share2,
  Headphones,
} from "lucide-react";
import Image from "next/image";

export default function UserProfile() {
  const userInfo = {
    name: "Alex Thompson",
    username: "@alexthompson",
    avatar: "/placeholder.svg?height=200&width=200",
    coverImage: "/placeholder.svg?height=300&width=800",
    bio: "Music lover, playlist curator, and indie rock enthusiast. Always discovering new sounds and sharing great music with friends.",
    location: "San Francisco, CA",
    joinDate: "March 2022",
    isVerified: false,
    stats: {
      totalStreams: 15420,
      hoursListened: 2340,
      followingArtists: 127,
      playlistsCreated: 23,
      favoriteGenres: ["Indie Rock", "Electronic", "Jazz"],
    },
  };

  const playlists = [
    {
      id: 1,
      name: "Indie Discoveries",
      songCount: 47,
      thumbnail: "/placeholder.svg?height=100&width=100",
      isPublic: true,
    },
    {
      id: 2,
      name: "Late Night Vibes",
      songCount: 32,
      thumbnail: "/placeholder.svg?height=100&width=100",
      isPublic: true,
    },
    {
      id: 3,
      name: "Workout Mix",
      songCount: 28,
      thumbnail: "/placeholder.svg?height=100&width=100",
      isPublic: false,
    },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-green-500">
      {/* Profile Header */}
      <section className="relative">
        <div className="h-64 bg-black"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="container mx-auto px-4">
          <div className="relative -mt-20 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-1 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {userInfo.name}
                </h1>
                <p className="text-green-100 text-lg mb-2">
                  {userInfo.username}
                </p>
                <p className="text-green-100 mb-4 max-w-2xl">{userInfo.bio}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-green-100">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{userInfo.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {userInfo.joinDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Headphones className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900">
                {formatNumber(userInfo.stats.totalStreams)}
              </div>
              <div className="text-sm text-slate-600">Total Streams</div>
            </div>
            <div className="text-center">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900">
                {formatNumber(userInfo.stats.hoursListened)}
              </div>
              <div className="text-sm text-slate-600">Hours Listened</div>
            </div>
            <div className="text-center">
              <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900">
                {userInfo.stats.followingArtists}
              </div>
              <div className="text-sm text-slate-600">Following Artists</div>
            </div>
            <div className="text-center">
              <Music className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900">
                {userInfo.stats.playlistsCreated}
              </div>
              <div className="text-sm text-slate-600">Playlists Created</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* User Playlists */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">My Playlist</h2>
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Add to Playlist
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {playlists.map((playlist) => (
                <Card
                  key={playlist.id}
                  className="border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <Image
                      src={playlist.thumbnail || "/placeholder.svg"}
                      alt={playlist.name}
                      width={100}
                      height={100}
                      className="rounded-md w-full aspect-square object-cover mb-3"
                    />
                    <h3 className="font-medium text-slate-900 mb-1">
                      {playlist.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">
                      {playlist.songCount} songs
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
