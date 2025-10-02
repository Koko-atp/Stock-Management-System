import MPL from "./Page/MainProductListPage";
import Pfooter from "./cpn/Pagefooter";
import TranPage from "./Page/TranLogPage";
function App() {
 return(
<div className="App">  
  {/* <MPL/> */}
  <TranPage visble = {true}/>
  <Pfooter/>
</div>
 );
}
export default App;