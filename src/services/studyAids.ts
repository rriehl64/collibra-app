import api, { ApiResponse } from './api';

export interface BaModule {
  id: string;
  title: string;
  description: string;
  sections: string[];
}

function deterministicShuffle<T>(arr: T[], seed: number): T[] {
  // Simple LCG-based shuffle for determinism
  let a = 1664525, c = 1013904223;
  let state = seed >>> 0;
  const rnd = () => (state = (a * state + c) >>> 0) / 0xffffffff;
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Optional curated bank; populate with high-quality questions per chapter id when available
const CURATED_QUESTIONS: Record<string, QuizItem[]> = {
  // '1': [ { id: '1-c1', type: 'mcq', prompt: '...', options: ['...'], answerKey: 2, explanation: '...' } ]
};

// Build content-derived questions from chapter metadata when curated items are not available
function buildContentQuizFromChapter(ch: BaChapter, allChapters: BaChapter[], maxPerChapter = 2, seedOffset = 0): QuizItem[] {
  const items: QuizItem[] = [];
  const otherChapters = allChapters.filter(c => c.id !== ch.id);
  const localSeed = FALLBACK_CHAPTERS.length + Number(ch.id) + seedOffset;

  // 1) MCQ: Identify chapter focus via title among distractor chapter titles
  if (ch.title) {
    const distractorTitles = deterministicShuffle(otherChapters.map(o => o.title), localSeed).slice(0, 3);
    const opts = deterministicShuffle([ch.title, ...distractorTitles], localSeed + 13);
    const answerKey = opts.indexOf(ch.title);
    items.push({
      id: `${ch.id}-c-m1`,
      type: 'mcq',
      prompt: `Which title best matches the main focus of Chapter ${ch.number}?`,
      options: opts,
      answerKey,
      explanation: `Chapter ${ch.number} is "${ch.title}".`
    });
  }

  // 2) MSQ: Select all teaching points that apply to this chapter among distractors from other chapters
  const tp = Array.isArray(ch.teachingPoints) ? ch.teachingPoints.slice(0, 3) : [];
  if (tp.length >= 2) {
    const distractorPool = otherChapters.flatMap(oc => (oc.teachingPoints || []).slice(0, 1));
    const distractors = deterministicShuffle(distractorPool, localSeed + 29).slice(0, Math.max(0, 6 - tp.length));
    const options = deterministicShuffle([...tp, ...distractors], localSeed + 31);
    const answerKey: number[] = [];
    options.forEach((opt, idx) => { if (tp.includes(opt)) answerKey.push(idx); });
    if (options.length >= 3 && answerKey.length >= 2) {
      items.push({
        id: `${ch.id}-c-s1`,
        type: 'msq',
        prompt: `Select all statements that align with Chapter ${ch.number} teaching points:`,
        options,
        answerKey,
        explanation: 'Correct choices are derived from this chapter\'s teaching points.'
      });
    }
  }

  // 3) Fallback MCQ from objectives if needed
  if (items.length < maxPerChapter && Array.isArray(ch.objectives) && ch.objectives.length > 0) {
    const objective = ch.objectives[0];
    const distractorObjectives = deterministicShuffle(
      otherChapters.flatMap(oc => (oc.objectives || []).slice(0, 1)),
      localSeed + 41
    ).slice(0, 3);
    const opts = deterministicShuffle([objective, ...distractorObjectives], localSeed + 43);
    const answerKey = opts.indexOf(objective);
    items.push({
      id: `${ch.id}-c-m2`,
      type: 'mcq',
      prompt: `Which objective best aligns with Chapter ${ch.number}?`,
      options: opts,
      answerKey,
      explanation: 'Derived from the first listed objective for this chapter.'
    });
  }

  // If still short, pad with deterministic simple True/False metadata checks (as last resort)
  while (items.length < maxPerChapter) {
    const tf = ['True', 'False'];
    items.push({
      id: `${ch.id}-c-tf${items.length + 1}`,
      type: 'mcq',
      prompt: `Chapter ${ch.number} has at least one tag.`,
      options: tf,
      answerKey: (ch.tags && ch.tags.length > 0) ? 0 : 1,
      explanation: 'Checks the presence of tags in chapter metadata.'
    });
  }

  return items.slice(0, maxPerChapter);
}

function assembleFinalExamQuestions(totalCount = 35): QuizItem[] {
  const chapters = FALLBACK_CHAPTERS;
  const perChapterBase = Math.max(1, Math.floor(totalCount / chapters.length));
  const remainder = Math.max(0, totalCount - perChapterBase * chapters.length);

  // Prepare per-chapter pools (curated first, else content-derived)
  const pools: Record<string, QuizItem[]> = {};
  chapters.forEach((ch, idx) => {
    const curated = CURATED_QUESTIONS[ch.id] || [];
    const contentDerived = curated.length >= perChapterBase
      ? []
      : buildContentQuizFromChapter(ch, chapters, perChapterBase + (idx < remainder ? 1 : 0));
    const combined = [...curated, ...contentDerived];
    pools[ch.id] = combined;
  });

  // Assemble with even distribution and deterministic shuffle inside each pool
  const result: QuizItem[] = [];
  chapters.forEach((ch, idx) => {
    const take = perChapterBase + (idx < remainder ? 1 : 0);
    const pool = pools[ch.id];
    const selected = deterministicShuffle(pool, chapters.length + idx).slice(0, take);
    result.push(...selected);
  });

  // If we still have fewer than totalCount (e.g., scarce content), fill from remaining pools
  if (result.length < totalCount) {
    const leftovers: QuizItem[] = [];
    chapters.forEach((ch, idx) => {
      const already = result.filter(q => (q.id || '').startsWith(`${ch.id}-`)).length;
      const pool = pools[ch.id];
      const extra = pool.slice(already);
      leftovers.push(...deterministicShuffle(extra, chapters.length * 7 + idx));
    });
    const needed = totalCount - result.length;
    result.push(...leftovers.slice(0, needed));
  }

  return result.slice(0, totalCount);
}

function gradeQuestions(items: QuizItem[], answers: (number | number[] | null)[]): QuizSubmitResponse {
  const total = items.length;
  let score = 0;
  const results: QuizResultItem[] = items.map((q, i) => {
    const a = answers[i];
    let correct = false;
    if (q.type === 'mcq' && typeof q.answerKey === 'number') {
      correct = typeof a === 'number' && a === q.answerKey;
    } else if (q.type === 'msq' && Array.isArray(q.answerKey)) {
      const ans = Array.isArray(a) ? a.slice().sort((x, y) => x - y) : [];
      const key = (q.answerKey as number[]).slice().sort((x, y) => x - y);
      correct = ans.length === key.length && ans.every((v, idx) => v === key[idx]);
    } else if (q.type === 'numeric' && typeof q.answerKey === 'number') {
      correct = typeof a === 'number' && a === q.answerKey;
    }
    if (correct) score += 1;
    return { id: q.id, correct, explanation: q.explanation };
  });
  return { total, score, results };
}

export interface BaChapter {
  id: string;
  number: number;
  title: string;
  objectives: string[];
  summary: string;
  resources: { label: string; url: string }[];
  tags: string[];
  // Optional structured content for richer presentation
  teachingPoints?: string[];
  keyTakeaways?: string[];
  applications?: { context: string; items: string[] }[];
}

export interface QuizItem {
  id: string;
  type: 'mcq' | 'msq' | 'numeric' | 'short';
  prompt: string;
  options?: string[];
  answerKey?: number | number[];
  explanation?: string;
}

export interface QuizResultItem {
  id: string;
  correct: boolean;
  explanation?: string;
}

export interface QuizSubmitResponse {
  total: number;
  score: number;
  results: QuizResultItem[];
}

// Fallback: Complete list of 19 chapters (Albright & Winston 8e)
const FALLBACK_CHAPTERS: BaChapter[] = [
  { 
    id: '1', 
    number: 1, 
    title: 'Introduction to Business Analytics', 
    objectives: [
      'Understand the scope and organizational value of business analytics',
      'Differentiate description, visualization, inference, and relationship analysis',
      'Recognize sound spreadsheet modeling practices and basic modeling workflow'
    ],
    summary: 'Introduces the role of analytics in decision making, common categories of analytical work (description, visualization, inference, relationships), and good habits for spreadsheet-based models, including structure, documentation, and versioning.',
    resources: [],
    tags: ['introduction'],
    teachingPoints: [
      'Business analytics supports informed decisions across all functions; it is practical and managerial, not only technical.',
      'Structured decision-making improves outcomes: define the problem, gather data and metrics, evaluate alternatives, choose, act, and review.',
      'Data-driven management reduces risk and bias; shift from intuition to evidence.',
      'Analysis (descriptive) is the foundation for analytics (predictive and prescriptive).',
      'Data value and ownership: know data forms, generation, and governance; quality is non-negotiable.',
      'Practical applications span marketing, finance, HR, and supply chain.'
    ],
    keyTakeaways: [
      'Embed a structured, repeatable decision process that relies on data.',
      'Prioritize data quality, governance, and ownership from the start.',
      'Train teams on analytical and interpretive skills.',
      'Promote a culture valuing data-driven insights over intuition.',
      'Leverage Excel/Power BI for reproducible analysis and visualization.',
      'Align data strategy objectives to specific business processes and goals.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Define clear performance and quality metrics for each stage and form.',
          'Map process interdependencies; visualize flows and bottlenecks.',
          'Track family-based cohorts alongside individuals to spot stuck cases.',
          'Continuously analyze stage times and outcomes to drive improvements.',
          'Enforce data standards, stewardship, and ownership; reduce duplicates and errors.',
          'Deliver transparent, actionable dashboards on both outcomes and process health.',
          'Use structured escalation for complex cases triggered by data thresholds.',
          'Translate insights into actions (e.g., staffing reallocation, form redesign).',
          'Communicate insights routinely across teams with full case context.',
          'Institute regular review cycles to iterate and learn from results.'
        ]
      }
    ] 
  },
  { 
    id: '2', 
    number: 2, 
    title: 'Describing the Distribution of a Variable', 
    objectives: [
      'Build foundational skills to understand, summarize, and visualize single variables',
      'Communicate variable characteristics effectively to support decision-making'
    ],
    summary: 'Covers univariate descriptive statistics: data types, measures of center and spread, distribution shape, outliers, and core visualizations (histograms, bar charts, boxplots). Introduces basic Excel tools for profiling and communicating data characteristics.',
    resources: [],
    tags: ['descriptive', 'univariate', 'visualization'],
    teachingPoints: [
      'Types of data: categorical vs. numerical, with different summary and visualization methods.',
      'Central tendency: mean, median, mode to describe the data “center”.',
      'Spread: range, variance, standard deviation, and IQR to quantify variability.',
      'Shape & patterns: normal, skewed, bimodal, uniform; detect outliers and anomalies.',
      'Visualizing data: histograms, bar charts, boxplots, stem-and-leaf for clear communication.',
      'Excel basics: PivotTables, summary functions, and charts for descriptive statistics.'
    ],
    keyTakeaways: [
      'Descriptive statistics reveal content, typical values, variability, and unusual cases.',
      'Proper visualization turns raw data into actionable insight.',
      'Recognizing data type is key to valid methods and interpretations.',
      'Excel provides accessible, practical tooling for descriptive analysis.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Profile new or changing data sources first with univariate summaries.',
          'Monitor performance/quality metrics: use means/medians and track variation and outliers.',
          'Build dashboards with clear visuals (bar charts, boxplots) by form, stage, and family size.',
          'Detect anomalies early (e.g., delayed cases) to target interventions.',
          'Standardize summary metrics across stages for consistent reporting.'
        ]
      }
    ]
  },
  { 
    id: '3', 
    number: 3, 
    title: 'Finding Relationships Among Variables', 
    objectives: [
      'Discover, quantify, and interpret relationships between pairs (and sets) of variables',
      'Use correlation and visualization to assess direction, strength, and form of relationships'
    ],
    summary: 'Introduces ways to detect and describe relationships among variables using covariance, correlation (especially Pearson), and visual tools like scatter plots. Emphasizes proper interpretation, limitations (e.g., correlation ≠ causation), outlier sensitivity, and nonlinearity. Includes practical Excel approaches.',
    resources: [],
    tags: ['relationships', 'correlation', 'visualization'],
    teachingPoints: [
      'Types of relationships: linear, nonlinear, and no apparent relationship.',
      'Covariance measures joint variability; correlation standardizes to [-1, 1] for strength/direction.',
      'Interpretation: positive, negative, and near-zero correlation; watch for outliers and nonlinearity.',
      'Visualization: use scatter plots to inspect patterns before advanced modeling.',
      'Excel tools: CORREL and scatter charts to compute and present findings.'
    ],
    keyTakeaways: [
      'Relationships help reveal underlying business mechanisms and candidate drivers.',
      'Correlation is a gateway tool for prioritizing deeper analysis or modeling.',
      'Visualization is vital: patterns can emerge or disappear based on presentation.',
      'Context matters: strong correlation does not imply causation or actionability.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Identify operational factors most related to outcomes (e.g., completion time vs. family size).',
          'Add scatter plots to dashboards to display key metric relationships.',
          'Use visuals to align teams on interdependencies and improvement ideas.',
          'Investigate outliers for data errors, unique cases, or workflow breakdowns.',
          'Evaluate interventions by comparing relationships before and after changes.'
        ]
      }
    ]
  },
  { 
    id: '4', 
    number: 4, 
    title: 'Business Intelligence (BI) Tools for Importing and Transforming Data: Power Query', 
    objectives: [
      'Introduce BI tooling for importing, cleaning, transforming, and organizing data for analysis',
      'Gain hands-on practice with Power Query to prepare large/complex datasets for analytics and reporting'
    ],
    summary: 'Focuses on Power Query (Excel, primarily Windows) to automate repeatable data preparation: import from multiple sources, apply transformations (filtering, joining, pivot/unpivot, splitting/merging), and shape data for reliable dashboards. Emphasizes documenting steps for transparent, repeatable pipelines and previews next steps with Power Pivot/Tableau.',
    resources: [],
    tags: ['power-query', 'bi', 'etl', 'data-prep'],
    teachingPoints: [
      'Power Query basics and Excel integration (Windows-centric), automating import/filter/merge/reshape.',
      'Data preparation workflow: connect to CSV/Excel/web/DB; remove duplicates; split/merge columns; filter rows; pivot/unpivot.',
      'Merging and shaping: join multiple tables/sources to produce clean, analysis-ready datasets.',
      'Process documentation: save queries to make steps transparent, repeatable, and scalable.',
      'Automation value: recorded transformations reduce manual work and error risk.',
      'Preview: segue to modeling/aggregation with Power Pivot and visualization with Tableau.'
    ],
    keyTakeaways: [
      'Real-world data is messy; BI tools drastically reduce cleanup time and errors.',
      'Automation frees analysts to focus on insight rather than wrangling.',
      'Documented transformations improve auditability and maintenance.',
      'Consistent, automated prep underpins reliable, scalable performance and quality monitoring.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Streamline data intake from multiple operational systems with automated Power Query pipelines.',
          'Embed quality checks for completeness, duplicates, and inconsistencies early in the pipeline.',
          'Join/reshape by applicant, family, and stage to create end-to-end monitoring views.',
          'Maintain a reusable query library to adapt quickly as forms and processes evolve.',
          'Scale analytics throughput via automation without proportional staff increases.'
        ]
      }
    ]
  },
  { 
    id: '5', 
    number: 5, 
    title: 'Business Intelligence (BI) Tools for Reports and Visualizations: Power Pivot', 
    objectives: [
      'Introduce Power Pivot for aggregating, modeling, and analyzing large datasets inside Excel',
      'Enable robust, scalable data models and DAX measures beyond traditional PivotTables'
    ],
    summary: 'Covers Power Pivot fundamentals: building a Data Model of related tables, creating relationships, and writing DAX for calculated columns and measures. Demonstrates PivotTables/Charts powered by the model to analyze millions of rows, when to prefer Power Pivot over normal PivotTables, and the value of documenting models for governance.',
    resources: [],
    tags: ['power-pivot', 'data-model', 'dax', 'bi'],
    teachingPoints: [
      'Power Pivot fundamentals: create a Data Model (related tables) directly in Excel.',
      'Replace repeated VLOOKUPs/manual merges by relating tables via keys.',
      'Working with models: import from databases/spreadsheets/web; add calculated columns and DAX measures.',
      'Advanced aggregation: build PivotTables/Charts from the model; scale to millions of rows.',
      'DAX for advanced metrics: YTD, rolling averages, custom filters, and KPI logic.',
      'When to use Power Pivot vs. normal PivotTables: larger, relational, or complex analyses.',
      'Automation and documentation: record model design and measures for reproducibility and maintenance.'
    ],
    keyTakeaways: [
      'Power Pivot integrates, models, and analyzes complex multi-table datasets efficiently within Excel.',
      'Data Models reveal richer insights than flat tables, especially for processes with dependencies and entities.',
      'DAX unlocks advanced, reusable performance metrics for decision support.',
      'Documented models improve sustainability, transparency, and error reduction.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Integrate datasets from stages/forms/systems into one Data Model for unified views.',
          'Design DAX measures to track KPIs (e.g., avg processing time per family, error rates by stage).',
          'Use model-driven PivotTables/Charts to scale reporting without splitting files.',
          'Document relationships and measures to support onboarding, audits, and continuous improvement.',
          'Analyze interdependencies to pinpoint bottlenecks and optimize workflow.'
        ]
      }
    ]
  },
  { 
    id: '6', 
    number: 6, 
    title: 'Probability and Probability Distributions', 
    objectives: [
      'Understand core probability concepts for analytics and decision-making under uncertainty',
      'Use common probability distributions to model real-world process variability'
    ],
    summary: 'Builds foundational probability: events, rules, conditional probability, independence, and random variables. Introduces discrete vs. continuous distributions with practical business uses, focusing on Binomial, Poisson, and Normal distributions. Emphasizes expected value and variance, plus Excel functions for applied calculations.',
    resources: [],
    tags: ['probability', 'distributions', 'binomial', 'poisson', 'normal'],
    teachingPoints: [
      'Foundations: experiment, outcome, event, probability, sample space; subjective vs. empirical vs. theoretical probability.',
      'Rules: addition, multiplication, and complement rules for combining events.',
      'Conditional probability and independence: compute and interpret; simplify when independent.',
      'Random variables: discrete vs. continuous; PMF for discrete, PDF for continuous.',
      'Key distributions: Binomial (yes/no), Poisson (counts of rare events), Normal (timing/measurement).',
      'Excel tools: BINOM.DIST, POISSON.DIST, NORM.DIST and related functions for practical work.'
    ],
    keyTakeaways: [
      'Probability underpins forecasting, risk, and process improvement in uncertain environments.',
      'Choosing an appropriate distribution is critical to accurate modeling and simulation.',
      'Conditional probability and independence are central when analyzing linked, multi-stage systems.',
      'Excel enables accessible, repeatable probability calculations for operations analysts.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Model arrival variability with Poisson to plan staffing and intake capacity.',
          'Approximate processing times with Normal to estimate SLAs and backlog dynamics.',
          'Use Binomial to estimate error/approval probabilities per stage and across families.',
          'Apply conditional probabilities to see how a stage’s failure cascades to family-level outcomes.',
          'Run scenario analyses using expected value and variance to test “what if” operational changes.',
          'Automate Excel-based calculators for recurring probability and risk assessments.'
        ]
      }
    ]
  },
  { 
    id: '7', 
    number: 7, 
    title: 'Decision Making Under Uncertainty', 
    objectives: [
      'Equip analysts with techniques for making business decisions when outcomes are uncertain',
      'Introduce methods to structure, analyze, and choose among alternatives with unknown future results'
    ],
    summary: 'Introduces decision frameworks for certainty, risk, and uncertainty. Covers payoff tables, decision trees, expected value, risk analysis, and value of information. Emphasizes transparent, structured approaches to scenario analysis and choice under ambiguity.',
    resources: [],
    tags: ['decision-analysis', 'uncertainty', 'expected-value', 'decision-trees', 'voI'],
    teachingPoints: [
      'Nature of decision problems: certainty vs. risk vs. uncertainty; real-world situations with incomplete probabilities.',
      'Decision criteria: Maximax (optimistic), Maximin (pessimistic), and Minimax Regret; choose based on risk tolerance and goals.',
      'Payoff tables: construct and compare alternatives across states of nature.',
      'Decision trees: map multi-stage choices and chance events; annotate probabilities, outcomes, and payoffs.',
      'Expected value and risk: compute expected payoffs; incorporate variability and subjective probabilities when data is scarce.',
      'Value of Information (VOI): compare expected outcomes with/without new information to assess research or pilot investments.',
      'Business applications: product launches, resource allocation, demand forecasting, and investment under uncertainty.'
    ],
    keyTakeaways: [
      'Most impactful managerial choices occur under uncertainty; structure improves clarity and accountability.',
      'Payoff tables and decision trees enable systematic scenario analysis and communication.',
      'Expected value, regret, and VOI support justified, evidence-based decisions despite ambiguity.',
      'Decision analysis foundations prepare teams for simulation and optimization methods.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Scenario planning: use payoff tables and decision trees for policy/process alternatives under changing demand.',
          'Risk-aware KPIs: report variability and downside risk, not just averages, for stage-level and family-level outcomes.',
          'VOI assessment: quantify benefits of improved data collection/analytics before investing.',
          'Team workshops: facilitate cross-functional sessions using formal decision-structuring tools to ensure transparency.'
        ]
      }
    ]
  },
  { 
    id: '8', 
    number: 8, 
    title: 'Statistical Inference', 
    objectives: [
      'Introduce hypothesis testing, confidence intervals, and statistical significance',
      'Enable drawing reliable population conclusions from sample data for evidence-based decisions'
    ],
    summary: 'Covers populations vs. samples, estimation of parameters, confidence intervals, and hypothesis testing using p-values and significance levels. Includes two-sample and paired comparisons and emphasizes avoiding common misinterpretations (correlation vs. causation; statistical vs. practical significance). Provides Excel-based workflows for applied inference.',
    resources: [],
    tags: ['inference', 'hypothesis-testing', 'confidence-intervals', 'p-values', 'excel'],
    teachingPoints: [
      'Sampling and estimation: why samples are used; estimating means and proportions from sample statistics.',
      'Confidence intervals: construct and interpret; trade-off between confidence level and interval width.',
      'Hypothesis testing: null vs. alternative; p-values; alpha levels; Type I/II errors; practical vs. statistical significance.',
      'Two-sample and paired tests: compare process paths or segments to detect meaningful differences.',
      'Excel tools: Data Analysis add-in and functions for CIs and t-tests to standardize recurring analyses.'
    ],
    keyTakeaways: [
      'Inference generalizes from samples to populations and is essential for disciplined decision-making.',
      'Confidence intervals quantify estimate uncertainty; hypothesis tests guard against reacting to noise.',
      'Critical thinking about causality and practical importance prevents misuses of statistics.',
      'A solid inference toolkit strengthens the credibility of dashboards and reports.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Performance assessment: report CIs for key metrics (processing time, approval rate) to convey certainty.',
          'Process improvement: use before/after or A/B tests to validate changes before full rollout.',
          'Risk monitoring: run hypothesis tests to detect early degradations in service quality.',
          'Evidence-based reporting: add statistically grounded indicators to dashboards and briefs.',
          'Automation: build Excel templates to standardize inference for frequent KPIs with auditability.'
        ]
      }
    ]
  },
  { 
    id: '9', 
    number: 9, 
    title: 'Regression Analysis: Estimating Relationships', 
    objectives: [
      'Use linear regression to estimate and explain relationships between variables',
      'Enable data-driven prediction and interpretation of factor impacts'
    ],
    summary: 'Introduces simple and multiple linear regression for explaining and predicting outcomes. Covers interpreting coefficients (slope, intercept), assessing fit with R^2, residuals, and standard errors, and checking assumptions (linearity, independence, normality, constant variance). Demonstrates Excel-based implementation.',
    resources: [],
    tags: ['regression', 'prediction', 'modeling', 'diagnostics', 'excel'],
    teachingPoints: [
      'What is regression: best-fit linear model linking a dependent variable to one or more predictors.',
      'Simple vs. multiple regression: isolate effects by controlling for other variables.',
      'Interpreting coefficients: slope as marginal effect; intercept as baseline; units and practical meaning.',
      'Model fit and diagnostics: R^2, adjusted R^2, residual plots, standard errors, and influence points.',
      'Assumptions: linearity, independence, normal errors, constant variance; implications and remedies.',
      'Predictive analytics: forecasting outcomes (e.g., processing time, quality metrics) with confidence.',
      'Excel implementation: use Data Analysis Toolpak or LINEST; visualize with scatter and fitted line.'
    ],
    keyTakeaways: [
      'Regression quantifies relationships and supports prediction and explanation.',
      'Diagnostics are essential to ensure validity; unchecked violations mislead decisions.',
      'Regression forms a foundation for advanced techniques (time series, inferential regression, data mining).'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Service optimization: model how backlog, family size, and staffing affect processing time and approval rates.',
          'Actionable forecasting: predict workload and identify bottlenecks under demand/resource scenarios.',
          'Targeted improvement: estimate expected impact of interventions (e.g., form simplification).',
          'Holistic reporting: embed model insights and predicted trends into dashboards for “why” analysis.'
        ]
      }
    ]
  },
  { 
    id: '10', 
    number: 10, 
    title: 'Regression Analysis: Statistical Inference', 
    objectives: [
      'Make statistically sound conclusions about regression model parameters and predictions',
      'Use hypothesis tests and confidence intervals to evaluate significance and uncertainty in regression'
    ],
    summary: 'Extends regression to formal inference: overlay stochastic error, state distributional assumptions, and perform CI and hypothesis tests for coefficients. Covers overall model significance (F-test), model selection impacts, diagnostics for assumptions, and generating predictions with intervals.',
    resources: [],
    tags: ['regression', 'inference', 't-tests', 'f-test', 'prediction-intervals', 'diagnostics'],
    teachingPoints: [
      'Statistical model: y = Xβ + ε with random error; assumptions on ε (often Normal, mean 0, constant variance).',
      'Coefficient inference: construct CIs for slope/intercept; t-tests for predictor significance.',
      'p-values and significance: decide which predictors matter; distinguish statistical vs. practical importance.',
      'Multiple regression: overall F-test for joint significance; implications of adding/removing variables; basic model selection ideas.',
      'Assumption checks: residual plots, tests for normality/constant variance/independence; consider robust remedies if violated.',
      'Prediction with uncertainty: compute fitted values and attach prediction intervals to communicate risk.'
    ],
    keyTakeaways: [
      'Inference makes regression conclusions trustworthy and action-worthy.',
      'Diagnostics and assumption checks prevent misinterpretation and costly mistakes.',
      'CIs, p-values, and F-tests strengthen credibility in reporting and decision forums.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Evidence-based reporting: highlight only statistically significant, business-relevant drivers of outcomes.',
          'Robust forecasting: include prediction intervals on service forecasts to show uncertainty bands.',
          'Continuous monitoring: routinely reassess model assumptions as processes/policies evolve.',
          'Stakeholder confidence: clearly communicate limits and strength of findings using inferential metrics.'
        ]
      }
    ]
  },
  { 
    id: '11', 
    number: 11, 
    title: 'Time Series Analysis and Forecasting', 
    objectives: [
      'Analyze time-dependent data to identify trend, seasonality, and noise',
      'Develop forecasts of future values using historical business data'
    ],
    summary: 'Introduces time series concepts and decomposition into trend, seasonality, and irregular components. Covers visualization, moving averages, exponential smoothing, basic trend/seasonal models, autocorrelation and diagnostics, and assessing forecast accuracy with MAE/MSE/RMSE. Demonstrates practical Excel workflows.',
    resources: [],
    tags: ['time-series', 'forecasting', 'seasonality', 'smoothing', 'excel'],
    teachingPoints: [
      'Time series vs. cross-sectional data; equally spaced observations and ordering.',
      'Visualization and decomposition: trend, seasonality, noise; identify patterns from plots.',
      'Smoothing methods: moving averages and exponential smoothing for short-term signals.',
      'Trend and seasonal models: fit linear/nonlinear trend; model/remove seasonality for accuracy.',
      'Autocorrelation: meaning and implications; diagnostics via residual checks.',
      'Forecast accuracy: compute MAE, MSE, RMSE; compare models for operational use.',
      'Excel implementation: plotting, smoothing, and simple forecasting tools.'
    ],
    keyTakeaways: [
      'Forecasting is essential for demand, workload, and performance planning.',
      'Accounting for seasonality and trend materially improves forecast accuracy.',
      'Simple smoothing/trend models are robust baselines; diagnostics and error reporting are mandatory.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Forecast demand and workload to plan staffing and manage backlogs proactively.',
          'Use seasonal patterns to set monthly/quarterly operational targets and resource allocations.',
          'Monitor deviations from expected trends to detect emerging service issues early.',
          'Embed forecasts with confidence/error metrics into dashboards for tactical and strategic planning.',
          'Provide Excel-based forecasting tools to make capabilities accessible to analysts and managers.'
        ]
      }
    ]
  },
  { 
    id: '12', 
    number: 12, 
    title: 'Introduction to Optimization Modeling', 
    objectives: [
      'Introduce optimization as a structured approach to choose the best action under constraints',
      'Formulate and solve problems to maximize or minimize objectives using analytical models'
    ],
    summary: 'Defines decision variables, objective functions, and constraints. Covers linear programming (LP) with mentions of integer, nonlinear, and network models. Emphasizes translating business problems into math, solving with tools like Excel Solver, and interpreting solutions with sensitivity analysis for robust decision support.',
    resources: [],
    tags: ['optimization', 'linear-programming', 'solver', 'resource-allocation', 'sensitivity'],
    teachingPoints: [
      'What is optimization: best feasible choice given objectives and constraints; navigating trade-offs.',
      'Model components: decision variables (controls), objective (min/max), constraints (limits/requirements).',
      'Types: LP for linear relationships; overview of integer programming, nonlinear, and network models.',
      'Formulation: translate business challenges into variables, objective, and constraints with clear units and logic.',
      'Solving & interpretation: use Excel Solver or similar; read solutions and perform sensitivity/what-if analysis.',
      'Decision support: integrate optimization outputs into dashboards and planning workflows.'
    ],
    keyTakeaways: [
      'Optimization converts analytics into actionable recommendations under real constraints.',
      'Correct formulation is critical—poorly specified models yield poor decisions.',
      'Sensitivity analysis reveals robustness and informs resilient, flexible planning.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Resource allocation: assign staff/budget to minimize wait times or maximize throughput within limits.',
          'Operational planning: schedule work, balance loads across teams, and design workflows.',
          'Scenario and robustness: test how optimal plans shift with demand spikes, staffing changes, or policy updates.',
          'From analytics to action: embed optimization recommendations and constraints into management dashboards.'
        ]
      }
    ]
  },
  { 
    id: '13', 
    number: 13, 
    title: 'Optimization Models', 
    objectives: [
      'Develop skill in building and applying optimization models across business problems',
      'Maximize or minimize objectives (cost, profit, time) subject to real-world constraints'
    ],
    summary: 'Builds from optimization fundamentals to practical formulations and solutions. Covers linear, integer, nonlinear, and network models; translating business rules into variables, objectives, and constraints; solving with tools (e.g., Excel Solver); interpreting results; and performing sensitivity/scenario analysis for robust decisions.',
    resources: [],
    tags: ['optimization', 'lp', 'ip', 'nlp', 'network', 'solver', 'sensitivity'],
    teachingPoints: [
      'Formulation: define decision variables, objective function, and constraints from real business rules.',
      'Problem types: LP (linear), IP (integer/binary decisions), NLP (nonlinear relationships), and network models (flows, assignments).',
      'Solving models: use Solver and other tools; visualize feasible region and interpret optimal solutions.',
      'Sensitivity & scenarios: analyze how solutions change with data, bounds, and objectives.',
      'Real-world applications: supply chain design, budget allocation, scheduling, service network optimization.'
    ],
    keyTakeaways: [
      'Well-constructed optimization models drive efficient resource allocation and service improvement.',
      'Sensitivity analysis adds robustness and supports contingency planning.',
      'Optimization shifts analytics from descriptive/predictive to prescriptive—recommending actions.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Cross-process optimization: schedule multi-stage workflows and allocate staff to minimize delays and backlogs.',
          'Strategic planning: integrate forecasts into optimization to plan for demand/capacity/policy shifts.',
          'Scenario and contingency: quantify impacts of regulation or budget changes on optimal plans.',
          'Action-oriented dashboards: present optimal recommendations with constraint/rationale summaries.'
        ]
      }
    ]
  },
  { 
    id: '14', 
    number: 14, 
    title: 'Introduction to Simulation Modeling', 
    objectives: [
      'Introduce simulation as a method to evaluate complex processes under uncertainty',
      'Quantify risk and variability when analytical solutions are impractical'
    ],
    summary: 'Explains simulation as imitating real systems via random sampling to study performance over many trials. Covers when to use simulation, how to build a model (inputs, logic, outputs), running iterations, and interpreting distributions with risk metrics and visuals. Emphasizes decision-making under uncertainty.',
    resources: [],
    tags: ['simulation', 'monte-carlo', 'risk', 'uncertainty', 'excel'],
    teachingPoints: [
      'What is simulation: use random sampling to imitate system behavior over time and scenarios.',
      'Why simulation: handles uncertainty, dependencies, and complex logic not suited to closed-form math.',
      'Process: define system and outputs; model inputs (random/fixed) and logic; generate random values; run many trials.',
      'Tools: implement in spreadsheets (e.g., Excel) or specialized software; use RNGs and distribution fits.',
      'Interpreting results: analyze means, quantiles, probabilities; visualize with histograms/probability plots; communicate risk clearly.',
      'Applications: staffing needs, inventory policies, process flow performance, and project timeline risk.'
    ],
    keyTakeaways: [
      'Simulation exposes likely and tail outcomes, informing robust plans and contingencies.',
      'Best for systems with multiple uncertain drivers and interdependencies.',
      'Provides expected values and risk measures—not just point estimates—for resilient decisions.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Operational risk planning: simulate arrival/service variability and inter-form dependencies.',
          'Capacity and staffing: test surge/slowdown scenarios to size teams and buffers.',
          'Service level forecasting: estimate probabilities of meeting targets and risks of backlog formation.',
          'Decision support: integrate distributions and risk dashboards into planning and reviews.'
        ]
      }
    ]
  },
  { 
    id: '15', 
    number: 15, 
    title: 'Simulation Models', 
    objectives: [
      'Build, run, and interpret simulation models for decision-making under uncertainty',
      'Create advanced models that assess risk, variability, and policy impacts in complex systems'
    ],
    summary: 'Extends simulation fundamentals to constructing robust models with probabilistic inputs, correlated risks, complex logic, and feedback. Emphasizes running large trial sets, extracting risk metrics (quantiles, target probabilities), and communicating insights via visuals and dashboards for operational adoption.',
    resources: [],
    tags: ['simulation', 'monte-carlo', 'risk', 'uncertainty', 'excel', 'arisk', 'data-table'],
    teachingPoints: [
      'Model building: identify all uncertain drivers; specify distributions for arrivals, service times, and delays.',
      'Trials and outputs: run thousands of iterations to estimate distributions of KPIs (cycle time, SLA attainment, cost).',
      'Advanced techniques: model dependencies (correlated inputs), branching/feedback logic, warm-up periods.',
      'Tools: set up in Excel with Data Tables/Solver or packages like @RISK; ensure reproducibility with seeds.',
      'Interpretation: compute expected values, quantiles, risk of shortfall/exceedance, and confidence in targets.',
      'Reporting: present histograms, risk profiles, and “chance of meeting target” summaries with clear narratives.'
    ],
    keyTakeaways: [
      'One scenario is insufficient—distributions reveal variability and risk critical to sound planning.',
      'Simulating policies before deployment reduces costs and mitigates operational risk.',
      'Clear communication of uncertainty drives stakeholder trust and actionability.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Multi-process simulation: represent end-to-end flows with interdependencies and variable workloads.',
          'Risk-based resource planning: estimate bottleneck and backlog probabilities to guide staffing and scheduling.',
          'Decision support: build risk dashboards showing likelihoods, ranges, and policy impacts prior to rollout.',
          'Continuous scenario testing: rerun models as demand/policy/resources change to stay resilient.'
        ]
      }
    ]
  },
  { 
    id: '16', 
    number: 16, 
    title: 'Data Mining: Classification', 
    objectives: [
      'Introduce foundational data mining concepts with focus on classification',
      'Discover patterns in large datasets to inform, automate, and predict decisions'
    ],
    summary: 'Covers core classification concepts and workflow: splitting data, training/testing, common algorithms (decision trees, logistic regression, k-NN, naive Bayes), and rigorous evaluation (accuracy, precision/recall, F1, ROC, confusion matrix). Emphasizes interpretability, validation, and operationalization for business impact.',
    resources: [],
    tags: ['data-mining', 'classification', 'decision-trees', 'logistic-regression', 'evaluation', 'roc', 'confusion-matrix'],
    teachingPoints: [
      'What is data mining: extracting useful patterns and knowledge from large datasets.',
      'Classification: predict categorical outcomes using labeled training data.',
      'Techniques: decision trees, logistic regression, k-NN, naive Bayes; strengths, assumptions, and use cases.',
      'Data splitting: train/validation/test to avoid overfitting; cross-validation basics.',
      'Evaluation: accuracy vs. precision/recall/F1; ROC/AUC; confusion matrix interpretation.',
      'Decision trees in depth: splits, branches, leaves, pruning; visualization for stakeholder understanding.',
      'Tooling: spreadsheet add-ins or specialized software for model building and interpretation.'
    ],
    keyTakeaways: [
      'Classification enables predictive, automated decisions for operational efficiency.',
      'Decision trees provide intuitive, explainable models suitable for business contexts.',
      'Robust validation and monitoring are essential to prevent brittle models and ensure reliability in production.',
      'Data mining shifts analytics from reactive to predictive and proactive.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Process automation & triage: route requests, prioritize reviews, and flag escalations using predicted outcomes.',
          'Performance monitoring: track predictions vs. actuals to improve service quality and detect drift/anomalies.',
          'Family/group analytics: tailor communications or interventions based on predicted needs or risks.',
          'Transparency: use decision-tree visuals and documentation to explain automated actions and support compliance.'
        ]
      }
    ]
  },
  { 
    id: '17', 
    number: 17, 
    title: 'Data Mining: Clustering and Association Rules', 
    objectives: [
      'Introduce clustering and market basket analysis for uncovering natural groupings and associative patterns',
      'Apply unsupervised techniques to large datasets for segmentation, bundling, and process insights'
    ],
    summary: 'Covers clustering (k-means, hierarchical, DBSCAN) and association rule mining (support, confidence, lift). Addresses evaluation (silhouette, WCSS), interpretation, workflow (prep, algorithm choice, tuning), and ethical considerations (privacy, fairness, transparency). Focus on actionable segmentation and co-occurrence insights.',
    resources: [],
    tags: ['data-mining', 'clustering', 'k-means', 'hierarchical', 'dbscan', 'association-rules', 'market-basket', 'support', 'confidence', 'lift'],
    teachingPoints: [
      'Clustering basics: group similar cases; distance metrics and feature scaling considerations.',
      'Methods: k-means (centroid-based), hierarchical (agglomerative/divisive), DBSCAN (density-based).',
      'Applications: customer segmentation, usage patterns, workflow bottleneck discovery.',
      'Evaluation: silhouette score, within-cluster sum of squares (WCSS), dendrograms, and visual inspection.',
      'Association rules: market basket analysis with support, confidence, and lift; rule interpretation.',
      'Implementation steps: data prep, algorithm selection, parameter tuning (k, linkage, eps/minPts), interpretation.',
      'Tools: spreadsheet add-ins and specialized analytics software.',
      'Ethics: ensure privacy, avoid biased segments/rules, and communicate transparently.'
    ],
    keyTakeaways: [
      'Clustering reveals hidden segments for tailored programs and operational optimization.',
      'Association rules uncover co-occurrence patterns that inform bundling and process redesign.',
      'Unsupervised learning expands analytics beyond single-variable views to multidimensional insights.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Service personalization & segmentation: identify applicant/family groups to tailor engagement and processing.',
          'Bundled service design: use market basket rules to streamline common form combinations and UI flows.',
          'Resource optimization: align staffing to clustered demand patterns; reduce handoff friction across segments.',
          'Pattern detection: monitor emerging clusters/rules for early warning on bottlenecks or behavior shifts.'
        ]
      }
    ]
  },
  { 
    id: '18', 
    number: 18, 
    title: 'Analysis of Variance and Experimental Design', 
    objectives: [
      'Introduce ANOVA for comparing means across multiple groups or process variants',
      'Enable rigorous experimental design for testing treatments, workflows, and system settings'
    ],
    summary: 'Explains one-way/multi-factor ANOVA, interpretation of F-statistic and p-values, and the role of post-hoc tests. Covers experimental design principles—randomization, replication, control—and factorial/fractional designs. Emphasizes checking assumptions (normality, equal variances, independence) and translating results into process improvements.',
    resources: [],
    tags: ['anova', 'experimental-design', 'factorial', 'post-hoc', 'tukey', 'bonferroni', 'assumptions'],
    teachingPoints: [
      'ANOVA purpose: assess whether differences in group means are statistically significant beyond random variation.',
      'Interpretation: F-statistic, p-values, effect size; handling multiple comparisons with post-hoc tests (Tukey/Bonferroni).',
      'Experimental design: plan comparisons of treatments/workflows; apply randomization, replication, and control.',
      'Factorial designs: study multiple factors and interactions; use fractional designs to reduce runs when resources are limited.',
      'Assumptions & diagnostics: check normality, homogeneity of variance, and independence; apply remedies or robust methods as needed.',
      'Practical tools: implement in Excel or statistical software; document hypotheses, design, and analysis clearly.'
    ],
    keyTakeaways: [
      'ANOVA generalizes hypothesis testing to more than two groups—vital for comparing multiple process options.',
      'Careful experimental design maximizes learning while minimizing time/cost.',
      'Diagnostics and post-hoc analyses make results robust and actionable for continuous improvement.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Process improvement: compare alternative service paths, form designs, or routing rules to identify significant gains.',
          'Experiment-driven decisions: pilot, test, and scale only those changes that outperform the status quo.',
          'Ongoing monitoring: run periodic experiments as policies/technology evolve to maintain optimal performance.',
          'Resource optimization: use factorial designs to quantify interactions and balance objectives (cost, time, satisfaction).'
        ]
      }
    ]
  },
  { 
    id: '19', 
    number: 19, 
    title: 'Statistical Process Control', 
    objectives: [
      'Introduce statistical tools for monitoring, controlling, and improving process quality',
      'Equip users to distinguish common vs. special cause variation and maintain stability'
    ],
    summary: 'Defines SPC and the use of control charts (X̄, R, p, c) to separate routine variation from signals. Covers process stability vs. capability, interpreting control limits, and using SPC as the basis for root-cause analysis and continuous improvement across manufacturing and services.',
    resources: [],
    tags: ['spc', 'control-charts', 'quality', 'process-capability', 'continuous-improvement'],
    teachingPoints: [
      'SPC basics: common vs. special causes of variation; purpose of ongoing statistical monitoring.',
      'Control charts: construct and interpret X̄/R for variables; p/c charts for attributes; control limits and signals.',
      'Stability and capability: assess in-control status and capability vs. specifications.',
      'Root-cause and CI: use SPC signals to investigate, correct, and prevent issues; embed PDCA cycles.',
      'Applications: manufacturing, services, transactional workflows, and any repeated process.'
    ],
    keyTakeaways: [
      'SPC shifts quality from ad hoc inspection to proactive, continuous monitoring.',
      'Control charts provide simple, powerful visuals for detecting trends and anomalies.',
      'Understanding variation sources drives smarter interventions and reliable performance.'
    ],
    applications: [
      {
        context: 'Data Strategy for multi-step, family-centered application processing',
        items: [
          'Quality dashboards: track approval times, error rates, and backlog signals with control charts.',
          'Process improvement: target interventions where charts indicate special-cause variation.',
          'Performance monitoring: avoid overreacting to noise; respond decisively to true shifts.',
          'Change management: document stability pre/post changes to build evidence and buy-in.'
        ]
      }
    ]
  },
];

// Deterministic fallback quiz generator so chapters without API quizzes still work
function generateFallbackQuiz(chapterId: string): QuizItem[] {
  const ch = FALLBACK_CHAPTERS.find(c => c.id === chapterId);
  if (!ch) return [];
  const trueFalse = ['True', 'False'];
  // Simple, accessible MCQs tied to chapter metadata; deterministic per chapter
  return [
    {
      id: `${chapterId}-q1`,
      type: 'mcq',
      prompt: `Chapter ${ch.number}: ${ch.title}. This chapter is part of the Business Analytics study aids.`,
      options: trueFalse,
      answerKey: 0,
      explanation: 'All listed chapters are part of the Business Analytics study aids module.'
    },
    {
      id: `${chapterId}-q2`,
      type: 'mcq',
      prompt: `Objectives exist for Chapter ${ch.number}.`,
      options: trueFalse,
      answerKey: (ch.objectives && ch.objectives.length > 0) ? 0 : 1,
      explanation: (ch.objectives && ch.objectives.length > 0)
        ? 'Objectives are provided in the chapter metadata.'
        : 'No objectives were listed for this chapter.'
    },
    {
      id: `${chapterId}-q3`,
      type: 'mcq',
      prompt: `Chapter ${ch.number} summary mentions data or models.`,
      options: trueFalse,
      answerKey: (/data|model/i.test(ch.summary) ? 0 : 1),
      explanation: 'The summary text determines the correct answer.'
    },
    {
      id: `${chapterId}-q4`,
      type: 'mcq',
      prompt: `Select True if at least one resource link is listed for Chapter ${ch.number}.`,
      options: trueFalse,
      answerKey: (ch.resources && ch.resources.length > 0) ? 0 : 1,
      explanation: 'Checks whether resources are present in the chapter metadata.'
    },
    {
      id: `${chapterId}-q5`,
      type: 'mcq',
      prompt: `Tags are provided for Chapter ${ch.number}.`,
      options: trueFalse,
      answerKey: (ch.tags && ch.tags.length > 0) ? 0 : 1,
      explanation: 'Verifies presence of tags in chapter metadata.'
    }
  ];
}

function gradeFallbackQuiz(chapterId: string, answers: (number | number[] | null)[]): QuizSubmitResponse {
  const items = generateFallbackQuiz(chapterId);
  const total = items.length;
  let score = 0;
  const results: QuizResultItem[] = items.map((q, i) => {
    const a = answers[i];
    let correct = false;
    if (q.type === 'mcq' && typeof q.answerKey === 'number') {
      correct = typeof a === 'number' && a === q.answerKey;
    } else if (q.type === 'msq' && Array.isArray(q.answerKey)) {
      const ans = Array.isArray(a) ? a.slice().sort((x, y) => x - y) : [];
      const key = (q.answerKey as number[]).slice().sort((x, y) => x - y);
      correct = ans.length === key.length && ans.every((v, idx) => v === key[idx]);
    } else if (q.type === 'numeric' && typeof q.answerKey === 'number') {
      correct = typeof a === 'number' && a === q.answerKey;
    }
    if (correct) score += 1;
    return { id: q.id, correct, explanation: q.explanation };
  });
  return { total, score, results };
}

export const studyAidsService = {
  getModule: async (): Promise<BaModule> => {
    const res = await api.get<ApiResponse<BaModule>>('/study-aids/ba');
    return res.data.data as BaModule;
  },
  updateChapter: async (id: string, payload: Partial<BaChapter>): Promise<BaChapter> => {
    const res = await api.put<ApiResponse<BaChapter>>(`/study-aids/ba/chapters/${id}`, payload);
    if (!res.data.data) throw new Error('Update failed');
    return res.data.data as BaChapter;
  },
  getChapters: async (): Promise<BaChapter[]> => {
    try {
      const res = await api.get<ApiResponse<BaChapter[]>>('/study-aids/ba/chapters');
      const apiChapters = res.data.data || [];
      // If API returns nothing or fewer than fallback, ensure we at least show all 19
      return apiChapters.length >= FALLBACK_CHAPTERS.length ? apiChapters : FALLBACK_CHAPTERS;
    } catch {
      return FALLBACK_CHAPTERS;
    }
  },
  getChapter: async (id: string): Promise<BaChapter> => {
    try {
      const res = await api.get<ApiResponse<BaChapter>>(`/study-aids/ba/chapters/${id}`);
      return (res.data.data as BaChapter) || FALLBACK_CHAPTERS.find(c => c.id === id)!;
    } catch {
      const fallback = FALLBACK_CHAPTERS.find(c => c.id === id);
      if (!fallback) throw new Error('Chapter not found');
      return fallback;
    }
  },
  getQuiz: async (chapterId: string): Promise<QuizItem[]> => {
    try {
      const res = await api.get<ApiResponse<QuizItem[]>>(`/study-aids/ba/chapters/${chapterId}/quiz`);
      const items = res.data.data || [];
      if (items.length > 0) return items;
      // No API items: provide fallback for full coverage (4–19 included)
      return generateFallbackQuiz(chapterId);
    } catch {
      // API failed: provide fallback
      return generateFallbackQuiz(chapterId);
    }
  },
  submitQuiz: async (chapterId: string, answers: (number | number[] | null)[]): Promise<QuizSubmitResponse> => {
    try {
      const res = await api.post<ApiResponse<QuizSubmitResponse>>(`/study-aids/ba/chapters/${chapterId}/quiz/submit`, { answers });
      if (res.data && res.data.data) return res.data.data as QuizSubmitResponse;
      // Unexpected shape: fallback grade
      return gradeFallbackQuiz(chapterId, answers);
    } catch {
      // API unavailable: grade fallback deterministically
      return gradeFallbackQuiz(chapterId, answers);
    }
  },
  getFinalExam: async (count = 35): Promise<QuizItem[]> => {
    try {
      const res = await api.get<ApiResponse<QuizItem[]>>('/study-aids/ba/final-exam');
      const items = res.data.data || [];
      if (items.length > 0) return items.slice(0, count);
      return assembleFinalExamQuestions(count);
    } catch {
      return assembleFinalExamQuestions(count);
    }
  },
  submitFinalExam: async (answers: (number | number[] | null)[], count = 35): Promise<QuizSubmitResponse> => {
    try {
      const res = await api.post<ApiResponse<QuizSubmitResponse>>('/study-aids/ba/final-exam/submit', { answers });
      if (res.data && res.data.data) return res.data.data as QuizSubmitResponse;
      const items = assembleFinalExamQuestions(count);
      return gradeQuestions(items, answers);
    } catch {
      const items = assembleFinalExamQuestions(count);
      return gradeQuestions(items, answers);
    }
  },
  getLabs: async () => {
    const res = await api.get<ApiResponse<any[]>>('/study-aids/ba/labs');
    return res.data.data || [];
  },
  getProgress: async () => {
    const res = await api.get<ApiResponse<any>>('/study-aids/ba/progress');
    return res.data.data || {};
  }
};
