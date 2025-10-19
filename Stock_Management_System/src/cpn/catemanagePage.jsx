import { useEffect, useState } from "react";
import DB from "../assets/DB";

function Catemanager({visible , close , fromCate , toMPLP}) {
    const [load , setLoading] = useState(true)
    const [category , setcategory] = useState([]);
    const [newcat , setnewcat] = useState('')

    const getCate = async() =>{
        let {data , error} = await DB.rpc('get_category_stats')
        if(error){console.log('ไม่สามารถดึงข้อมูลได้ ' , {error})}
        else{setcategory(data)
            setLoading(false)
        }
    }

    useEffect(() => {
        getCate()
    },[visible , load])


const tocatedirect = (cateid) => {
    fromCate(cateid);
    toMPLP();
}

const addcate = async() =>{
        if (newcat.trim() !== '') {
        try {
            const { data: wasAdded, error: rpcError } = await DB.rpc('add_new_category', {
                new_category_name: newcat.trim()
            });
            if (rpcError) throw rpcError; 

            if (wasAdded) {
                console.log(`✅ เพิ่มหมวดหมู่ใหม่ "${newcat.trim()}" สำเร็จ`);
            } else {
                alert(`ℹ️ หมวดหมู่ "${newcat.trim()}" มีอยู่แล้วในระบบ`);
                return;
            }
            } catch (error) {
            alert('เกิดข้อผิดพลาดในการจัดการหมวดหมู่: ' + error.message);
            return;
        }}

 setnewcat('')
setLoading(true)
};

    const removecate = async(id) =>{
        console.log(id)
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?')) return;

        let {error}  = await DB.rpc('del_category' , {cateid: id})
        if(error) {alert('ลบไม่สำเร็จ' , error.message)
            return;
        }
        else{setLoading(true)}
    }

    onclose = () => {
        setnewcat('')
        close(false)
    }

    if(visible){
        if(load) return null;
        return(  
        <div className="productlog_Popup">
        <div className="LogContent">
            <div className="TableTitle">จัดการหมวดหมู่</div>
            <div className="catmanageTable">
            <table >

                <tbody>
                    {category.map((cat) => (
                        <tr key={cat.id}>
                            <td><div> {cat.name} </div>
                            </td>
                            <td>
                                <div>
                                {cat.count == 0 ? 
                                    <div className="dashboard-box-cate0" onClick={() => removecate(cat.id)}>
                                       มี {cat.count} รายการ ลบหมวดหมู่
                                        </div> 
                                    : <div className='dashboard-box' onClick={() => tocatedirect(cat.id)} >
                                        มี {cat.count} รายการในหมวดหมู่นี้
                                    </div>
                                         }
                                </div>
                            </td></tr>
                    ))}
                </tbody>
            </table>

            </div>
            < input className='catemanageinput' placeholder='เพิ่มหมวดหมู่ใหม่' onChange={(e) => setnewcat(e.target.value)} />
            {newcat !== ''?
                    <button className="btn btn-save" onClick={() => addcate()}> เพิ่มหมวดหมู่ใหม่! </button>
                    :<button className="btn" >ใส่ชื่อหมวดหมู่ใหม่ก่อน!</button>
            }
            <hr/>
                    <button className="btn btn-delete" onClick={() => onclose()}> ออก </button>
            </div>
        </div>
        )}
}export default Catemanager;