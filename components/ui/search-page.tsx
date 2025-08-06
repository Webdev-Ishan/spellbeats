"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Music, Heart } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import z from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type upvote = {
  userId: string;
};

type stream = {
  id: string;
  title: string;
  bigImage: string;
  creator: {
    username: string;
  };
  upvotes: upvote[];
};

type backendresponse = {
  success: boolean;
  status: number;
  result: stream[];
};

type backendresponse2 = {
  success: boolean;
  status: number;
};

const queryschema = z.object({
  query: z.string(),
});

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<stream[]>([]);
  const [upvote, setupvote] = useState(false);

  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedBody = queryschema.safeParse({ query: searchQuery });
    if (!parsedBody.success) {
      toast.error("Invalid search query");
      console.log(parsedBody.error.flatten().fieldErrors);
    }

    try {
      const response = await axios.post<backendresponse>("/api/search", {
        query: searchQuery,
      });

      if (response.data && response.data.success) {
        setSearchResults(response.data.result);
        // Remove this block, as it is not needed and causes a type error.
        const currentUserId = session?.user.id;
        const hasUpvoted = response.data.result.some((stream) =>
          stream.upvotes.some((upvote) => upvote.userId === currentUserId)
        );
        setupvote(hasUpvoted);
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

  const hanldevote = async (id: string) => {
    try {
      if (upvote === false) {
        const result = await axios.post<backendresponse2>("/api/upvote", {
          streamid: id,
        });

        if (result.data && result.data.success) {
          setupvote(true);
        }
      } else {
        const result = await axios.post("/api/downvote", {
          streamid: id,
        });

        if (result.data && result.data.success) {
          setupvote(false);
        }
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
      {/* Search Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge
            onClick={() => router.push("/search")}
            className="bg-green-500 ml-4 cursor-pointer hover:bg-green-600 px-3 py-2 text-white mb-6"
          >
            Discover Podcasts
          </Badge>
          <Badge
            onClick={() => router.push("/SearchCreator")}
            className="bg-green-500 ml-4 cursor-pointer hover:bg-green-600 px-3 py-2 text-white mb-6"
          >
            Discover Creators
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Search PodCast
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
            Find your favorite podcasts, discover new creators, and explore
            millions of knowledge seekers
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <form onSubmit={handleSubmit} className="">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white">
                  <Search className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="Search for podcasrts, creastors, playlists, or genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white text-white"
                />
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                {searchResults.map((song, idx) => (
                  <Card
                    key={idx}
                    className="border-1 border-black hover:border-green-500 shadow-md  hover:shadow-green-500 transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative group">
                          <Image
                            src={song.bigImage || "/placeholder.svg"}
                            alt={song.title}
                            onClick={() =>
                              router.push(
                                `/player/?id=${encodeURIComponent(song.id)}`
                              )
                            }
                            width={200}
                            height={200}
                            className="rounded-md object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-lg truncate">
                            {song.title}
                          </h3>
                          <p className="text-green-500 truncate">
                            {song.creator.username}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => hanldevote(song.id)}
                          size="sm"
                          className={
                            upvote ? "text-green-500 " : "text-gray-400"
                          }
                        >
                          <Heart fill={upvote ? "#22c55e" : "none"} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {searchQuery && searchResults.length === 0 && (
              <div className="text-center py-16">
                <Music className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No podcast found
                </h3>
                <p className="text-slate-600 mb-6">
                  Try searching with different keywords or check your spelling
                </p>
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                >
                  Clear Search
                </Button>
              </div>
            )}

            {/* Default State */}
            {!searchQuery && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Start Your Knowledge Journey
                </h3>
                <p className="text-slate-600 mb-6">
                  Search for your favorite podcasts, artists, playlists, or
                  discover new content
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
