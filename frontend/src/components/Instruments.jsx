import React, { useEffect, useState,useContext } from 'react'
import Instrument from './Instrument'
import  miningTypeContext  from '../context/miningtype.context'
import '../css/instruments.css'
const Instruments= () => {
  const {miningType,setMiningType}=useContext(miningTypeContext)
    const [instruments,setInstruments]=useState([])
    
    const data=[
        {
            miningType:"conv",
            instruments:[
              {name: "Dual Height Tell Tail", code: "DHT"},
              {name: "Single Height Tell Tail", code: "SHT"},
              {name: "Rotary Tell Tail", code: "RTT"},
              {name: "Auto Warning Tell Tail", code: "AWTT"},
              {name: "Stress Cells", code: "SC"},
              {name: "Load Cells", code: "LC"},
              {name: "Roof Floor Convergence", code: "RFC"},
              {name: "Multi Point Borehole Extensometer", code: "MPBX"},
             
              {name: "Convergence rate indicator (CRI)", code: "CRI"}
          ]
          
          
        },
        {
            miningType:"mech",
            instruments:[
              {name: "Dual Height Tell Tail", code: "DHT"},
              {name: "Single Height Tell Tail", code: "SHT"},
              {name: "Rotary Tell Tail", code: "RTT"},
              {name: "Auto Warning Tell Tail", code: "AWTT"},
              {name: "Stress Cells", code: "SC"},
              {name: "Load Cells", code: "LC"},
              {name: "Roof Floor Convergence", code: "RFC"},
              {name: "Multi Point Borehole Extensometer", code: "MPBX"},
              {name: "Convergence rate indicator (CRI)", code: "CRI"}
          ]
          
          
          
        }
    ]
    useEffect(()=>{
    const reqInstruments=data.find(d=>d.miningType===miningType).instruments
    setInstruments(reqInstruments)
    },[miningType])
  return (
    <div className="instruments_container">
   {instruments.map(instrument=><Instrument key={instrument.name} instrument={instrument} />)}
    </div>
  )
}

export default Instruments
