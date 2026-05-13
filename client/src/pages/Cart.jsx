import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your Cart</h1>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        cart.map((item) => (
          <div
            key={item._id}
            className="bg-white p-4 rounded shadow flex justify-between"
          >
            <div>
              <h2>{item.title}</h2>
              <p>Rs. {item.price}</p>
            </div>

            <button
              onClick={() => removeItem(item._id)}
              className="bg-red-500 text-white px-3 rounded"
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}
