import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App  from './App'
import {
  createBrowserRouter,
  RouterProvider, 
} from "react-router-dom";
import Graph from './components/Graph';
const router=createBrowserRouter([
  {
    path:'/',
    element:<App/>  
  },
  {
    path:'/:instrumentId/graph',
    element:<Graph/>
  }

])
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={router} />
  </StrictMode>,
)
