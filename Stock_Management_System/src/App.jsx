import MPL from "./Page/MainProductListPage";
import Pfooter from "./cpn/Pagefooter";
import ProductLog from "./Page/TransaclogPage";

function App() {
 return(
<div className="App">  
  <MPL/>
  {/* <ProductLog popupstate={true}/>    ยังไม่เสร็จ    */} 
  <Pfooter/>
</div>
 ); 
}
export default App;