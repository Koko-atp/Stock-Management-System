// src/AddProductModal.jsx
import React, { useState } from 'react';
import DB from '../assets/DB';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMountain, 
         faPlus ,
         faXmark  
        } 
from '@fortawesome/free-solid-svg-icons'

const DEFAULT_IMAGE_URL = 'https://kdyryibnpimemkrpurja.supabase.co/storage/v1/object/public/product-images/679821.png'; 
const BUCKET_NAME = 'product-images'; // ชื่อ Bucket ใน Supabase Storage

// =======================================
// ฟังก์ชันจัดการอัปโหลด Supabase Storage
// =======================================

const uploadProductImage = async (file) => {
    const safeFileName = file.name.replace(/\s/g, '_').replace(/[^\w.-]/g, '');
    const fileName = `${Date.now()}-${safeFileName}`;
    const filePath = `public/${fileName}`;

  const { error } = await DB.storage 
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw error;
  }

  // ดึง Public URL
  const { data: publicUrlData } = DB.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
// =======================================


const AddProductModal = ({ isVisible, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState({
    sku: '',
    productname: '',
    price: '',
    initialquantity: '',
    minimumcriteria: '',
    categoryid: '',
  });
  
  const [imageFile, setImageFile] = useState(null); 

  if (!isVisible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    
    let imageUrl = '';

    if (imageFile) {
        try {
            // 1. อัปโหลดรูปภาพ
            imageUrl = await uploadProductImage(imageFile); 
        } catch (error) {
            console.error("Image upload failed:", error.message);
            alert(`ไม่สามารถอัปโหลดรูปภาพได้: ${error.message}`);
            return; 
        }
    } else {
        // 2. ใช้รูปภาพ Default
        imageUrl = DEFAULT_IMAGE_URL; 
    }
    
    // รวม URL รูปภาพเข้ากับข้อมูลฟอร์ม
    const dataToSave = {
        ...formData,
        image_url: imageUrl,
    };

    onSave(dataToSave); // onSave จะเรียก API เพื่อบันทึกข้อมูลเข้า Supabase Table
    
    // Reset States
    setFormData({
      sku: '',
      productname: '',
      price: '',
      initialquantity: '',
      minimumcriteria: '',
      categoryid: '',
    });
    setImageFile(null);
    onClose();
  };
  const handleRemoveImage = () => {
    setImageFile(null);
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>เพิ่มสินค้าใหม่</h3>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label className="image-upload-label">รูปภาพสินค้า:</label>
            <div className="image-upload-area">
                <div className="current-image-container">
                    {imageFile 
                        ? (
                          <>
                            <img src={URL.createObjectURL(imageFile)} alt="Preview" />
                            <button 
                                type="button" 
                                className="remove-image-button" 
                                onClick={handleRemoveImage}
                            >
                                <FontAwesomeIcon icon={faXmark } />
                            </button>
                          </>
                        )
                        : <FontAwesomeIcon icon={faMountain} className="image-placeholder-icon" />
                    }
                </div>
                {/*ปุ่มสำหรับอัปโหลดใหม่ (+) */}
                <label htmlFor="image-upload-input" className="upload-button">
                    <FontAwesomeIcon icon={faPlus} className="upload-plus-icon" />
                </label>
                
               
                <input 
                    id="image-upload-input" 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange} 
                />
            </div>
          </div>
          <div className="modal-form-group">
            <label>SKU:</label>
            <input type="text" name="sku" value={formData.sku} onChange={handleChange} required />
          </div>
          <div className="modal-form-group">
            <label>ชื่อสินค้า:</label>
            <input type="text" name="productname" value={formData.productname} onChange={handleChange} required />
          </div>
          <div className="modal-form-group">
            <label>หมวดหมู่สินค้า:</label>
            <div className="custom-select-wrapper">
              <select name="categoryid" value={formData.categoryid} onChange={handleChange} required>
                <option value="">เลือกหมวดหมู่</option>
                {categories.map((cat) => (
                  <option key={cat.categoryid} value={cat.categoryid}>
                    {cat.categoryname}
                  </option>
                ))}
              </select>
            </div>
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