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

    const [catvalue , setcatvalue] = useState('')
    const [newcat , setnewcat] = useState('')

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

  const resetForm = () => {
  setnewcat('');
  setcatvalue('');
  setFormData({
    sku: '',
    productname: '',
    price: '',
    initialquantity: '',
    minimumcriteria: '',
    categoryid: '',
  });
  setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---- 1. จัดการรูปภาพ ----
    let imageUrl = DEFAULT_IMAGE_URL;
    if (imageFile) {
        try {
            imageUrl = await uploadProductImage(imageFile);
        } catch (error) {
            alert(`อัปโหลดรูปภาพไม่สำเร็จ: ${error.message}`);
            return;
        }
    }
    const dataToSave = { ...formData, image_url: imageUrl };

    // ---- 2. จัดการหมวดหมู่ ----
    let finalCategoryId = catvalue;

    // กรณีที่ผู้ใช้ "เพิ่มหมวดหมู่ใหม่"
    if (catvalue === "" && newcat.trim() !== '') {
        try {
            const { data: wasAdded, error: rpcError } = await DB.rpc('add_new_category', {
                new_category_name: newcat.trim()
            });

            if (rpcError) throw rpcError; 

            // `wasAdded` จะเป็น true ถ้าเพิ่มใหม่, false ถ้ามีอยู่แล้ว
            if (wasAdded) {
                console.log(`✅ เพิ่มหมวดหมู่ใหม่ "${newcat.trim()}" สำเร็จ`);
            } else {
                alert(`ℹ️ หมวดหมู่ "${newcat.trim()}" มีอยู่แล้วในระบบ`);
                resetForm();
            }    
            const { data: categoryData, error: selectError } = await DB.from('category')
                .select('categoryid')
                .ilike('categoryname', newcat.trim()) // .ilike คือการค้นหาแบบไม่สนตัวพิมพ์เล็ก/ใหญ่
                .single();

            if (selectError) throw selectError;

            if (!categoryData) {
                alert('เกิดข้อผิดพลาด: ไม่พบ ID ของหมวดหมู่');
                return;
            }
            finalCategoryId = categoryData.categoryid;

        } catch (error) {
            alert('เกิดข้อผิดพลาดในการจัดการหมวดหมู่: ' + error.message);
            return;
        }
    } else if (catvalue === "") {
        alert("กรุณาเลือกหมวดหมู่ หรือเพิ่มหมวดหมู่ใหม่");
        return;
    }
    const dataToSaveWithCat = {
        ...dataToSave,
        categoryid: finalCategoryId
    };
    
    onSave(dataToSaveWithCat,newcat);
  
      setnewcat('');
      setcatvalue('');
      setFormData({ sku: '', productname: '', price: '', initialquantity: '', minimumcriteria: '', categoryid: '' });
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
              <select name="categoryid" value={catvalue} onChange={(e) => setcatvalue(e.target.value)} >
                <option value="">เพิ่มหมวดหมู่ใหม่</option>
                {categories.map((cat) => (
                  <option key={cat.categoryid} value={cat.categoryid}>
                    {cat.categoryname}
                  </option>
                ))}
              </select>
              </div>
            {catvalue == '' &&
            <>
            <hr></hr>
            < input placeholder='เพิ่มหมวดหมู่ใหม่' onChange={(e) => setnewcat(e.target.value)} />
            </> 
            }

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