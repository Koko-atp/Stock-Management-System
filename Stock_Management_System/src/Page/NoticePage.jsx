import { useEffect, useState } from "react";
import DB from "../assets/DB";


function Noticpage({visible}) {
    const[loading , setload] = useState(true);
    const[NoticLog , setNoticLog] = useState([]);

    const  fetchNotic = async () => {
       try{
           const{data ,error} = await DB.from('stocknotification')
           .select('productid , notificationdate , notificationmessage , product(productname) ')
           .order('notificationdate')
           setNoticLog(data);
           if (error) throw error;
        } 
        catch(e){
            console.error("Can't Load Notification" , e);
        }
        finally {
            setload(false);
        }
        };
    useEffect(() => {
        fetchNotic()
    },[visible , loading])
    
    if(visible) {
        if(loading) return <div className="loading">กำลังโหลดข้อมูล...</div>;
        else
            return (
        <div>
    <div className="pos-container">
        
    <div className="main-content">
        <div className="page-header-logo">
      </div>

      <div className="border"></div>
      <div className="product-list-container"></div>
            <table>
                <tbody>
                        {NoticLog.map((NLog) => (    
                            <tr key={NoticLog.productid}>
                        <td>
                        <div className="" >
                            <span>{NLog.notificationdate.replace('T' ,' : ')}</span>
                            <div>{NLog.product.productname} {NLog.notificationmessage}</div>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>

    </div>
    </div>
</div>
    );
}
}
export default Noticpage;