// React imports
import React, { useState } from 'react';

// CSS import
import './Aims.css'; // Create your CSS file for styling

// Define the main component
const AIMS = () => {
  // State for academic year and semester selection
  const [academicYear, setAcademicYear] = useState('2324');
  const [semester, setSemester] = useState('B');

  // Function to handle change in academic year selection
  const handleAcademicYearChange = (event) => {
    setAcademicYear(event.target.value);
  };

  // Function to handle change in semester selection
  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  // Render the component
  return (
    <div className="aims-content">
      <h4>
        Welcome, CABAÑA, XIANNA ANDREI (13-1767-861)
      </h4>
      <hr />
      <div className="selections">
        <label>
          Academic Year:
          <select value={academicYear} onChange={handleAcademicYearChange}>
            <option value="1314">1314</option>
            {/* Add other academic years as needed */}
            <option value="2324">2324</option>
          </select>
        </label>
        <label>
          Semester:
          <select value={semester} onChange={handleSemesterChange}>
            <option value="">- sem -</option>
            <option value="A">First</option>
            <option value="B">Second</option>
            <option value="D">Third</option>
            <option value="C">Summer</option>
          </select>
        </label>
      </div>
      {/* Here you can add your table component */}
      <Table />
    </div>
  );
};

// Define Table component
const Table = () => {
  // Dummy data
  const data = [
    { id: 1, faculty: 'Busico, Eugene Caldino', courseCode: 'CSIT385', description: 'Information Assurance and Security 1', lec: 2, lab: 3, units: 3, cluster: 0, section: 'G1-AP4 - M/TH 12:30PM-02:30PM CASEROOM / 12:30PM-03:30PM CASEROOM' },
    { id: 2, faculty: 'Millan, Thelma R', courseCode: 'CSIT335', description: 'Testing and Quality Assurance', lec: 3, lab: 0, units: 3, cluster: 0, section: 'G2-AP3 - T/F 06:00PM-07:30PM online / 06:00PM-07:30PM online' },
    { id: 3, faculty: 'Laviste, Ralph Pepe', courseCode: 'IT332', description: 'Capstone and Research 1', lec: 3, lab: 0, units: 3, cluster: 0, section: 'G4-AP3 - W/F 10:30AM-11:30AM online / 10:00AM-12:00PM FIELD' },
    { id: 4, faculty: 'Herrera, Catherine Uytico', courseCode: 'IT334', description: 'IS Strategy', lec: 3, lab: 0, units: 3, cluster: 0, section: 'G4-AP3 - T/W 03:30PM-05:00PM online / 03:30PM-05:00PM online' },
    { id: 5, faculty: 'Pardillo, Jun Albert', courseCode: 'CSIT349', description: 'Applied AI', lec: 2, lab: 3, units: 3, cluster: 0, section: 'G4-AP3 - T/F 01:00PM-03:30PM online / 01:00PM-03:30PM online' },
    { id: 6, faculty: 'Revilleza, Frederick Jr. L', courseCode: 'IT342', description: 'Systems Integration and Architecture 1', lec: 2, lab: 3, units: 3, cluster: 0, section: 'G4-AP4 - M/TH 10:30AM-12:30PM CASEROOM / 09:30AM-12:30PM CASEROOM' },
    { id: 7, faculty: 'Sayson, Jensar Joey Z', courseCode: 'IT344', description: 'Systems Administration and Maintenance', lec: 2, lab: 3, units: 3, cluster: 0, section: 'G6-AP4 - W/SAT 08:30AM-10:30AM RTL303 / 07:30AM-10:30AM NGE207' }
  ];
  

  // Render the table
  return (
    <div className="table-container">
      <table className="dbtable table-bordered table-hover">
        <thead>
          <tr>
            <td className="tableheader">#</td>
            <td className="tableheader" align="center">Faculty</td>
            <td className="tableheader" align="center">Course Code</td>
            <td className="tableheader" align="center">Description</td>
            <td className="tableheader" align="center">Lec</td>
            <td className="tableheader" align="center">Lab</td>
            <td className="tableheader" align="center">Units</td>
            <td className="tableheader" align="center">Cluster</td>
            <td className="tableheader">Section - Schedule - Room</td>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="regu">{item.id}</td>
              <td className="regu">{item.faculty}</td>
              <td className="regu">{item.courseCode}</td>
              <td className="regu">{item.description}</td>
              <td className="regu" align="center">{item.lec}</td>
              <td className="regu" align="center">{item.lab}</td>
              <td className="regu" align="center">{item.units}</td>
              <td className="regu" align="center">{item.cluster}</td>
              <td className="regu">{item.section}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AIMS;
