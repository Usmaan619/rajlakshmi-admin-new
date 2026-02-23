import React from 'react';
import Sidebar from '../../Common/SideBar/sidebar';
import Navbar from '../../Common/Navbar/navbar';
import ProductForm from '../../Common/ProductForm/productForm';

const RajlaxmiProductInfo = () => {
    return (
        <>
            <div className='container-fluid px-0 bg-light-cream-color'>
                <Navbar />
                <div className='row'>
                    <div className='col-lg-2'>
                        <Sidebar />
                    </div>
                    <div className='col-lg-10 px-lg-5'>
                        {/* Show ProductForm with only "Ghee" category */}
                        <ProductForm  />
                    </div>
                </div>
            </div>
        </>
    );
};

export default RajlaxmiProductInfo;
