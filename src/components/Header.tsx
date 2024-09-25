"use client";

import React from "react";
import Image from "next/image";
import NavBar from "./NavBar";
import { links } from "@/data/nav_link";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-bianco p-0 m-0">
      <div className="container mx-auto flex flex-row md:flex-row justify-between items-center">
        <div className="flex items-center ml-20">

          <Link href={"/"}>

            <Image
              src="/siclipulse-02.svg"
              alt="Logo"
              width={200}
              height={50}
              className="my-2"
            />
          </Link>
        </div>
        <NavBar links={links} />
      </div>
      <div className="w-full border border-rosso"></div>
    </header>
  );
};

export default Header;
