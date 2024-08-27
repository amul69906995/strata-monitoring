import React,{useState} from 'react'
import Miningtype from './components/Miningtype'
import { Outlet } from 'react-router-dom'
import miningTypeContext from './context/miningtype.context'
import instrumentTypeContext from './context/instrumenttype.context'
import {startDateContext,endDateContext} from './context/date.context.js'
import FullViewContext from './context/view.context.js'

const Layout = () => {
  const [miningType, setMiningType] = useState("conv")
  const [instrumentType,setInstrumentType]=useState(null)
 const [startDate,setStartDate]=useState("")
 const [endDate,setEndDate]=useState("")
 const [isFullView,setIsFullView]=useState(false)
  return (
    <>
      <miningTypeContext.Provider value={{ miningType, setMiningType }}>
      <instrumentTypeContext.Provider value={{ instrumentType, setInstrumentType }}>
      <startDateContext.Provider value={{startDate,setStartDate}}>
      <endDateContext.Provider value={{endDate,setEndDate}}>
      <FullViewContext.Provider value={{isFullView,setIsFullView}}>
       
        {isFullView?null:<Miningtype />}
         <Outlet />
        </FullViewContext.Provider>
        </endDateContext.Provider>
        </startDateContext.Provider>
        </instrumentTypeContext.Provider>
      </miningTypeContext.Provider>

    </>
  )
}

export default Layout
