import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBoxArchive, // ไอคอนสำหรับคลังสินค้า (แทนกล่อง)
    faFileInvoice, // ไอคอนสำหรับประวัติรวม
    faBell, // ไอคอนสำหรับแจ้งเตือน
    faBoxesStacked
} from '@fortawesome/free-solid-svg-icons';
import'../CSS/footer.css'

function Pfooter({ MainP , TransacP , NoticP , DashboardP , onNotic , onTransacP , onMainP , onDashboard}) {

  const profileImageUrl = 'https://kdyryibnpimemkrpurja.supabase.co/storage/v1/object/public/Proflie/Proflie.png';
  
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

            <div className={onTransacP === true? 'nav-item active' : 'nav-item'}>
              <button className='nav-box' onClick={() => TransacP() }>
                <FontAwesomeIcon icon={faFileInvoice} className="nav-icon" />
                <span className="nav-label">ประวัติรวม</span>
                </button>
            </div>

        <div className={onNotic === true? 'nav-item active' : 'nav-item'}>
          <button className='nav-box' onClick={() => NoticP() }>
            <FontAwesomeIcon icon={faBell} className="nav-icon" />
            <span className="nav-label">การแจ้งเตือน</span>
          </button>
        </div>

        <div className={onDashboard === true? 'nav-item active' : 'nav-item'}>
          <button className='nav-box' onClick={DashboardP}>
          <FontAwesomeIcon icon={faBoxesStacked} className="nav-icon" />
          <span className="nav-label">ภาพรวม</span>
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