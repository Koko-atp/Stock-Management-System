import { BarChart, Bar,  XAxis, YAxis, Tooltip , LabelList , ResponsiveContainer} from 'recharts';
import DB from '../assets/DB';
import { useEffect, useState } from 'react';
function Productgraph (visible) {
    const [findata , setdata] = useState([])
    const getdata = async() =>{
        let {data , error} = await DB.rpc('get_catepro_forchart');
        if (error) {
            console.log(error)
        }else {
            console.log(data)
            setdata(data)}
    }

    useEffect(() => {
        if(visible){
            getdata()
        }
    },[visible])
    

    const customTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#ffffffff', border: '1px solid #ccc', padding: 10 }}>
        <p>{` ${label}`}</p>
        <p style={{color: '#1234cbae',  fontWeight: 'bold'}}>{`จำนวนสิค้า: ${payload[0].value} รายการ`} </p>
      </div>
    );
  }
  return null;
};



if (visible)
    return(
     <div className='dashboradgarph'>
        <span>จำนวนสินค้าแต่ละหมวดหมู่</span>
        <hr/>
<ResponsiveContainer width='100%' height='100%'>
    <BarChart data={findata}>
  <XAxis dataKey="categoryname" angle={0} textAnchor="start"/>
  <YAxis />
  <Tooltip content={customTooltip}/>

  <Bar type="monotone" dataKey="productnum" fill='#82ca9d' stroke="#82ca9d" >
    <LabelList dataKey="categoryname" position="insideTop" angle={45} />
    </Bar>
</BarChart>
</ResponsiveContainer>
    </div>
    )
}export default Productgraph;