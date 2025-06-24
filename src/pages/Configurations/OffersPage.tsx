import OffersListSection from "@/components/Offers/OffersListSection";
import { useNavigate } from "react-router";

const OffersPage = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-row items-center justify-between px-1">
        <h2 className="text-2xl font-semibold text-gray-800">Offers</h2>
        <div
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
          onClick={() => {
            navigate("/createOffers");
          }}
        >
          <span>+ Add Offers</span>
        </div>
      </div>

      <OffersListSection />

      {/* Modal */}
    </div>
  );
};

export default OffersPage;
