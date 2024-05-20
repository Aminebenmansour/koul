import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import Chart from "chart.js/auto";

const Stat = () => {
  const [nmapResults, setNmapResults] = useState({});
  const [analysisDate, setAnalysisDate] = useState("");

  useEffect(() => {
    fetch('http://127.0.0.1:5000/get_nmap')
      .then(response => response.json())
      .then(data => {
        setNmapResults(data);
        const currentDate = new Date();
        setAnalysisDate(currentDate.toLocaleString());
      });
  }, []);

  useEffect(() => {
    if (!Object.keys(nmapResults).length) {
      return;
    }
    console.log(nmapResults)
    const openCount = Object.values(nmapResults).filter(service => service.state === 'open').length;
    const closedCount = Object.values(nmapResults).filter(service => service.state === 'closed').length;
    const filteredCount = Object.values(nmapResults).filter(service => service.state === 'filtered').length;

    const ctx1 = document.getElementById('protocolStatsChart').getContext('2d');
    new Chart(ctx1, {
      type: 'pie',
      data: {
        labels: ['Ouverts', 'Fermés', 'Filtrés'],
        datasets: [{
          label: 'Protocoles',
          data: [openCount, closedCount, filteredCount],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
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

    const protocolsFound = Object.keys(nmapResults);
    const portCount = protocolsFound.length; // Nombre de ports détectés
    
    const dataValues = Array(portCount).fill(1); // Remplir le tableau avec la valeur 1 pour chaque section du cercle
    
    const ctx2 = document.getElementById('foundProtocolsChart').getContext('2d');
    new Chart(ctx2, {
      type: 'pie',
      data: {
        labels: protocolsFound,
        datasets: [{
          label: 'Protocols Found',
          data: dataValues,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
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
            text: 'Found Protocols'
          }
        }
      }
    });
    
  }, [nmapResults]);

  return (
    <div className="content">
      <Row>
        <Col md="6">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Protocol Statistics</CardTitle>
            </CardHeader>
            <CardBody>
              <canvas id="protocolStatsChart" width="350" height="200"></canvas>
            </CardBody>
          </Card>
        </Col>
        <Col md="6">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Found Protocols</CardTitle>
            </CardHeader>
            <CardBody>
              <canvas id="foundProtocolsChart" width="350" height="200"></canvas>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Analysis Date and Time</CardTitle>
            </CardHeader>
            <CardBody>
              <p>{analysisDate}</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Stat;
