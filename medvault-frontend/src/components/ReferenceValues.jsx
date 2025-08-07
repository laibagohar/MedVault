import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReferenceValueList() {
  const [referenceValues, setReferenceValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchReferenceValues = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/getreferencevalue/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
        setReferenceValues(res.data);
      } catch (error) {
        console.error('Error fetching reference values:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferenceValues();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Reference Values</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Test Category</th>
            <th>Test Name</th>
            <th>Unit</th>
            <th>Min</th>
            <th>Max</th>
            <th>Gender</th>
            <th>Age Min</th>
            <th>Age Max</th>
          </tr>
        </thead>
        <tbody>
          {referenceValues.map((ref) => (
            <tr key={ref.id}>
              <td>{ref.testCategory}</td>
              <td>{ref.testName}</td>
              <td>{ref.testUnit}</td>
              <td>{ref.minValue}</td>
              <td>{ref.maxValue}</td>
              <td>{ref.gender}</td>
              <td>{ref.ageMin}</td>
              <td>{ref.ageMax}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReferenceValueList;
