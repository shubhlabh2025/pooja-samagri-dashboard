import type { OrderDetailMainCardProps } from "@/interfaces/orders";

const PaymentSummaryCard = ({ orderDetails }: OrderDetailMainCardProps) => {
  const subTotal = orderDetails.order_items.reduce((acc, cv) => {
    return acc + cv.mrp * cv.quantity;
  }, 0);
  const totalPrice = orderDetails.order_items.reduce((acc, cv) => {
    return acc + cv.price * cv.quantity;
  }, 0);

  const discount = subTotal - totalPrice;

  let coupounDiscount = orderDetails.order_coupons.reduce((acc, cv) => {
    return acc + cv.discount_amount;
  }, 0);

  coupounDiscount = Math.min(totalPrice, coupounDiscount);

  return (
    <div className="flex flex-col rounded-[12px] bg-white pb-4">
      <div className="flex justify-between border-b border-[#E9E9EB] pt-3 pb-2">
        <p className="text-[16px] text-[#02060c73]">Payment Details</p>
      </div>
      <div className="flex w-full flex-col gap-2 bg-white px-4 pt-3">
        <div className="flex items-center justify-between">
          <p className="line-clamp-1 text-sm leading-4.5 font-extralight -tracking-[0.35px] text-[#02060c99]">
            Item Total
          </p>
          <p className="text-sm leading-4.5 font-normal -tracking-[0.35px] text-[#02060cbf]">
            ₹
            {new Intl.NumberFormat("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(subTotal)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="line-clamp-1 text-sm leading-4.5 font-extralight -tracking-[0.35px] text-[#02060c99]">
            Discount
          </p>
          <p className="text-sm leading-4.5 font-normal -tracking-[0.35px] whitespace-nowrap text-[#1ba672]">
            - ₹
            {new Intl.NumberFormat("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(discount)}
          </p>
        </div>

        {coupounDiscount > 0 && (
          <>
            <div className="my-2 border-t border-dashed border-[#02060c26]" />

            <div className="flex items-center justify-between">
              <p className="line-clamp-1 text-sm leading-4.5 font-extralight -tracking-[0.35px] text-[#02060c99]">
                Promo Code Discount
              </p>
              <p className="text-sm leading-4.5 font-normal -tracking-[0.35px] whitespace-nowrap text-[#1ba672]">
                - ₹
                {new Intl.NumberFormat("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(coupounDiscount)}
              </p>
            </div>
          </>
        )}
        <div className="my-2 border-t border-dashed border-[#02060c26]" />

        <div className="flex items-center justify-between">
          {orderDetails.order_charges.map(({ name, amount }) => (
            <>
              <p className="line-clamp-1 text-sm leading-4.5 font-extralight -tracking-[0.35px] text-[#02060c99]">
                {name}
              </p>
              {amount === 0 ? (
                <p className="text-sm leading-4.5 font-normal -tracking-[0.35px] text-[#1ba672]">
                  FREE
                </p>
              ) : (
                <p className="line-clamp-1 text-sm leading-4.5 font-normal -tracking-[0.35px] whitespace-nowrap text-[#02060cbf]">
                  ₹
                  {new Intl.NumberFormat("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(amount)}
                </p>
              )}
            </>
          ))}
        </div>

        <div className="my-2 border-t border-dashed border-[#02060c26]" />

        <div className="flex items-center justify-between">
          <p className="text-sm leading-4.5 font-semibold -tracking-[0.35px] text-[#02060ceb]">
            Total
          </p>
          <p className="text-sm leading-4.5 font-semibold -tracking-[0.35px] text-[#02060ceb]">
            ₹
            {new Intl.NumberFormat("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(orderDetails.payment_details.amount)}
          </p>
        </div>
        {/* <div className="-mx-4 -mb-4 flex justify-center gap-2 rounded-b-lg bg-[#1ba672bf] px-2 py-1.5">
          <div className="flex aspect-square w-[20px] items-center justify-center p-[1px]">
            <img src={guartIcon} alt="Guard Icon" className="" />
          </div>
          <p className="line-clamp-1 text-sm leading-4.5 font-normal -tracking-[0.35px] text-[#ffffffeb]">
            Trusted, authentic, safe, easy returns
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default PaymentSummaryCard;
