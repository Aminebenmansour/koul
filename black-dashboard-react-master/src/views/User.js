import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faDoorOpen, faDoorClosed, faLaptop } from '@fortawesome/free-solid-svg-icons';
import Chart from "chart.js/auto";

const User = () => {
  const [fileStats, setFileStats] = useState({});
  const [protocolStats, setProtocolStats] = useState({});
  const [uniqueIPs, setUniqueIPs] = useState([]);
  const [portCounts, setPortCounts] = useState({});

  useEffect(() => {
    fetch('http://localhost:5000/api/scans')
      .then(response => response.json())
      .then(data => {
        const fileStatsData = processData(data);
        setFileStats(fileStatsData);
        renderFileStatsChart(fileStatsData);
        const uniqueIPList = getUniqueIPs(data); // Obtention des adresses IP uniques
        setUniqueIPs(uniqueIPList);
      })
      .catch(err => console.error('Error fetching file statistics:', err));

    fetch('http://localhost:5000/scan')
      .then(response => response.json())
      .then(data => {
        const protocolStatsData = processProtocolData(data);
        setProtocolStats(protocolStatsData);
        renderProtocolStatsChart(protocolStatsData);
      })
      .catch(err => console.error('Error fetching protocol statistics:', err));

    fetch('http://localhost:5000/compteur')
      .then(response => response.json())
      .then(data => {
        setPortCounts(data);
      })
      .catch(err => console.error('Error fetching port counts:', err));
  }, []);

  const processData = (data) => {
    const fileTypesCount = data.reduce((acc, file) => {
      acc[file.fileName] = acc[file.fileName] ? acc[file.fileName] + 1 : 1;
      return acc;
    }, {});
    return fileTypesCount;
  };

  const processProtocolData = (data) => {
    const protocolCount = Object.entries(data).reduce((acc, [protocol, count]) => {
      acc[protocol] = count;
      return acc;
    }, {});
    return protocolCount;
  };

  const renderFileStatsChart = (stats) => {
    const ctx = document.getElementById('fileStatsChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(stats),
        datasets: [{
          label: 'File Types',
          data: Object.values(stats),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          },
          title: {
            display: true,
            text: 'File Statistics'
          }
        }
      }
    });
  };

  const renderProtocolStatsChart = (stats) => {
    const ctx = document.getElementById('protocolStatsChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(stats),
        datasets: [{
          label: 'Protocols',
          data: Object.values(stats),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          },
          title: {
            display: true,
            text: 'Protocol Statistics'
          }
        }
      }
    });
  };

  const getUniqueIPs = (data) => {
    const ipSet = new Set();
    data.forEach(item => ipSet.add(item.ip));
    return Array.from(ipSet);
  };

  return (
    <div className="content">
      <Row>
        <Col md="6">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">File Statistics User</CardTitle>
            </CardHeader>
            <CardBody>
              <canvas id="fileStatsChart" width="600" height="600"></canvas>
            </CardBody>
          </Card>
        </Col>
        <Col md="6">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Protocol Statistics User</CardTitle>
            </CardHeader>
            <CardBody>
              <canvas id="protocolStatsChart" width="600" height="600"></canvas>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">IP and Port Statistics</CardTitle>
            </CardHeader>
            <CardBody>
              <div style={{ textAlign: 'center' }}>
                <h2><FontAwesomeIcon icon={faLaptop} style={{ color: 'black' }} />: {uniqueIPs.length}</h2>
                <h2><FontAwesomeIcon icon={faDoorClosed} style={{ color: 'red' }} />: {portCounts.closed_ports}</h2>
                <h2><FontAwesomeIcon icon={faDoorOpen} style={{ color: 'yellow' }} />: {portCounts.open_ports}</h2>
                <h2><FontAwesomeIcon icon={faFilter} style={{ color: 'green' }} />: {portCounts.filtered_ports}</h2>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default User;
