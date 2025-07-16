"use client";
import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import clsx from "clsx"; // or use 'classnames' if you prefer

// Alias 'clsx' as 'cn' for compatibility with the rest of the code
const cn = clsx;

const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  className,
  onclick,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  className?: string;
  onclick?: () => void;
}) => {
  return (
    <div
      onMouseEnter={() => setActive(item)}
      onClick={() => {
        onclick?.(); // ✅ Call onClick if provided
      }}
      className={`relative`}
    >
      <motion.p
        transition={{ duration: 0.3 }}
        className={cn(
          "cursor-pointer hover:text-green-500",
          className // <-- custom styles here
        )}
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 ">
             
                <motion.div
                  layout // layout ensures smooth animation
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
            
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className="relative rounded-full w-full border border-transparent dark:bg-slate-800  bg-slate-800 shadow-input flex justify-evenly items-center space-x-6 px-6 py-1 "
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <a href={href} className="flex space-x-2">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </a>
  );
};

export const HoveredLink = ({
  children,
  ...rest
}: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => {
  return (
    <a {...rest} className="text-white hover:text-blue-500 ">
      {children}
    </a>
  );
};