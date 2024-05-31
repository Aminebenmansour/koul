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

// Nouveau composant Card pour afficher le contenu du fichier
function FileContentCard({ title, content }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <pre>{content}</pre>
      </CardBody>
    </Card>
  );
}

function Vuln(props) {
  const [activeTab, setActiveTab] = useState("");
  const [protocolData, setProtocolData] = useState([]);
  const [fileContent, setFileContent] = useState("");

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
  }, []);

  useEffect(() => {
    // Récupérer les données du fichier tcp_21_ftp_anonymous_test.txt
    axios.get("http://127.0.0.1:5000/get_tcp_21_data")
      .then(response => {
        // Ajouter les données dans le tableau protocolData
        setProtocolData(prevData => [...prevData, response.data]);
        setFileContent(response.data);
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
            {/* Affichage du contenu du fichier dans un Card indépendant */}
            {data.protocol === 'tcp21' && (
              <Row>
                <Col md="12">
                  <FileContentCard title="FTP Anonymous Exploit" content={fileContent} />
                </Col>
              </Row>
            )}
          </TabPane>
        ))}
      </TabContent>
    </div>
  );
}

export default Vuln;
