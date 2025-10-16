import React, { useEffect, useState } from 'react';

const Modal = ({ isVisible, product, onClose, onSave }) => {
  // สร้าง State สำหรับประเภทการทำรายการ ('add' หรือ 'subtract') และจำนวนสินค้า
  const [transactionType, setTransactionType] = useState('add');
  const [quantity, setQuantity] = useState(0);
  const [transac_note , setnote] = useState()
  const [tran_id , settran_id] = useState()

  
  const handleSave = () => {
    // ตรวจสอบว่าจำนวนที่กรอกมากกว่า 0 หรือไม่
    if (quantity <= 0) {
      alert("กรุณากรอกจำนวนสินค้าที่ถูกต้อง");
      return;
    }
    
    const finalQuantity = transactionType === 'add' ? quantity : -quantity;
    const zoned = new Date()
    zoned.setHours((zoned.getHours() + 7))
    const trandate = zoned.toISOString().split('.')[0];
    
    if (product.initialquantity + finalQuantity < 0 ){
      alert("จำนวนไม่ถูกต้อง");
    }else{
      onSave({
        transactiontypeid: tran_id,
        productid: product.productid,
        userid: 1,
        transactiondate: trandate,
        quantity: quantity ,
        note: transac_note
      });
    }
  };
  
  useEffect(() =>{ 
    if (transactionType === 'add'){
      setnote('เพิ่ม สินค้าเข้าคลัง')
      settran_id(1)
    }else{
      setnote('เบิก/ลด สินค้าออกจากคลัง')
      settran_id(2)
    }
  } ,[ transactionType])


  if (!isVisible) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>แก้ไขจำนวนสินค้า: {product?.productname}</h3>
        <p>จำนวนปัจจุบัน: {product?.initialquantity}</p>
        
        <div className="modal-input-group">
          <div className="custom-select-wrapper">
            <span>ประเภท</span>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="add">เพิ่มจำนวนสินค้า (+)</option>
              <option value="subtract">ลดจำนวนสินค้า (-)</option>
            </select>
          </div>

          <div className='quan-input'>
            <span>หมายเหตุ</span>
          <input
          className='quan-input'
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min="0" // กำหนดให้จำนวนต้องมากกว่าหรือเท่ากับ 0
          />
          </div>

          
          <div className='Modal-note'>
          <span>หมายเหตุ</span>
        <input
         placeholder={transac_note}
         onChange={(e) => setnote(e.target.value)}></input>
         </div>

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