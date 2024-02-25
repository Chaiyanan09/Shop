import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
      id: "",
      name: "",
      price: "",
      img: ""
    });
    const [editProduct, setEditProduct] = useState(null);
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = () => {
      axios.get("http://localhost:5000/product")
        .then(response => setProducts(response.data.product))
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    };
  
    const handleNewProductChange = (event) => {
      const { name, value } = event.target;
      setNewProduct(prevProduct => ({ ...prevProduct, [name]: value }));
    };
  
    const handleNewProductSubmit = (event) => {
      event.preventDefault();
  
      // แปลง id เป็นจำนวนเต็ม
      const newProductId = parseInt(newProduct.id);
  
      // ตรวจสอบว่าการแปลงเป็นจำนวนเต็มเป็นที่เรียบร้อยแล้วและเป็นจำนวนเต็มที่ถูกต้องหรือไม่
      if (!isNaN(newProductId) && Number.isInteger(newProductId)) {
        // อัปเดต newProduct ด้วย id ที่แปลงแล้ว
        const updatedProduct = { ...newProduct, id: newProductId };
  
        axios.post("http://localhost:5000/product", updatedProduct)
          .then(response => {
            console.log('Response from server:', response.data);
  
            // รีเซ็ตฟอร์ม
            setNewProduct({ id: "", name: "", price: "", img: "" });
  
            // เรียกดึงข้อมูลที่อัปเดตแล้ว
            fetchData();
          })
          .catch(error => {
            console.error('Error adding new product:', error);
          });
      } else {
        console.error('Invalid ID. Please enter a valid integer for ID.');
      }
    };
  
    const handleDeleteProduct = async (productId) => {
      try {
        console.log('Deleting product with ID:', productId);
        await axios.delete(`http://localhost:5000/product/${parseInt(productId)}`);
        console.log('Product deleted successfully');
  
        // Update the products state by filtering out the deleted product
        setProducts((prevProducts) => prevProducts.filter(p => p._id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    };
  
    const handleEditProduct = (id) => {
      // ดึงข้อมูลสินค้าที่ต้องการแก้ไขจากเซิร์ฟเวอร์โดยใช้ id
      axios.get(`http://localhost:5000/product/${id}`)
        .then(response => {
          // เซ็ตข้อมูลสินค้าที่ได้เข้าไปในตัวแปรสำหรับการแก้ไข
          setEditProduct(response.data);
        })
        .catch(error => {
          console.error('Error fetching product for edit:', error);
        });
    };
  
    const handleUpdateProduct = () => {
      if (editProduct) {
        axios.put(`http://localhost:5000/product/${editProduct._id}`, editProduct)
          .then(response => {
            console.log('Updated product:', response.data);
  
            // Reset editProduct to null
            setEditProduct(null);
  
            // Refetch data
            fetchData();
          })
          .catch(error => {
            console.error('Error updating product:', error);
          });
      }
    };
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setEditProduct(prevProduct => ({ ...prevProduct, [name]: value }));
    };
  
    const productList = products.map(product => (
      <div key={product._id} className="product-card">
        <p>ID: {product._id}</p>
        <p>Name: {product.name}</p>
        <p>Price: {product.price}</p>
        <p>Image: <img src={product.img} alt={product.name} /></p>
        <div className="product-actions">
          <button onClick={() => handleEditProduct(product._id)}>Edit</button>
          <button className="delete" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
        </div>
      </div>
    ));
  
    return (
      <div className="container">
        <h1>My Market</h1>
        <div>
          <input type="text" placeholder="ID" name="id" value={newProduct.id} onChange={handleNewProductChange} className="product-input" />
          <input type="text" placeholder="Name" name="name" value={newProduct.name} onChange={handleNewProductChange} className="product-input" />
          <input type="text" placeholder="Price" name="price" value={newProduct.price} onChange={handleNewProductChange} className="product-input" />
          <input type="text" placeholder="Image URL" name="img" value={newProduct.img} onChange={handleNewProductChange} className="product-input" />
          <button className="Add-product" onClick={handleNewProductSubmit}>Add Product</button>
        </div>
        <div>
          {productList}
        </div>
        {editProduct && (
          <div>
            <h2>Edit Product</h2>
            <input type="text" placeholder="Name" name="name" value={editProduct.name} onChange={handleInputChange} className="product-input"/>
            <input type="text" placeholder="Price" name="price" value={editProduct.price} onChange={handleInputChange} className="product-input"/>
            <input type="text" placeholder="Image URL" name="img" value={editProduct.img} onChange={handleInputChange} className="product-input"/>
            <button className="Add-product" onClick={handleUpdateProduct}>Update Product</button>
          </div>
        )}
      </div>
    );
  };
  
  export default ProductManagement;
  
