import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Chat from "./pages/Chat";
import Users from "./pages/Users";
import Notifications from "./pages/Notifications";
import SinglePost from "./pages/SinglePost";
import Marketplace from "./pages/Marketplace";
import Cart from "./pages/Cart";
import Assignments from "./pages/Assignments";
import CreateAssignment from "./pages/CreateAssignment";
import AIChat from "./pages/AIChat";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/users" element={<Users />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/post/:id" element={<SinglePost />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/create-assignment" element={<CreateAssignment />} />
            <Route path="/ai-chat" element={<AIChat />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
