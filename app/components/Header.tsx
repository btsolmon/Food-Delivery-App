/* eslint-disable @next/next/no-img-element */
"use client";
import { Container } from "./Container";
import { useState } from "react";
import { AddressModal } from "./AddressModal";
import { UserDropdown } from "./UserDropdown";

export default function Header() {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="w-full h-17 bg-black">
      <Container className="h-full">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src="/logo.svg" alt="logo" className="h-[37.29px] w-[46px]" />
            <div className="flex flex-col justify-center gap-1">
              <img src="logoname.svg" alt="logo name" className="h-auto w-22" />
              <p className="text-sm text-white">Swift delivery</p>
            </div>
          </div>

          <div className="flex gap-3.5">
            <input
              readOnly
              onClick={() => setIsAddressModalOpen(true)}
              className="w-62.75 h-9 bg-white rounded-3xl text-sm px-4 cursor-pointer"
              placeholder="Delivery address: Add Location"
            />
            <button className="w-9 h-9 bg-white rounded-3xl cursor-pointer">
              <img src="/shoppingcart.svg" alt="shopping cart" />
            </button>

            {/* ЗӨВ БҮТЭЦ: Dropdown-ыг товчлуурын дотор биш, гадна нь relative контейнерт хийнэ */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-9 h-9 bg-red-500 rounded-3xl cursor-pointer flex items-center justify-center"
              >
                <img src="/user.svg" alt="user" />
              </button>

              {isUserMenuOpen && (
                <UserDropdown onClose={() => setIsUserMenuOpen(false)} />
              )}
            </div>
          </div>
        </div>
      </Container>

      {isAddressModalOpen && (
        <AddressModal onClose={() => setIsAddressModalOpen(false)} />
      )}
    </header>
  );
}
