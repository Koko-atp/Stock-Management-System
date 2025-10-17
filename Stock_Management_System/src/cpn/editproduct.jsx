// src/EditProductModal.jsx
import React, { useState, useEffect } from 'react';
import DB from '../assets/DB'; // ต้อง Import DB Client
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// 💡 เพิ่ม Icon ที่ใช้สำหรับการจัดการรูปภาพ
import { faMountain, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'; 

// Constants คัดลอกมาจาก addproduct.jsx
const DEFAULT_IMAGE_URL = 'https://kdyryibnpimemkrpurja.supabase.co/storage/v1/object/public/product-images/679821.png'; 
const BUCKET_NAME = 'product-images'; 



// =======================================
// ฟังก์ชันจัดการอัปโหลด Supabase Storage (คัดลอกจาก addproduct.jsx)
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

  const { data: publicUrlData } = DB.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
// =======================================


const EditProductModal = ({ isVisible, product, onClose , onSave ,  categories }) => {
  const [catvalue , setcatvalue] = useState()
  const [newcat , setnewcat] = useState('')



  const [formData, setFormData] = useState({
    productname: '',
    price: 0,
    sku: '',
    categoryid: null,
    minimumcriteria:'',
  });
  
  // 💡 NEW: State สำหรับจัดการรูปภาพ
  const [imageFile, setImageFile] = useState(null); 
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  // ใช้ useEffect เพื่ออัปเดตค่าฟอร์มเมื่อ prop 'product' เปลี่ยน
  useEffect(() => {
    if (product) {
      setFormData({
        productname: product.productname,
        price: product.price,
        sku: product.sku,
        categoryid: product.categoryid, 
        minimumcriteria:product.minimumcriteria,
      });
      
      // 💡 NEW: ตั้งค่ารูปภาพเริ่มต้น
      setImageFile(null); // เคลียร์ไฟล์ใหม่ที่เคยเลือกไว้
      setCurrentImageUrl(product.image_url || DEFAULT_IMAGE_URL); // ใช้ URL เดิมของสินค้า
      setIsImageRemoved(false);
      setcatvalue(product.categoryid)
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
  
  // 💡 NEW: ฟังก์ชันจัดการการเลือกไฟล์ใหม่
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setIsImageRemoved(false); // ยกเลิกสถานะลบถ้าเลือกไฟล์ใหม่
    } else {
      setImageFile(null);
    }
  };
  
  // 💡 NEW: ฟังก์ชันจัดการการลบรูปภาพ
  const handleRemoveImage = () => {
    setImageFile(null); 
    setCurrentImageUrl(DEFAULT_IMAGE_URL); // แสดงภาพ Default ทันที
    setIsImageRemoved(true); // ตั้งสถานะว่าต้องการใช้ Default URL แทนรูปเก่า
  };


  const handleSubmit =  async() => {

    
    let finalImageUrl = product.image_url; // ใช้ URL เดิมของสินค้าเป็นค่าเริ่มต้น

    if (imageFile) {
        // Case 1: มีการเลือกไฟล์ใหม่ -> อัปโหลด
        try {
            finalImageUrl = await uploadProductImage(imageFile);
        } catch (error) {
            console.error("Image upload failed:", error.message);
            alert(`ไม่สามารถอัปโหลดรูปภาพใหม่ได้: ${error.message}`);
            return; 
        }
    } else if (isImageRemoved) {
        // Case 2: ผู้ใช้กดลบรูปภาพ -> ใช้ Default URL
        finalImageUrl = DEFAULT_IMAGE_URL;
    } 
    // Case 3: ไม่มีการเปลี่ยนแปลงรูปภาพ
    
    const dataToSave = {
        ...formData,
    image_url: finalImageUrl, // รวม URL รูปภาพใหม่/เดิม/Default
    };
    
    if (catvalue == "") {
      if(newcat.trim() === ''){alert("กรุณาใส่ชื่อหมวดหมู")
        return;}
    const {error} = await  DB.from('category')
      .insert([{ categoryname :  newcat }])
      if(error) {
        alert('แก้ไขไม่สำเร็จ : ' , error.message) 
        return;}
    }

      const  dataToSaveWithcat = {
          ...dataToSave,
          categoryid : catvalue
      }

      setcatvalue('')
      onSave(product.productid , dataToSaveWithcat , newcat )
      setnewcat('')
    onClose()
  }
  
  // Logic สำหรับการแสดงผลพรีวิวรูปภาพ
  const previewImage = imageFile 
    ? URL.createObjectURL(imageFile) // ถ้ามีการเลือกไฟล์ใหม่ ให้แสดงพรีวิวไฟล์นั้น
    : currentImageUrl;              // ถ้าไม่มีไฟล์ใหม่ ให้แสดง URL เก่า/Default

  const isImagePlaceholder = !imageFile && (currentImageUrl === DEFAULT_IMAGE_URL || currentImageUrl === null);


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>แก้ไขข้อมูลสินค้า: {product?.productname}</h3>
     
        
          {/* 💡 NEW: ส่วนสำหรับแก้ไขรูปภาพ */}
          <div className="modal-form-group">
            <label className="image-upload-label">รูปภาพสินค้า:</label>
            <div className="image-upload-area">
                <div className="current-image-container">
                    {/* แสดงรูปภาพ หรือ Placeholder */}
                    {previewImage && !isImagePlaceholder
                        ? (
                          <>
                            <img src={previewImage} alt="Preview" />
                            {/* ปุ่มลบรูปภาพ (แสดงเมื่อมีรูปภาพ ไม่ใช่ Default Placeholder) */}
                            <button 
                                type="button" 
                                className="remove-image-button" 
                                onClick={handleRemoveImage}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </>
                        )
                        : <FontAwesomeIcon icon={faMountain} className="image-placeholder-icon" />
                    }
                </div>
                
                {/* ปุ่มสำหรับอัปโหลดใหม่ (+) */}
                <label htmlFor="image-upload-input" className="upload-button">
                    <FontAwesomeIcon icon={faPlus} className="upload-plus-icon" />
                </label>
                
                {/* Input จริงที่ซ่อนไว้ */}
                <input 
                    id="image-upload-input" 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange} 
                />
            </div>
          </div>
          {/* END IMAGE SECTION */}
          
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
              value={catvalue}
              onChange={(e) => setcatvalue(e.target.value)}
            >
              <option value="">หมวดหมู่ใหม่</option>
              {categories.map((cat) => (
                <option key={cat.categoryid} value={cat.categoryid}>
                  {cat.categoryname}
                </option>
              ))}
            </select>
            
            {catvalue == '' &&
            <>
            <hr></hr>
            < input placeholder='เพิ่มหมวดหมู่ใหม่' onChange={(e) => setnewcat(e.target.value)} />
            </> 
            }

          </div>
          <div className="modal-form-group">
            <label>เกณฑ์ขั้นต่ำ:</label>
            <input
              type="number"
              name="minimumcriteria"
              value={formData.minimumcriteria}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-save" onClick={handleSubmit}>บันทึกการแก้ไข</button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>ยกเลิก</button>
          </div>
      </div>
    </div>
  );
};

export default EditProductModal;