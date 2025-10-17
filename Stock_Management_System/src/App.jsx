import { useState , useEffect } from "react";
import MPL from "./Page/MainProductListPage";
import Pfooter from "./cpn/Pagefooter";
import TranPage from "./Page/TranLogPage";
import Hprofile from './cpn/ProfileLogo'
import Noticpage from "./Page/NoticePage";

function App() {
    const [MPLP , setMPLP] = useState(true);
    const [TransacLog , setTransacLog] = useState(false);
    const [Notic , setNotic] = useState(false);

    const [Pdirect , setPdirect] = useState('')
    const [footerload , setfooterload] = useState(true)
    
    useEffect(() => {
    setfooterload(false)
  },[footerload])

    const directfromNotic = (Productsku) => {
      setPdirect(Productsku)
      openMPLP()
    }
    const openMPLP= () => {
        setMPLP(true);
        setTransacLog(false);
        setNotic(false)
    }

    const openTransac = () => {
      setTransacLog(true);
      setMPLP(false);
      setNotic(false)
    }

    const openNotification = () => {
      setNotic(true)
      setTransacLog(false)
      setMPLP(false)
    }

 return(
  <> 
   <Hprofile/>
    <MPL open={MPLP}
    todirct={Pdirect}/>

    <TranPage visible={TransacLog}/>

    <Noticpage visible={Notic} 
    fromdirct={directfromNotic}/>

    <Pfooter 
    MainP={openMPLP} 
    TransacP={openTransac}
    NoticP={openNotification}

    onMainP={MPLP}
    onTransacP={TransacLog}
    onNotic={Notic}
    load={footerload}
    />
  </>
 );
}
export default App;