"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Users,
  Headphones,
  Award,
  Globe,
  Smartphone,
  Zap,
  Shield,
  ChevronRight,
  Check,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Home from '../../public/paisaje-verde-con-luces-borrosas.jpg'
export default function Homepage() {
  const router = useRouter();

  const features = [
    {
      icon: Music,
      title: "100M+ Pods",
      description:
        "Access to the world's largest podcast library with new releases daily",
    },
    {
      icon: Zap,
      title: "AI-Powered Discovery",
      description:
        "Smart recommendations that learn your taste and introduce you to new favorites",
    },
    {
      icon: Headphones,
      title: "Hi-Fi Audio Quality",
      description:
        "Crystal clear sound with lossless audio streaming up to 24-bit/192kHz",
    },
    {
      icon: Users,
      title: "Social Features",
      description:
        "Share pods, create collaborative playlists, and connect with friends",
    },
    {
      icon: Smartphone,
      title: "Offline Listening",
      description: "Download your favorite podcasts and listen anywhere, anytime",
    },
    {
      icon: Shield,
      title: "Ad-Free Experience",
      description: "Uninterrupted audio streaming with premium subscription",
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Limited skips",
        "Ads between Podcasts",
        "Standard audio quality",
        "Mobile app access",
      ],
      popular: false,
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "month",
      features: [
        "Unlimited skips",
        "Ad-free listening",
        "High-quality audio",
        "Offline downloads",
        "All devices",
      ],
      popular: true,
    },
    {
      name: "Family",
      price: "$14.99",
      period: "month",
      features: [
        "Up to 6 accounts",
        "All Premium features",
        "Individual profiles",
        "Parental controls",
        "Family mix playlists",
      ],
      popular: false,
    },
  ];

  const stats = [
    { icon: Users, value: "50M+", label: "Active Users" },
    { icon: Music, value: "10M+", label: "Pods" },
    { icon: Globe, value: "180+", label: "Countries" },
    { icon: Award, value: "15+", label: "Industry Awards" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-500 hover:bg-green-500 text-white mb-6">
                🎵 New: AI-Powered Playlists
              </Badge>
              <h1 className="text-4xl lg:text-6xl text-green-500 font-bold mb-6 leading-tight">
                Your PodCast, Your World, Your Way
              </h1>
              <p className="text-xl lg:text-2xl text-white mb-8 leading-relaxed">
                Discover, stream, and share your pods like never before. Join
                millions of knowledge lovers on the platform that puts artists and
                users first.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  size="lg"
                  onClick={() => router.push("/register")}
                  className="bg-white text-green-600 hover:bg-green-500 hover:text-white"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
                >
                  Explore PodCast
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-green-200" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-green-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
                <Image
                className="rounded-xl border-1 border-white transition duration-300 shadow-sm hover:shadow-md hover:shadow-green-500"
                width={500}
                height={500}
                src={Home}
                alt="l"
                />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mb-4">
              Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to enhance your listening experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-1 border-black shadow-lg hover:shadow-md hover:shadow-green-500 transition-shadow"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 border-1 border-black rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Artist Spotlight */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/artists")}
              className="bg-white hover:bg-green-500 hover:text-white"
            >
              Discover More Listener
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mb-4">
              Pricing
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Start free, upgrade when you are ready
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`border-1 border-black shadow-lg hover:shadow-xl transition-shadow relative ${
                  plan.popular ? "ring-2 ring-green-600" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-600 hover:bg-green-600 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">
                      {plan.price}
                    </span>
                    <span className="text-slate-600">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {plan.name === "Free" ? "Get Started" : "Start Free Trial"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Join millions of knowledge seakers and discover your next favorite podcasts
            today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/about")}
              className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
}
