import { useEffect, useState } from "react";
import DB from "../assets/DB";
import '../CSS/Transaction.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFileInvoice,
    faList
} from '@fortawesome/free-solid-svg-icons';


function TranPage ({visible}) {
    const[loading , setload] = useState(true)
    const[LogData , setLogData] = useState([]);
    const[search , setsearch] = useState(['']);
    const [filLog , setfilLog] = useState([]);
    const [sortchoice , setschoice] = useState();
    const [sortby , setsort] = useState('transactiondate');
    const[ascend , setasc] = useState(false);

 /// LoadLog ///
    const fetchLog = async () => {
       try{
           const{data ,error} = await DB.from('stocktransaction')
           .select('quantity , note , transactiondate ,  transactionid , transactiontype( transactiontypeid , typename ) , product( productname) ')
           .order(sortby , {ascending: ascend})
           setLogData(data);
           if (error) throw error;
        } 
        catch(e){
            console.error("Can't Load History Log" , e);
        }
        finally {
            setload(false);
        }
    };
    
    /// searchung ///
    useEffect(() => {
        const result = LogData.filter( LogData =>
            LogData.transactiondate.includes(search) ||
            LogData.transactiontype.typename.toLowerCase().includes(search.toLowerCase()) ||
            LogData.product.productname.toLowerCase().includes(search.toLowerCase())
        );
        setfilLog(result);
    },[search , LogData , sortby]);
    
    /// LoadLogic ///
    useEffect(() => {
        if(visible) {
            fetchLog()
        }
    },[visible, loading]);
    /////////////////////////////////////////////////////////////
    
    const veiwby = (e) => {
        if (e === 'minquantity') {
            setsort('quantity')
            setasc(true)
        } else{
            setsort(e)
            setasc(false)
        };
        setschoice(e);
        setload(true)
    }
    if(visible) 
        if (loading) return <div className="loading">กำลังโหลดข้อมูล...</div>;
    else
        return(
        <div className="pos-container">
            <div className="main-content" >

            <div className="pageHead">

                <div className='page-header-logo'>
                    <FontAwesomeIcon icon={faFileInvoice} className="header-icon" />
                     <div className="header-text-container">
                    <span className="header-main-text">ประวัติรวม</span>
                     </div>
                </div>
                
                <input className="search-input"
                            placeholder="🔎ค้นหาสินค้าโดย ชื่อสินค้า / วันที่ / ประเภทรายการ"
                            value={search}
                            onChange={(e) => setsearch(e.target.value)}>
                </input>
                
                <div className="sort-by">
                    <p>จัดเรียงตาม</p>

                    <FontAwesomeIcon icon={faList} />
                <select className="sort-option" value={sortchoice} onChange={(e) => veiwby(e.target.value) }>
                    <option value='transactiondate' > วันที่ล่าสุด </option>
                    <option value='quantity' > จำนวนชิ้นมากสุด </option>
                    <option value='minquantity'> จำนวนชิ้นน้อยสุด </option>
                </select>
                </div>

            </div>


            <table className="LogTable">

                <thead>
                    <tr>
                    <th>วันที่เวลา</th>
                    <th>จำนวน</th>
                    <th>ประเภท</th>
                    <th>สินค้า</th>
                    <th>หมายเหตู</th>
                    </tr>
                </thead>

                <tbody>
                    {filLog.map((pLog ) => (
                        <tr key= {pLog.transactionid}>
                        <td>{pLog.transactiondate.replace('T' , ' : ')}</td>
                        <td>{pLog.quantity}</td>
                        <td>{pLog.transactiontype.typename}</td>
                        <td>{pLog.product.productname}</td>
                        <td>{pLog.note || '-'}</td>
                    </tr> 
                    ))}
                </tbody>

            </table>

            </div>
        </div>
    );
    else return null
}
export default TranPage ;