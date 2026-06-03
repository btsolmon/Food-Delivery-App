/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable @next/next/no-img-element */
"use client";
import { Container } from "./Container";
import { useState, useEffect } from "react";
import { AddressModal } from "./AddressModal";
import { UserDropdown } from "./UserDropdown";
import { CartDrawer } from "./CartDrawer";

export default function Header() {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("deliveryAddress");
    if (saved) setAddress(saved);

    const handleUpdate = () => {
      setAddress(localStorage.getItem("deliveryAddress") || "");
    };
    window.addEventListener("addressUpdated", handleUpdate);
    return () => window.removeEventListener("addressUpdated", handleUpdate);
  }, []);

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
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="flex justify-center items-center h-9 bg-white rounded-3xl text-sm px-4 gap-1
              cursor-pointer"
            >
              <img src="/locationicon.svg" alt="location" className="" />
              <p className="text-red-500 shrink-0">Delivery address:</p>
              <p className="text-gray-500 truncate max-w-[150px]">
                {address || "Add Location"}
              </p>
              <img src="/chevronright.svg" alt="location" className="" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-9 h-9 bg-white rounded-3xl cursor-pointer"
            >
              <img src="/shoppingcart.svg" alt="shopping cart" />
            </button>

            {/* ЗӨВ БҮТЭЦ: Dropdown-ыг товчлуурын дотор биш, гадна нь relative контейнерт хийнэ */}
            <div className="relative z-[100] ">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-9 h-9 bg-red-500 rounded-3xl cursor-pointer flex items-center justify-center"
              >
                <img src="/user.svg" alt="user" />
              </button>

              {isUserMenuOpen &&
                (localStorage.getItem("token") ? (
                  <UserDropdown onClose={() => setIsUserMenuOpen(false)} />
                ) : (
                  <div className="absolute top-12 right-0 p-4 bg-white rounded-xl shadow-lg">
                    <a
                      href="/login"
                      className="text-sm font-bold text-black rounded-3xl bg-gray-100 hover:bg-gray-200 px-4 py-2"
                    >
                      Login
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Container>

      {isAddressModalOpen && (
        <AddressModal onClose={() => setIsAddressModalOpen(false)} />
      )}

      {isCartOpen && <CartDrawer onClose={() => setIsCartOpen(false)} />}
    </header>
  );
}
