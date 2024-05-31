const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require("path");


const app = express();
const RESULTS_DIR = '/home/amine/amine/stage1/ss/defansy/results';

app.use(cors()); // Active CORS pour toutes les routes de l'application

function parseNmapFile(filePath) {
  const results = {};
  let currentService = null;

  const data = fs.readFileSync(filePath, 'utf8').split('\n');

  data.forEach(line => {
    const portMatch = line.match(/^(\d+)\/tcp\s+(open|closed)\s+(\w+)\s+(.*)$/);
    if (portMatch) {
      const [_, port, state, service, version] = portMatch;
      currentService = service;
      results[currentService] = { state, version, details: '' };
    } else if (currentService) {
      results[currentService].details += line + '\n';
    }
  });

  return results;
}

app.get('/get_nmap', (req, res) => {
  const ip = req.query.ip;
  console.log(ip)
  const directoryPath = `${RESULTS_DIR}/${ip.replace(/"/g, '')}/scans/`;
  console.log(directoryPath)
  const filePath = `${directoryPath}_quick_tcp_nmap.txt`;

  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }

  const nmapResults = parseNmapFile(filePath);
  console.log(nmapResults);

  res.json(nmapResults);
});

function findTxtFiles(directory) {
  const txtFiles = [];
  const files = fs.readdirSync(directory);

  files.forEach(file => {
    const fullPath = `${directory}/${file}`;
    if (fs.statSync(fullPath).isFile() && file.endsWith('.txt')) {
      txtFiles.push(fullPath);
    } else if (fs.statSync(fullPath).isDirectory()) {
      txtFiles.push(...findTxtFiles(fullPath));
    }
  });

  return txtFiles;
}

app.get('/scan', (req, res) => {
  const ipDirectories = fs.readdirSync(RESULTS_DIR);
  const nmapResults = {};

  ipDirectories.forEach(ipDir => {
    const directoryPath = `${RESULTS_DIR}/${ipDir}/scans`;
    const filePath = `${directoryPath}/_quick_tcp_nmap.txt`;

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8').split('\n');

      data.forEach(line => {
        const portMatch = line.match(/^(\d+)\/tcp\s+(open|closed)\s+(\w+)\s+(.*)$/);
        if (portMatch) {
          const [_, port, state, protocol, version] = portMatch;
          nmapResults[protocol] = (nmapResults[protocol] || 0) + 1;
        }
      });
    }
  });

  console.log(nmapResults);
  res.json(nmapResults);
});

app.get('/compteur', (req, res) => {
  let openPorts = 0;
  let closedPorts = 0;
  let filteredPorts = 0;

  const txtFiles = findTxtFiles(RESULTS_DIR);

  txtFiles.forEach(txtFile => {
    const parsedResults = parseNmapFile(txtFile);
    Object.values(parsedResults).forEach(info => {
      const state = info.state;
      if (state === 'open') {
        openPorts += 1;
      } else if (state === 'closed') {
        closedPorts += 1;
      } else if (state === 'filtered') {
        filteredPorts += 1;
      }
    });
  });

  console.log({ openPorts, closedPorts, filteredPorts });
  res.json({ openPorts, closedPorts, filteredPorts });
});

app.get('/api/scans', (req, res) => {
  const ipDirectories = fs.readdirSync(RESULTS_DIR);
  const scansData = [];

  ipDirectories.forEach(ipDir => {
    const ipDirPath = `${RESULTS_DIR}/${ipDir}`;
    const txtFiles = findTxtFiles(ipDirPath);

    txtFiles.forEach(filePath => {
      const fileData = fs.readFileSync(filePath, 'utf8');
      scansData.push({
        ip: ipDir,
        fileName: filePath.replace(`${ipDirPath}/`, ''),
        content: fileData
      });
    });
  });

  res.json(scansData);
});

app.get('/get_data', (req, res) => {
  try {
    const ip = req.query.ip;
    console.log(ip)

    const directoryPath = `${RESULTS_DIR}/${ip.replace(/"/g, '')}/scans/`;

    const folders = fs.readdirSync(directoryPath).filter(f => fs.statSync(`${directoryPath}/${f}`).isDirectory() && f.startsWith('tcp'));

    console.log('Dossiers dans', directoryPath, ':', folders);

    const protocolData = [];

    folders.forEach(folder => {
      const folderPath = `${directoryPath}/${folder}`;
      const filePath = `${folderPath}/exploit_results.txt`;

      const vulnerabilities = [];

      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8').split('\n');

        data.forEach(line => {
          const parts = line.trim().split(':');
          if (parts.length === 3) {
            vulnerabilities.push({
              exploitLine: parts[0].trim(),
              description: parts[1].trim(),
              path: parts[2].trim()
            });
          }
        });
      }

      protocolData.push({
        protocol: folder,
        vulnerabilities
      });
    });

    res.json(protocolData);
  } catch (e) {
    console.error(`Erreur lors de la récupération des données : ${e}`);
    res.status(500).send(e.toString());
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
