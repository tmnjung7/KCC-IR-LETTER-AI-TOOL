
export interface PerformanceData {
  quarter: string;
  revenue: number;
  operatingProfit: number;
  profitRate: number;
}

export interface IndicatorData {
  quarter: string;
  liquidityRatio: number;
  equityRatio: number;
  dependencyRatio: number;
  debtRatio: number;
}

export interface BusinessHighlight {
  title: string;
  subtitle: string;
  details: string[];
}

export interface IRLetterState {
  date: string;
  quarterTitle: string;
  earningsSummary: string[];
  performanceHistory: PerformanceData[];
  businessHighlights: BusinessHighlight[];
  indicatorHistory: IndicatorData[];
  irSupport: string[];
  irAction: string[];
}
