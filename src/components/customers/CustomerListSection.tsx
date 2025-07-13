import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchUsers } from "@/slices/userSlice";
import {
  selectUsers,
  selectUserPagination,
  selectUserStatus,
} from "@/slices/userSlice";
import userAvatar from "../../assets/user.png";

const DEBOUNCE_MS = 300;

const CustomerListSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const pagination = useAppSelector(selectUserPagination);
  const status = useAppSelector(selectUserStatus);

  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(
      fetchUsers({ page: currentPage, pageSize: 10, phone_number: query }),
    );
  }, [dispatch, currentPage, query]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQuery(searchText.trim());
      setCurrentPage(1); // reset to page 1 on new search
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounce);
  }, [searchText]);

  const totalPages = pagination?.totalPages || 1;
  const pageButtons = [...Array(Math.min(5, totalPages)).keys()].map(
    (i) => i + 1,
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b px-6 py-4 text-lg border-l-4 border-blue-500 flex items-center justify-between">
        <span className="font-semibold text-gray-800">
          Customer Details ({pagination?.totalItems || 0})
        </span>
        <input
          ref={inputRef}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by Phone Number"
          className="border p-2 rounded text-sm"
        />
      </div>

      {/* Loading */}
      {status === "loading" ? (
        <div className="p-6 text-center text-gray-500">
          Loading customers...
        </div>
      ) : (
        <>
          {/* List */}
          <div className="divide-y">
            {users.length === 0 ? (
              <div className="px-6 py-4 text-gray-500 text-sm text-center">
                No customers found
              </div>
            ) : (
              users.map((user) => (
                <Link
                  to={`/customerDetails/${user.phone_number.replace(
                    "+91",
                    "",
                  )}`}
                  key={user.id}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 hover:bg-blue-50 gap-3">
                    <div className="flex items-center gap-4">
                      <img
                        src={userAvatar}
                        alt={user.first_name || "Customer"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {user.first_name || user.phone_number || "Unnamed"}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                          9 order(s), Total Amount - Rs. 3999
                          {/* Replace with real order count/amount if available */}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex gap-2 justify-center py-4">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>
              {pageButtons.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerListSection;
