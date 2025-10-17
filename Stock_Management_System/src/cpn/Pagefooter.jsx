import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBoxArchive, // ไอคอนสำหรับคลังสินค้า (แทนกล่อง)
    faFileInvoice, // ไอคอนสำหรับประวัติรวม
    faBell, // ไอคอนสำหรับแจ้งเตือน
    faGear, // สำหรับปุ่มเพิ่มสินค้าใหม่ด้านบน
} from '@fortawesome/free-solid-svg-icons';
import'../CSS/footer.css'

function Pfooter({load , MainP , TransacP , NoticP , onNotic , onTransacP , onMainP}) {

  const profileImageUrl = 'https://kdyryibnpimemkrpurja.supabase.co/storage/v1/object/public/Proflie/Proflie.png';
  
  if(load) return null
    return(
      <>
      <nav className="bottom-nav">

            <div className={onMainP === true? 'nav-item active' : 'nav-item'}
               >
              <button className='nav-box' onClick={() => MainP()}>
                <FontAwesomeIcon icon={faBoxArchive} className="nav-icon" />
              <span className="nav-label">คลังสินค้า</span>
              </button>
            </div>

            <div className={onTransacP === true? 'nav-item active' : 'nav-item'}
           >
              <button className='nav-box' onClick={() => TransacP() }>
                <FontAwesomeIcon icon={faFileInvoice} className="nav-icon" />
                <span className="nav-label">ประวัติรวม</span>
                </button>
            </div>

        <div className={onNotic === true? 'nav-item active' : 'nav-item'}
                   >
          <button className='nav-box' onClick={() => NoticP() }>
            <FontAwesomeIcon icon={faBell} className="nav-icon" />
            <span className="nav-label">การแจ้งเตือน</span>
          </button>
        </div>

        <div className="nav-item">
          <button className='nav-box' >
          <FontAwesomeIcon icon={faGear} className="nav-icon" />
          <span className="nav-label">การตั้งค่า</span>
          </button>
        </div>
        <div className="nav-item">
          <img src={profileImageUrl} alt="Profile" className="nav-profile-img" />
          <span className="nav-label">โปรไฟล์</span>
        </div>

      </nav>
        </>
    );
}
export default Pfooter;