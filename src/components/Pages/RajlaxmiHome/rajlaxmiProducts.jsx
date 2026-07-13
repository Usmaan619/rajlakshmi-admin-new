import React from 'react'
import Navbar from '../../Common/Navbar/navbar';
import Sidebar from '../../Common/SideBar/sidebar';
import ProductTable from '../../Common/ProductTable/productTable';
 

const RajlaxmiProducts = () => {
    return (
        <div>
            <div className='container-fluid bg-light-cream-color vh-100'>
                <Navbar />
                <div className='row'>
                    <div className='col-lg-2'>
                        <Sidebar />
                    </div>

                    <div className='col-lg-10 px-lg-5'>
                        {/* <p className='inter-font-family-500 font-20 text-drak-blue-colo'>Navbar</p> */}
                        <ProductTable />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RajlaxmiProducts;