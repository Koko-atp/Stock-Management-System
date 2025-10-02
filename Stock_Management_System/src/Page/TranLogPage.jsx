import { useEffect, useState } from "react";
import DB from "../assets/DB";

function TranPage (visible) {
    const[LogData , setLogData] = useState([]);
    const[search , setsearch] = useState(['']);
    const [filLog , setfilLog] = useState([]);

 /// LoadLog ///
        const fetchLog = async () => {
       try{
           const{data ,error} = await DB.from('stocktransaction')
           .select('quantity , note , transactiondate ,  transactionid , transactiontype( transactiontypeid , typename ) , product( productname) ')
           .order('transactiondate' , {ascending: false})
           setLogData(data);
           if (error) throw error;
        } 
        catch(e){
            console.error("Can't Load History Log" , e);
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
},[search , LogData]);

/// LoadLogic ///
  useEffect(() => {
          if(visible) {
              fetchLog() }
        },[visible]); 


    if(!visible) return null;

    return(
        <div className="contentholder">

            <div className="pageHead">
                <div className="Logo">History</div>
                <input className="searchbar"
                            placeholder="👾"
                            onChange={(e) => setsearch(e.target.value)}
                            >
                </input>
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
                        <td>{pLog.transactiondate}</td>
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