import { Link, useNavigate} from 'react-router-dom';
import '../css/instrument.css'
import React, { useContext, useEffect} from 'react'
import  miningTypeContext  from '../context/miningtype.context'
import  instrumentTypeContext  from '../context/instrumenttype.context'

const Instrument = ({instrument}) => {
  const {miningType}=useContext(miningTypeContext)
const navigate=useNavigate()
const { instrumentType, setInstrumentType }=useContext(instrumentTypeContext)
 
 const handleClick=()=>{
    setInstrumentType(instrument.code)   
  }
 useEffect(()=>{
  console.log(miningType,instrumentType)
  navigate(`/graph/${miningType}/${instrumentType}`)
 },[miningType,instrumentType])
  return (
    
    <div className={'intrument '+(instrumentType===instrument.code?'active':"")}onClick={handleClick}>
    
    {instrument.name}
   
    </div>
   
  )
}

export default Instrument;
