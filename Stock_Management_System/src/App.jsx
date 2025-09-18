import MPL from "./Page/MainProductListPage";
import Mfooter from "./cpn/Pagefooter";
import ProductLog from "./Page/TransaclogPage";

function App() {
 return(
<div className="App">  
  <MPL/>
  {/* <ProductLog popupstate={true}/>    ยังไม่เสร็จ    */} 
  <Mfooter/>
</div>
 ); 
}
export default App;