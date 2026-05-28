"use client";
import { useState } from "react";
import { ProductModal } from "./ProductModal";
import Image from "next/image";
import { Toast } from "./Toast";

export type Product = {
  name: string;
  description: string;
  price: string;
  image: string;
};

export function ProductCard({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    // 1. Сагсанд нэмэх логик
    // ... addToCart(product) ...

    // 2. Notification-ыг харуулах
    setShowToast(true);

    // 3. 3 секундын дараа автоматаар хаах
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <>
      <article className="flex flex-col gap-5 rounded-[20px] bg-white p-4">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            type="button"
            aria-label={`Add ${product.name} to cart`}
            className="absolute right-5 bottom-5 flex size-11 items-center justify-center rounded-full bg-white text-red-500 shadow-sm transition hover:scale-120 cursor-pointer"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="size-4"
              aria-hidden="true"
            >
              <path
                d="M8 3v10M3 8h10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <h3 className="flex-1 text-[24px] font-semibold leading-8 tracking-tight text-red-500">
              {product.name}
            </h3>
            <span className="text-[18px] font-semibold leading-7 text-black">
              {product.price}
            </span>
          </div>
          <p className="text-sm leading-5 text-black">{product.description}</p>
        </div>
      </article>
      {isModalOpen && (
        <ProductModal
          product={product}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleAddToCart}
        />
      )}
      {showToast && <Toast message={`${product.name} сагсанд нэмэгдлээ!`} />}
    </>
  );
}
