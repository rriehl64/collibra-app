/**
 * DataLineageVisualization Component
 * 
 * Interactive data lineage visualization using D3.js with accessibility features.
 * Shows upstream and downstream data flow relationships.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as CenterIcon,
  Fullscreen as FullscreenIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import {
  select,
  zoom,
  zoomIdentity,
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
  drag,
  scaleOrdinal,
  schemeCategory10,
  Simulation
} from 'd3';
import { DataAsset } from '../../types/DataAsset';

interface LineageNode {
  id: string;
  name: string;
  type: string;
  level: number;
  isCenter: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface LineageLink {
  source: string | LineageNode;
  target: string | LineageNode;
  type: string;
  strength?: number;
}

interface LineageData {
  nodes: LineageNode[];
  links: LineageLink[];
}

interface DataLineageVisualizationProps {
  asset: DataAsset;
  onNodeClick?: (nodeId: string) => void;
  height?: number;
  width?: number;
}

export const DataLineageVisualization: React.FC<DataLineageVisualizationProps> = ({
  asset,
  onNodeClick,
  height = 600,
  width = 800
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [lineageData, setLineageData] = useState<LineageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedDepth, setSelectedDepth] = useState(2);
  const [layoutType, setLayoutType] = useState<'force' | 'hierarchical'>('hierarchical');

  // Generate lineage data based on asset relationships
  const generateLineageData = useCallback((depth: number = 2): LineageData => {
    const nodes: LineageNode[] = [];
    const links: LineageLink[] = [];
    
    // Center node (current asset)
    const centerNode: LineageNode = {
      id: asset._id || 'center',
      name: asset.name,
      type: asset.type,
      level: 0,
      isCenter: true
    };
    nodes.push(centerNode);

    // Generate upstream nodes (sources)
    const upstreamCount = Math.min(depth, 3);
    for (let level = 1; level <= upstreamCount; level++) {
      const nodesAtLevel = Math.max(1, Math.floor(Math.random() * 3) + 1);
      
      for (let i = 0; i < nodesAtLevel; i++) {
        const nodeId = `upstream-${level}-${i}`;
        const upstreamNode: LineageNode = {
          id: nodeId,
          name: `${asset.domain} Source ${level}.${i + 1}`,
          type: level === 1 ? 'Table' : level === 2 ? 'Database' : 'Data Lake',
          level: -level,
          isCenter: false
        };
        nodes.push(upstreamNode);

        // Create link to previous level or center
        const targetId = level === 1 ? centerNode.id : `upstream-${level - 1}-0`;
        links.push({
          source: nodeId,
          target: targetId,
          type: 'feeds',
          strength: 1 / level
        });
      }
    }

    // Generate downstream nodes (targets)
    const downstreamCount = Math.min(depth, 3);
    for (let level = 1; level <= downstreamCount; level++) {
      const nodesAtLevel = Math.max(1, Math.floor(Math.random() * 4) + 1);
      
      for (let i = 0; i < nodesAtLevel; i++) {
        const nodeId = `downstream-${level}-${i}`;
        const downstreamNode: LineageNode = {
          id: nodeId,
          name: `${asset.domain} Target ${level}.${i + 1}`,
          type: level === 1 ? 'Report' : level === 2 ? 'Dashboard' : 'Analytics',
          level: level,
          isCenter: false
        };
        nodes.push(downstreamNode);

        // Create link from previous level or center
        const sourceId = level === 1 ? centerNode.id : `downstream-${level - 1}-0`;
        links.push({
          source: sourceId,
          target: nodeId,
          type: 'feeds',
          strength: 1 / level
        });
      }
    }

    // Add some cross-level connections for complexity
    if (nodes.length > 5) {
      const randomConnections = Math.floor(nodes.length * 0.1);
      for (let i = 0; i < randomConnections; i++) {
        const sourceNode = nodes[Math.floor(Math.random() * nodes.length)];
        const targetNode = nodes[Math.floor(Math.random() * nodes.length)];
        
        if (sourceNode.id !== targetNode.id && sourceNode.level < targetNode.level) {
          links.push({
            source: sourceNode.id,
            target: targetNode.id,
            type: 'references',
            strength: 0.3
          });
        }
      }
    }

    return { nodes, links };
  }, [asset]);

  // Load lineage data
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      setTimeout(() => {
        const data = generateLineageData(selectedDepth);
        setLineageData(data);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to load lineage data');
      setLoading(false);
    }
  }, [generateLineageData, selectedDepth]);

  // Get node color based on type and level
  const getNodeColor = (node: LineageNode): string => {
    if (node.isCenter) return '#003366';
    
    const typeColors: Record<string, string> = {
      'Table': '#2196F3',
      'Database': '#4CAF50',
      'Data Lake': '#FF9800',
      'Report': '#9C27B0',
      'Dashboard': '#E91E63',
      'Analytics': '#795548',
      'API': '#607D8B',
      'File': '#FFC107'
    };
    
    return typeColors[node.type] || '#757575';
  };

  // Get node size based on importance
  const getNodeSize = (node: LineageNode): number => {
    if (node.isCenter) return 12;
    return Math.max(6, 10 - Math.abs(node.level));
  };

  // Create visualization
  useEffect(() => {
    if (!lineageData || !svgRef.current) return;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create zoom behavior
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event: any) => {
        g.attr('transform', `translate(${margin.left + event.transform.x},${margin.top + event.transform.y}) scale(${event.transform.k})`);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoomBehavior);

    // Create simulation
    let simulation: Simulation<LineageNode, LineageLink>;
    
    if (layoutType === 'hierarchical') {
      // Hierarchical layout
      const levels = Array.from(new Set(lineageData.nodes.map(n => n.level))).sort((a, b) => a - b);
      const levelHeight = innerHeight / (levels.length + 1);
      
      lineageData.nodes.forEach(node => {
        const levelIndex = levels.indexOf(node.level);
        node.y = (levelIndex + 1) * levelHeight;
        
        // Distribute nodes horizontally within each level
        const nodesAtLevel = lineageData.nodes.filter(n => n.level === node.level);
        const nodeIndex = nodesAtLevel.indexOf(node);
        const levelWidth = innerWidth / (nodesAtLevel.length + 1);
        node.x = (nodeIndex + 1) * levelWidth;
      });

      simulation = forceSimulation<LineageNode>(lineageData.nodes)
        .force('link', forceLink<LineageNode, LineageLink>(lineageData.links)
          .id((d: LineageNode) => d.id)
          .strength((d: LineageLink) => d.strength || 0.5))
        .force('charge', forceManyBody().strength(-100))
        .force('x', forceX<LineageNode>((d: LineageNode) => d.x || innerWidth / 2).strength(0.8))
        .force('y', forceY<LineageNode>((d: LineageNode) => d.y || innerHeight / 2).strength(0.8));
    } else {
      // Force-directed layout
      simulation = forceSimulation<LineageNode>(lineageData.nodes)
        .force('link', forceLink<LineageNode, LineageLink>(lineageData.links)
          .id((d: LineageNode) => d.id)
          .distance(100)
          .strength((d: LineageLink) => d.strength || 0.5))
        .force('charge', forceManyBody().strength(-300))
        .force('center', forceCenter(innerWidth / 2, innerHeight / 2))
        .force('collision', forceCollide().radius(20));
    }

    // Create arrow markers for links
    svg.append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 13)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 13)
      .attr('markerHeight', 13)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#666')
      .style('stroke', 'none');

    // Create links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(lineageData.links)
      .enter()
      .append('line')
      .attr('stroke', (d: LineageLink) => d.type === 'feeds' ? '#666' : '#999')
      .attr('stroke-width', (d: LineageLink) => d.type === 'feeds' ? 2 : 1)
      .attr('stroke-dasharray', (d: LineageLink) => d.type === 'references' ? '5,5' : 'none')
      .attr('marker-end', 'url(#arrowhead)')
      .attr('opacity', 0.7);

    // Create nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(lineageData.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(drag<SVGGElement, LineageNode>()
        .on('start', (event: any, d: LineageNode) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event: any, d: LineageNode) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event: any, d: LineageNode) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Add circles to nodes
    node.append('circle')
      .attr('r', (d: LineageNode) => getNodeSize(d))
      .attr('fill', (d: LineageNode) => getNodeColor(d))
      .attr('stroke', '#fff')
      .attr('stroke-width', (d: LineageNode) => d.isCenter ? 3 : 1.5);

    // Add labels to nodes
    node.append('text')
      .text((d: LineageNode) => d.name.length > 15 ? d.name.substring(0, 12) + '...' : d.name)
      .attr('x', 0)
      .attr('y', (d: LineageNode) => getNodeSize(d) + 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', (d: LineageNode) => d.isCenter ? 'bold' : 'normal')
      .attr('fill', '#333');

    // Add type labels
    node.append('text')
      .text((d: LineageNode) => d.type)
      .attr('x', 0)
      .attr('y', (d: LineageNode) => getNodeSize(d) + 28)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#666');

    // Add click handlers
    node.on('click', (event: MouseEvent, d: LineageNode) => {
      if (onNodeClick) {
        onNodeClick(d.id);
      }
    });

    // Add hover effects
    node.on('mouseenter', function(this: SVGGElement, event: MouseEvent, d: LineageNode) {
      select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', getNodeSize(d) * 1.2)
        .attr('stroke-width', 3);
    })
    .on('mouseleave', function(this: SVGGElement, event: MouseEvent, d: LineageNode) {
      select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', getNodeSize(d))
        .attr('stroke-width', d.isCenter ? 3 : 1.5);
    });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: LineageLink) => (d.source as LineageNode).x || 0)
        .attr('y1', (d: LineageLink) => (d.source as LineageNode).y || 0)
        .attr('x2', (d: LineageLink) => (d.target as LineageNode).x || 0)
        .attr('y2', (d: LineageLink) => (d.target as LineageNode).y || 0);

      node
        .attr('transform', (d: LineageNode) => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Store zoom function for external controls
    (svg.node() as any).zoomIn = () => {
      svg.transition().call(zoomBehavior.scaleBy, 1.5);
    };
    (svg.node() as any).zoomOut = () => {
      svg.transition().call(zoomBehavior.scaleBy, 1 / 1.5);
    };
    (svg.node() as any).resetZoom = () => {
      svg.transition().call(zoomBehavior.transform, zoomIdentity);
    };

  }, [lineageData, width, height, layoutType, onNodeClick]);

  // Control handlers
  const handleZoomIn = () => {
    (svgRef.current as any)?.zoomIn();
  };

  const handleZoomOut = () => {
    (svgRef.current as any)?.zoomOut();
  };

  const handleResetZoom = () => {
    (svgRef.current as any)?.resetZoom();
  };

  const handleExport = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${asset.name}-lineage.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading lineage data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      {/* Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="h6" component="h3">
          Data Lineage: {asset.name}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Depth</InputLabel>
            <Select
              value={selectedDepth}
              onChange={(e) => setSelectedDepth(Number(e.target.value))}
              label="Depth"
            >
              <MenuItem value={1}>1 Level</MenuItem>
              <MenuItem value={2}>2 Levels</MenuItem>
              <MenuItem value={3}>3 Levels</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Layout</InputLabel>
            <Select
              value={layoutType}
              onChange={(e) => setLayoutType(e.target.value as 'force' | 'hierarchical')}
              label="Layout"
            >
              <MenuItem value="hierarchical">Hierarchical</MenuItem>
              <MenuItem value="force">Force-Directed</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Zoom In">
            <IconButton onClick={handleZoomIn} size="small">
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Zoom Out">
            <IconButton onClick={handleZoomOut} size="small">
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Reset Zoom">
            <IconButton onClick={handleResetZoom} size="small">
              <CenterIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Export SVG">
            <IconButton onClick={handleExport} size="small">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Refresh">
            <IconButton onClick={() => setLineageData(generateLineageData(selectedDepth))} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Chip label="Current Asset" sx={{ bgcolor: '#003366', color: 'white' }} size="small" />
        <Chip label="Upstream (Sources)" sx={{ bgcolor: '#2196F3', color: 'white' }} size="small" />
        <Chip label="Downstream (Targets)" sx={{ bgcolor: '#9C27B0', color: 'white' }} size="small" />
        <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
          Zoom: {Math.round(zoomLevel * 100)}% | Drag nodes to rearrange | Click nodes for details
        </Typography>
      </Box>

      {/* Visualization */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
        <svg
          ref={svgRef}
          width={width}
          height={height}
          style={{ display: 'block' }}
          role="img"
          aria-label={`Data lineage visualization for ${asset.name}`}
        />
      </Box>
    </Paper>
  );
};

export default DataLineageVisualization;
