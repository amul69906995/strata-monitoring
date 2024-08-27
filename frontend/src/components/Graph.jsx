import React,{useContext, useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';
import Linegraph from './Linegraph';
import {startDateContext,endDateContext} from '../context/date.context.js'
import { magic } from '../utils/magic.js';
import View from './View.jsx';
import '../css/graph.css'

const Graph = () => {
  const { activeMiningType, ActiveInstrumentType } = useParams();
  const {startDate}=useContext(startDateContext)
  const {endDate}=useContext(endDateContext)
  const [requiredData,setRequiredData]=useState([])
  const [isDataAvailable,setIsDataAvailable]=useState(true)
  useEffect(()=>{
  
   const data= magic(activeMiningType,ActiveInstrumentType,startDate,endDate)
   console.log("useEffect ran",data)
   if(data?.length==0||!data){
    setIsDataAvailable(false)
   }
   else{
   setRequiredData(data)
   setIsDataAvailable(true)
   }
   
  },[activeMiningType,ActiveInstrumentType,startDate,endDate])
  console.log(isDataAvailable)
  if (ActiveInstrumentType==="null" || !startDate || !endDate) {
    return (
      <>
        <div className='error'>select instrument and startdate and end date</div>
      </>
    );

  }
  else if(!isDataAvailable){
    return <>
    <div className='error'>No data available</div>
    </>
  }
  else {
    return <>
    <View/>
    {requiredData.length==0?(<div>Loading...</div>):(<Linegraph requiredData={requiredData}/>)}
    
    </>;
  }
};

export default Graph;


