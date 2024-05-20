/*!

=========================================================
* Black Dashboard React v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Alloutput from "views/Alloutput.js"
import Icons from "views/Icons.js";
import Stat from "views/Stat";
import Vuln from "views/Vuln"
import Nmap from "views/Nmap";
import User from "views/User";
import Test from "views/Test";
import TableList from "views/TableList.js";

var routes = [
  {
    path: "/test",
    name: "Test",
    rtlName: "test",
    icon: "tim-icons icon-chart-pie-36",
    component: <Test/>,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "User",
    rtlName: "user",
    icon: "tim-icons icon-chart-pie-36",
    component: <User/>,
    layout: "/admin",
  },
  {
    path: "/stat",
    name: "stat",
    rtlName: "stat",
    icon: "tim-icons icon-chart-pie-36",
    component: <Stat/>,
    layout: "/admin",
  },
  {
    path: "/alloutput",
    name: "All_output",
    rtlName: "alloutput",
    icon: "tim-icons icon-chart-pie-36",
    component: <Alloutput/>,
    layout: "/admin",
  },
  {
    path: "/vuln",
    name: "Vuln",
    rtlName: "vuln",
    icon: "tim-icons icon-atom",
    component: <Vuln />,
    layout: "/admin",
  },
  {
    path: "/nmap",
    name: "nmap",
    rtlName: "nmap",
    icon: "tim-icons icon-atom",
    component: <Nmap />,
    layout: "/admin",
  }
 
 
 
 
  
 
];
export default routes;
