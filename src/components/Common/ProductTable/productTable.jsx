import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // ✅ Make sure useLocation is imported
import Dropdown from 'react-bootstrap/Dropdown';
import Pagination from 'react-bootstrap/Pagination';
import { IoIosSearch, IoIosArrowRoundForward, IoIosArrowRoundBack, IoIosArrowDown } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { PiPencilSimple } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import Product1 from "../../Assets/Images/Products-img/Mask group.svg";
import { GoPlus } from 'react-icons/go';



const ProductTable = () => {
  const Products = Array.from({ length: 15 }, (_, i) => ({
    product_name: 'Hing Powder',
    stock: i === 14 ? 'Out Of Stock' : '74 items left',
    price: '2,499',
    payment: 'Paid',
    category: 'Spice'
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [filterOption, setFilterOption] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const isRajlaxmi = location.pathname.startsWith('/rajlaxmi');
  const addProductLink = isRajlaxmi ? '/rajlaxmi/productinfo' : '/productinfo';

  const filteredProducts = Products.filter((product) => {
    const matchesFilter =
      filterOption === "All" ||
      (filterOption === "In Stock" && product.stock !== "Out Of Stock") ||
      (filterOption === "Out Of Stock" && product.stock === "Out Of Stock") ||
      (filterOption === product.category);

    const matchesSearch =
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filterOption, searchQuery, totalPages, currentPage]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <div className='recent-table bg-white d-flex flex-column'>
        <p className='p-3 recent-tble-header text-murmaid-color bg-light-green-color font-20 inter-font-family-500'>Products</p>

        <form className="row gy-3 px-lg-5 px-3 pb-4 pt-2">
          <div className='col-lg-2'>
            <Dropdown className='border rounded-3'>
              <Dropdown.Toggle variant="white" id="dropdown-basic" className="d-flex justify-content-between align-items-center w-100">
                <span>{filterOption}</span>
                <span className="ms-auto"><IoIosArrowDown /></span>
              </Dropdown.Toggle>
              <Dropdown.Menu className='w-100'>
                <Dropdown.Item onClick={() => setFilterOption("All")}>All</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterOption("In Stock")}>In Stock</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterOption("Out Of Stock")}>Out Of Stock</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className='col-lg-4'>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><IoIosSearch /></span>
              <input
                className="form-control border border-start-0"
                type="search"
                placeholder="Search by Name or Category"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className='col-lg-6 text-end'>
            <NavLink to={addProductLink}>
              <button className={`rounded-3 px-3 py-2 font-12 inter-font-family-400 mb-3 ${isRajlaxmi ? 'add-btn-rajlaxmi' : 'add-btn-gauswarn'}`}>
                <GoPlus className='font-16' /> Add Product
              </button>
            </NavLink>
          </div>
        </form>

        <div className='table-responsive flex-grow-1'>
          <table className="table text-nowrap fixed-table">
            <thead className='text-center'>
              <tr>
                <th className='text-dark-silver-color inter-font-family-500 align-middle ps-5'>
                  <div className='d-flex align-items-center'>
                    <input type="checkbox" className={`custom-checkbox me-3 ${isRajlaxmi ? 'add-btn-rajlaxmi' : 'add-btn-gauswarn'}`} />
                    Product Name
                  </div>
                </th>
                <th className='text-dark-silver-color inter-font-family-500 align-middle'>Price</th>
                <th className='text-dark-silver-color inter-font-family-500 align-middle'>Stock</th>
                <th className='text-dark-silver-color inter-font-family-500 align-middle'>Category</th>
                <th className='text-dark-silver-color inter-font-family-500 align-middle'>Action</th>
              </tr>
            </thead>
            <tbody className='text-center'>
              {paginatedProducts.map((product, index) => (
                <tr key={index}>
                  <td data-label="Product Name" className='text-murmaid-color inter-font-family-400 align-middle ps-5'>
                    <div className='d-flex align-items-center'>
                     <input type="checkbox" className={`custom-checkbox me-3 ${isRajlaxmi ? 'add-btn-rajlaxmi' : 'add-btn-gauswarn'}`} />

                      <img src={Product1} alt="Product" className='mx-2' />
                      {product.product_name}
                    </div>
                  </td>
                  <td data-label="Price" className='text-murmaid-color inter-font-family-400 align-middle'>₹ {product.price}</td>
                  <td data-label="Stock" className='text-murmaid-color inter-font-family-400 align-middle'>{product.stock}</td>
                  <td data-label="Category" className='text-murmaid-color inter-font-family-400 align-middle'>{product.category}</td>
                  <td data-label="Action" className='text-murmaid-color inter-font-family-400 align-middle'>
                    <div className='d-flex align-items-center justify-content-center'>
                      <NavLink to="/productinfo">
                        <span className='border-2 border eye-icon-color fs-5 p-1 rounded-3 d-flex align-items-center justify-content-center'><IoEyeOutline /></span>
                      </NavLink>
                      <NavLink to="/productinfo">
                        <span className='border-2 border edit-icon-color fs-5 p-1 d-flex align-items-center justify-content-center rounded-3 mx-3'><PiPencilSimple /></span>
                      </NavLink>
                      <span
                        className='border-2 border trash-icon-color fs-5 p-1 rounded-3 d-flex align-items-center justify-content-center'
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      ><RiDeleteBinLine /></span>
                    </div>
                  </td>
                </tr>
              ))}

              {Array(itemsPerPage - paginatedProducts.length).fill(null).map((_, i) => (
                <tr key={`empty-${i}`}><td colSpan="4" className="empty_row"></td>
                  <td colSpan="5"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex align-items-center justify-content-left mt-auto mb-3">
          <Pagination className='border-0'>
            <Pagination.Prev
              className='fs-3'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <IoIosArrowRoundBack />
            </Pagination.Prev>
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              className='fs-3'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <IoIosArrowRoundForward />
            </Pagination.Next>
          </Pagination>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <p className="modal-title font-16 inter-font-family-600 text-murmaid-color" id="exampleModalLabel">Delete Items</p>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body inter-font-family-400 text-murmaid-color font-14 pt-0">
              Are you sure you want to delete 4 selected items?
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="font-12 inter-font-family-400 text-murmaid-color border-0 bg-transparent" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="border-0 px-3 py-2 rounded font-12 inter-font-family-500 text-murmaid-color bg-light-green-color">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductTable;
