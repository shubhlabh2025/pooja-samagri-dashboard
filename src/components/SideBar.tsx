// components/Sidebar/Sidebar.tsx
import { Link } from "react-router-dom";

interface SidebarProps {
  onLinkClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen fixed">
      <div className="p-4 text-lg font-bold">📊 Dashboard</div>
      <nav className="mt-4 space-y-2">
        <Link
          to="/orders"
          className="block px-4 py-2 hover:bg-gray-700"
          onClick={onLinkClick}
        >
          Home
        </Link>
        <Link
          to="/products"
          className="block px-4 py-2 hover:bg-gray-700"
          onClick={onLinkClick}
        >
          Product
        </Link>
        <Link
          to="/category"
          className="block px-4 py-2 hover:bg-gray-700"
          onClick={onLinkClick}
        >
          Category
        </Link>
        <Link
          to="/customers"
          className="block px-4 py-2 hover:bg-gray-700"
          onClick={onLinkClick}
        >
          Customers
        </Link>
        <Link
          to="/configurations"
          className="block px-4 py-2 hover:bg-gray-700"
          onClick={onLinkClick}
        >
          Settings
        </Link>
      </nav>
    </aside>
  );
};
export default Sidebar;
