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
              value={CustomerInfoData?.full_name}
            />
          </div>
          <div className="form-row">
            {/* Email and Phone Number input disableds */}
            <input
              disabled
              type="email"
              placeholder="Email"
              value={CustomerInfoData?.email}
            />
            <input
              disabled
              type="tel"
              placeholder="Phone Number"
              value={CustomerInfoData?.mobile_number}
            />
          </div>
        </section>

        {/* Section: Customer's Addresses */}
        <section>
          <h4>Customer's Addresses</h4>
          {CustomerInfoData?.addresses && CustomerInfoData.addresses.length > 0 ? (
            CustomerInfoData.addresses.map((addr, index) => (
              <div key={addr.id || index} className="address-card mb-4 p-3 border rounded">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 fw-bold">Address {index + 1} {addr.is_default === 1 && <span className="badge bg-primary ms-2">Default</span>}</h6>
                  {addr.full_name && <span className="text-muted small">Recipient: {addr.full_name}</span>}
                </div>
                <div className="form-row">
                  <input
                    value={addr.address_line1}
                    disabled
                    type="text"
                    placeholder="Address Line 1"
                  />
                  <input
                    value={addr.address_line2}
                    disabled
                    type="text"
                    placeholder="Address Line 2"
                  />
                </div>
                <div className="form-row">
                  <input
                    value={addr.city}
                    disabled
                    type="text"
                    placeholder="City"
                  />
                  <input
                    value={addr.state}
                    disabled
                    type="text"
                    placeholder="State"
                  />
                </div>
                <div className="form-row">
                  <input
                    value={addr.country}
                    disabled
                    type="text"
                    placeholder="Country"
                  />
                  <input
                    value={addr.pincode}
                    disabled
                    type="text"
                    placeholder="Pincode"
                  />
                </div>
                {addr.phone && (
                  <div className="form-row">
                    <input
                      value={addr.phone}
                      disabled
                      type="text"
                      placeholder="Address Contact"
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <>
              <div className="form-row">
                <input
                  value={CustomerInfoData?.address_line1}
                  disabled
                  type="text"
                  placeholder="Address Line 1"
                />
                <input
                  value={CustomerInfoData?.address_line2}
                  disabled
                  type="text"
                  placeholder="Address Line 2"
                />
              </div>
              <div className="form-row">
                <input
                  value={CustomerInfoData?.city}
                  disabled
                  type="text"
                  placeholder="City"
                />
                <input
                  value={CustomerInfoData?.state}
                  disabled
                  type="text"
                  placeholder="State"
                />
              </div>
              <div className="form-row">
                <input
                  value={CustomerInfoData?.country}
                  disabled
                  type="text"
                  placeholder="Country"
                />
                <input
                  value={CustomerInfoData?.pincode}
                  disabled
                  type="text"
                  placeholder="Pincode"
                />
              </div>
            </>
          )}
        </section>
      </form>
    </div>
  );
};

export default CustomerInfoForm;
