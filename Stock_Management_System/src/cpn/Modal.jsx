import React, { useState } from 'react';

const Modal = ({ isVisible, product, onClose, onSave }) => {
  // สร้าง State สำหรับประเภทการทำรายการ ('add' หรือ 'subtract') และจำนวนสินค้า
  const [transactionType, setTransactionType] = useState('add');
  const [quantity, setQuantity] = useState(0);

  if (!isVisible) return null;

  const handleSave = () => {
    // ตรวจสอบว่าจำนวนที่กรอกมากกว่า 0 หรือไม่
    if (quantity <= 0) {
      alert("กรุณากรอกจำนวนสินค้าที่ถูกต้อง");
      return;
    }
    
    // ส่งค่า transactionType และ quantity ไปที่คอมโพเนนต์หลัก
    // ตัวอย่าง: ถ้าเลือก 'subtract' และกรอก 5, จะส่งค่าเป็น -5
    const finalQuantity = transactionType === 'add' ? quantity : -quantity;
    
    onSave(product.productid, finalQuantity);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>แก้ไขจำนวนสินค้า: {product?.productname}</h3>
        <p>จำนวนปัจจุบัน: {product?.initialquantity}</p>
        
        <div className="modal-input-group">
          {/* เพิ่ม dropdown สำหรับเลือกประเภท */}
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="add">เพิ่มจำนวนสินค้า (+)</option>
            <option value="subtract">ลดจำนวนสินค้า (-)</option>
          </select>

          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min="0" // กำหนดให้จำนวนต้องมากกว่าหรือเท่ากับ 0
          />
        </div>

        <div className="modal-actions">
          <button className="btn btn-save" onClick={handleSave}>บันทึก</button>
          <button className="btn btn-cancel" onClick={onClose}>ยกเลิก</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;