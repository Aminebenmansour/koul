import React, { useState, useEffect } from "react";
import axios from "axios";
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Card, CardHeader, CardBody, CardTitle } from "reactstrap";

function Nmap() {
  const [nmapData, setNmapData] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/get_nmap")
      .then(response => {
        setNmapData(response.data);
        setActiveTab(Object.keys(response.data)[0]); // Set the first IP as active initially
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données Nmap :", error);
      });
  }, []);

  const toggle = (ip) => {
    setActiveTab(ip);
  };

  return (
    <div className="content">
      <Nav tabs>
        {Object.keys(nmapData).map((ip, index) => (
          <NavItem key={index}>
            <NavLink
              className={activeTab === ip ? "active" : ""}
              style={{ color: '#1d8cf8' }} 
              onClick={() => toggle(ip)}
            >
              
              {ip}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent activeTab={activeTab}>
        {Object.keys(nmapData).map((ip, index) => (
          <TabPane key={index} tabId={ip}>
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">{ip.toUpperCase()} Détails</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <p>State: {nmapData[ip].state}</p>
                    <p>Version: {nmapData[ip].version}</p>
                    <p>Details: {nmapData[ip].details}</p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>
        ))}
      </TabContent>
    </div>
  );
}

export default Nmap;
