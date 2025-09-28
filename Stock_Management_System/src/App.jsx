import MPL from "./Page/MainProductListPage";
import Mfooter from "./cpn/Pagefooter";
import TranPage from "./Page/TranLogPage";
function App() {
 return(
<div className="App">  
  <MPL/>
  {/* <TranPage visble = {true}/> */}
  <Mfooter/>
</div>
 );
}
export default App;