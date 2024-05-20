import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
} from "reactstrap";

function Vuln(props) {
  const [activeTab, setActiveTab] = useState("");
  const [protocolData, setProtocolData] = useState([]);

  useEffect(() => {
    // Récupérer les données de l'API Flask
    axios.get("http://127.0.0.1:5000/get_data")
      .then(response => {
        setProtocolData(response.data || []);
        setActiveTab(response.data[0]?.protocol || "");
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données :", error);
      });

    // Récupérer les données du fichier tcp_21_ftp_anonymous_test.txt
    axios.get("http://127.0.0.1:5000/get_tcp_21_data")
      .then(response => {
        const tcp21Data = response.data;
        console.log(tcp21Data)
        if (tcp21Data) {
          setProtocolData(prevData => {
            // Vérifier si tcp21 existe déjà dans protocolData
            const updatedData = prevData.map(data => {
              if (data.protocol === "tcp21") {
                return { ...data, vulnerabilities: [...(data.vulnerabilities || []), ...tcp21Data.vulnerabilities] };
              }
              return data;
            });

            // Ajouter tcp21 si ce n'est pas déjà présent
            if (!updatedData.some(data => data.protocol === "tcp21")) {
              updatedData.push({ protocol: "tcp21", vulnerabilities: tcp21Data.vulnerabilities });
            }

            return updatedData;
          });
        }
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données TCP 21 :", error);
      });
  }, []);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div className="content">
      <Nav tabs>
        {protocolData && protocolData.length > 0 && protocolData.map((data, index) => (
          <NavItem key={index}>
            <NavLink
              className={activeTab === data.protocol ? "active" : ""}
              style={{ color: '#1d8cf8' }} // Changement de couleur ici
              onClick={() => toggle(data.protocol)}
            >
              {data.protocol ? data.protocol.toUpperCase() : ''}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent activeTab={activeTab}>
        {protocolData && protocolData.length > 0 && protocolData.map((data, index) => (
          <TabPane key={index} tabId={data.protocol}>
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">{data.protocol ? data.protocol.toUpperCase() : ''} Vulnérabilités</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <ul>
                      {data.vulnerabilities && data.vulnerabilities.length > 0 && data.vulnerabilities.map((vuln, idx) => (
                        <li key={idx}>
                          <strong>{vuln.exploitLine}</strong>: {vuln.description} - {vuln.path}
                        </li>
                      ))}
                    </ul>
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

export default Vuln;
