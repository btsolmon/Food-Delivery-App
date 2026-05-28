/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useContext } from "react"; // useState-ийг энд ашиглахгүй болсон тул хассан
import { CartContext } from "@/context/CartContext";
import { useState } from "react";

export const CartDrawer = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState("Cart");
  // Context-ээс хэрэгтэй функцүүдээ дуудна
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    itemsTotal,
    shipping,
    total,
  } = useContext(CartContext);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[100]" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-[535px] bg-[#333333] z-[101] p-5 shadow-2xl flex flex-col gap-[24px] rounded-l-2xl">
        <h2 className="text-white text-[20px] font-semibold flex gap-3">
          <img src="/shoppingcartwhite.svg" alt="cart" /> Order detail
        </h2>

        <div className="bg-white h-[44px] p-1 rounded-3xl flex">
          <button
            onClick={() => setActiveTab("Cart")}
            className={`flex-1 rounded-3xl text-[18px] font-medium transition ${activeTab === "Cart" ? "bg-[#ff5252] text-white" : "text-gray-500"}`}
          >
            Cart
          </button>
          <button
            onClick={() => setActiveTab("Order")}
            className={`flex-1 rounded-3xl text-[18px] font-medium transition ${activeTab === "Order" ? "bg-[#ff5252] text-white" : "text-gray-500"}`}
          >
            Order
          </button>
        </div>

        {/* 2. АГУУЛГА */}
        <div className="flex-1 bg-white rounded-3xl p-[16px] text-black overflow-y-auto">
          {activeTab === "Cart" ? (
            cartItems.length === 0 ? (
              // Хоосон үеийн загвар (Таны хүссэнээр)
              <>
                <h2 className="text-xl font-bold mb-4">My Cart</h2>
                <div className="bg-gray-100 rounded-xl p-[32px] flex flex-col items-center justify-center gap-2">
                  <img
                    src="/logo.svg"
                    alt="empty"
                    className="w-[61px] h-[50px]"
                  />
                  <h3 className="font-bold text-lg">Your cart is empty</h3>
                  <p className="text-gray-500 text-sm text-center">
                    Hungry? 🍔 Add some delicious dishes to your cart and
                    satisfy your cravings!
                  </p>
                </div>
              </>
            ) : (
              // Бараа нэмэгдсэн үеийн жагсаалт
              <>
                <h2 className="text-xl font-bold mb-4">My Cart</h2>
                {cartItems.map((item: any) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-4 border-b pb-4 mb-4"
                  >
                    <img
                      src={item.image}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.name)}
                          className="text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQuantity(item.name, -1)}
                          className="border px-2 rounded-full"
                        >
                          -
                        </button>
                        <span className="font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.name, 1)}
                          className="border px-2 rounded-full"
                        >
                          +
                        </button>
                        <span className="ml-auto font-bold text-sm">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )
          ) : (
            // Order history хэсэг (Таны хүссэнээр)
            <>
              <h2 className="text-xl font-bold mb-4">Order history</h2>
              <div className="bg-gray-100 rounded-xl p-[32px] flex flex-col items-center justify-center gap-2">
                <img
                  src="/logo.svg"
                  alt="empty"
                  className="w-[61px] h-[50px]"
                />
                <h3 className="font-bold text-lg">No Orders Yet?</h3>
                <p className="text-gray-500 text-sm text-center">
                  🍕 You have not placed any orders yet. Start exploring our
                  menu and satisfy your cravings!
                </p>
              </div>
            </>
          )}
        </div>

        {/* 3. PAYMENT INFO (Динамик үнийн дүнтэй) */}
        <div className="bg-white rounded-3xl p-6">
          <h3 className="font-bold mb-4 text-black text-[20px]">
            Payment info
          </h3>
          <div className="space-y-2 text-[16px] text-gray-600">
            <div className="flex justify-between">
              <span>Items</span>
              <span>${itemsTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="border-t border-dashed border-gray-300 my-2"></div>
            <div className="flex justify-between text-base font-bold text-black">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            className={`w-full py-3 rounded-3xl font-bold mt-6 ${cartItems.length > 0 ? "bg-[#ff5252] text-white" : "bg-[#fcdbd9] text-white cursor-not-allowed"}`}
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};
