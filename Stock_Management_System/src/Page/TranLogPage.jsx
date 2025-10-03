import { useEffect, useState } from "react";
import DB from "../assets/DB";
import '../CSS/Transaction.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileInvoice, // ไอคอนสำหรับประวัติรวม
} from '@fortawesome/free-solid-svg-icons';

function TranPage ({visible}) {
    const[loading , setload] = useState(true)
    const[LogData , setLogData] = useState([]);
    const[search , setsearch] = useState(['']);
    const [filLog , setfilLog] = useState([]);
    const [sortchoice , setschoice] = useState();
    const [sortby , setsort] = useState('');
    const[ascend , setasc] = useState(false);

 /// LoadLog ///
    const fetchLog = async () => {
       try{
           const{data ,error} = await DB.from('stocktransaction')
           .select('quantity , note , transactiondate ,  transactionid , transactiontype( transactiontypeid , typename ) , product( productname) ')
           .order(sortby === ''? 'transactiondate' : sortby , {ascending: ascend})
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
        },[visible , loading]);

/////////////////////////////////////////////////////////////

    const veiwby = (e) => {
        setload(true);
        if (e === 'minquantity') {
            setsort('quantity')
            setasc(true)
        } else{
            setsort(e)
            setasc(false)
        };
        setschoice(e);
        fetchLog();
    }

    if(!visible) return null;
    if (loading) return <div className="loading">กำลังโหลดข้อมูล...</div>;
    return(
        <div className="contentholder">
            <div className="pageHead">

                <dvi className='PageLogo'>
                    <FontAwesomeIcon icon={faFileInvoice} className="HeaderLogo" />
                    History</dvi>
                
                <input className="searchbar"
                            placeholder="👾"
                            value={search}
                            onChange={(e) => setsearch(e.target.value)}>
                </input>

                <select value={sortchoice} onChange={(e) => veiwby(e.target.value) }>
                    <option value='transactiondate' > วันที่ล่าสุด </option>
                    <option value='quantity' > จำนวนชิ้นมากสุด </option>
                    <option value='minquantity'> จำนวนชิ้นน้อยสุด </option>
                </select>
            </div>

            <div className="maincontent" >

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
}
export default TranPage ;