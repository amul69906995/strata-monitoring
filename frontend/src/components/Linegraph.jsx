import React, { useEffect, useState ,useContext} from 'react'
import '../css/linegraph.css'
import instrumentTypeContext from '../context/instrumenttype.context';
import { LineChart, Line, CartesianGrid, XAxis, YAxis,Tooltip,Legend,ResponsiveContainer, AreaChart,Area,Label,ComposedChart } from 'recharts';
import { instrumentName,instrumentCode,instrumentUnit } from '../utils/unit';
import FullViewContext from '../context/view.context';
const Linegraph = ({requiredData}) => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
const {isFullView}=useContext(FullViewContext)
const {instrumentType}=useContext(instrumentTypeContext)
    console.log(requiredData);
    useEffect(() => {
        const handleResize = () => {
          setScreenWidth(window.innerWidth);
          setScreenHeight(window.innerHeight);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
  return (
    <div className='linegraph_container'>
     <ComposedChart width={isFullView?(screenWidth-100):310} height={isFullView?(screenHeight-100):320} data={requiredData} margin={{ top: 5, right:0, bottom:20, left:0  }}>
     //for other instrument
    <Line name={instrumentName(instrumentType)}  type="monotone" dataKey="value" stroke="#8884d8" />
    // for Inclinometers
    
    // adding more line on composed chart
    {/* <Line name="USL"  type="monotone" dataKey="USL" stroke="#FF0000" />
    <Line name="LSL"  type="monotone" dataKey="LSL" stroke="#00FF00" /> */}
    // adding area on composed chart
    {/* <Area name="USL" type="monotone" dataKey="USL" stroke="#FF0000" fill="#FFCCCC" />
      <Area name="LSL" type="monotone" dataKey="LSL" stroke="#00FF00" fill="#CCFFCC" /> */}
      //adding range in composed chart
      <Area dataKey="range" stroke="#00FF00" fill="#CCFFCC" />
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
    <XAxis dataKey="date" >
    <Label value="Date Time" offset={0} position="insideBottom"  />
    </XAxis>
    <YAxis label={{ value:instrumentUnit(instrumentType), angle: -90, position: 'insideLeft' }}/>
    <Tooltip wrapperStyle={{ width: 133, backgroundColor: '#ccc' }} />
   
    <Legend verticalAlign="top" height={30}  >
    
    </Legend>

    
  </ComposedChart>
  {/* <ResponsiveContainer width="100%" height="100%">
  <AreaChart  width={isFullView?screenWidth:310} height={isFullView?screenHeight:320}
          data={requiredData}
          margin={{ top: 5, right:0, bottom:0, left:0  }}
        >
    <Area type="monotone" dataKey="LSL" stroke="#8884d8" fill="#8884d8" />
         </AreaChart>
      </ResponsiveContainer> */}
    </div>
  )
}

export default Linegraph;
