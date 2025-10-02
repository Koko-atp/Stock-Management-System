import MPL from "./Page/MainProductListPage";
import Pfooter from "./cpn/Pagefooter";
import TranPage from "./Page/TranLogPage";
import { useState } from "react";

function App() {
    const [MPLP , setMPLP] = useState(true);
    const [TransacLog , setTransacLog] = useState(false);


    const openMain= () => {
        setMPLP(true);
        setTransacLog(false);
    }

    const openTransac = () => {
      setMPLP(false);
      setTransacLog(true);
    }

 return(
  <> 
    <MPL open={MPLP}/>
    <TranPage visible={TransacLog}/>

    <Pfooter 
    MainP={openMain} 
    TransacP={openTransac}
    />
  </>
 );
}
export default App;