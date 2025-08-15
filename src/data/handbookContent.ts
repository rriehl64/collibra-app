import { Handbook } from '../types/handbook';

/**
 * Sample USCIS Data Literacy Handbook content
 * In production, this would likely be loaded from a CMS or API
 */
export const handbookContent: Handbook = {
  id: 'uscis-data-literacy-handbook',
  title: 'USCIS Data Literacy Handbook',
  version: '1.0.0',
  lastUpdated: '2025-08-01',
  chapters: [
    {
      id: 'ch-1',
      title: 'Data Fundamentals',
      slug: 'data-fundamentals',
      description: 'Core concepts in data literacy and management for USCIS staff',
      order: 1,
      sections: [
        {
          id: 'sec-1-1',
          title: 'What is Data Literacy?',
          slug: 'what-is-data-literacy',
          level: 1,
          keywords: ['literacy', 'basics', 'introduction', 'fundamentals'],
          content: [
            {
              id: 'el-1-1-1',
              type: 'heading',
              content: 'What is Data Literacy?',
              level: 1
            },
            {
              id: 'el-1-1-2',
              type: 'paragraph',
              content: 'Data literacy is the ability to read, understand, create, and communicate data as information. For USCIS staff, this means being able to derive meaningful information from data, interpret data visualizations, and make decisions based on data.'
            },
            {
              id: 'el-1-1-3',
              type: 'callout',
              title: 'Why Data Literacy Matters',
              content: "In a government agency that handles millions of applications and petitions annually, data literacy ensures that staff can effectively interpret patterns, identify trends, and make informed decisions that affect people's lives.",
              severity: 'info'
            },
            {
              id: 'el-1-1-4',
              type: 'list',
              items: [
                'Understand the data you work with daily',
                'Make better-informed decisions',
                'Communicate findings effectively to stakeholders',
                'Identify data quality issues before they impact operations'
              ],
              ordered: false,
              ariaLabel: 'Benefits of data literacy'
            }
          ],
          subsections: [
            {
              id: 'sec-1-1-1',
              title: 'The Data Literacy Spectrum',
              slug: 'data-literacy-spectrum',
              level: 2,
              keywords: ['spectrum', 'skills', 'levels'],
              content: [
                {
                  id: 'el-1-1-1-1',
                  type: 'heading',
                  content: 'The Data Literacy Spectrum',
                  level: 2
                },
                {
                  id: 'el-1-1-1-2',
                  type: 'paragraph',
                  content: 'Data literacy exists on a spectrum. At USCIS, staff may need different levels of data literacy depending on their role:'
                },
                {
                  id: 'el-1-1-1-3',
                  type: 'table',
                  caption: 'Data Literacy Levels at USCIS',
                  headers: ['Level', 'Description', 'Typical Roles'],
                  rows: [
                    ['Basic', 'Understanding data presented in reports and dashboards', 'Frontline staff, Case processors'],
                    ['Intermediate', 'Analyzing data trends and creating basic visualizations', 'Supervisors, Program analysts'],
                    ['Advanced', 'Complex data analysis, model building, predictive analytics', 'Data scientists, Policy analysts, IT specialists']
                  ],
                  summary: 'Table showing three levels of data literacy at USCIS: basic, intermediate, and advanced, with descriptions and typical roles for each level.'
                }
              ]
            }
          ]
        },
        {
          id: 'sec-1-2',
          title: 'Data Types at USCIS',
          slug: 'data-types-at-uscis',
          level: 1,
          keywords: ['data types', 'structured', 'unstructured', 'categories'],
          content: [
            {
              id: 'el-1-2-1',
              type: 'heading',
              content: 'Data Types at USCIS',
              level: 1
            },
            {
              id: 'el-1-2-2',
              type: 'paragraph',
              content: 'USCIS handles various types of data across its operations. Understanding these data types is essential for proper handling, analysis, and compliance with privacy regulations.'
            },
            {
              id: 'el-1-2-3',
              type: 'list',
              items: [
                'Structured Data: Form fields, application status codes, country codes',
                'Unstructured Data: Supporting documentation, case notes, correspondence',
                'Sensitive Data: Personally Identifiable Information (PII), biometric data',
                'Aggregate Data: Statistical reporting, trend analysis, workload reporting'
              ],
              ordered: false,
              ariaLabel: 'Main data types used at USCIS'
            }
          ]
        }
      ]
    },
    {
      id: 'ch-2',
      title: 'Data Governance & Privacy',
      slug: 'data-governance-privacy',
      description: 'Understanding USCIS data governance frameworks and privacy requirements',
      order: 2,
      sections: [
        {
          id: 'sec-2-1',
          title: 'USCIS Data Governance Framework',
          slug: 'data-governance-framework',
          level: 1,
          keywords: ['governance', 'policy', 'framework', 'management'],
          content: [
            {
              id: 'el-2-1-1',
              type: 'heading',
              content: 'USCIS Data Governance Framework',
              level: 1
            },
            {
              id: 'el-2-1-2',
              type: 'paragraph',
              content: 'The USCIS Data Governance Framework establishes guidelines for data management across the agency. It ensures data is treated as a valuable asset and managed according to federal regulations and best practices.'
            },
            {
              id: 'el-2-1-3',
              type: 'image',
              src: '/images/handbook/data-governance-framework.png',
              altText: 'USCIS Data Governance Framework diagram showing the relationship between data strategy, data management, data quality, and data security',
              caption: 'USCIS Data Governance Framework'
            }
          ]
        },
        {
          id: 'sec-2-2',
          title: 'Privacy Considerations in Immigration Data',
          slug: 'privacy-considerations',
          level: 1,
          keywords: ['privacy', 'PII', 'sensitive data', 'protection'],
          content: [
            {
              id: 'el-2-2-1',
              type: 'heading',
              content: 'Privacy Considerations in Immigration Data',
              level: 1
            },
            {
              id: 'el-2-2-2',
              type: 'paragraph',
              content: 'USCIS processes sensitive information about applicants and beneficiaries. Protecting this information is not just a legal requirement but a core ethical obligation.'
            },
            {
              id: 'el-2-2-3',
              type: 'callout',
              title: 'Important',
              content: 'Always follow the principle of least privilege when accessing data. Only access the data necessary to perform your job functions.',
              severity: 'warning'
            },
            {
              id: 'el-2-2-4',
              type: 'interactive',
              interactiveType: 'quiz',
              content: {
                question: 'Which of the following is NOT considered Personally Identifiable Information (PII)?',
                options: [
                  'Alien Registration Number (A-Number)',
                  'Aggregate case processing times by form type',
                  'Applicant home address',
                  'Biometric data'
                ],
                correctAnswer: 1
              },
              instructions: 'Select the option that is NOT considered PII.',
              ariaInstructions: 'This quiz asks which item is not considered Personally Identifiable Information. There are four options.'
            }
          ]
        }
      ]
    },
    {
      id: 'ch-3',
      title: 'Data Analysis Fundamentals',
      slug: 'data-analysis-fundamentals',
      description: 'Basic concepts and techniques for analyzing USCIS data',
      order: 3,
      sections: [
        {
          id: 'sec-3-1',
          title: 'Statistical Concepts',
          slug: 'statistical-concepts',
          level: 1,
          keywords: ['statistics', 'average', 'median', 'trends', 'analysis'],
          content: [
            {
              id: 'el-3-1-1',
              type: 'heading',
              content: 'Statistical Concepts',
              level: 1
            },
            {
              id: 'el-3-1-2',
              type: 'paragraph',
              content: 'Understanding basic statistical concepts is essential for interpreting USCIS operational data and reports.'
            },
            {
              id: 'el-3-1-3',
              type: 'table',
              caption: 'Common Statistical Measures in USCIS Reporting',
              headers: ['Measure', 'Definition', 'Use Case at USCIS'],
              rows: [
                ['Mean (Average)', 'Sum of values divided by count', 'Average processing time for a form type'],
                ['Median', 'Middle value in a data set', 'Median wait time for an interview'],
                ['Mode', 'Most frequently occurring value', 'Most common country of origin for applicants'],
                ['Range', 'Difference between maximum and minimum values', 'Range of case completion times']
              ],
              summary: 'Table describing four common statistical measures used at USCIS: mean, median, mode, and range, with definitions and USCIS use cases.'
            }
          ]
        }
      ]
    }
  ],
  metadata: {
    author: 'USCIS Office of Data Analytics',
    department: 'Department of Homeland Security',
    contactEmail: 'data-literacy@uscis.dhs.gov',
    approvalDate: '2025-07-15',
    reviewDate: '2026-07-15'
  }
};
