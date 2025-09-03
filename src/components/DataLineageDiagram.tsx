import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  Box,
  Paper,
  Typography,
  Toolbar,
  Button,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as CenterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

interface DataAsset {
  _id: string;
  name: string;
  type: string;
  domain: string;
  description?: string;
  parentTable?: string;
}

interface DataLineageDiagramProps {
  assets: DataAsset[];
  onNodeClick?: (asset: DataAsset) => void;
}

const DataLineageDiagram: React.FC<DataLineageDiagramProps> = ({ 
  assets, 
  onNodeClick 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(100);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Asset type colors matching Collibra style
  const getAssetColor = (type: string): string => {
    const colorMap: { [key: string]: string } = {
      'Database': '#4CAF50',           // Green
      'Table': '#2196F3',             // Blue
      'View': '#2196F3',              // Blue
      'Column': '#FF9800',            // Orange
      'Report': '#9C27B0',            // Purple
      'Business Term': '#00BCD4',     // Cyan
      'Data Warehouse': '#4CAF50',    // Green
      'Schema': '#607D8B',            // Blue Grey
      'Dashboard': '#E91E63',         // Pink
      'API': '#795548',               // Brown
      'File': '#FFC107',              // Amber
      'Dataset': '#3F51B5'            // Indigo
    };
    return colorMap[type] || '#757575';
  };

  // Create hierarchical data structure
  const createHierarchy = (assets: DataAsset[]) => {
    const nodes: any[] = [];
    const links: any[] = [];
    
    // Filter HR assets for the diagram
    const hrAssets = assets.filter(asset => asset.domain === 'Human Resources');
    
    // Create nodes
    hrAssets.forEach(asset => {
      nodes.push({
        id: asset._id,
        name: asset.name,
        type: asset.type,
        domain: asset.domain,
        description: asset.description,
        color: getAssetColor(asset.type),
        parentTable: asset.parentTable
      });
    });

    // Create links based on relationships
    hrAssets.forEach(asset => {
      if (asset.parentTable) {
        const parentExists = hrAssets.find(p => p._id === asset.parentTable);
        if (parentExists) {
          links.push({
            source: asset.parentTable,
            target: asset._id
          });
        }
      }
    });

    // Add some logical connections for HR domain
    const businessTerms = nodes.filter(n => n.type === 'Business Term');
    const reports = nodes.filter(n => n.type === 'Report');
    const tables = nodes.filter(n => n.type === 'Table' || n.type === 'View');
    const databases = nodes.filter(n => n.type === 'Database');
    const schemas = nodes.filter(n => n.type === 'Schema');

    // Connect databases to schemas
    databases.forEach(db => {
      schemas.forEach(schema => {
        links.push({ source: db.id, target: schema.id });
      });
    });

    // Connect schemas to tables/views
    schemas.forEach(schema => {
      tables.forEach(table => {
        links.push({ source: schema.id, target: table.id });
      });
    });

    // Connect tables to reports
    tables.forEach(table => {
      reports.forEach(report => {
        links.push({ source: table.id, target: report.id });
      });
    });

    return { nodes, links };
  };

  useEffect(() => {
    if (!svgRef.current || assets.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 600;
    const { nodes, links } = createHierarchy(assets);

    if (nodes.length === 0) return;

    // Create zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        setZoom(Math.round(event.transform.k * 100));
      });

    svg.call(zoomBehavior);

    const container = svg.append('g');

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Create links
    const link = container.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

    // Add arrowhead marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke', 'none');

    // Create nodes
    const node = container.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag<SVGGElement, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles for nodes
    node.append('circle')
      .attr('r', 20)
      .attr('fill', (d: any) => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add labels
    node.append('text')
      .attr('dy', 35)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text((d: any) => d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name);

    // Add type labels
    node.append('text')
      .attr('dy', 50)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#666')
      .text((d: any) => d.type);

    // Add click handlers
    node.on('click', (event, d) => {
      if (onNodeClick) {
        onNodeClick(d as DataAsset);
      }
    });

    // Add hover effects
    node.on('mouseover', function(event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', 25)
        .attr('stroke-width', 3);
    })
    .on('mouseout', function(event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', 20)
        .attr('stroke-width', 2);
    });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Store zoom behavior for external controls
    (svg.node() as any).__zoom__ = zoomBehavior;

  }, [assets, onNodeClick]);

  const handleZoomIn = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const zoomBehavior = (svg.node() as any).__zoom__;
      if (zoomBehavior) {
        svg.transition().duration(300).call(
          zoomBehavior.scaleBy, 1.5
        );
      }
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const zoomBehavior = (svg.node() as any).__zoom__;
      if (zoomBehavior) {
        svg.transition().duration(300).call(
          zoomBehavior.scaleBy, 1 / 1.5
        );
      }
    }
  };

  const handleCenter = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const zoomBehavior = (svg.node() as any).__zoom__;
      if (zoomBehavior) {
        svg.transition().duration(500).call(
          zoomBehavior.transform,
          d3.zoomIdentity
        );
      }
    }
  };

  const handleExport = () => {
    if (svgRef.current) {
      const svgElement = svgRef.current;
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svgElement);
      const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'data-lineage-diagram.svg';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider', gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Data Lineage Diagram
        </Typography>
        
        <Chip 
          label={`Zoom: ${zoom}%`} 
          variant="outlined" 
          size="small" 
        />
        
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
        
        <Tooltip title="Center View">
          <IconButton onClick={handleCenter} size="small">
            <CenterIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Export SVG">
          <IconButton onClick={handleExport} size="small">
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>

      {/* Filter Chips */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Drag nodes to rearrange | Click nodes for details
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label="Upstream (Sources)" 
            variant="outlined" 
            size="small"
            sx={{ backgroundColor: '#E3F2FD' }}
          />
          <Chip 
            label="Downstream (Targets)" 
            variant="outlined" 
            size="small"
            sx={{ backgroundColor: '#FCE4EC' }}
          />
        </Box>
      </Box>

      {/* SVG Container */}
      <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          style={{ border: 'none', background: '#fafafa' }}
        />
      </Box>
    </Paper>
  );
};

export default DataLineageDiagram;
