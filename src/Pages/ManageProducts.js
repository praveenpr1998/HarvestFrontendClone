import React, { Component } from 'react';
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader} from 'mdbreact';
import AdminNavbar from "./AdminNavbar";
import '../Resources/Styling/ManageProducts.css';
import { Spinner } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GLOBAL = require('../global');
let _ = require('lodash');

class ManageProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            groupedProducts: {},
            categories: [],
            products: [],
            catList: [],
            modal: false,
            addProductModal: false,
            editId: '',
            editName: '',
            editImage: '',
            editCategory: '',
            editPrice: '',
            editPricePerUnit: 0,
            addName: '',
            addImage: '',
            addCategory: '',
            addPrice: 'Kg',
            addPricePerUnit: 0,
            productsEmpty: true,
        };
    };

    // Redering Methods
    // Render Products
    products = () => {
        if(this.state.loading) {
            return(
                <Spinner animation="border" variant="success" />
            );
        } else {
            return(
                Object.keys(this.state.groupedProducts).map((key) => {
                    return(
                        <div className='product-section'>
                                    <span className='category-title-text'>
                                        { key }:
                                    </span>
                            <table className='products-table'>
                                <tr>
                                    <th >Name</th>
                                    <th >Price Unit</th>
                                    <th >Price Per Unit</th>
                                    <th>Options</th>
                                </tr>
                                {
                                    this.state.groupedProducts[key].map((product) => {
                                        return(
                                            <tr>
                                                <td className='t-name-column'>{ product.name }</td>
                                                <td className='t-priceUnit-column'>{ product.price }</td>
                                                <td className='t-pricePerUnit-column'>{ product.pricePerUnit}</td>
                                                <td
                                                    className='t-options-column-edit'
                                                    onClick={() => this.toggleModalEdit(product)}
                                                >
                                                    Edit
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </table>
                        </div>
                    )
                })
            );
        }
    };

    // Non-Rendering Methods
    // Edit Product Method
    editProduct = () => {
        if(this.state.editName === '' ||
            this.state.editName === '' ||
            this.state.editName === '' ||
            this.state.editName === '' ||
            this.state.editName === ''
        ) {
            toast.error(' Please Fill All the details', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else if(isNaN(this.state.editPricePerUnit)) {
            toast.error('Price Per Unit must be a Number', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else {

        fetch(GLOBAL.BASE_URL+'products/editProduct', {
            method: 'PATCH',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.editId,
                name: this.state.editName,
                category: this.state.editCategory,
                image: this.state.editImage,
                price: this.state.editPrice,
                pricePerUnit: this.state.editPricePerUnit
            })
        })
                .then(res => res.json())
                .then(
                    (result) => {
                        if(result.status === 200) {
                            this.toggleModal();
                            this.componentDidMount();
                        }
                        toast.success(' Product Details Updated', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                    },
                    (error) => {
                        console.log('ERROR editing::', error)
                    }
                );
        }
    };

    // Delete Product Method
    deleteProduct = () => {
        fetch(GLOBAL.BASE_URL+'products/deleteProduct', {
            method: 'DELETE',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.editId,
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.status === 200) {
                        this.toggleModal();
                        this.componentDidMount();
                    }
                    toast.error(' Product Deleted', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                },
                (error) => {
                    console.log('ERROR deleting::', error)
                }
            );
    };

    // Add Product Method
    addProduct = () => {
        if(this.state.addName === '' ||
            this.state.addCategory === '' ||
            this.state.addPrice === '' ||
            this.state.addPricePerUnit === '' ||
            this.state.addImage === ''
        ) {
            toast.error(' Please Fill All the details', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else if(isNaN(this.state.addPricePerUnit)) {
            toast.error('Price Per Unit must be a Number', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else {

        fetch(GLOBAL.BASE_URL+'products/createProduct', {
            method: 'POST',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: this.state.addName,
                category: this.state.addCategory,
                image: this.state.addImage,
                price: this.state.addPrice,
                pricePerUnit: this.state.addPricePerUnit,
                sellers: []
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        addName: '',
                        addImage: '',
                        addCategory: '',
                        addPrice: 'Kilogram',
                        addPricePerUnit: 0,
                    });
                    if(result.status === 200) {
                        this.toggleAddModal();
                        this.componentDidMount();
                    }
                    toast.error('Product Added', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                },
                (error) => {
                    this.setState({
                        addName: '',
                        addImage: '',
                        addCategory: '',
                        addPrice: 'Kilogram',
                        addPricePerUnit: 0,
                    });
                    console.log('ERROR deleting::', error)
                }
            );
        }
    };

    // Toggling the Bootstrap modal - Add Product Modal
    toggleAddModal = () => {
        this.setState({
            addProductModal: !this.state.addProductModal,
        });
    };

    // Toggling the Bootstrap modal - Edit Product Modal
    toggleModal = () => {
        this.setState({
            modal: !this.state.modal,
            editName: '',
            editCategory: '',
            editImage: '',
            editPrice: '',
            editPricePerUnit: 0,
        });
    };

    // Toggling the Bootstrap modal - When Edit is pressed
    toggleModalEdit = (product) => {
        this.setState({
            editId: product.id,
            editName: product.name,
            editCategory: product.category,
            editImage: product.image,
            editPrice: product.price,
            editPricePerUnit: product.pricePerUnit,
            modal: !this.state.modal,
        });
    };

    // Handle Modal Name input change
    handleNameChange = (event) => {
        this.setState({
            editName: event.target.value,
        })
    };

    // Handle Modal Category input change
    handleCategoryChange = (event) => {
        this.setState({
            editCategory: event.target.value,
        })
    };
    // Handle Modal Name input change
    handleImageChange = (event) => {
        this.setState({
            editImage: event.target.value,
        })
    };

    // Handle Modal Price Unit input change
    handlePriceChange = (event) => {
        this.setState({
            editPrice: event.target.value,
        })
    };

    // Handle Modal Name input change
    handlePricePerUnitChange = (event) => {
        this.setState({
            editPricePerUnit: event.target.value,
        })
    };

    // Handle Add Modal Name input change
    handleAddNameChange = (event) => {
        this.setState({
            addName: event.target.value,
        })
    };

    // Handle Add Modal Name input change
    handleAddImageChange = (event) => {
        this.setState({
            addImage: event.target.value,
        })
    };

    // Handle Add Modal Category input change
    handleAddCategoryChange = (event) => {
        this.setState({
            addCategory: event.target.value,
        })
    };

    // Handle Add Modal Price Unit input change
    handleAddPriceChange = (event) => {
        this.setState({
            addPrice: event.target.value,
        })
    };

    // Handle Add Modal Name input change
    handleAddPricePerUnitChange = (event) => {
        this.setState({
            addPricePerUnit: event.target.value,
        })
    };

    // Component Lifecycle Methods
    // Component-Did-Mount method
    componentDidMount() {
        fetch(GLOBAL.BASE_URL+'products/getAllProducts',{
            method: 'POST',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                token: localStorage.getItem('token')
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.status === 200) {
                        if(result.allProducts.length !== 0) {
                            let groupedProducts = _.groupBy(result.allProducts, 'category');
                            this.setState({
                                productsEmpty: false,
                                groupedProducts: groupedProducts,
                                loading:false,
                            });
                        } else {
                            this.setState({
                                productsEmpty: true,
                                groupedProducts: result,
                                loading: false,
                            });
                        }
                    } else if(result.status === 401) {
                        alert('Invalid User, Please login again');
                        this.props.history.push("/");
                    }
                },
                (error) => {
                    console.log('ERROR FETCHING PRODUCTS::', error);
                }
            )
    }

    // render() method
    render() {
        return(
            <div className='mp-primary-section'>
                <ToastContainer />
                <AdminNavbar />
                {/* Edit Product Modal */}
                <MDBContainer>
                    <MDBModal isOpen={ this.state.modal } toggle={() => this.toggleModal()}>
                        <MDBModalHeader
                            toggle={() =>this.toggleModal()}
                            className='modal-header-text'
                        >
                            Edit Product
                        </MDBModalHeader>
                        <MDBModalBody>
                            <div className='d-flex flex-column align-items-center justify-content-center'>
                                <div className='field-section'>
                                    <span className='field-text'>Name:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.editName }
                                    placeholder='Product Name'
                                    className='modal-text-input'
                                    onChange={(event) => this.handleNameChange(event)}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>Category:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.editCategory }
                                    placeholder='Product Category'
                                    className='modal-text-input'
                                    onChange={(event) => this.handleCategoryChange(event)}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>Image:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.editImage }
                                    placeholder='Product Image URL'
                                    className='modal-text-input'
                                    onChange={(event) => this.handleImageChange(event)}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>Price Unit:</span>
                                </div>
                                <select
                                    value={this.state.editPrice}
                                    className='mp-dropDown'
                                    onChange={(event) => this.handlePriceChange(event)}
                                >
                                    <option value="Kilogram">Kilogram</option>
                                    <option value="Individual">Individual</option>
                                </select>
                                <div className='field-section'>
                                    <span className='field-text'>Price per Unit:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.editPricePerUnit }
                                    placeholder='Product Price per Unit'
                                    className='modal-text-input'
                                    onChange={(event) => this.handlePricePerUnitChange(event)}
                                />
                                <button
                                    className='modal-edit-btn'
                                    onClick={() => this.editProduct()}
                                >
                                    Edit Product
                                </button>
                                <button
                                    className='modal-delete-btn'
                                    onClick={() => this.deleteProduct()}
                                >
                                    Delete Product
                                </button>
                            </div>
                        </MDBModalBody>
                    </MDBModal>
                </MDBContainer>
                {/* Add Product Modal */}
                <MDBContainer>
                    <MDBModal isOpen={ this.state.addProductModal } toggle={() => this.toggleAddModal()}>
                        <MDBModalHeader
                            toggle={() =>this.toggleAddModal()}
                            className='modal-header-text'
                        >
                            Add Product
                        </MDBModalHeader>
                        <MDBModalBody>
                            <div className='d-flex flex-column align-items-center justify-content-center'>
                                <div className='field-section'>
                                    <span className='field-text'>Name:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.addName }
                                    placeholder='Product Name'
                                    className='modal-text-input'
                                    onChange={(event) => this.handleAddNameChange(event)}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>Category:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.addCategory }
                                    placeholder='Product Category'
                                    className='modal-text-input'
                                    onChange={(event) => this.handleAddCategoryChange(event)}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>Image:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.addImage }
                                    placeholder='Product Image URL'
                                    className='modal-text-input'
                                    onChange={(event) => this.handleAddImageChange(event)}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>Price Unit:</span>
                                </div>
                                <select
                                    value={this.state.addPricet}
                                    className='mp-dropDown'
                                    onChange={(event) => this.handleAddPriceChange(event)}
                                >
                                    <option value="Kilogram">Kilogram</option>
                                    <option value="Individual">Individual</option>
                                </select>
                                <div className='field-section'>
                                    <span className='field-text'>Price per Unit:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.addPricePerUnit }
                                    placeholder='Product Price per Unit'
                                    className='modal-text-input'
                                    onChange={(event) => this.handleAddPricePerUnitChange(event)}
                                />
                                <button
                                    className='modal-edit-btn'
                                    onClick={() => this.addProduct()}
                                >
                                    Add Product
                                </button>
                            </div>
                        </MDBModalBody>
                    </MDBModal>
                </MDBContainer>
                <div className='d-flex flex-column align-items-center justify-content-center primary-area'>
                    <button
                        className='add-product-btn'
                        onClick={() => this.toggleAddModal()}
                    >
                        Add Product
                    </button>
                    {
                        this.state.productsEmpty && !this.state.loading &&
                        <div className='no-products-msg'>
                            No Products Available
                        </div>
                    }
                    {
                        !this.state.productsEmpty &&
                        this.products()

                    }
                </div>
            </div>
        );
    }
}

export default ManageProducts;
