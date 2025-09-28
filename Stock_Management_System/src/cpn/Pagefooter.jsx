// Pfooter.jsx
import React from 'react';
import './Pfooter.css'; // สมมติว่ามีไฟล์ CSS สำหรับสไตล์

const Pfooter = () => {
  return (
    <div className="p-footer-menu">
      <a href="#" className="menu-item active">
        <img src="/path/to/icon-box.svg" alt="กล่องสินค้า" />
        <span>กล่องสินค้า</span>
      </a>
      <a href="#" className="menu-item">
        <img src="/path/to/icon-history.svg" alt="ประวัติรวม" />
        <span>ประวัติรวม</span>
      </a>
      <a href="#" className="menu-item">
        <img src="/path/to/icon-bell.svg" alt="การแจ้งเตือน" />
        <span>การแจ้งเตือน</span>
      </a>
      <a href="#" className="menu-item">
        <img src="/path/to/icon-gear.svg" alt="การตั้งค่า" />
        <span>การตั้งค่า</span>
      </a>
      <a href="#" className="menu-item">
        <img src="/path/to/icon-profile.svg" alt="โปรไฟล์" />
        <span>โปรไฟล์</span>
      </a>
    </div>
  );
};

export default Pfooter;