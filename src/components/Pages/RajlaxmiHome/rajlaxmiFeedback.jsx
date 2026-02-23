import React, { useState, useEffect } from 'react';
import Sidebar from '../../Common/SideBar/sidebar';
import FeedbackCard from '../../Common/feedbackCard/feedbackcard';
import Navbar from '../../Common/Navbar/navbar';
import noDataImg from '../../Assets/Images/home-img/flat-design-no-data-illustration.png'; // Adjust path if needed

const RajlaxmiFeedback = () => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    setProductData([]); // Simulating no data
    setProductData([{ id: 1, feedback: 'Great!' },{ id: 1, feedback: 'Great!' },{ id: 1, feedback: 'Great!' },{ id: 1, feedback: 'Great!' },{ id: 1, feedback: 'Great!' },{ id: 1, feedback: 'Great!' },{ id: 1, feedback: 'Great!' },{ id: 1, feedback: 'Great!' }]); // Use this to simulate data
  }, []);

  return (
    <div className='container-fluid bg-light-cream-color min-vh-100'>
      <Navbar title="Rajlaxmi Dashboard" />
      <div className='row py-2'>
        <div className='col-lg-2'>
          <Sidebar />
        </div>

       <div className="col-lg-10 px-lg-5 ">
          {productData.length === 0 ? (
            <div className="no-data text-center d-flex flex-column align-items-center">
              <img src={noDataImg} alt="No Data" className="no-data-img rounded-3" />
              <h3 className="mt-3">No Records Found</h3>
            </div>
          ) : (
            <FeedbackCard data={productData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RajlaxmiFeedback;
