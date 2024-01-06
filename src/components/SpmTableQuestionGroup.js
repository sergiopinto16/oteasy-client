

import React, { useState } from 'react';

function TableWithRadioButtons() {
  const [selectedRow, setSelectedRow] = useState(null);

  const data = [
    { id: 1, name: 'Item 1', value: 'Value 1' },
    { id: 2, name: 'Item 2', value: 'Value 2' },
    { id: 3, name: 'Item 3', value: 'Value 3' },
  ];

  const handleRadioChange = (event) => {
    setSelectedRow(event.target.value);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Value</th>
          <th>Select</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.value}</td>
            <td>
              <input
                type="radio"
                name="items"
                value={item.id}
                checked={selectedRow === item.id}
                onChange={handleRadioChange}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableWithRadioButtons;
