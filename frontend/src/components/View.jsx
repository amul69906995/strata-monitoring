import React,{useContext} from 'react'

import FullViewContext from '../context/view.context';

const View = () => {
    const {isFullView,setIsFullView}=useContext(FullViewContext)
  return (
    <div>
     <button onClick={()=>setIsFullView(true)}>full Size</button> 
     <button onClick={()=>setIsFullView(false)}>Small Size</button>
    </div>
  )
}

export default View
