/* eslint-disable @typescript-eslint/no-explicit-any */
export const UserDropdown = ({ onClose }: any) => {
  return (
    <div className="absolute top-12 right-0 bg-white shadow-xl rounded-xl p-4 w-48 text-black z-50">
      <p className="text-sm font-medium mb-2">user@example.com</p>
      <button
        onClick={() => {
          /* Logout логик */
        }}
        className="text-red-500 text-sm font-bold"
      >
        Sign Out
      </button>
    </div>
  );
};
