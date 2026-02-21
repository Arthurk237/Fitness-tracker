import BottomNav from "../component/ui/BottomNav"
import Sidebar from "../component/ui/Sidebar"
import {Outlet} from "react-router-dom"
const Layout=() => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="flex-1 overflow-y-scroll ">
        <Outlet/>
    </div>
    <BottomNav />
    </div>
  )
}
export default Layout