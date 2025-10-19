import { useState } from "react";
import MPL from "./Page/MainProductListPage";
import Pfooter from "./cpn/Pagefooter";
import TranPage from "./Page/TranLogPage";
import Hprofile from './cpn/ProfileLogo'
import Noticpage from "./Page/NoticePage";
import Dashboard from"./Page/DashBoard"

function App() {
    const [MPLP , setMPLP] = useState(true);
    const [TransacLog , setTransacLog] = useState(false);
    const [Notic , setNotic] = useState(false);
    const[DashBoard , setDashBoard] = useState(false);

    const [Pdirect , setPdirect] = useState('')
    const [Pcatdirect , setPcatdirect] = useState('')


    const directfromNotic = (Productsku) => {
      setPdirect(Productsku)
      openMPLP()
    }

    const openMPLP= () => {
      setTransacLog(false);
      setNotic(false)
      setDashBoard(false);
      setMPLP(true);
    }

    const openTransac = () => {
      setMPLP(false);
      setNotic(false)
      setDashBoard(false);
      setTransacLog(true);
    }

    const openNotification = () => {
      setTransacLog(false)
      setMPLP(false)
      setDashBoard(false);
      setNotic(true)
    }

    const openDashboard = () => {
      setTransacLog(false);
      setMPLP(false);
      setNotic(false);
      setDashBoard(true);
    }

 return(
  <> 
   <Hprofile/>
    <MPL open={MPLP}
    tocatedirect={Pcatdirect}
    clearCate={setPcatdirect}
    todirct={Pdirect}
    cleardirect={setPdirect}/>

    <TranPage visible={TransacLog}/>

    <Noticpage visible={Notic} 
    fromdirct={directfromNotic}/>

    <Dashboard visible={DashBoard}
    toMPLP={openMPLP}
    toTransac={openTransac}
    toNotice={openNotification}
    fromCatedirect={setPcatdirect}
    / >




    <Pfooter 
    MainP={openMPLP} 
    TransacP={openTransac}
    NoticP={openNotification}
    DashboardP={openDashboard}

    onMainP={MPLP}
    onTransacP={TransacLog}
    onNotic={Notic}
    onDashboard={DashBoard}
    />
  </>
 );
}
export default App;