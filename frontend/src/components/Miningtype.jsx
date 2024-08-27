import React, { useContext} from 'react'
import miningTypeContext from '../context/miningtype.context.js'
import instrumentTypeContext from '../context/instrumenttype.context.js'
import '../css/miningtype.css'
import Instruments from './Instruments.jsx'
import {startDateContext,endDateContext} from '../context/date.context.js'
const Miningtype = () => {
  const { miningType, setMiningType } = useContext(miningTypeContext)
  const { setInstrumentType } = useContext(instrumentTypeContext)
  const {startDate,setStartDate}=useContext(startDateContext)
  const {endDate,setEndDate}=useContext(endDateContext)
  console.log(startDate,endDate)
  return (
    <>
      <div className="miningtype_container">
        <span className={"miningtype_container_type_1" + (miningType === "conv" ? " active" : "")} onClick={() => {
          setMiningType("conv")
          setInstrumentType(null)

        }}>Conventional Mining</span>
        <span className={"miningtype_container_type_2" + (miningType === "mech" ? " active" : "")} onClick={() => {
          setMiningType("mech")
          setInstrumentType(null)
        }}>Mechanized Mining</span>
      </div>
      <Instruments />
      <div className="date-picker">
        <label htmlFor="start_date">Installation Date</label>
        <input type="date" name="start_date" id="start_date"
        value={startDate}
        onChange={(e)=>setStartDate(e.target.value)}
          />
        <label htmlFor="end_date">End Date</label>
        <input type="date" name="end_date" id="end_date"
        value={endDate}
        onChange={(e)=>setEndDate(e.target.value)}
         />

      </div>

    </>
  )
}

export default Miningtype;
