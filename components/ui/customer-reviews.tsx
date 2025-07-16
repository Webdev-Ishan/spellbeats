"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Music, Users, Calendar } from "lucide-react";
import Image from "next/image";

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

  const reviews = [
    {
      id: 1,
      user: {
        name: "Alex Thompson",
        avatar: "/placeholder.svg?height=50&width=50",
        verified: true,
        memberSince: "2022",
      },
      rating: 5,
      title: "Best music discovery platform I've ever used!",
      content:
        "SoundWave has completely changed how I discover new music. The recommendations are spot-on, and I love how it connects me with artists I never would have found otherwise. The sound quality is exceptional, and the interface is so intuitive.",
      date: "2024-01-15",
      helpful: 24,
      plan: "Premium",
    },
    {
      id: 2,
      user: {
        name: "Maria Rodriguez",
        avatar: "/placeholder.svg?height=50&width=50",
        verified: true,
        memberSince: "2021",
      },
      rating: 5,
      title: "Perfect for music lovers",
      content:
        "As a musician myself, I appreciate how SoundWave supports independent artists. The platform makes it easy to discover emerging talent, and the audio quality is pristine. Customer support is also fantastic - they responded to my query within hours.",
      date: "2024-01-12",
      helpful: 18,
      plan: "Premium",
    },
    {
      id: 3,
      user: {
        name: "David Chen",
        avatar: "/placeholder.svg?height=50&width=50",
        verified: false,
        memberSince: "2023",
      },
      rating: 4,
      title: "Great service with minor issues",
      content:
        "Overall very happy with SoundWave. The music library is extensive and the discovery features are excellent. Sometimes the app can be a bit slow to load, but the quality of recommendations more than makes up for it.",
      date: "2024-01-10",
      helpful: 12,
      plan: "Free",
    },
    {
      id: 4,
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=50&width=50",
        verified: true,
        memberSince: "2020",
      },
      rating: 5,
      title: "Exceeded all my expectations",
      content:
        "I've tried every major streaming service, and SoundWave is by far the best. The personalized playlists are incredible, and I love the social features that let me share discoveries with friends. Worth every penny of the premium subscription.",
      date: "2024-01-08",
      helpful: 31,
      plan: "Premium",
    },
    {
      id: 5,
      user: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=50&width=50",
        verified: true,
        memberSince: "2022",
      },
      rating: 4,
      title: "Solid platform with room for improvement",
      content:
        "SoundWave does a lot of things right. The music quality is excellent and the recommendation engine is pretty good. I'd love to see more podcast content and better offline functionality, but overall it's a great service.",
      date: "2024-01-05",
      helpful: 8,
      plan: "Premium",
    },
    {
      id: 6,
      user: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=50&width=50",
        verified: true,
        memberSince: "2023",
      },
      rating: 3,
      title: "Good but not great",
      content:
        "The music selection is decent and the app works well most of the time. However, I find the recommendations sometimes miss the mark, and the premium price is a bit steep compared to competitors. Still a solid choice overall.",
      date: "2024-01-03",
      helpful: 5,
      plan: "Free",
    },
  ];

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
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="border-0 shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Image
                        src={review.user.avatar || "/placeholder.svg"}
                        alt={review.user.name}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-slate-900">
                              {review.user.name}
                            </h3>
                            {review.user.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {review.plan}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-slate-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-3">
                          {renderStars(review.rating)}
                          <span className="text-sm text-slate-600">
                            Member since {review.user.memberSince}
                          </span>
                        </div>

                        <h4 className="font-medium text-slate-900 mb-2">
                          {review.title}
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
          >
            Write a Review
          </Button>
        </div>
      </section>
    </div>
  );
}
