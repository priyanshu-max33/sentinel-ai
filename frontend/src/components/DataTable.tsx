import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No records found',
  onRowClick
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', fontSize: '13px' }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick && onRowClick(item)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(item, index) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

