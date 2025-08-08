"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import SignOut from "./Signout";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../public/logo.png";
import { useSession } from "next-auth/react";
export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
      <p className="text-white dark:text-white">
        The Navbar will show on top of the page
      </p>
    </div>
  );
}

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className={cn("fixed top-3 inset-x-0 w-full z-50", className)}>
      <nav className="flex items-center  bg-slate-800 border border-white hover:shadow hover:shadow-green-500  transition duration-300 justify-between w-[98%]  mr-4 ml-2  px-4 md:px-8  rounded-4xl  shadow ">
        <div className="flex items-center justify-center gap-4">
          <Image
            width={16}
            height={16}
            src={logo}
            alt="logo"
            className="rounded-lg border border-green-500"
          />
          <h1
            onClick={() => router.push("/")}
            className="text-green-500 cursor-pointer text-xl font-sans md:text-lg font-bold"
          >
            SpellBeats
          </h1>
        </div>
        {/* Hamburger button for mobile */}
        <button
          className="md:hidden p-2  rounded focus:outline-none"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-white dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>
        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-evenly">
          <Menu setActive={setActive}>
            <MenuItem
              setActive={setActive}
              active={active}
              onclick={() => router.push("/artists")}
              className="text-white text-xs"
              item="Creators"
            ></MenuItem>
            <MenuItem
              setActive={setActive}
              active={active}
              className="text-white text-xs"
              onclick={() => router.push("/profile")}
              item="Profile"
            ></MenuItem>
            <MenuItem
              setActive={setActive}
              active={active}
              onclick={() => router.push(`/dashboard/${session?.user.id}`)}
              className="text-white text-xs"
              item="Dashboard"
            ></MenuItem>
            <MenuItem
              setActive={setActive}
              active={active}
              onclick={() => router.push("/reviews")}
              className="text-white text-xs"
              item="Reviews"
            ></MenuItem>
            <MenuItem
              className="text-white text-xs "
              setActive={setActive}
              active={active}
              onclick={() => {
                router.push("/about");
              }}
              item="About Us"
            ></MenuItem>
            <SignOut />
          </Menu>
        </div>
      </nav>
      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-800 shadow px-4 py-2">
          <div className="flex flex-col space-y-2">
            <HoveredLink onClick={() => router.push("/")}>Home</HoveredLink>
            <HoveredLink onClick={() => router.push("/profile")}>
              Profile
            </HoveredLink>
            <HoveredLink onClick={() => router.push("/artists")}>
              Creators
            </HoveredLink>
            <HoveredLink
              onClick={() => router.push(`/dashboard/${session?.user.id}`)}
            >
              Dashboard
            </HoveredLink>
            <HoveredLink onClick={() => router.push("/reviews")}>
              Reviews
            </HoveredLink>
            <HoveredLink onClick={() => router.push("/about")}>
              About Us
            </HoveredLink>
            <HoveredLink onClick={() => router.push("/signin")}>
              Sign In
            </HoveredLink>
          </div>
        </div>
      )}
    </div>
  );
}
