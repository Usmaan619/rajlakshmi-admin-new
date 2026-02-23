import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from '../../Common/Navbar/navbar';
import Sidebar from '../../Common/SideBar/sidebar';
import OrderTable from '../../Common/OrderTable/ordertable';

import noDataImg from '../../Assets/Images/home-img/flat-design-no-data-illustration.png'; // Adjust if needed

const RajlaxmiOrder = () => {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/orders') // 🟡 Replace with actual API
      .then((res) => setOrderData(res.data))
      .catch((err) => {
        console.error('Order fetch failed:', err);
        setOrderData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const orderHeadings = [
    'Order ID',
    'Customer Name',
    'Order Date',
    'Total Amount',
    'Payment Status',
    'Order Status',
  ];

  return (
    <div className="container-fluid bg-light-cream-color">
      <Navbar />

      <div className="row py-2">
        <div className="col-lg-2">
          <Sidebar />
        </div>

        <div className="col-lg-10 px-lg-5 position-relative">
          {/* Table always visible */}
          <OrderTable data={orderData} headings={orderHeadings} />

        </div>
      </div>
    </div>
  );
};

export default RajlaxmiOrder;
