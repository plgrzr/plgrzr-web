export interface Root {
  total_comparisons: number;
  comparisons: Comparison[];
}

export interface Comparison {
  file1: string;
  file2: string;
  result: Result;
}

export interface Result {
  text_similarity: number;
  text_consistency: TextConsistency;
  handwriting_similarity: number;
  similarity_index: number;
  feature_scores: FeatureScores;
  anomalies: Anomalies;
  variations: Variations;
  report_url: string;
}

export interface TextConsistency {
  doc1: Doc1[];
  doc2: Doc2[];
}

export interface Doc1 {
  segment_index: number;
  segment_text: string;
  next_segment_text: string;
  similarity_score: number;
}

export interface Doc2 {
  segment_index: number;
  segment_text: string;
  next_segment_text: string;
  similarity_score: number;
}

export interface FeatureScores {
  confidence_similarity: number;
  symbol_density_similarity: number;
  line_break_similarity: number;
  average_confidence_similarity: number;
}

export interface Anomalies {
  document1: Document1[];
  document2: Document2[];
}

export interface Document1 {
  confidence?: Confidence;
  symbol_density?: SymbolDensity;
  paragraph_index: number;
  page_number: number;
  line_breaks?: LineBreaks;
}

export interface Confidence {
  value: number;
  mean: number;
  deviation: number;
}

export interface SymbolDensity {
  value: number;
  mean: number;
  deviation: number;
}

export interface LineBreaks {
  value: number;
  mean: number;
  deviation: number;
}

export interface Document2 {
  symbol_density?: SymbolDensity2;
  paragraph_index: number;
  page_number: number;
  line_breaks?: LineBreaks2;
  confidence?: Confidence2;
}

export interface SymbolDensity2 {
  value: number;
  mean: number;
  deviation: number;
}

export interface LineBreaks2 {
  value: number;
  mean: number;
  deviation: number;
}

export interface Confidence2 {
  value: number;
  mean: number;
  deviation: number;
}

export interface Variations {
  document1: Document12[];
  document2: Document22[];
}

export interface Document12 {
  from_page: number;
  to_page: number;
  changes: Change[];
}

export interface Change {
  type: string;
  difference: number;
  description: string;
}

export interface Document22 {
  from_page: number;
  to_page: number;
  changes: Change2[];
}

export interface Change2 {
  type: string;
  difference: number;
  description: string;
}
