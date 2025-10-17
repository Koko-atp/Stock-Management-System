import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBoxArchive, // ไอคอนสำหรับคลังสินค้า (แทนกล่อง)
    faFileInvoice, // ไอคอนสำหรับประวัติรวม
    faBell, // ไอคอนสำหรับแจ้งเตือน
    faGear, // สำหรับปุ่มเพิ่มสินค้าใหม่ด้านบน
} from '@fortawesome/free-solid-svg-icons';
import'../CSS/footer.css'

function Pfooter({load , MainP , TransacP , NoticP , onNotic , onTransacP , onMainP}) {


  if(load) return null
    return(
      <>
        <nav className="bottom-nav">

            <div className={onMainP === true? 'nav-item active' : 'nav-item'}
                onClick={() => MainP()}>
                <FontAwesomeIcon icon={faBoxArchive} className="nav-icon" />
              <span className="nav-label">คลังสินค้า</span>
            </div>

            <div className={onTransacP === true? 'nav-item active' : 'nav-item'}
            onClick={() => TransacP() }>
          <FontAwesomeIcon icon={faFileInvoice} className="nav-icon" />
          <span className="nav-label">ประวัติรวม</span>
        </div>

        <div className={onNotic === true? 'nav-item active' : 'nav-item'}
                  onClick={() => NoticP() } >
          <FontAwesomeIcon icon={faBell} className="nav-icon" />
          <span className="nav-label">การแจ้งเตือน</span>
        </div>

        <div className="nav-item">
          <FontAwesomeIcon icon={faGear} className="nav-icon" />
          <span className="nav-label">การตั้งค่า</span>
        </div>
        <div className="nav-item">
          <img src="src\assets\pic\f111a4d9e98c2f1849285d198126666303e67f65.png" alt="Profile" className="nav-profile-img" />
          <span className="nav-label">โปรไฟล์</span>
        </div>

      </nav>
        </>
    );
}
export default Pfooter;