import { useEffect, useState } from "react";
import DB from "../assets/DB";


function Noticpage(visible) {
    const[loading , setload] = useState(true);
    const[NoticLog , setNoticLog] = useState([]);

    const  fetchNotic = async () => {
       try{
           const{data ,error} = await DB.from('stocktransaction')
           .select('product(productname) , stocknotification(notificationmessage , notificationdate)')
           .order('notificationdate')
           setNoticLog(data);
           if (error) throw error;
        } 
        catch(e){
            console.error("Can't Load History Log" , e);
        }
        finally {
            setload(false);
        }
        };
    useEffect(() => {
        fetchNotic()
    },[visible , loading])
    
    if(visible) {return (
        <div>
            <table>
                <tbody>
                </tbody>
            </table>
        </div>
    );}
}
export default Noticpage;