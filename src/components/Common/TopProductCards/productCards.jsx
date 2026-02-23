import React from "react";
import "./productCards.css";
import Product1 from "../../Assets/Images/topProduct/jaggeryt.svg"; // Importing sample product image

// Sample list of top products with repeated dummy data
const products = [
  {
    id: 1,
    name: "Organic Jaggery Powder",
    price: "₹ 54.00",
    qty: "500gm",
    image: Product1,
  },
  {
    id: 2,
    name: "Organic Jaggery Powder",
    price: "₹ 54.00",
    qty: "500gm",
    image: Product1,
  },
  {
    id: 3,
    name: "Organic Jaggery Powder",
    price: "₹ 54.00",
    qty: "500gm",
    image: Product1,
  },
  {
    id: 4,
    name: "Organic Jaggery Powder",
    price: "₹ 54.00",
    qty: "500gm",
    image: Product1,
  },
  {
    id: 5,
    name: "Organic Jaggery Powder",
    price: "₹ 54.00",
    qty: "500gm",
    image: Product1,
  },
];

// Functional component to display product cards
const ProductCards = () => {
  return (
    <div>
      {/* Section title */}
      <h2 className="inter-font-family-600 font-20 text-drak-blue-color">
        Top Products
      </h2>

      {/* Grid row for cards */}
      <div className="row gy-4 pt-2">
        {/* Mapping through products to create individual cards */}
        {products.map((product) => (
          <div className="top-product">
            <div
              className="top-product-card"
              key={product.id}
            >
              {/* Product image */}
              <img
                src={product.image}
                alt={product.name}
                className="top-product-image"
              />

              {/* Product title */}
              <h4 className="product-title inter-font-family-500 font-14 text-gray-color px-2">
                {product.name}
              </h4>

              {/* Product price and quantity info */}
              <div className="product-details inter-font-family-400 font-12 px-2">
                <p>
                  Price<br />
                  <strong>{product.price}</strong>
                </p>
                <p>
                  Qty<br />
                  <strong>{product.qty}</strong>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCards;
