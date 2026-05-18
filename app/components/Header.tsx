/* eslint-disable @next/next/no-img-element */
import { Container } from "./Container";


export default function Header() {
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
        <button className="w-62.75 h-9 bg-white rounded-3xl text-sm ">Delivery address: Add Location</button>
        <button className="w-9 h-9 bg-white rounded-3xl cursor-pointer">
            <img src="/shoppingcart.svg" alt="shopping cart" />
        </button>
        <button className="w-9 h-9 bg-red-500 rounded-3xl cursor-pointer">
            <img src="/user.svg" alt="user" />
        </button>
      </div>
    </div>
  </Container>
</header>
  );
}