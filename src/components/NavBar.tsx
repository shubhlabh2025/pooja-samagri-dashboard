// components/Navbar/Navbar.tsx

import { Bell, Mail } from "lucide-react";

const Navbar = () => (
  <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
    <h1 className="text-xl font-semibold"> Dashboard</h1>
    <div className="space-x-4">
      <button>
        <Bell />
      </button>
      <button>
        <Mail />
      </button>
    </div>
  </header>
);
export default Navbar;
