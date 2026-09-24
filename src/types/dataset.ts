/**
 * Core type definitions for DataMind AI
 */

export type DataType = 'number' | 'string' | 'date' | 'boolean';

export type SemanticRole =
  | 'measure'      // Numeric metrics: revenue, cost, quantity, fee
  | 'dimension'    // Categorical slicing: product, category, tier, branch
  | 'temporal'     // Date/time: ship_date, purchase_timestamp, renewal_date
  | 'identifier'   // Unique keys: invoice_id, receipt_number, subscription_key
  | 'geography'    // Locations: territory, region, country, state, city
  | 'categorical'; // Generic classification

export interface ColumnProfile {
  name: string;
  dataType: DataType;
  nullCount: number;
  uniqueCount: number;
  totalCount: number;
  sampleValues: (string | number | boolean)[];
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  sum?: number;
  stdDev?: number;
  isDateCandidate?: boolean;
}

export interface InferredColumn {
  columnName: string;
  role: SemanticRole;
  businessConcept: string; // e.g. "Gross Billed Revenue", "Shipped Units", "Item Code"
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
  unit?: string; // '$', '₹', 'units', 'kg', etc.
}

export interface QualityIssue {
  id: string;
  type: 'missing' | 'duplicate' | 'outlier' | 'constant_col' | 'invalid_date';
  severity: 'high' | 'medium' | 'low';
  description: string;
  column?: string;
  affectedCount: number;
}

export interface DataQualityReport {
  score: number; // 0 to 100
  totalRows: number;
  totalColumns: number;
  missingValuesCount: number;
  duplicateRowsCount: number;
  outlierCount: number;
  issues: QualityIssue[];
}

export interface AnomalyItem {
  id: string;
  rowNumber: number;
  columnName: string;
  value: number | string;
  expectedMin: number;
  expectedMax: number;
  zScore?: number;
  deviationMultiplier?: number;
  reason: string;
  recordSnapshot: Record<string, any>;
}

export interface FilterCondition {
  column: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'in';
  value: any;
}

export type QueryIntent =
  | 'total'
  | 'average'
  | 'minimum'
  | 'maximum'
  | 'count'
  | 'ranking'
  | 'top_n'
  | 'bottom_n'
  | 'group_by'
  | 'trend'
  | 'comparison'
  | 'percentage'
  | 'distribution'
  | 'correlation'
  | 'anomaly';

export interface AnalysisPlan {
  intent: QueryIntent;
  targetMeasure?: string;
  secondaryMeasure?: string;
  groupBy?: string;
  dateGranularity?: 'day' | 'month' | 'year' | 'quarter';
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'median';
  filterConditions?: FilterCondition[];
  sort?: 'asc' | 'desc';
  limit?: number;
  recommendedChart: 'metric' | 'bar' | 'horizontal_bar' | 'line' | 'donut' | 'scatter' | 'table';
  explanationSteps: string[];
  technicalFormula: string;
  
  // Ambiguity & Unanswerable handling
  ambiguity?: {
    isAmbiguous: boolean;
    question: string;
    options: string[];
    reason: string;
  };
  isUnanswerable?: boolean;
  unanswerableReason?: string;
  suggestedAlternatives?: string[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  percentage?: number;
  rawRecord?: Record<string, any>;
}

export interface AnalysisResult {
  id: string;
  question: string;
  plan: AnalysisPlan;
  answerSummary: string;
  highlightValue?: string | number;
  highlightSubtext?: string;
  chartType: 'metric' | 'bar' | 'horizontal_bar' | 'line' | 'donut' | 'scatter' | 'table';
  chartData: ChartDataPoint[];
  tableData?: Record<string, any>[];
  calculationSteps: string[];
  technicalFormula: string;
  aiInsights: string[];
  timestamp: string;
}

export interface Dataset {
  id: string;
  name: string;
  fileName: string;
  description?: string;
  records: Record<string, any>[];
  columns: string[];
  profiles: Record<string, ColumnProfile>;
  inferredSchema: Record<string, InferredColumn>;
  quality: DataQualityReport;
  anomalies: AnomalyItem[];
  suggestedQuestions: string[];
  uploadedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content?: string;
  analysisResult?: AnalysisResult;
  ambiguityChoice?: {
    question: string;
    options: string[];
    reason: string;
  };
  unanswerable?: {
    reason: string;
    suggestedQuestions: string[];
  };
  timestamp: string;
}
