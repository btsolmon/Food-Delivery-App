/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Хуудас ачаалагдахад localStorage-оос датаг сэргээх
  useEffect(() => {
    const savedOrders = localStorage.getItem("adminOrderCache");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // API-аас дата татах
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        localStorage.setItem("adminOrderCache", JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Pagination логик
  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE));
  const currentOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const toggleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === orders.length ? [] : orders.map((o) => o.id),
    );
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    );
    // Энд API дуудаж статус шинэчлэх үйлдлээ хийнэ (PATCH /api/orders/:id)
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-[#333333] font-sans">
      <aside className="w-[240px] bg-white border-r border-neutral-200 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="logo" className="h-[29.18px] w-[36px]" />
            <div>
              <h1 className="font-bold text-base leading-none text-[18px]">
                NomNom
              </h1>
              <span className="text-xs text-neutral-500">Swift delivery</span>
            </div>
          </div>
          <nav className="space-y-6">
            <button
              onClick={() => router.push("/admin")}
              className="w-full flex items-center gap-[10px] text-neutral-500 hover:bg-neutral-100 px-[40px] py-2.5 rounded-3xl font-medium text-sm transition shadow-sm"
            >
              <img src="/dashboardicon.svg" alt="" /> Food menu
            </button>
            <button
              onClick={() => router.push("/admin/orders")}
              className="w-full flex items-center gap-[10px] bg-black text-white px-[40px] py-2.5 rounded-3xl font-medium text-sm transition shadow-sm"
            >
              <img src="/truckicon.svg" alt="" />
              Orders
            </button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-w-[1200px] mx-auto w-full">
        <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Orders</h1>
            <span className="text-sm text-neutral-500">
              {orders.length} items total
            </span>
          </div>

          <div className="grid grid-cols-[40px_80px_160px_120px_150px_100px_1fr_150px] min-w-[1000px] gap-4 px-4 pb-4 border-b border-neutral-100 text-[14px] font-bold text-neutral-400">
            <div>
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={
                  selectedOrders.length === orders.length && orders.length > 0
                }
              />
            </div>
            <div>№</div>
            <div>Customer</div>
            <div>Food</div>
            <div>Date</div>
            <div>Total</div>
            <div className="flex ">Delivery Address</div>
            <div className="text-right"> Delivery State</div>
          </div>

          {currentOrders.map((order: any) => (
            <React.Fragment key={order.id}>
              <div className="grid grid-cols-[40px_80px_160px_120px_150px_100px_1fr_150px] min-w-[1000px] gap-4 items-center px-4 py-6 border-b border-neutral-50 text-sm">
                <div>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() =>
                      setSelectedOrders((prev) =>
                        prev.includes(order.id)
                          ? prev.filter((i) => i !== order.id)
                          : [...prev, order.id],
                      )
                    }
                  />
                </div>
                <div className="font-bold text-neutral-400">
                  #{order.id.slice(-5).toUpperCase()}
                </div>
                <div className="truncate font-medium">
                  {order.buyer?.email || "Anonymous"}
                </div>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() =>
                    setExpandedOrders((prev) =>
                      prev.includes(order.id)
                        ? prev.filter((id) => id !== order.id)
                        : [...prev, order.id],
                    )
                  }
                >
                  {order.items?.length} foods{" "}
                  <span className="text-[10px]">
                    <img src="/chevrondown.svg" alt="" />
                  </span>
                </div>
                <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                <div className="">${(order.totalPrice || 0).toFixed(2)}</div>
                <div className="text-neutral-500 truncate text-xs">
                  {order.address || "No address provided"}
                </div>
                <div className="text-right">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className={`text-[10px] font-bold px-3 py-2 rounded-full cursor-pointer outline-none border transition-all ${
                      order.status === "PENDING"
                        ? "border-red-500 text-red-500 bg-red-50"
                        : order.status === "DELIVERED"
                          ? "border-green-500 text-green-500 bg-green-50"
                          : "border-gray-400 text-gray-400 bg-gray-50"
                    }`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELED">CANCELED</option>
                  </select>
                </div>
              </div>

              {expandedOrders.includes(order.id) && (
                <div className="px-12 py-4 bg-neutral-50 border-b border-neutral-100 min-w-[1000px]">
                  <div className="flex gap-4">
                    {order.items?.map((item: any) => (
                      <div
                        key={item.food.id}
                        className="flex flex-col items-center gap-1 w-20"
                      >
                        <img
                          src={item.food.image}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span className="text-[9px] text-center truncate w-full">
                          {item.food.foodName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Pagination Controls */}
          {orders.length > 0 && (
            <div className="flex justify-end items-center gap-3 mt-8 pb-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-neutral-500 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 disabled:opacity-50 transition-all shadow-sm"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        currentPage === page
                          ? "bg-black text-white shadow-md scale-105"
                          : "bg-white text-neutral-500 border border-neutral-100 hover:bg-neutral-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-neutral-500 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 disabled:opacity-50 transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
