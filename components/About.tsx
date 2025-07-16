"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Users,
  Heart,
  Headphones,
  Star,
  Award,
  Globe,
} from "lucide-react";
import Image from "next/image";
import about from "../public/about.jpg";
import { useRouter } from "next/navigation";

export default function AboutUs() {
  const router = useRouter();
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Former Spotify executive with 10+ years in music tech",
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Product",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Product visionary focused on user experience and discovery",
    },
    {
      name: "Emily Johnson",
      role: "Chief Technology Officer",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Engineering leader with expertise in scalable audio systems",
    },
    {
      name: "David Kim",
      role: "Head of Music Partnerships",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Industry veteran with deep connections across record labels",
    },
  ];

  const stats = [
    { icon: Users, value: "50M+", label: "Active Users" },
    { icon: Music, value: "100M+", label: "Songs" },
    { icon: Globe, value: "180+", label: "Countries" },
    { icon: Award, value: "15+", label: "Industry Awards" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Music First",
      description:
        "Every decision we make puts music and artists at the center",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Building connections between artists and fans worldwide",
    },
    {
      icon: Star,
      title: "Innovation",
      description: "Pioneering new ways to discover and experience music",
    },
    {
      icon: Headphones,
      title: "Quality Sound",
      description: "Delivering the highest quality audio experience possible",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}

      {/* Hero Section */}
      <section className="bg-slate-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-green-500 py-2 hover:bg-green-500 text-md text-white mb-6">
            About SpellBeats
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Connecting the World Through Music
          </h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
            We are on a mission to make music discovery magical and bring
            artists closer to their fans than ever before.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 hover:scale-105 hover:bg-black transition duration-300 backdrop-blur-sm rounded-lg p-4 min-w-[120px]"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-green-200" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-green-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-slate-600 text-lg">
                <p>
                  Founded in 2018, SpellBeats began as a simple idea: what if
                  discovering new music could be as exciting as hearing your
                  favorite song for the first time?
                </p>
                <p>
                  Our founders, frustrated with algorithmic recommendations that
                  felt cold and impersonal, set out to create a platform that
                  celebrates the human connection to music. We believe that the
                  best music discoveries happen through shared experiences,
                  cultural moments, and genuine passion.
                </p>
                <p>
                  Today, we are proud to serve over 50 million music lovers
                  worldwide, helping them discover their next favorite artist
                  while supporting musicians in reaching new audiences.
                </p>
              </div>
              <Button
                onClick={() => router.push("/register")}
                className="mt-8 bg-green-600 hover:bg-green-700 px-2 py-3 text-white"
              >
                Join Our Community
              </Button>
            </div>
            <div className="relative">
              <Image
                src={about}
                alt="Music studio with people collaborating"
                width={600}
                height={500}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-green-600 text-white p-6 rounded-lg shadow-lg">
                <Music className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">2018</div>
                <div className="text-sm">Founded</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-100 ">
        <div className="container mx-auto px-4 ">
          <div className="text-center mb-16 ">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do at SpellBeats
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 hover:bg-black  rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The passionate people behind SpellBeats mission
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <CardContent className="p-6 text-center">
                  <Image
                    src={
                      "data:image/jpeg;base64,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"
                    }
                    alt={member.name}
                    width={200}
                    height={200}
                    className="rounded-full border-1 border-black mx-auto mb-4 w-32 h-32 object-cover"
                  />
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-green-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-slate-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-8">
            To democratize music discovery and create a world where every artist
            has the opportunity to be heard, and every listener can find their
            perfect soundtrack to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Start Listening
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
            >
              For Artists
            </Button>
          </div>
        </div>
      </section>

      
    </div>
  );
}
