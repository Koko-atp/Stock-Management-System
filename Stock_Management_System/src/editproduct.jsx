// src/EditProductModal.jsx
import React, { useState, useEffect } from 'react';


const EditProductModal = ({ isVisible, product, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState({
    productname: '',
    price: 0,
    sku: '',
    categoryid: null, // เปลี่ยนจาก categoryname เป็น categoryid
  });

  // ใช้ useEffect เพื่ออัปเดตค่าฟอร์มเมื่อ prop 'product' เปลี่ยน
  useEffect(() => {
    if (product) {
      setFormData({
        productname: product.productname,
        price: product.price,
        // เพิ่มค่าเริ่มต้นของ field ใหม่
        sku: product.sku,
        categoryid: product.categoryid, // กำหนดค่าเริ่มต้นเป็น categoryid ของสินค้า

      });
    }
  }, [product]);
  

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
    onSave(product.productid, formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>แก้ไขข้อมูลสินค้า: {product?.productname}</h3>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label>SKU:</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-form-group">
            <label>ชื่อสินค้า:</label>
            <input
              type="text"
              name="productname"
              value={formData.productname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-form-group">
            <label>ราคา:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-form-group">
            <label>หมวดหมู่สินค้า:</label>
            <select
              name="categoryid"
              value={formData.categoryid}
              onChange={handleChange}
            >
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((cat) => (
                <option key={cat.categoryid} value={cat.categoryid}>
                  {cat.categoryname}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-save">บันทึกการแก้ไข</button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>ยกเลิก</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;