"use client";

import Image from "next/image";
import React from "react";
import { openModal } from "../redux/features/modalSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();

  return (
    <nav className="nav">
      <div className="nav__wrapper">
        <figure className="nav__img--mask">
          <Image className="nav__img" src="/logo.png" alt="logo" width={600} height={600}/>
        </figure>
        <ul className="nav__list--wrapper">
          <li className="nav__list nav__list--login"
            onClick={() => dispatch(openModal("login"))}
          >
            Login
          </li>
          <li className="nav__list nav__list--mobile">About</li>
          <li className="nav__list nav__list--mobile">Contact</li>
          <li className="nav__list nav__list--mobile">Help</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
