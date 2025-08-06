import React, { useState, useEffect, useRef } from "react";
import { Trash2, Search, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchCoupons, deleteCouponById } from "../../slices/offerSlice";
import { ProductSkeleton } from "../loadingSkeletons/productSkeleton";
import { ErrorMessage } from "../Common/ErrorMessage";
import DismissDialog from "../Common/DismissDialog";
import percentageIcon from "../../assets/percentage.svg";
import flatIcon from "../../assets/rupees.svg";
import { useNavigate } from "react-router";

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 200;

const OffersListSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { coupons, loading, error } = useAppSelector((state) => state.offers);

  const [currentPage, setCurrentPage] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchText.trim());
      setCurrentPage(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    dispatch(
      fetchCoupons({ page: currentPage, pageSize: PAGE_SIZE, q: query })
    );
  }, [dispatch, currentPage, query]);

  useEffect(() => {
    if (showSearch && inputRef.current) inputRef.current.focus();
  }, [showSearch]);

  const displayedCoupons = Array.isArray(coupons) ? coupons : [];

  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b px-6 py-4 text-lg border-l-4 border-blue-500 flex items-center justify-between">
        <span className="font-semibold text-gray-800">Our Offers</span>
        <div className="flex gap-2">
          {!showSearch && (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 rounded bg-gray-100 hover:bg-blue-100 text-blue-600"
              title="Search Offers"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {showSearch && (
        <div className="flex gap-2 px-6 py-2 bg-gray-50 border-b">
          <input
            ref={inputRef}
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search offers by code..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded focus:outline-none"
          />
          {searchText && (
            <button
              type="button"
              onClick={() => setSearchText("")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setShowSearch(false);
              setSearchText("");
            }}
            className="p-2 bg-gray-100 rounded hover:bg-gray-200"
            title="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading && (
        <div>
          {[...Array(6)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}
      {error && <ErrorMessage message={error} />}

      {/* Offers List */}
      <div className="divide-y">
        {displayedCoupons.map((coupon) => (
          <div
            key={coupon.id}
            onClick={() => {
              navigate(`/updateOffer/${coupon.id}`);
            }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 hover:bg-blue-50 gap-3 group"
          >
            <div className="flex-1 flex items-center gap-3">
              <img
                src={
                  coupon.discount_type === "percentage"
                    ? percentageIcon
                    : flatIcon
                }
                alt="Coupon"
                className="aspect-square w-[23px] rounded-[8px] bg-[#FF5200] p-[3px]"
              />
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  {coupon.offer_code}
                </div>
                <div className="text-xs text-gray-500">
                  Valid: {new Date(coupon.start_date).toLocaleDateString()} -{" "}
                  {new Date(coupon.end_date).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="text-red-600 hover:text-red-800"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedCouponId(coupon.id);
                  setShowDialog(true);
                }}
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      <DismissDialog
        open={showDialog}
        title="Delete Offer"
        message="Are you sure you want to delete this offer?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (selectedCouponId) dispatch(deleteCouponById(selectedCouponId));
          setShowDialog(false);
          setSelectedCouponId(null);
        }}
        onCancel={() => setShowDialog(false)}
      />
    </div>
  );
};

export default OffersListSection;
