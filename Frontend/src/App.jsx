import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Navbar from './component/Sidebar';
import Dashboard from './component/DashBoard';
import TopBar from './component/TopBar';
import Sidebar from './component/Sidebar';
import Login from './component/Login';
import Signup from './component/Signup';
import Main from './component/main';
import ProtectedRoute from './component/ProtectedRoute';
import UpdateProfile from './component/updateProfile';
import DeleteEmployee from './component/employeeDelete';
import AddEmployee from './component/AddEmployee';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='.app-container'>
    {/* <Sidebar/>
    <TopBar/> */}
    <Routes>
        
        
    <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private Route (Protected) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/Dashboard" element={<Main />} />
          <Route path="/Employees" element={<Dashboard />}></Route>
          <Route path="/UpdateDetails/:id" element={<UpdateProfile />} />
          <Route path="/DeleteEmployee/:id" element={<DeleteEmployee />} />
          <Route path='/AddEmployee' element={<AddEmployee/>} />
        </Route>
      </Routes>
    </div>
    </>
  )
}

export default App
