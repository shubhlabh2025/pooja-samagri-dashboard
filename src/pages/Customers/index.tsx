import type { FC } from "react";
import CustomerListSection from "@/components/customers/CustomerListSection";


const CustomerPage: FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-row items-center justify-between px-1">
        <h2 className="text-2xl font-semibold text-gray-800">Customers</h2>
        
      </div>

      {/* Charts Section */}
      <CustomerListSection></CustomerListSection>
    </div>
  );
};

export default CustomerPage;
