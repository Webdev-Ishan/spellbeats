"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "react-toastify";

type artists = {
  username: string;
  email: string;
  Sharable: string;
  _count: {
    streams: number;
  };
};

type backendresponse = {
  success: boolean;
  status: number;
  allartists: artists[];
};
export default function AllArtists() {
  const [Artists, setArtists] = useState<artists[]>([]);

  const fetchartists = async () => {
    try {
      const response = await axios.get<backendresponse>("/api/artist");

      if (response.data && response.data.success) {
        setArtists(response.data.allartists);
        console.log(Artists);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Somethign went wrong");
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    fetchartists();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-green-500 hover:bg-green-600 text-white mb-6 py-3 px-4 ">
            Discover Artists
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Artists</h1>
          <p className="text-xl  max-w-2xl mx-auto">
            Explore talented artists from around the world and discover your
            next favorite creator
          </p>
        </div>
      </section>

      {/* Artists List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Featured Artists
            </h2>

            <div className="space-y-6">
              {Artists.map((artist, idx) => (
                <Card
                  key={idx}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-8 border-1 flex flex-col md:flex-row justify-between items-center border-black rounded-xl">
                    <div className="flex items-center justify-center space-x-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-green-500 mb-2">
                          {artist.username}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-light text-slate-900 mb-2">
                          {artist.email}
                        </h3>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold  text-blue-600 mb-2">
                          {artist.Sharable}
                        </h3>
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-6">
                      <div className="text-2xl font-extrabold text-slate-900 mb-2">
                        <h2>StreamCount:</h2>
                      </div>
                      <h3 className="text-2xl font-bold text-green-500 mb-2">
                        {artist._count.streams}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
