// import React from "react";

// // Import customer image
// import User from "../../Assets/Images/customer-img/user.jpg";

// // CustomerCards component
// const CustomerCards = ({ CustomerCardData }) => {
//   
  
//   return (
//     <div className="customer-cards-row">
//       {/* Map through each customer card */}
//       {CustomerCardData?.map((items, index) => {
//         const totalOrder = CustomerCardData?.filter(
//           (card) => card?.user_mobile_num === items?.user_mobile_num && card?.user_email === items?.user_email && card?.user_name === items?.user_name

//         );
//         

//         return (
//           <div
//             key={index}
//             className="customer-card box-shadow border-orange bg-white p-2 my-3"
//           >
//             <div className="row gx-0">
//               {/* Image column */}
//               <div className="col-lg-3 col-3 d-flex align-items-center">
//                 <div className="customer-img">
//                   <img src={User} alt="Loading" />
//                 </div>
//               </div>

//               {/* Customer details column */}
//               <div className="col-lg-9 col-9 px-3">
//                 {/* Customer name */}
//                 <p className="mb-0 font-14 inter-font-family-500 text-murmaid-color">
//                   {items?.user_name}
//                 </p>

//                 {/* Customer email */}
//                 <p className="font-10 inter-font-family-400 text-dark-silver-color mb-lg-4 mb-2">
//                   {items?.user_email}
//                 </p>

//                 {/* Orders and total purchase info */}
//                 <div className="d-flex justify-content-between flex-wrap align-items-center">
//                   <p className="font-12 text-dark-silver-color d-flex align-items-center inter-font-family-300 mb-0">
//                     No. Of Orders
//                     <span className="text-murmaid-color inter-font-family-600 mb-0">
//                       {" "}
//                       {totalOrder?.length}
//                     </span>
//                   </p>

//                   <p className="font-12 text-dark-silver-color d-flex align-items-center inter-font-family-300 mb-0">
//                     Total Purchase
//                     <span className="text-murmaid-color inter-font-family-400 font-14 mb-0">
//                       {" "}
//                       ₹ {items.user_total_amount}
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default CustomerCards;



import React from "react";
import User from "../../Assets/Images/customer-img/user.jpg";

const CustomerCards = ({ CustomerCardData }) => {
  console.log('CustomerCardData: ', CustomerCardData);
  // Group orders by unique key (mobile + email)
  const groupedData = [];

  CustomerCardData?.forEach((item) => {
    const uniqueKey = `${item.user_mobile_num}-${item.user_email}`;
    const existing = groupedData.find((user) => user.key === uniqueKey);
    console.log('existing: ', existing);

    if (existing) {
      existing.user_total_amount += item.user_total_amount; // Correct field
      existing.orders.push(item);
    } else {
      groupedData.push({
        key: uniqueKey,
        user_name: item.user_name,
        user_email: item.user_email,
        user_mobile_num: item.user_mobile_num,
        user_total_amount: item.user_total_amount, // Initialize with user_total_amount
        orders: [item],
      });
    }
  });

  // Sort descending by total purchase and pick top 5
  const topCustomers = groupedData
    .sort((a, b) => b.user_total_amount - a.user_total_amount)
    .slice(0, 5);

  return (
    <div className="customer-cards-row">
      {topCustomers.map((customer, index) => (
        <div
          key={index}
          className="customer-card box-shadow border-orange bg-white p-2 my-3"
        >
          <div className="row gx-0">
            <div className="col-lg-3 col-3 d-flex align-items-center">
              <div className="customer-img">
                <img src={User} alt="Customer" />
              </div>
            </div>

            <div className="col-lg-9 col-9 px-3">
              <p className="mb-0 font-14 inter-font-family-500 text-murmaid-color">
                {customer.user_name}
              </p>
              <p className="font-10 inter-font-family-400 text-dark-silver-color mb-lg-4 mb-2">
                {customer.user_email}
              </p>

              <div className="d-flex justify-content-between flex-wrap align-items-center">
                <p className="font-12 text-dark-silver-color d-flex align-items-center inter-font-family-300 mb-0">
                  No. Of Orders
                  <span className="text-murmaid-color inter-font-family-600 mb-0">
                    &nbsp;{customer.orders.length}
                  </span>
                </p>
                <p className="font-12 text-dark-silver-color d-flex align-items-center inter-font-family-300 mb-0">
                  Total Purchase
                  <span className="text-murmaid-color inter-font-family-400 font-14 mb-0">
                    &nbsp;₹ {customer.user_total_amount}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerCards;

