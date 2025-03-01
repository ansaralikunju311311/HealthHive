import React from 'react';

const DataTable = ({ 
  columns, 
  data, 
  emptyMessage = "No data found",
  rowClassName = "hover:bg-gray-50",
  headerClassName = "bg-gray-100"
}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className={headerClassName}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-600"
                style={column.width ? { width: column.width } : {}}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowClassName}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                  {column.render ? column.render(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
