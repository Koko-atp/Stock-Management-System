import { useState, useEffect } from 'react';
import DB from '../assets/DB'
import Modal from '../cpn/Modal';
import EditProductModal from '../cpn/editproduct';
import AddProductModal from '../cpn/addproduct';
import ProductLog from "../cpn/TransaclogPopUp";
import '../CSS/MPLP.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFileArrowDown , 
    faArrowsUpDown, 
    faPenToSquare, 
    faTrashCan, 
    faCartPlus,  
    faBoxArchive, // ไอคอนสำหรับคลังสินค้า (แทนกล่อง)
    faFileInvoice, // ไอคอนสำหรับประวัติรวม
    faBell, // ไอคอนสำหรับแจ้งเตือน
    faGear // สำหรับปุ่มเพิ่มสินค้าใหม่ด้านบน
} from '@fortawesome/free-solid-svg-icons';

function MPL(){
  const [products, setProducts] = useState([]); // State สำหรับเก็บข้อมูลสินค้า
  const [categories, setCategories] = useState([]); // State สำหรับเก็บข้อมูลหมวดหมู่
  const [searchTerm, setSearchTerm] = useState(''); // State สำหรับเก็บข้อมูลแถบค้นหา
  const [filteredProducts, setFilteredProducts] = useState([]); // State สำหรับเก็บข้อมูลสินค้าที่ถูกกรอง

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const[Showhistory , setShowhistory] = useState(false);
  const[ProducHis , setProductHis] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await DB
        .from('product')
        .select('*')
        .order('productid', { ascending: true });

      if (error) throw error;
      setProducts(data);
    } catch (e) {
      setError('ไม่สามารถโหลดข้อมูลสินค้าได้: ' + e.message);
      console.error('Error fetching products:', e);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();

    const fetchCategories = async () => {
      try {
        const { data, error } = await DB
          .from('category')
          .select('*')
          .order('categoryid', { ascending: true });

        if (error) throw error;
        
        setCategories(data);
      } catch (e) {
        console.error("Error fetching categories:", e);
      }
    };
    
    fetchCategories();
  }, [categories]); 
  
 //ฟังก์ชัน Search หาสินค้า 
  useEffect(() => {
    const results = products.filter(product =>
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryName(product.categoryid).toLowerCase().includes(searchTerm.toLowerCase())||
      String(product.price).includes(searchTerm)
    );
    setFilteredProducts(results);
  }, [products, searchTerm, categories]);
  
  const getCategoryName = (categoryid) => {
  const category = categories.find(cat => cat.categoryid === categoryid);
  return category ? category.categoryname : 'ไม่พบหมวดหมู่';
};
  

  // ฟังก์ชันสำหรับเปิด Modal อัปเดตจำนวนสินค้า
  const handleUpdateQuantity = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  // ฟังก์ชันสำหรับปิด Modal อัปเดตจำนวนสินค้า
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  

   //ฟังก์ชันเพื่อจัดการการบันทึกจำนวนสินค้า
  const handleSaveQuantity = async (productId, quantity) => {
    try {
      const productToUpdate = products.find(p => p.productid === productId);
      if (!productToUpdate) throw new Error("ไม่พบสินค้า");

      const newQuantity = productToUpdate.initialquantity + quantity;

      if (newQuantity < 0) {
        alert("จำนวนไม่ถูกต้อง");
      } else {
        const { error: updateError } = await DB
          .from('product')
          .update({ initialquantity: newQuantity })
          .eq('productid', productId);

        if (updateError) throw updateError;

        // ประเภทการทำรายการ (1 = รับเข้า, 2 = เบิกออก)
        const transactionTypeId = quantity > 0 ? 1 : 2;

        // Insert ข้อมูลลง stocktransaction
        const { error: logError } = await DB
          .from('stocktransaction')
          .insert({
            transactiontypeid: transactionTypeId,
            productid: productId,
            userid: 1, // ← ใส่ userid เป็น 1 ไว้ชั่วคราว
            transactiondate: new Date().toISOString().split('T')[0],
            quantity: Math.abs(quantity),
            note: transactionTypeId === 1 
                    ? 'เพิ่มจำนวนเข้าคลัง' 
                    : 'เบิก/ลดจำนวนสินค้าออกจากคลัง'
          });

        if (logError) throw logError;

        // อัปเดต State
        setProducts(products.map(p =>
          p.productid === productId ? { ...p, initialquantity: newQuantity } : p
        ));

        console.log('✅ อัปเดตสินค้าและบันทึก Log เรียบร้อย');
      }
    } catch (e) {
      setError('ไม่สามารถอัปเดตจำนวนสินค้าได้: ' + e.message);
      console.error('Error updating quantity:', e);
    } finally {
      closeModal();
    }
  };

  // ฟังก์ชันสำหรับเปิด Modal แก้ไข
  const openEditModal = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };
  
  // ฟังก์ชันสำหรับปิด Modal แก้ไข
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setProductToEdit(null);
  };

  const handleEditSave = async (productId, newFormData) => {
    try {
      const { error } = await DB
        .from('product')
        .update(newFormData) 
        .eq('productid', productId);
      
      if (error) throw error;

      //ฟังก์ชันเพื่อดึงข้อมูลสินค้าทั้งหมดมาอัปเดต state ใหม่
      await fetchProducts();
      
      console.log('อัปเดตข้อมูลสินค้าสำเร็จ!');

    } catch (e) {
      setError('ไม่สามารถอัปเดตข้อมูลสินค้าได้: ' + e.message);
      console.error('Error updating product data:', e);
    }
  };

    //ฟังก์ชันสำหรับเปิด/ปิด Modal เพิ่มสินค้า
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

// ฟังก์ชันสำหรับบันทึกสินค้าใหม่

const handleAddSave = async (newProductData) => {
    
  try {
      const dataToInsert = {
        ...newProductData,
        createddate: new Date().toISOString().split('T')[0],
        initialquantity: parseInt(newProductData.initialquantity) || 0,
      };
      // ใช้คำสั่ง insert โดยตรง
      const { error } = await DB
        .from('product')
        .insert(dataToInsert);
        
        
      
      if (error) throw error;

      await fetchProducts(); // ดึงข้อมูลใหม่เพื่อแสดงสินค้าที่เพิ่งเพิ่ม
      console.log('เพิ่มสินค้าใหม่สำเร็จ!');
    } catch (e) {
      setError('ไม่สามารถเพิ่มสินค้าใหม่ได้: ' + e.message);
      console.error('Error adding new product:', e);
    }
  };

  // ฟังก์ชันสำหรับลบสินค้า

const handleDeleteProduct = async (productId) => {
  if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้ารายการนี้?")) {
    try {
      const { error } = await DB
        .from('product')
        .delete()
        .eq('productid', productId);
      
      if (error) throw error;

      await DB.rpc('reset_productid');

      await fetchProducts(); // ดึงข้อมูลใหม่เพื่อแสดงรายการที่อัปเดต
      console.log('ลบสินค้าสำเร็จ!');

    } catch (e) {
      setError('ไม่สามารถลบสินค้าได้: ' + e.message);
      console.error('Error deleting product:', e);
    }
  }
};

const openHistory = async(productId)=> {
  setShowhistory(true);
  setProductHis(productId);
};

const closeHis = () => {
  setShowhistory(false);
}



  if (loading) return <div className="loading">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="error">{error}</div>;

  return (

    <><div className="pos-container">
      <header className="header">
      </header>
        <div className='Logo'>
          <img src='src\assets\pic\f111a4d9e98c2f1849285d198126666303e67f65.png'></img><h1>PPJ SPROT</h1>
        </div>
      <main className="main-content">
        <div className="product-actions">
          <div className="page-header-logo">
            {/* เราจะใช้ไอคอน faBoxArchive ที่คุณ import มาแล้ว */}
            <FontAwesomeIcon icon={faBoxArchive} className="header-icon" />
            <div className="header-text-container">
              <span className="header-main-text">คลังสินค้า</span>
              <span className="header-sub-text">หน้าหลัก</span>
            </div>
          </div>
          <div className='bottom'></div>
          <input
            type="text"
            placeholder="🔍 ค้นหาสินค้า (SKU, ชื่อ, ราคา, หมวดหมู่)"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
          <div className='add-new-product'>
            <button className="btn-save-add" onClick={openAddModal}><FontAwesomeIcon icon={faCartPlus} /></button>
            <p>เพิ่มสินค้าใหม่</p>
          </div>
        </div>
        <div className="border"></div>
        <div className="product-list-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>รูปภาพ</th>
                <th>SKU</th>
                <th>ชื่อสินค้า</th>
                <th>หมวดหมู่สินค้า</th>
                <th>ราคา</th>
                <th>จำนวน</th>
                <th>เกณฑ์ขั้นต่ำ</th>
                <th>รายการเพิ่มเติม</th>

              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.productid}
                  className={product.initialquantity < product.minimumcriteria ? 'low-stock' : ''} 
                  title={product.initialquantity < product.minimumcriteria ? 'เหลือน้อยแล้ว!' : ''}>
                  <td>
                    <div className="product-image-cell">
                        <img src={product.image_url} alt={`รูปภาพสินค้า ${product.productname}`} className="product-thumbnail" />
                    </div>
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.productname}</td>
                  <td>{getCategoryName(product.categoryid)}</td>
                  <td>{product.price} บาท</td>
                  <td>{product.initialquantity} ชิ้น</td>
                  <td>{product.minimumcriteria} ชิ้น</td>
                  <td>
                    <div className='more_items_button'>
                        <button className="btn btn_plus_minus" onClick={() => handleUpdateQuantity(product)} title='ทำรายการ เพิ่ม/ถอน'>
                          <FontAwesomeIcon icon={faArrowsUpDown} />
                        </button>
                      <button className="btn btn_history" onClick={() => openHistory(product.productid)} title='ประวัติการทำรายการของสินค้าชิ้นนี้'>
                        <FontAwesomeIcon icon={faFileArrowDown} />
                      </button>
                      <button className="btn btn-edit" onClick={() => openEditModal(product)} title='แก้ไขรายละเอียด' >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button className="btn btn_plus_minus" onClick={() => handleDeleteProduct(product.productid)} title='ลบสินค้าจากคลัง'>
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </div>
                  </td>
                </tr>

              ))}

            </tbody>
          </table>

        </div>
      </main>
      <Modal
        isVisible={isModalOpen}
        product={selectedProduct}
        onClose={closeModal}
        onSave={handleSaveQuantity} />
      <EditProductModal
        isVisible={isEditModalOpen}
        product={productToEdit}
        categories={categories}
        onClose={closeEditModal}
        onSave={handleEditSave} />
      <AddProductModal
        isVisible={isAddModalOpen}
        categories={categories}
        onClose={closeAddModal}
        onSave={handleAddSave} />

      <ProductLog popupstate={Showhistory}
        productId={ProducHis}
        closeHis={closeHis} />
    </div>
    
    <nav className="bottom-nav">
        <div className="nav-item active">
          <FontAwesomeIcon icon={faBoxArchive} className="nav-icon" />
          <span className="nav-label">คลังสินค้า</span>
        </div>
        <div className="nav-item">
          <FontAwesomeIcon icon={faFileInvoice} className="nav-icon" />
          <span className="nav-label">ประวัติรวม</span>
        </div>
        <div className="nav-item">
          <FontAwesomeIcon icon={faBell} className="nav-icon" />
          <span className="nav-label">การแจ้งเตือน</span>
        </div>
        <div className="nav-item">
          <FontAwesomeIcon icon={faGear} className="nav-icon" />
          <span className="nav-label">การตั้งค่า</span>
        </div>
        <div className="nav-item">
          <img src="src\assets\pic\f111a4d9e98c2f1849285d198126666303e67f65.png" alt="Profile" className="nav-profile-img" />
          <span className="nav-label">โปรไฟล์</span>
        </div>
      </nav>
    </>

  
    
  );
}

export default MPL ;
