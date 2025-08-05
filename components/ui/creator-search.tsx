"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Music } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import z from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type creators = {
  id: string;
  name: string;
  email: string;
};

type backendresponse = {
  success: boolean;
  status: number;
  response: creators[];
};

const queryschema = z.object({
  query: z.string(),
});

export default function CreatorSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<creators[]>([]);

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
      const response = await axios.post<backendresponse>("/api/shareaccess", {
        Sharable: searchQuery,
      });

      if (response.data && response.data.success) {
        setSearchResults(response.data.response);
        console.log(searchResults);
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
            className="bg-green-500 hover:bg-green-500 px-3 py-2 text-white mb-6"
          >
            Discover Podcasts
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Search Creators</h1>
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
                {searchResults.map((creator, idx) => (
                  <Card
                    key={idx}
                    className="border-1 border-black hover:border-green-500 shadow-md  hover:shadow-green-500 transition-shadow"
                  >
                    <CardContent
                      onClick={() => router.push(`/dashboard/${creator.id}`)}
                      className="p-4"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-lg truncate">
                            {creator.name}
                          </h3>
                          <p className="text-green-500 truncate">
                            {creator.email}
                          </p>
                        </div>
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
