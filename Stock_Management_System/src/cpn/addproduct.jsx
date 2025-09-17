// src/AddProductModal.jsx
import React, { useState } from 'react';

const AddProductModal = ({ isVisible, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState({
    sku: '',
    productname: '',
    price: '',
    initialquantity: '',
    minimumcriteria: '',
    categoryid: '',
  });

  if (!isVisible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      sku: '',
      productname: '',
      price: '',
      initialquantity: '',
      minimumcriteria: '',
      categoryid: '',
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>เพิ่มสินค้าใหม่</h3>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label>SKU:</label>
            <input type="text" name="sku" value={formData.sku} onChange={handleChange} required />
          </div>
          <div className="modal-form-group">
            <label>ชื่อสินค้า:</label>
            <input type="text" name="productname" value={formData.productname} onChange={handleChange} required />
          </div>
          <div className="modal-form-group">
            <label>ราคา:</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="modal-form-group">
            <label>จำนวนเริ่มต้น:</label>
            <input type="number" name="initialquantity" value={formData.initialquantity} onChange={handleChange} required />
          </div>
          <div className="modal-form-group">
            <label>เกณฑ์ขั้นต่ำ:</label>
            <input type="number" name="minimumcriteria" value={formData.minimumcriteria} onChange={handleChange} required />
          </div>
          <div className="modal-form-group">
            <label>หมวดหมู่สินค้า:</label>
            <select name="categoryid" value={formData.categoryid} onChange={handleChange} required>
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((cat) => (
                <option key={cat.categoryid} value={cat.categoryid}>
                  {cat.categoryname}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-save">บันทึก</button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>ยกเลิก</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;