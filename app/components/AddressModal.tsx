/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export const AddressModal = ({ onClose }: any) => {
  const [address, setAddress] = useState("");

  const handleSave = async () => {
    // Энд API дуудаж хаягаа хадгална (fetch("/api/user/address", ...))
    console.log("Saving address:", address);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[460px] space-y-4">
        <h2 className="font-bold text-lg">
          Please write your delivery address!
        </h2>
        <textarea
          className="w-full border p-2 rounded-lg"
          placeholder="Please share your complete address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
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
