import React from "react";
import "./customer.css"; // Importing the component-specific stylesheet

// CustomerInfoForm component definition
const CustomerInfoForm = ({ CustomerInfoData }) => {
  console.log("CustomerInfoData: ", CustomerInfoData);

  return (
    <div className="info-form-container bg-light-cream-color">
      {/* Header section of the form */}
      <div className="form-header bg-light-green-color inter-font-family-600 font-16 text-drak-blue-color">
        Customers Information
      </div>

      {/* Main form body */}
      <form className="info-form-body inter-font-family-400 font-14">
        {/* Section: Basic Information */}
        <section>
          <h4>Basic Information</h4>
          <div className="form-row">
            {/* First and Last Name inputs */}
            <input
              disabled
              type="text"
              placeholder="Full Name"
              value={CustomerInfoData?.user_name}
            />
          </div>
          <div className="form-row">
            {/* Email and Phone Number input disableds */}
            <input
              disabled
              type="email"
              placeholder="Email"
              value={CustomerInfoData?.user_email}
            />
            <input
              disabled
              type="tel"
              placeholder="Phone Number"
              value={CustomerInfoData?.user_mobile_num}
            />
          </div>
        </section>

        {/* Section: Customer's Address */}
        <section>
          <h4>Customers Address</h4>
          <div className="form-row">
            {/* Address and Apartment input disableds */}
            <input
              value={CustomerInfoData?.user_house_number}
              disabled
              type="text"
              placeholder="Address"
            />
            <input
              value={CustomerInfoData?.user_landmark}
              disabled
              type="text"
              placeholder="Apartment"
            />
          </div>
          <div className="form-row">
            {/* City, Country, and Code input disableds */}
            <input
              value={CustomerInfoData?.user_city}
              disabled
              type="text"
              placeholder="City"
            />
            <input
              value={CustomerInfoData?.user_country}
              disabled
              type="text"
              placeholder="Country"
            />
            <input
              value={CustomerInfoData?.user_pincode}
              disabled
              type="text"
              placeholder="Code"
            />
          </div>
          <div className="form-row">
            {/* Extra Phone Number input disabled (optional) */}
            <input
              value={CustomerInfoData?.user_mobile_num}
              disabled
              type="text"
              placeholder="Phone No."
            />
          </div>
        </section>
      </form>
    </div>
  );
};

export default CustomerInfoForm;
