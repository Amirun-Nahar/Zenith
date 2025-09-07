import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';

export default function AutoMindMap({ onNodeClick }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState(null);
  const [touchCenter, setTouchCenter] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set(['root'])); // Track expanded nodes
  const svgRef = useRef(null);
  const containerRef = useRef(null);

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

  // Handle zoom
  const handleZoom = useCallback((delta) => {
    setZoom(prev => Math.max(0.3, Math.min(3, prev + delta * 0.1)));
  }, []);

  // Toggle node expansion
  const toggleNodeExpansion = (nodeId) => {
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

  // Handle window resize for responsive positioning
  useEffect(() => {
    const handleResize = () => {
      // Force re-render when window resizes to recalculate positions
      if (data) {
        setData({ ...data });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data]);

  // Touch event handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch to zoom
      e.preventDefault();
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

  // Generate mindmap data
  async function generateMindMap() {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');

    // Clear any corrupted localStorage data that might cause JSON parsing errors
    try {
      const token = localStorage.getItem('token');
      if (token && !token.startsWith('eyJ')) {
        console.warn('Invalid token format detected, clearing localStorage');
        localStorage.removeItem('token');
      }
    } catch (e) {
      console.warn('Error checking localStorage:', e);
    }

    try {
      const response = await api.post('/api/ai/mindmap', { topic: topic.trim() });
      if (response.error) {
        throw new Error(response.error);
      }
      console.log('Mindmap response:', response); // Debug log
      setData(response);
      setPosition({ x: 0, y: 0 }); // Reset position when new data is loaded
      setZoom(1); // Reset zoom when new data is loaded
    } catch (e) {
      console.error('Mindmap generation error:', e); // Debug log
      setError(e.message || 'Failed to generate mindmap');
    } finally {
      setLoading(false);
    }
  }

  // Calculate node positions - Updated for vertical layout like the image
  const calculateNodePositions = useCallback((node, level = 0) => {
    const positions = {};
    const children = node.children || [];
    
    // Get container dimensions for responsive positioning
    const containerWidth = containerRef.current?.clientWidth || 800;
    const containerHeight = containerRef.current?.clientHeight || 600;
    
    // Responsive center position
    const centerX = Math.max(150, containerWidth * 0.25); // 25% from left, minimum 150px
    const centerY = containerHeight * 0.5; // Center vertically
    
    // Center node position
    positions[node.id] = {
      x: centerX,
      y: centerY,
      level,
      isCenter: level === 0
    };

    // For level 1 (main branches), arrange vertically on the right
    if (level === 0 && children.length > 0) {
      const branchSpacing = Math.max(80, containerHeight / 8); // Responsive spacing
      const startY = centerY - ((children.length - 1) * branchSpacing) / 2;
      const branchX = centerX + Math.max(180, containerWidth * 0.3); // Responsive distance
      
      children.forEach((child, index) => {
        const childY = startY + (index * branchSpacing);
        positions[child.id] = {
          x: branchX,
          y: childY,
          level: level + 1,
          isCenter: false
        };
        
        // Add sub-branches if they exist
        if (child.children && child.children.length > 0) {
          const subBranchX = branchX + Math.max(150, containerWidth * 0.25); // Responsive distance for sub-branches
          const subBranchSpacing = Math.max(120, containerHeight / 6); // Responsive spacing for sub-branches
          const subStartY = childY - ((child.children.length - 1) * subBranchSpacing) / 2;
          
          child.children.forEach((subChild, subIndex) => {
            positions[subChild.id] = {
              x: subBranchX,
              y: subStartY + (subIndex * subBranchSpacing),
              level: level + 2,
              isCenter: false
            };
          });
        }
      });
    }

    return positions;
  }, []);

  // Render connections - Updated for curved lines like the image
  const renderConnections = () => {
    if (!data) return null;
    const positions = calculateNodePositions(data);
    const connections = [];
    
    const addConnections = (node) => {
      if (node.children) {
        node.children.forEach(child => {
          const parentPos = positions[node.id];
          const childPos = positions[child.id];
          
          if (parentPos && childPos) {
            // Create curved connection like in the image
            const controlPointX = parentPos.x + (childPos.x - parentPos.x) * 0.6;
            const controlPointY = parentPos.y + (childPos.y - parentPos.y) * 0.3;
            
            connections.push(
              <motion.path
                key={`${node.id}-${child.id}`}
                d={`M ${parentPos.x} ${parentPos.y} Q ${controlPointX} ${controlPointY} ${childPos.x} ${childPos.y}`}
                stroke="#6B7280"
                strokeWidth="1.5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
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

  // Render nodes - Updated to match image style
  const renderNodes = () => {
    if (!data) return null;
    const positions = calculateNodePositions(data);
    const nodes = [];
    
    const addNodes = (node) => {
      const pos = positions[node.id];
      if (!pos) return;
      
      const isExpanded = expandedNodes.has(node.id);
      const hasChildren = node.children && node.children.length > 0;
      
      // Only render if parent is expanded (except for root)
      if (node.id !== 'root' && node.parentId && !expandedNodes.has(node.parentId)) {
        return;
      }
      
      nodes.push(
        <motion.g
          key={node.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Node rectangle */}
          <motion.rect
            x={pos.x - 80}
            y={pos.y - 15}
            width={160}
            height={30}
            rx={6}
            fill={pos.isCenter ? "#1E40AF" : "#374151"}
            stroke={pos.isCenter ? "#1D4ED8" : "#4B5563"}
            strokeWidth={1}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNodeClick?.(node)}
            style={{ cursor: 'pointer' }}
          />
          
          {/* Node text */}
          <text
            x={pos.x}
            y={pos.y + 4}
            textAnchor="middle"
            fontSize={pos.isCenter ? 14 : 12}
            fontWeight={pos.isCenter ? "600" : "400"}
            fill="white"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {node.title}
          </text>
          
          {/* Expand/Collapse button */}
          {hasChildren && (
            <motion.circle
              cx={pos.x + 70}
              cy={pos.y}
              r={8}
              fill="#6B7280"
              stroke="#9CA3AF"
              strokeWidth={1}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                toggleNodeExpansion(node.id);
              }}
              style={{ cursor: 'pointer' }}
            />
          )}
          
          {/* Chevron icon */}
          {hasChildren && (
            <text
              x={pos.x + 70}
              y={pos.y + 3}
              textAnchor="middle"
              fontSize={10}
              fill="white"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {isExpanded ? '‹' : '›'}
            </text>
          )}
        </motion.g>
      );
      
      // Recursively add children if expanded
      if (node.children && isExpanded) {
        node.children.forEach(child => {
          child.parentId = node.id; // Add parent reference
          addNodes(child);
        });
      }
    };
    
    addNodes(data);
    return nodes;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., Object-Oriented Programming)"
          className="input flex-1 text-sm sm:text-base py-2.5 sm:py-2.5 px-3 sm:px-4"
        />
        <button
          onClick={generateMindMap}
          disabled={loading}
          className="btn btn-primary text-sm sm:text-base py-2.5 sm:py-2.5 px-4 sm:px-6 whitespace-nowrap"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-600 mt-2">{error}</div>
      )}

      <div
        ref={containerRef}
        className="relative h-[600px] sm:h-[700px] md:h-[800px] lg:h-[900px] xl:h-[1000px] rounded-xl border overflow-hidden touch-none"
        style={{ backgroundColor: '#374151', borderColor: 'rgba(248, 247, 229, 0.2)' }}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4B9EF4] border-t-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-2xl">🧠</div>
                </div>
              </div>
              <p className="text-sm" style={{ color: '#f8f7e5', opacity: 0.8 }}>
                Generating mindmap...
              </p>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full cursor-grab active:cursor-grabbing"
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
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2A2B36" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Connections */}
              {renderConnections()}
              
              {/* Nodes */}
              {renderNodes()}
            </svg>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex flex-row sm:flex-col gap-2">
          <motion.button
            className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/20 text-sm sm:text-base"
            onClick={() => handleZoom(0.1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Zoom In"
          >
            +
          </motion.button>
          <motion.button
            className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/20 text-sm sm:text-base"
            onClick={() => handleZoom(-0.1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Zoom Out"
          >
            −
          </motion.button>
          <motion.button
            className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/20 text-sm sm:text-base"
            onClick={() => {
              setZoom(1);
              setPosition({ x: 0, y: 0 });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Reset View"
          >
            ⌂
          </motion.button>
        </div>
      </div>
    </div>
  );
}
