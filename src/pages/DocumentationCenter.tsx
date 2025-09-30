import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
  Button
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Article as ArticleIcon,
  MenuBook as MenuBookIcon,
  PictureAsPdf as PdfIcon,
  Home as HomeIcon,
  AccountTree as GraphIcon,
  Business as BusinessIcon,
  Code as CodeIcon,
  Help as HelpIcon,
  Folder as FolderIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentItem {
  id: string;
  title: string;
  filename: string;
  description: string;
  icon: React.ReactNode;
  category: 'janusgraph' | 'business' | 'technical' | 'general';
  pages?: string;
}

const DocumentationCenter: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const documents: DocumentItem[] = [
    // JanusGraph Documentation
    {
      id: 'janusgraph-index',
      title: 'JanusGraph Documentation Index',
      filename: 'JANUSGRAPH_DOCUMENTATION_INDEX.md',
      description: 'Complete navigation guide for all JanusGraph documentation',
      icon: <FolderIcon sx={{ color: '#003366' }} />,
      category: 'janusgraph'
    },
    {
      id: 'janusgraph-access',
      title: 'JanusGraph Access Guide',
      filename: 'JANUSGRAPH_ACCESS_GUIDE.md',
      description: 'Step-by-step instructions for accessing JanusGraph in the application',
      icon: <HelpIcon sx={{ color: '#4caf50' }} />,
      category: 'janusgraph'
    },
    {
      id: 'janusgraph-strategic',
      title: 'JanusGraph Strategic Overview',
      filename: 'JANUSGRAPH_DSSS3_STRATEGIC_OVERVIEW.md',
      description: 'Business case, ROI analysis, and decision-making use cases (25 pages)',
      icon: <BusinessIcon sx={{ color: '#2196f3' }} />,
      category: 'janusgraph',
      pages: '25 pages'
    },
    {
      id: 'janusgraph-briefing',
      title: 'JanusGraph Executive Briefing',
      filename: 'JANUSGRAPH_EXECUTIVE_BRIEFING.md',
      description: '30-minute presentation deck for OCDO/OPQ leadership (25 slides)',
      icon: <ArticleIcon sx={{ color: '#ff9800' }} />,
      category: 'janusgraph',
      pages: '25 slides'
    },
    {
      id: 'janusgraph-implementation',
      title: 'JanusGraph Implementation Guide',
      filename: 'JANUSGRAPH_IMPLEMENTATION_GUIDE.md',
      description: 'Technical handbook for installation, configuration, and development (40 pages)',
      icon: <CodeIcon sx={{ color: '#9c27b0' }} />,
      category: 'janusgraph',
      pages: '40 pages'
    },
    {
      id: 'janusgraph-capabilities',
      title: 'JanusGraph DSSS3 Capabilities',
      filename: 'JANUSGRAPH_DSSS3_CAPABILITIES.md',
      description: 'Detailed technical capabilities and use case implementations',
      icon: <GraphIcon sx={{ color: '#f44336' }} />,
      category: 'janusgraph'
    },
    {
      id: 'janusgraph-roi',
      title: 'JanusGraph ROI Calculations',
      filename: 'JANUSGRAPH_ROI_CALCULATIONS.md',
      description: 'Trust and Verify: Detailed financial analysis with transparent methodology',
      icon: <BusinessIcon sx={{ color: '#4caf50' }} />,
      category: 'janusgraph',
      pages: 'Trust & Verify'
    },
    {
      id: 'janusgraph-roi-quick',
      title: 'JanusGraph ROI Quick Reference',
      filename: 'JANUSGRAPH_ROI_QUICK_REFERENCE.md',
      description: 'One-page summary of all ROI calculations and assumptions',
      icon: <ArticleIcon sx={{ color: '#4caf50' }} />,
      category: 'janusgraph',
      pages: '1 page'
    },
    // Business Documentation
    {
      id: 'business-value',
      title: 'Business Value Summary',
      filename: 'BUSINESS_VALUE_SUMMARY.md',
      description: 'ROI analysis and strategic value proposition ($23,985 saved, 159,900% ROI)',
      icon: <BusinessIcon sx={{ color: '#4caf50' }} />,
      category: 'business'
    },
    {
      id: 'platform-roi',
      title: 'Platform Development ROI Calculations',
      filename: 'PLATFORM_ROI_CALCULATIONS.md',
      description: 'Trust and Verify: How we calculated $23,985 saved and 159,900% ROI',
      icon: <BusinessIcon sx={{ color: '#4caf50' }} />,
      category: 'business',
      pages: 'Trust & Verify'
    },
    {
      id: 'ai-reality-check',
      title: 'AI Development Reality Check',
      filename: 'AI_DEVELOPMENT_REALITY_CHECK.md',
      description: 'Honest explanation: Why 99.94% cost reduction sounds like fluff (and what\'s really true)',
      icon: <HelpIcon sx={{ color: '#ff9800' }} />,
      category: 'business',
      pages: 'Skeptic\'s Guide'
    },
    {
      id: 'understanding-roi',
      title: 'Understanding ROI Percentages',
      filename: 'UNDERSTANDING_ROI_PERCENTAGES.md',
      description: 'Why ROI can be more than 100% (and what 29,700% actually means)',
      icon: <HelpIcon sx={{ color: '#4caf50' }} />,
      category: 'business',
      pages: 'ROI Explained'
    },
    {
      id: 'executive-decision',
      title: 'Executive Decision Strategy',
      filename: 'EXECUTIVE_DECISION_STRATEGY.md',
      description: '4-phase persuasion framework for AI-assisted development adoption',
      icon: <ArticleIcon sx={{ color: '#2196f3' }} />,
      category: 'business'
    },
    // Technical Documentation
    {
      id: 'data-asset-design',
      title: 'Data Asset Design',
      filename: 'DATA_ASSET_DESIGN.md',
      description: 'Technical design specifications for data asset management',
      icon: <CodeIcon sx={{ color: '#9c27b0' }} />,
      category: 'technical'
    },
    {
      id: 'data-governance-next',
      title: 'Data Governance Next Steps',
      filename: 'DATA_GOVERNANCE_NEXT_STEPS.md',
      description: 'Strategic roadmap for data governance implementation',
      icon: <MenuBookIcon sx={{ color: '#ff9800' }} />,
      category: 'technical'
    },
    {
      id: 'data-protection',
      title: 'Data Protection Guide',
      filename: 'DATA_PROTECTION_GUIDE.md',
      description: 'Comprehensive guide for data security and privacy compliance',
      icon: <DescriptionIcon sx={{ color: '#f44336' }} />,
      category: 'technical'
    }
  ];

  const loadDocument = async (filename: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/docs/${filename}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load document: ${response.statusText}`);
      }
      
      const text = await response.text();
      setMarkdownContent(text);
    } catch (err) {
      console.error('Error loading document:', err);
      setError(`Unable to load document. Please ensure the file exists at /docs/${filename}`);
      setMarkdownContent('');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentClick = (doc: DocumentItem) => {
    setSelectedDoc(doc.id);
    loadDocument(doc.filename);
  };

  const handleDownloadPdf = async () => {
    if (!selectedDoc || !markdownContent) return;
    
    setGeneratingPdf(true);
    
    try {
      const doc = documents.find(d => d.id === selectedDoc);
      if (!doc) return;
      
      // Remove emojis from content for PDF
      const cleanContent = markdownContent
        .replace(/🎯/g, '[PHASE 1]')
        .replace(/🔍/g, '[PHASE 2]')
        .replace(/🏗️/g, '[TECHNICAL]')
        .replace(/📊/g, '[VISUALIZATION]')
        .replace(/🚀/g, '[FUTURE]')
        .replace(/📋/g, '[ACCESS]')
        .replace(/🔒/g, '[SECURITY]')
        .replace(/📞/g, '[SUPPORT]')
        .replace(/📈/g, '[METRICS]')
        .replace(/🎓/g, '[CONCLUSION]')
        .replace(/💰/g, '[FINANCIAL]')
        .replace(/💡/g, '[KEY POINT]')
        .replace(/📚/g, '[DOCUMENTATION]')
        .replace(/✅/g, '[✓]')
        .replace(/❌/g, '[X]')
        .replace(/⚠️/g, '[WARNING]')
        .replace(/🤔/g, '[?]')
        .replace(/📄/g, '[DOCUMENT]')
        .replace(/🔐/g, '[SECURE]')
        .replace(/🎯/g, '[TARGET]')
        .replace(/🔍/g, '[SEARCH]');
      
      // Use browser's print functionality to generate PDF
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to download PDF');
        return;
      }
      
      // Create a styled HTML document
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${doc.title}</title>
          <style>
            @page {
              margin: 1in;
              size: letter;
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 8.5in;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              color: #003366;
              font-size: 2rem;
              border-bottom: 3px solid #003366;
              padding-bottom: 10px;
              margin-top: 30px;
            }
            h2 {
              color: #003366;
              font-size: 1.5rem;
              margin-top: 25px;
            }
            h3 {
              color: #003366;
              font-size: 1.25rem;
              margin-top: 20px;
            }
            p {
              margin: 10px 0;
            }
            code {
              background-color: #f5f5f5;
              padding: 2px 6px;
              border-radius: 3px;
              font-family: 'Courier New', monospace;
              font-size: 0.9em;
            }
            pre {
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 5px;
              overflow-x: auto;
              border: 1px solid #ddd;
            }
            pre code {
              background: none;
              padding: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              border: 1px solid #ddd;
            }
            th {
              background-color: #003366;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: bold;
            }
            td {
              padding: 10px;
              border-bottom: 1px solid #ddd;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            ul, ol {
              margin: 10px 0;
              padding-left: 30px;
            }
            li {
              margin: 5px 0;
            }
            blockquote {
              border-left: 4px solid #003366;
              padding-left: 15px;
              margin: 15px 0;
              font-style: italic;
              color: #666;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #003366;
            }
            .header h1 {
              border: none;
              margin: 0;
            }
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 0.9em;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${doc.title}</h1>
            <p><strong>USCIS Data Strategy Support Services 3</strong></p>
            <p>Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div class="content">
            ${cleanContent.split('\n').map(line => {
              // Convert markdown to HTML (basic conversion)
              if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
              if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
              if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`;
              if (line.startsWith('- ')) return `<li>${line.substring(2)}</li>`;
              if (line.trim() === '') return '<br>';
              if (line.startsWith('```')) return line.includes('```') ? '</pre>' : '<pre><code>';
              return `<p>${line}</p>`;
            }).join('\n')}
          </div>
          <div class="footer">
            <p><strong>For Official Use Only (FOUO)</strong></p>
            <p>USCIS Data Strategy Support Services 3 (DSSS3)</p>
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for content to load, then trigger print dialog
      setTimeout(() => {
        printWindow.print();
      }, 500);
      
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Error generating PDF. Please try again.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'janusgraph':
        return 'JanusGraph';
      case 'business':
        return 'Business';
      case 'technical':
        return 'Technical';
      default:
        return 'General';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'janusgraph':
        return '#003366';
      case 'business':
        return '#4caf50';
      case 'technical':
        return '#9c27b0';
      default:
        return '#757575';
    }
  };

  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, DocumentItem[]>);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <MuiLink
          component={Link}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', color: '#003366', textDecoration: 'none' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Home
        </MuiLink>
        <Typography color="text.primary">Documentation Center</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MenuBookIcon sx={{ fontSize: 40, color: '#003366', mr: 2 }} />
          <Box>
            <Typography variant="h4" sx={{ color: '#003366', fontWeight: 'bold' }}>
              Documentation Center
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Browse and view all platform documentation
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Document List Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 'calc(100vh - 250px)', overflow: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#003366', fontWeight: 'bold' }}>
              Available Documents
            </Typography>
            
            {Object.entries(groupedDocuments).map(([category, docs]) => (
              <Box key={category} sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: getCategoryColor(category),
                    fontWeight: 'bold',
                    mb: 1,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem'
                  }}
                >
                  {getCategoryLabel(category)}
                </Typography>
                <List dense>
                  {docs.map((doc) => (
                    <ListItemButton
                      key={doc.id}
                      selected={selectedDoc === doc.id}
                      onClick={() => handleDocumentClick(doc)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(0, 51, 102, 0.08)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 51, 102, 0.12)',
                          }
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {doc.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={doc.title}
                        secondary={doc.pages}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: selectedDoc === doc.id ? 'bold' : 'normal'
                        }}
                        secondaryTypographyProps={{
                          fontSize: '0.75rem'
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Document Viewer */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 'calc(100vh - 250px)', overflow: 'auto' }}>
            {!selectedDoc && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <MenuBookIcon sx={{ fontSize: 80, color: '#003366', opacity: 0.3, mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Select a document to view
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose from the list on the left to read documentation
                </Typography>
              </Box>
            )}

            {loading && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="body1" color="text.secondary">
                  Loading document...
                </Typography>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {selectedDoc && !loading && !error && markdownContent && (
              <Box>
                {/* Document Header */}
                <Box sx={{ mb: 3, pb: 2, borderBottom: '2px solid #003366' }}>
                  {documents.find(d => d.id === selectedDoc) && (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          {documents.find(d => d.id === selectedDoc)?.icon}
                          <Typography variant="h5" sx={{ ml: 1, color: '#003366', fontWeight: 'bold' }}>
                            {documents.find(d => d.id === selectedDoc)?.title}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          startIcon={generatingPdf ? null : <DownloadIcon />}
                          onClick={handleDownloadPdf}
                          disabled={generatingPdf}
                          sx={{
                            backgroundColor: '#003366',
                            '&:hover': {
                              backgroundColor: '#002244'
                            }
                          }}
                        >
                          {generatingPdf ? 'Generating...' : 'Download PDF'}
                        </Button>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {documents.find(d => d.id === selectedDoc)?.description}
                      </Typography>
                      <Chip
                        label={getCategoryLabel(documents.find(d => d.id === selectedDoc)?.category || 'general')}
                        size="small"
                        sx={{
                          backgroundColor: getCategoryColor(documents.find(d => d.id === selectedDoc)?.category || 'general'),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </>
                  )}
                </Box>

                {/* Markdown Content */}
                <Box
                  sx={{
                    '& h1': {
                      color: '#003366',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      mt: 3,
                      mb: 2,
                      borderBottom: '2px solid #003366',
                      pb: 1
                    },
                    '& h2': {
                      color: '#003366',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      mt: 3,
                      mb: 2
                    },
                    '& h3': {
                      color: '#003366',
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      mt: 2,
                      mb: 1
                    },
                    '& p': {
                      lineHeight: 1.8,
                      mb: 2
                    },
                    '& ul, & ol': {
                      pl: 3,
                      mb: 2
                    },
                    '& li': {
                      mb: 1
                    },
                    '& code': {
                      backgroundColor: '#f5f5f5',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.9em',
                      fontFamily: 'monospace'
                    },
                    '& pre': {
                      backgroundColor: '#f5f5f5',
                      padding: '16px',
                      borderRadius: '8px',
                      overflow: 'auto',
                      mb: 2
                    },
                    '& pre code': {
                      backgroundColor: 'transparent',
                      padding: 0
                    },
                    '& table': {
                      width: '100%',
                      borderCollapse: 'collapse',
                      mb: 3,
                      border: '1px solid #e0e0e0',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    },
                    '& thead': {
                      backgroundColor: '#003366'
                    },
                    '& th': {
                      backgroundColor: '#003366',
                      color: 'white',
                      padding: '14px 16px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      borderBottom: '2px solid #002244'
                    },
                    '& tbody tr': {
                      '&:nth-of-type(even)': {
                        backgroundColor: '#f8f9fa'
                      },
                      '&:hover': {
                        backgroundColor: '#e3f2fd',
                        transition: 'background-color 0.2s'
                      }
                    },
                    '& td': {
                      padding: '12px 16px',
                      borderBottom: '1px solid #e0e0e0',
                      fontSize: '0.9rem',
                      verticalAlign: 'top'
                    },
                    '& tbody tr:last-child td': {
                      borderBottom: 'none'
                    },
                    '& blockquote': {
                      borderLeft: '4px solid #003366',
                      pl: 2,
                      ml: 0,
                      fontStyle: 'italic',
                      color: '#666'
                    },
                    '& a': {
                      color: '#2196f3',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    },
                    '& hr': {
                      border: 'none',
                      borderTop: '1px solid #e0e0e0',
                      my: 3
                    }
                  }}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DocumentationCenter;
