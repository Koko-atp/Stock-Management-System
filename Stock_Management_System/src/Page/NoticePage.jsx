import { useEffect, useState } from "react";
import DB from "../assets/DB";
import '../CSS/NoticPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';


function Noticpage({visible , fromdirct}) {
    const[loading , setload] = useState(true);
    const[NoticLog , setNoticLog] = useState([]);

    const  fetchNotic = async () => {
       try{
           const{data ,error} = await DB.from('stocknotification')
           .select('productid , notificationdate , notificationmessage , product(productname , sku) ')
           .order('notificationdate' , {ascending : false})
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
        <div className="Notic-page-header-logo">
            <div className="Notic-title">

        <FontAwesomeIcon icon={faBell}  className="header-icon" />
          <div className="Notic-header-text-container">
            <span className="header-main-text">การแจ้งเตือน</span>
            </div>

            </div>
      </div>

      <div className="border"></div>
      <div className="product-list-container"></div>
            <table className="Notic_table">
                <tbody>
                        {NoticLog.map((NLog) => (    
                    <tr key={NoticLog.productid}>
                        <td>
                        <div className="Notic_box" onClick={() => (fromdirct(NLog.product.sku))}>
                            <span>{NLog.notificationdate.replace('T' ,' : ')}</span>
                            <div>{NLog.product.productname} : {NLog.notificationmessage}</div>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
    </div>
    </div>
</div>
    );}}
export default Noticpage;