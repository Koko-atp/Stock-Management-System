function Hprofile() {
    const profileImageUrl = 'https://kdyryibnpimemkrpurja.supabase.co/storage/v1/object/public/Proflie/Proflie.png';

    return(
        <div className='Logo'>
            {/* แก้ไข src ให้ใช้ URL ใหม่ */}
            <img src={profileImageUrl} alt="Profile Logo" />
            <p>PPJ SPROT</p>
        </div>
    );
}
export default Hprofile;