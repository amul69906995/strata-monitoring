import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App  from './App'
import {
  createBrowserRouter,
  RouterProvider, 
} from "react-router-dom";
import Graph from './components/Graph';
import UploadPanel from './components/UploadPanel';
import PanelList from './components/PanelList';
import PanelView from './components/PanelView';
import { GoogleOAuthProvider } from '@react-oauth/google';

const router=createBrowserRouter([
  {
    path:'/',
    element:<App/>  
  },
  {
    path:'/:instrumentId/graph',
    element:<Graph/>
  },
  {
   path:'/upload/panel',
   element:<UploadPanel/>
  },
  {
   path:'/all/panel',
   element:<PanelList/>
  },
  {
   path:'/panelview/:panelId',
   element:<PanelView/>
  }

])
createRoot(document.getElementById('root')).render(
  <StrictMode>

    <GoogleOAuthProvider clientId="260206504151-pthinpafj3dg0vsgt8uqibekig5s1r77.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>

  </StrictMode>,
)