import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Color palette for different branches
const BRANCH_COLORS = [
  '#E3F2FD', // Light Blue
  '#F3E5F5', // Light Purple
  '#E8F5E8', // Light Green
  '#FFF3E0', // Light Orange
  '#FCE4EC', // Light Pink
  '#F1F8E9', // Light Lime
  '#E0F2F1', // Light Teal
  '#FFF8E1', // Light Yellow
];

const ModernMindMap = ({ data, onNodeClick, onNodeEdit, onNodeAdd }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Calculate node positions
  const calculateNodePositions = useCallback((node, centerX = 400, centerY = 300, level = 0, angle = 0) => {
    const positions = {};
    const radius = 120 + (level * 80);
    const angleStep = (2 * Math.PI) / Math.max(node.children?.length || 1, 1);
    
    positions[node.id] = {
      x: centerX,
      y: centerY,
      level,
      angle,
      color: BRANCH_COLORS[level % BRANCH_COLORS.length]
    };

    if (node.children && expandedNodes.has(node.id)) {
      node.children.forEach((child, index) => {
        const childAngle = angle + (index - (node.children.length - 1) / 2) * angleStep;
        const childX = centerX + Math.cos(childAngle) * radius;
        const childY = centerY + Math.sin(childAngle) * radius;
        
        const childPositions = calculateNodePositions(child, childX, childY, level + 1, childAngle);
        Object.assign(positions, childPositions);
      });
    }

    return positions;
  }, [expandedNodes]);

  const nodePositions = calculateNodePositions(data);

  // Handle zoom
  const handleZoom = useCallback((delta) => {
    setZoom(prev => Math.max(0.3, Math.min(3, prev + delta * 0.1)));
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
      handleZoom(-e.deltaY / 1000);
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
      setTouchDistance(getTouchDistance(e.touches));
      setTouchCenter(getTouchCenter(e.touches));
    } else if (e.touches.length === 1) {
      // Single touch pan
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      // Pinch to zoom
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
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
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

  const handleNodeDrag = (nodeId, x, y) => {
    // Update node position (in a real app, this would update the data)
  };

  // Render curved connection lines
  const renderConnections = () => {
    const connections = [];
    
    const addConnections = (node) => {
      if (node.children && expandedNodes.has(node.id)) {
        node.children.forEach(child => {
          const parentPos = nodePositions[node.id];
          const childPos = nodePositions[child.id];
          
          if (parentPos && childPos) {
            connections.push(
              <motion.path
                key={`${node.id}-${child.id}`}
                d={`M ${parentPos.x} ${parentPos.y} Q ${(parentPos.x + childPos.x) / 2} ${parentPos.y - 50} ${childPos.x} ${childPos.y}`}
                stroke={parentPos.color}
                strokeWidth="2"
                fill="none"
                strokeDasharray="0"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
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

  // Render nodes
  const renderNodes = () => {
    const nodes = [];
    
    const addNodes = (node) => {
      const pos = nodePositions[node.id];
      if (!pos) return;
      
      const isSelected = selectedNode === node.id;
      const isExpanded = expandedNodes.has(node.id);
      
      nodes.push(
        <motion.g
          key={node.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Node Card */}
          <motion.rect
            x={pos.x - 60}
            y={pos.y - 25}
            width={120}
            height={50}
            rx={12}
            ry={12}
            fill={isSelected ? '#E3F2FD' : pos.color}
            stroke={isSelected ? '#1976D2' : '#E0E0E0'}
            strokeWidth={isSelected ? 2 : 1}
            style={{ cursor: 'pointer' }}
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNodeClick(node.id)}
            onDoubleClick={() => handleNodeDoubleClick(node.id)}
          />
          
          {/* Node Text */}
          <text
            x={pos.x}
            y={pos.y + 5}
            textAnchor="middle"
            fontSize="12"
            fontWeight="500"
            fill="#333"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {node.title}
          </text>
          
          {/* Expand/Collapse Indicator */}
          {node.children && node.children.length > 0 && (
            <motion.circle
              cx={pos.x + 50}
              cy={pos.y - 15}
              r={8}
              fill="#1976D2"
              style={{ cursor: 'pointer' }}
              onClick={() => handleNodeDoubleClick(node.id)}
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <text
                x={pos.x + 50}
                y={pos.y - 12}
                textAnchor="middle"
                fontSize="12"
                fill="white"
                style={{ pointerEvents: 'none' }}
              >
                {isExpanded ? '−' : '+'}
              </text>
            </motion.circle>
          )}
          
          {/* Add Child Button */}
          <motion.circle
            cx={pos.x + 50}
            cy={pos.y + 15}
            r={8}
            fill="#4CAF50"
            style={{ cursor: 'pointer' }}
            onClick={() => onNodeAdd?.(node.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <text
              x={pos.x + 50}
              y={pos.y + 18}
              textAnchor="middle"
              fontSize="12"
              fill="white"
              style={{ pointerEvents: 'none' }}
            >
              +
            </text>
          </motion.circle>
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
    <div className="w-full h-full relative overflow-hidden bg-gray-50">
      {/* Navigation Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col sm:flex-row gap-2">
        <div className="flex flex-row sm:flex-col gap-2">
          <motion.button
            className="w-12 h-12 sm:w-10 sm:h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 active:bg-gray-100"
            onClick={() => handleZoom(0.1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl sm:text-lg">+</span>
          </motion.button>
          <motion.button
            className="w-12 h-12 sm:w-10 sm:h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 active:bg-gray-100"
            onClick={() => handleZoom(-0.1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl sm:text-lg">−</span>
          </motion.button>
        </div>
        <motion.button
          className="w-12 h-12 sm:w-10 sm:h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 active:bg-gray-100"
          onClick={() => {
            setZoom(1);
            setPosition({ x: 0, y: 0 });
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm">⌂</span>
        </motion.button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg px-3 py-2 shadow-md hidden sm:block">
        <span className="text-sm text-gray-600">
          Zoom: {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Touch Instructions */}
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
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {/* Grid Background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E0E0E0" strokeWidth="0.5"/>
            </pattern>
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
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg p-4 z-20"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Node Details</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={data.title}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add notes..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Links
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                  Save
                </button>
                <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
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

export default ModernMindMap;
