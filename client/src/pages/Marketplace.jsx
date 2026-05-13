import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    condition: "used",
  });

  // ======================
  // FETCH ITEMS
  // ======================
  const fetchItems = async () => {
    try {
      const res = await API.get("/marketplace");
      setItems(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ======================
  // HANDLE INPUT
  // ======================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ======================
  // CREATE ITEM
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/marketplace", form);

      setItems((prev) => [res.data, ...prev]);

      setForm({
        title: "",
        description: "",
        price: "",
        condition: "used",
      });
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  // ======================
  // 🛒 ADD TO CART
  // ======================
  const handleAddToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find((c) => c._id === item._id);

    if (!exists) {
      cart.push(item);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Added to cart ✅");
    } else {
      alert("Item already in cart ⚠️");
    }
  };

  // ======================
  // 💬 CHAT SELLER (FIXED)
  // ======================
  const handleChatSeller = (item) => {
    const sellerId = item.user?._id || item.user;

    if (!sellerId) {
      console.log("❌ Seller missing:", item.user);
      alert("Seller info not available");
      return;
    }

    navigate(`/chat?sellerId=${sellerId}`);
  };

  // ======================
  // 💳 BUY NOW
  // ======================
  const handleBuy = (item) => {
    alert(`Buying: ${item.title} (Rs. ${item.price})`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Marketplace</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow space-y-3"
      >
        <h2 className="font-semibold">Sell an Item</h2>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="condition"
          value={form.condition}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="new">🆕 New</option>
          <option value="used">Used</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Post Item
        </button>
      </form>

      {/* ITEMS */}
      {items.length === 0 ? (
        <p className="text-gray-500">No items yet</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-xl shadow space-y-2"
            >
              <h2 className="font-semibold text-lg">{item.title}</h2>

              <p className="text-gray-600">{item.description}</p>

              <p className="text-green-600 font-bold">Rs. {item.price}</p>

              <p className="text-sm text-gray-500">
                {item.condition === "new" ? "🆕 New" : "Used"}
              </p>

              <p className="text-sm text-gray-400">
                Seller: {item.user?.name || "User"}
              </p>

              {/* BUTTONS */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => handleBuy(item)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Buy Now
                </button>

                <button
                  onClick={() => handleChatSeller(item)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
