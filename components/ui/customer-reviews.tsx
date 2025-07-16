"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Music, Users, Calendar } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type reviews = {
  topic: string;
  content: string;
  username: string;
  createdAT: Date;
};

type backendresponse = {
  success: boolean;
  status: number;
  allReviews: reviews[];
};

export default function CustomerReviews() {
  const overallStats = {
    averageRating: 4.6,
    totalReviews: 12847,
    ratingBreakdown: [
      { stars: 5, count: 8234, percentage: 64 },
      { stars: 4, count: 2891, percentage: 23 },
      { stars: 3, count: 1156, percentage: 9 },
      { stars: 2, count: 386, percentage: 3 },
      { stars: 1, count: 180, percentage: 1 },
    ],
  };

  const router = useRouter();
  const [reviews, setreviews] = useState<reviews[]>([]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get<backendresponse>(`/api/reviews`);

      if (response.data && response.data.success) {
        setreviews(response.data.allReviews);
        console.log(reviews);
      } else {
        toast.error("Somethign went wrong.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("unable to fetch Reviews.");
      }
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-green-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className=" py-2 px-4 bg-black text-white mb-6">
            Customer Reviews
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            What Our Users Say
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto mb-8">
            Real feedback from music lovers around the world
          </p>

          {/* Overall Rating */}
          <div className="bg-white border-1 border-black backdrop-blur-sm text-black rounded-lg p-6 max-w-md mx-auto">
            <div className="text-4xl text-black font-bold mb-2">
              {overallStats.averageRating}
            </div>
            {renderStars(Math.round(overallStats.averageRating), "lg")}
            <p className="text-black mt-2">
              Based on {overallStats.totalReviews.toLocaleString()} reviews
            </p>
          </div>
        </div>
      </section>

      {/* Rating Breakdown */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
              Rating Breakdown
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {overallStats.ratingBreakdown.map((rating) => (
                  <div
                    key={rating.stars}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex items-center space-x-2 w-16">
                      <span className="text-sm font-medium">
                        {rating.stars}
                      </span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${rating.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-16 text-right">
                      {rating.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">
                    {overallStats.totalReviews.toLocaleString()}
                  </div>
                  <div className="text-slate-600">Total Reviews</div>
                </div>
                <div className="text-center p-6 bg-slate-100 rounded-lg">
                  <Music className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">87%</div>
                  <div className="text-slate-600">Would Recommend</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Reviews */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.map((review, idx) => (
                <Card
                  key={idx}
                  className="border-0 shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6  border-1 border-black rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2 text-sm text-slate-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(review.createdAT).toLocaleDateString()}
                          </div>
                        </div>

                        <h4 className="font-bold text-slate-900 mb-2">
                          {review.topic}
                        </h4>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Write Review CTA */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Share Your Experience
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Help other music lovers discover what makes SoundWave special
          </p>
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => router.push("/givereviews")}
          >
            Write a Review
          </Button>
        </div>
      </section>
    </div>
  );
}
