function Hprofile() {
    const profileImageUrl = 'https://kdyryibnpimemkrpurja.supabase.co/storage/v1/object/public/Proflie/Proflie.png';

    return(
        <div className='Logo'>
            {/* แก้ไข src ให้ใช้ URL ใหม่ */}
            <img src={profileImageUrl} alt="Profile Logo" />
            <h1>PPJ SPROT</h1>
        </div>
    );
}
export default Hprofile;