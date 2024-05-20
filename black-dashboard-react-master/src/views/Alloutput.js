import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardTitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';

const AllOutput = () => {
  const [scans, setScans] = useState([]);
  const [selectedIp, setSelectedIp] = useState('');
  const [filesForIp, setFilesForIp] = useState({});
  const [selectedFileName, setSelectedFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/scans')
      .then(response => response.json())
      .then(data => {
        setScans(data);
        const uniqueIps = [...new Set(data.map(scan => scan.ip))];
        const filesByIp = {};
        uniqueIps.forEach(ip => {
          filesByIp[ip] = data.filter(scan => scan.ip === ip).map(scan => scan.fileName);
        });
        setFilesForIp(filesByIp);
      })
      .catch(err => console.error('Error fetching scans:', err));
  }, []);

  const handleIpClick = (ip) => {
    setSelectedIp(ip);
    setSelectedFileName('');
    setFileContent('');
  };

  const handleFileClick = (fileName) => {
    const scan = scans.find(scan => scan.ip === selectedIp && scan.fileName === fileName);
    if (scan) {
      setSelectedFileName(fileName);
      setFileContent(scan.content);
      console.log(scan.content);
    }
  };

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  return (
    <div className="content">
      <Row>
        <Col md="3">
          <Card>
            <CardHeader style={{ backgroundColor: '#1d8cf8' }}>
              <CardTitle tag="h4" style={{ color: '#fff' }}>Adresses IP</CardTitle>
            </CardHeader>
            <CardBody>
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle caret style={{ backgroundColor: '#525f7f', color: '#fff' }}>
                  {selectedIp ? selectedIp : 'Sélectionnez une adresse IP'}
                </DropdownToggle>
                <DropdownMenu style={{ backgroundColor: '#525f7f', color: '#fff' }}>
                  {Object.keys(filesForIp).map((ip, index) => (
                    <DropdownItem key={index} onClick={() => handleIpClick(ip)} style={{ color: '#fff' }}>
                      {ip}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          {selectedIp && (
            <Card>
              <CardHeader style={{ backgroundColor: '#1d8cf8' }}>
                <CardTitle tag="h4" style={{ color: '#fff' }}>Fichiers</CardTitle>
              </CardHeader>
              <CardBody>
                <Nav vertical>
                  {filesForIp[selectedIp].map((fileName, index) => (
                    <NavItem key={index}>
                      <NavLink href="#" onClick={() => handleFileClick(fileName)} style={{ color: 'white' }}>
                        {fileName}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
              </CardBody>
            </Card>
          )}
        </Col>
        <Col md="6">
          <Card>
            <CardHeader style={{ backgroundColor: '#1d8cf8' }}>
              <CardTitle tag="h4" style={{ color: '#fff' }}>Contenu du fichier</CardTitle>
            </CardHeader>
            <CardBody>
              {selectedFileName ? (
                <div>
                  <h3 >Contenu du fichier {selectedFileName} :</h3>
                  <pre >{fileContent}</pre>
                </div>
              ) : (
                <div>Sélectionnez un fichier pour voir son contenu</div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AllOutput;
