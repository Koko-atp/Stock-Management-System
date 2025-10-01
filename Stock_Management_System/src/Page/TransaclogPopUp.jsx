import { useEffect, useState } from "react";
import DB from "../assets/DB";
import './transac.css';

function ProductLog({popupstate , productId , closeHis }) {
    const[LogData , setLogData] = useState([]);
    


    ////////////    Load Log    ////////////
    const fetchLog = async () => {
       try{
           const{data ,error} = await DB.from('stocktransaction')
           .select('quantity , note , transactiondate ,  transactionid   , transactiontype( transactiontypeid , typename ) , product(productid)')
           .eq('productid' , productId)
           .order('transactiondate' , {ascending: false})
           setLogData(data);
           if (error) throw error;
        } 
        catch(e){
            console.error("Can't Load History Log" , e);
        }
    };

    /////  load when change  /////
    useEffect(() =>{
             if (popupstate) {
                fetchLog();}
    } , [popupstate]);

    if(!popupstate) return null;
    return(
        <div className="productlog_Popup">
        <div className="LogContent">
            <button className="closebutton" onClick={() => closeHis()}>
                -
            </button>
            <div className="TableTitle">ประวัติการทำรายการ</div>
            <div className="TLog-Table">
            <table >

                <thead>
                    <tr>
                    <th>วันที่เวลา</th>
                    <th>จำนวน</th>
                    <th>ประเภท</th>
                    <th>หมายเหตู</th>
                    </tr>
                </thead>

                <tbody>
                    {LogData.map((pLog ) => (
                        <tr key= {pLog.transactionid}>
                        <td>{pLog.transactiondate}</td>
                        <td>{pLog.quantity}</td>
                        <td>{pLog.transactiontype.typename}</td>
                        <td>{pLog.note || '-'}</td>
                    </tr> 
                    ))}
                </tbody>

            </table>

            </div>
            </div>
        </div>
    );
}
export default ProductLog; 