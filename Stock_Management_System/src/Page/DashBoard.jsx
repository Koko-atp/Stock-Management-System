import DB from '../assets/DB'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxesStacked ,
    faBoxArchive ,
    faBoxOpen,
    faBars ,
    faTriangleExclamation,
    faArrowTrendUp
 } from '@fortawesome/free-solid-svg-icons';
 import  '../CSS/Dashboard.css';



function Dashboard({visible , toMPLP , toTransac , toNotice}){

    const [productnum , setproduct] = useState('-')
    const [productsum , setsumpro] = useState('-')
    const [catenum , setcatenum] = useState('-')
    const [noticenum , setnoticnum] = useState('-')
    const [transacsum , settransum] = useState('-')
    
    const gettransacsum = async() =>{
        let { data, error } = await DB.rpc('get_sum_transac_out') ;
        if (error) {
            console.error(error)
        }else settransum(data)
    }
    
    const getNotice = async() =>{
        let { data, error } = await DB.rpc('count_item', {table_name: 'stocknotification'}) ;
        if (error) {
            console.error(error)
        }else setnoticnum(data)
    }
    const getcate = async() =>{
        let { data, error } = await DB.rpc('count_item', {table_name: 'category'}) ;
        if (error) {
            console.error(error)
        }else setcatenum(data)
    }
    const getproductnum = async() =>{
        let { data, error } = await DB.rpc('count_item', {table_name: 'product'}) ;
        if (error) {
            console.error(error)
        }else setproduct(data)
    }
    
    const getproductsum = async() =>{
        let { data, error } = await DB.rpc('get_sum_of', {table_name: 'product' , column_name: 'initialquantity'}) ;
        if (error) {
            console.error(error)
        }else setsumpro(data)
    }
    
    
    useEffect(() => {
        getNotice()
        getproductnum()
        getproductsum()
        getcate()
        gettransacsum()
    },[visible])
    
if(visible){
    return(
         <div>
        <div className="pos-container">
        
        <div className="main-content">
        <div className="Notic-page-header-logo">
        <div className="Notic-title">

        <FontAwesomeIcon icon={faBoxesStacked}  className="header-icon" />
          <div className="header-text-container">
            <span className="header-main-text">ภาพรวม</span>
            <span className="header-sub-text">สรุปสินค้า</span>
        </div>

            </div>
      </div>

      <div className="border"></div>

      <div className='dashboard'>

      <div className='dashboard-box' onClick={toMPLP}>
        <FontAwesomeIcon icon={faBoxArchive} className='dashboard-icon'/>
        <div className='dash-text-box'>
        <span> สินค้าทั้งหมด </span>
        <span>{productnum} รายการ</span>
        </div>
      </div>

  
      <div className='dashboard-box' onClick={toMPLP}>
        <FontAwesomeIcon icon={faBoxOpen} className='dashboard-icon' />
        <div className='dash-text-box'>
        <span> จำนวนสินค้าทั้งหมด </span>
        <span>{productsum} ชิ้น</span>
        </div>
      </div>
      
      <div className='dashboard-box' onClick={toMPLP}>
        <FontAwesomeIcon icon={faBars} className='dashboard-icon'/>
        <div className='dash-text-box'>

        <span> ประเภทสินค้าทั้งหมด </span>
        <span>{catenum} ประเภท</span>

        </div>
      </div>
        
      <div className='dashboard-box' onClick={toNotice}>

       <FontAwesomeIcon icon={faTriangleExclamation} className='dashboard-icon dashboard-Notice'/>
       <div className='dash-text-box'>
        <span>การแจ้งเตือนทั้งหมด</span>
        <span>{noticenum} รายการ</span>
       
       </div>
      </div>
        
    <div className='dashboard-box' onClick={toTransac}>


       <div className='dash-text-box'>
       <FontAwesomeIcon icon={faArrowTrendUp} className='dashboard-icon'/>
       <hr/>
        <span> สิ้นค้าออกทั้งหมด </span>
        <span>{transacsum} ชิ้น</span>
       
       </div>
      </div>
        
    </div>
    </div>
    </div>
</div>
)
}

} export default Dashboard;