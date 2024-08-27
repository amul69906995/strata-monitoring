import React, { useState } from 'react'
import Create from './components/Create'
import Add from './components/Add'
import View from './components/View'
import Search from './components/Search'

const App = () => {
  const [isOpenCreate, setIsOpenCreate] = useState(false)
  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(true)

  return (
    <>
<button
  onClick={() => { setIsOpenCreate(true); setIsOpenAdd(false);setIsViewOpen(false)}}
  style={{
    backgroundColor: '#007bff', // Blue background
    color: '#fff',               // White text
    padding: '10px 20px',        // Padding around the button
    border: 'none',              // No border
    borderRadius: '4px',         // Slightly rounded corners
    cursor: 'pointer',           // Pointer cursor on hover
    fontSize: '16px',            // Font size
    marginRight: '10px',         // Margin to separate buttons
    transition: 'background-color 0.3s ease-in-out', // Smooth hover effect
  }}
  onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'} // Darker blue on hover
  onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}   // Original blue on mouse out
>
  Create
</button>

<button
  onClick={() => { setIsOpenAdd(true); setIsOpenCreate(false); setIsViewOpen(false)}}
  style={{
    backgroundColor: '#007bff', // Blue background
    color: '#fff',               // White text
    padding: '10px 20px',        // Padding around the button
    border: 'none',              // No border
    borderRadius: '4px',         // Slightly rounded corners
    cursor: 'pointer',           // Pointer cursor on hover
    fontSize: '16px',            // Font size
    transition: 'background-color 0.3s ease-in-out', // Smooth hover effect
  }}
  onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'} // Darker blue on hover
  onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}   // Original blue on mouse out
>
  Add
</button>
<button
  onClick={() => { setIsOpenAdd(false); setIsOpenCreate(false); setIsViewOpen(true)}}
  style={{
    backgroundColor: '#007bff', // Blue background
    color: '#fff',               // White text
    padding: '10px 20px',        // Padding around the button
    border: 'none',              // No border
    borderRadius: '4px',         // Slightly rounded corners
    cursor: 'pointer',           // Pointer cursor on hover
    fontSize: '16px',
    marginLeft:'10px',          // Font size
    transition: 'background-color 0.3s ease-in-out', // Smooth hover effect
  }}
  onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'} // Darker blue on hover
  onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}   // Original blue on mouse out
>
  View
</button>
<Search/>
      {isOpenCreate && <Create />}
      {isOpenAdd && <Add />}
      {isViewOpen && <View/>}
    </>
  )
}

export default App

