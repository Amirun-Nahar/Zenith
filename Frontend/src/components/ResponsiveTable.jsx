import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTouch } from '../hooks/useTouch';

export function ResponsiveTable({
  columns = [],
  data = [],
  onRowClick,
  onSort,
  sortable = false,
  className = '',
}) {
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    if (!sortable) return;

    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    if (onSort) onSort(key, direction);
  };

  const { touchHandlers } = useTouch({
    onSwipe: (direction) => {
      if (direction === 'left' || direction === 'right') {
        setExpandedRow(null);
      }
    },
  });

  // Render for mobile
  const renderMobileView = () => (
    <div className="space-y-4 sm:hidden">
      {data.map((row, rowIndex) => (
        <motion.div
          key={rowIndex}
          className="card mobile-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: rowIndex * 0.05 }}
          {...touchHandlers}
          onClick={() => {
            setExpandedRow(expandedRow === rowIndex ? null : rowIndex);
            if (onRowClick) onRowClick(row);
          }}
        >
          {/* Primary content */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {columns[0] && (
                <div className="font-medium text-[#E43D12]">
                  {row[columns[0].key]}
                </div>
              )}
              {columns[1] && (
                <div className="text-sm opacity-70">
                  {row[columns[1].key]}
                </div>
              )}
            </div>
            <motion.div
              animate={{ rotate: expandedRow === rowIndex ? 180 : 0 }}
              className="text-[#E43D12] opacity-60"
            >
              ▼
            </motion.div>
          </div>

          {/* Expanded content */}
          <AnimatePresence>
            {expandedRow === rowIndex && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                  {columns.slice(2).map((col, colIndex) => (
                    <div key={colIndex} className="flex justify-between">
                      <span className="text-sm opacity-70">{col.label}</span>
                      <span className="text-sm font-medium">{row[col.key]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );

  // Render for desktop
  const renderDesktopView = () => (
    <div className="hidden sm:block overflow-x-auto">
      <table className={`w-full ${className}`}>
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((col, index) => (
              <th
                key={index}
                className={`
                  py-3 px-4 text-left text-sm font-medium text-[#E43D12] opacity-90
                  ${sortable ? 'cursor-pointer hover:bg-white/5' : ''}
                `}
                onClick={() => handleSort(col.key)}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {sortable && sortConfig.key === col.key && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIndex * 0.05 }}
              className="border-b border-white/10 hover:bg-white/5 cursor-pointer"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="py-3 px-4 text-sm"
                  style={{ color: '#E43D12' }}
                >
                  {row[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {renderMobileView()}
      {renderDesktopView()}
    </>
  );
}
