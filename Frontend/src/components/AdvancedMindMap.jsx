import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced color palette with gradients
const BRANCH_COLORS = [
  { bg: '#E3F2FD', border: '#1976D2', text: '#0D47A1' }, // Blue
  { bg: '#F3E5F5', border: '#7B1FA2', text: '#4A148C' }, // Purple
  { bg: '#E8F5E8', border: '#388E3C', text: '#1B5E20' }, // Green
  { bg: '#FFF3E0', border: '#F57C00', text: '#E65100' }, // Orange
  { bg: '#FCE4EC', border: '#C2185B', text: '#880E4F' }, // Pink
  { bg: '#F1F8E9', border: '#689F38', text: '#33691E' }, // Lime
  { bg: '#E0F2F1', border: '#00796B', text: '#004D40' }, // Teal
  { bg: '#FFF8E1', border: '#F9A825', text: '#F57F17' }, // Yellow
];

const AdvancedMindMap = ({ data, onNodeClick, onNodeEdit, onNodeAdd, onNodeDelete }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set(['root']));
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [nodePositions, setNodePositions] = useState({});
  const [editingNode, setEditingNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNodes, setFilteredNodes] = useState(new Set());

  // Calculate node positions with improved algorithm
  const calculateNodePositions = useCallback((node, centerX = 400, centerY = 300, level = 0, angle = 0, parentAngle = 0) => {
    const positions = {};
    const radius = 150 + (level * 100);
    const children = node.children || [];
    
    positions[node.id] = {
      x: centerX,
      y: centerY,
      level,
      angle,
      color: BRANCH_COLORS[level % BRANCH_COLORS.length],
      isExpanded: expandedNodes.has(node.id)
    };

    if (children.length > 0 && expandedNodes.has(node.id)) {
      const angleStep = (2 * Math.PI) / children.length;
      
      children.forEach((child, index) => {
        const childAngle = angle + (index - (children.length - 1) / 2) * angleStep;
        const childX = centerX + Math.cos(childAngle) * radius;
        const childY = centerY + Math.sin(childAngle) * radius;
        
        const childPositions = calculateNodePositions(child, childX, childY, level + 1, childAngle, angle);
        Object.assign(positions, childPositions);
      });
    }

    return positions;
  }, [expandedNodes]);

  // Update positions when data or expanded nodes change
  useEffect(() => {
    const positions = calculateNodePositions(data);
    setNodePositions(positions);
  }, [data, expandedNodes, calculateNodePositions]);

  // Search functionality
  useEffect(() => {
    if (searchTerm) {
      const filtered = new Set();
      const searchLower = searchTerm.toLowerCase();
      
      const searchNodes = (node) => {
        if (node.title.toLowerCase().includes(searchLower)) {
          filtered.add(node.id);
          // Add parent nodes to show path
          let current = node;
          while (current.parent) {
            filtered.add(current.parent);
            current = current.parent;
          }
        }
        if (node.children) {
          node.children.forEach(searchNodes);
        }
      };
      
      searchNodes(data);
      setFilteredNodes(filtered);
    } else {
      setFilteredNodes(new Set());
    }
  }, [searchTerm, data]);

  // Handle zoom with mouse wheel
  const handleZoom = useCallback((delta, centerX = 400, centerY = 300) => {
    setZoom(prev => {
      const newZoom = Math.max(0.2, Math.min(4, prev + delta * 0.1));
      return newZoom;
    });
  }, []);

  // Handle pan
  const handlePan = useCallback((deltaX, deltaY) => {
    setPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
  }, []);

  // Touch state
  const [touchDistance, setTouchDistance] = useState(null);
  const [touchCenter, setTouchCenter] = useState(null);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [lastTapPosition, setLastTapPosition] = useState({ x: 0, y: 0 });

  // Calculate distance between two touch points
  const getTouchDistance = (touches) => {
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY
    );
  };

  // Calculate center point between two touches
  const getTouchCenter = (touches) => {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  };

  // Mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = e.clientX - rect.left;
      const centerY = e.clientY - rect.top;
      handleZoom(-e.deltaY / 1000, centerX, centerY);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleZoom]);

  // Touch event handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch to zoom
      e.preventDefault();
      setTouchDistance(getTouchDistance(e.touches));
      setTouchCenter(getTouchCenter(e.touches));
    } else if (e.touches.length === 1) {
      // Single touch pan or tap
      const touch = e.touches[0];
      const now = Date.now();
      const timeDiff = now - lastTapTime;
      const touchX = touch.clientX;
      const touchY = touch.clientY;

      // Check for double tap
      if (timeDiff < 300 && 
          Math.abs(touchX - lastTapPosition.x) < 30 && 
          Math.abs(touchY - lastTapPosition.y) < 30) {
        // Double tap detected
        handleNodeDoubleClick(selectedNode);
      }

      setLastTapTime(now);
      setLastTapPosition({ x: touchX, y: touchY });
      
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      // Pinch to zoom
      e.preventDefault();
      const newDistance = getTouchDistance(e.touches);
      const newCenter = getTouchCenter(e.touches);
      
      if (touchDistance) {
        const scale = newDistance / touchDistance;
        const deltaZoom = (scale - 1) * 2;
        handleZoom(deltaZoom);
      }
      
      setTouchDistance(newDistance);
      setTouchCenter(newCenter);
    } else if (e.touches.length === 1 && isDragging) {
      // Single touch pan
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchDistance(null);
    setTouchCenter(null);
  };

  // Mouse drag for panning
  const handleMouseDown = (e) => {
    if (e.target === svgRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Node interactions
  const handleNodeClick = (nodeId) => {
    setSelectedNode(nodeId);
    onNodeClick?.(nodeId);
  };

  const handleNodeDoubleClick = (nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleNodeEdit = (nodeId) => {
    setEditingNode(nodeId);
    onNodeEdit?.(nodeId);
  };

  const handleNodeDelete = (nodeId) => {
    onNodeDelete?.(nodeId);
  };

  // Render curved connection lines with improved styling
  const renderConnections = () => {
    const connections = [];
    
    const addConnections = (node) => {
      if (node.children && expandedNodes.has(node.id)) {
        node.children.forEach((child, index) => {
          const parentPos = nodePositions[node.id];
          const childPos = nodePositions[child.id];
          
          if (parentPos && childPos) {
            const midX = (parentPos.x + childPos.x) / 2;
            const midY = (parentPos.y + childPos.y) / 2;
            const controlY = Math.min(parentPos.y, childPos.y) - 30;
            
            connections.push(
              <motion.path
                key={`${node.id}-${child.id}`}
                d={`M ${parentPos.x} ${parentPos.y} Q ${midX} ${controlY} ${childPos.x} ${childPos.y}`}
                stroke={parentPos.color.border}
                strokeWidth="2"
                fill="none"
                strokeDasharray="0"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
              />
            );
          }
          
          addConnections(child);
        });
      }
    };
    
    addConnections(data);
    return connections;
  };

  // Render nodes with enhanced styling
  const renderNodes = () => {
    const nodes = [];
    
    const addNodes = (node) => {
      const pos = nodePositions[node.id];
      if (!pos) return;
      
      const isSelected = selectedNode === node.id;
      const isExpanded = expandedNodes.has(node.id);
      const isFiltered = searchTerm && !filteredNodes.has(node.id);
      const hasChildren = node.children && node.children.length > 0;
      
      if (isFiltered) return;
      
      nodes.push(
        <motion.g
          key={node.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: isFiltered ? 0.8 : 1, 
            opacity: isFiltered ? 0.3 : 1 
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Node Card with enhanced styling */}
          <motion.rect
            x={pos.x - 80}
            y={pos.y - 30}
            width={160}
            height={60}
            rx={16}
            ry={16}
            fill={isSelected ? pos.color.bg : pos.color.bg}
            stroke={isSelected ? pos.color.border : pos.color.border}
            strokeWidth={isSelected ? 3 : 2}
            style={{ 
              cursor: 'pointer',
              filter: isSelected ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))'
            }}
            whileHover={{ 
              scale: 1.05, 
              filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.2))'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNodeClick(node.id)}
            onDoubleClick={() => handleNodeDoubleClick(node.id)}
          />
          
          {/* Node Text */}
          <text
            x={pos.x}
            y={pos.y + 5}
            textAnchor="middle"
            fontSize="13"
            fontWeight="600"
            fill={pos.color.text}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {node.title}
          </text>
          
          {/* Node Type Indicator */}
          {node.type && (
            <circle
              cx={pos.x - 60}
              cy={pos.y - 15}
              r={6}
              fill={pos.color.border}
            />
          )}
          
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <motion.circle
              cx={pos.x + 60}
              cy={pos.y - 15}
              r={10}
              fill={pos.color.border}
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                handleNodeDoubleClick(node.id);
              }}
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.1 }}
            >
              <text
                x={pos.x + 60}
                y={pos.y - 10}
                textAnchor="middle"
                fontSize="14"
                fill="white"
                style={{ pointerEvents: 'none' }}
              >
                {isExpanded ? '−' : '+'}
              </text>
            </motion.circle>
          )}
          
          {/* Action Buttons */}
          <motion.circle
            cx={pos.x + 60}
            cy={pos.y + 15}
            r={8}
            fill="#4CAF50"
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              onNodeAdd?.(node.id);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <text
              x={pos.x + 60}
              y={pos.y + 19}
              textAnchor="middle"
              fontSize="12"
              fill="white"
              style={{ pointerEvents: 'none' }}
            >
              +
            </text>
          </motion.circle>
          
          {/* Edit Button */}
          <motion.circle
            cx={pos.x - 60}
            cy={pos.y + 15}
            r={8}
            fill="#FF9800"
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              handleNodeEdit(node.id);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <text
              x={pos.x - 60}
              y={pos.y + 19}
              textAnchor="middle"
              fontSize="10"
              fill="white"
              style={{ pointerEvents: 'none' }}
            >
              ✎
            </text>
          </motion.circle>
          
          {/* Delete Button (only for non-root nodes) */}
          {node.id !== 'root' && (
            <motion.circle
              cx={pos.x}
              cy={pos.y - 40}
              r={6}
              fill="#F44336"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                handleNodeDelete(node.id);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <text
                x={pos.x}
                y={pos.y - 36}
                textAnchor="middle"
                fontSize="10"
                fill="white"
                style={{ pointerEvents: 'none' }}
              >
                ×
              </text>
            </motion.circle>
          )}
        </motion.g>
      );
      
      if (node.children) {
        node.children.forEach(addNodes);
      }
    };
    
    addNodes(data);
    return nodes;
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Controls */}
      <div className="absolute top-4 right-4 sm:left-4 sm:right-auto z-10 flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-2 order-first">
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 sm:py-1 text-base sm:text-sm border-none outline-none bg-transparent"
          />
        </div>
        
        {/* Zoom Controls */}
        <div className="flex sm:flex-row gap-2">
          <div className="bg-white rounded-lg shadow-md flex">
            <motion.button
              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-50 rounded-l-lg"
              onClick={() => handleZoom(0.1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-base sm:text-sm">+</span>
            </motion.button>
            <motion.button
              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-50 rounded-r-lg"
              onClick={() => handleZoom(-0.1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-base sm:text-sm">−</span>
            </motion.button>
          </div>
          
          {/* Reset View */}
          <motion.button
            className="w-10 h-10 sm:w-auto sm:h-auto px-3 py-1 bg-white rounded-lg shadow-md text-base sm:text-sm hover:bg-gray-50 flex items-center justify-center"
            onClick={() => {
              setZoom(1);
              setPosition({ x: 0, y: 0 });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="hidden sm:inline">Reset</span>
            <span className="sm:hidden">⌂</span>
          </motion.button>
        </div>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg px-3 py-2 shadow-md hidden sm:block">
        <span className="text-sm text-gray-600">
          Zoom: {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Mobile Instructions */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md sm:hidden">
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Pinch to zoom</p>
          <p>• Drag to pan</p>
          <p>• Tap to select</p>
          <p>• Double tap to expand</p>
        </div>
      </div>

      {/* Mind Map Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            touchAction: 'none' // Prevent browser touch actions
          }}
        >
          {/* Grid Background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E0E0E0" strokeWidth="0.5"/>
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Connections */}
          {renderConnections()}
          
          {/* Nodes */}
          {renderNodes()}
        </svg>
      </div>

      {/* Node Details Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ 
              x: window.innerWidth <= 640 ? 0 : 300,
              y: window.innerWidth <= 640 ? "100%" : 0,
              opacity: 0 
            }}
            animate={{ 
              x: window.innerWidth <= 640 ? 0 : 0,
              y: window.innerWidth <= 640 ? 0 : 0,
              opacity: 1 
            }}
            exit={{ 
              x: window.innerWidth <= 640 ? 0 : 300,
              y: window.innerWidth <= 640 ? "100%" : 0,
              opacity: 0 
            }}
            className={`
              fixed sm:absolute 
              sm:top-4 sm:right-4 
              bottom-0 sm:bottom-auto 
              left-0 sm:left-auto 
              w-full sm:w-80 
              bg-white rounded-t-2xl sm:rounded-lg 
              shadow-lg p-4 
              z-20
              max-h-[90vh] sm:max-h-[calc(100vh-2rem)]
              overflow-y-auto
            `}
          >
            <div className="flex justify-between items-center mb-3 sticky top-0 bg-white pb-2 border-b">
              <h3 className="text-lg font-semibold">Node Details</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm"
                  defaultValue={data.title}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm">
                  <option>Topic</option>
                  <option>Concept</option>
                  <option>Task</option>
                  <option>Note</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm"
                  placeholder="Add detailed notes..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Links
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              
              <div className="flex gap-2 pt-2 sticky bottom-0 bg-white mt-6 border-t py-3">
                <button className="flex-1 bg-blue-500 text-white py-3 sm:py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-base sm:text-sm">
                  Save
                </button>
                <button className="flex-1 bg-gray-200 text-gray-700 py-3 sm:py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-base sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedMindMap;
