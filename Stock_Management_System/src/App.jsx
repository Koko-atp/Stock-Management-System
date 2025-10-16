import { useState } from "react";
import MPL from "./Page/MainProductListPage";
import Pfooter from "./cpn/Pagefooter";
import TranPage from "./Page/TranLogPage";
import Hprofile from './cpn/ProfileLogo'
import Noticpage from "./Page/NoticePage";

function App() {
    const [MPLP , setMPLP] = useState(true);
    const [TransacLog , setTransacLog] = useState(false);
    const [Notic , setNotic] = useState(false);


    const openMain= () => {
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
    <MPL open={MPLP}/>
    <TranPage visible={TransacLog}/>
    <Noticpage visible={Notic} />

    <Pfooter 
    MainP={openMain} 
    TransacP={openTransac}
    NoticP={openNotification}
    />
  </>
 );
}
export default App;