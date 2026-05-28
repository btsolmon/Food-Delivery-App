/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export const AddressModal = ({ onClose }: any) => {
  const [address, setAddress] = useState("");

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Та нэвтэрч орно уу!");
      return;
    }

    try {
      const res = await fetch("/api/users/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address: address }),
      });

      if (!res.ok) throw new Error("Хаяг хадгалж чадсангүй");

      alert("Хаяг амжилттай хадгалагдлаа!");
      onClose(); // Хаах
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-black">
      <div className="bg-white p-6 rounded-2xl w-[460px] space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">
            Please write your delivery address!
          </h2>

          <button
            onClick={onClose}
            className=" text-neutral-400 hover:text-black w-8 h-8 flex items-center justify-center bg-neutral-100 rounded-full transition-colors"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>
        <textarea
          className="w-full border border-gray-300 p-2 rounded-lg text-[14px]"
          placeholder="Please share your complete address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="flex justify-end gap-2 text-[14px]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg "
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Deliver Here
          </button>
        </div>
      </div>
    </div>
  );
};
