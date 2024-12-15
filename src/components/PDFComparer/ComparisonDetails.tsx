// Types

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

type FeatureScore = {
  confidence_similarity: number;
  symbol_density_similarity: number;
  line_break_similarity: number;
  average_confidence_similarity: number;
};

type StatMetrics = {
  value: number;
  mean: number;
  deviation: number;
};

type AnomalyData = {
  page_number: number;
  paragraph_index: number;
  confidence?: StatMetrics;
  symbol_density?: StatMetrics;
  line_breaks?: StatMetrics;
};

type ConsistencySegment = {
  segment_index: number;
  segment_text: string;
  next_segment_text: string;
  similarity_score: number;
};

type VariationChange = {
  type: "major" | "minor";
  difference: number;
  description: string;
};

type Variation = {
  from_page: number;
  to_page: number;
  changes: VariationChange[];
};

type ComparisonResult = {
  similarity_index: number;
  text_similarity: number;
  handwriting_similarity: number;
  feature_scores: FeatureScore;
  anomalies: {
    document1: AnomalyData[];
    document2: AnomalyData[];
  };
  text_consistency: {
    doc1: ConsistencySegment[];
    doc2: ConsistencySegment[];
  };
  variations: {
    document1: Variation[];
    document2: Variation[];
  };
  report_url?: string;
};

interface Comparison {
  result: ComparisonResult;
}

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronRight,
  AlertTriangle,
  Shuffle,
  GitCompare,
  FileText,
  PenTool,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MathJaxContext } from "better-react-mathjax";

const ScoreDisplay = ({ label, value, icon: Icon, className = "" }) => (
  <Card className={`overflow-hidden ${className}`}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-3">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">
            {(value * 100).toFixed(1)}%
          </span>
          <Badge
            variant={
              value > 0.8 ? "success" : value > 0.6 ? "warning" : "destructive"
            }
          >
            {value > 0.8 ? "High" : value > 0.6 ? "Medium" : "Low"}
          </Badge>
        </div>
        <Progress value={value * 100} className="h-2" />
      </div>
    </CardContent>
  </Card>
);

const DetailScoreDisplay = ({ label, value, mean, deviation }) => (
  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium">{label}</span>
      <Badge variant="outline" className="font-mono">
        μ: {mean.toFixed(1)} σ: {deviation.toFixed(2)}
      </Badge>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-2xl font-bold">{value.toFixed(1)}</span>
      <Progress
        value={Math.min((value / (mean + deviation * 3)) * 100, 100)}
        className="w-1/2 h-2"
      />
    </div>
  </div>
);

const ConsistencyDisplay = ({ consistency }) => (
  <ScrollArea className="h-[500px]">
    <div className="space-y-4 p-2">
      {consistency.map((segment, index) => (
        <Card
          key={`consistency-${index}`}
          className="border-l-4 border-l-primary"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Shuffle className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Segment {segment.segment_index}</h4>
              <Badge className="ml-auto">
                {(segment.similarity_score * 100).toFixed(1)}% Similar
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm font-medium">Current</span>
                <div className="bg-muted p-3 rounded-md min-h-24">
                  <MathJaxContext>{segment.segment_text}</MathJaxContext>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">Next</span>
                <div className="bg-muted p-3 rounded-md min-h-24">
                  <MathJaxContext>{segment.next_segment_text}</MathJaxContext>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </ScrollArea>
);

const AnomalyDisplay = ({ anomaly }) => (
  <Card className="mb-4 border-l-4 border-l-yellow-500">
    <CardContent className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <div>
          <h4 className="font-medium">Anomaly Detected</h4>
          <p className="text-sm text-muted-foreground">
            Page {anomaly.page_number}, Paragraph {anomaly.paragraph_index}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {anomaly.confidence && (
          <DetailScoreDisplay label="Confidence" {...anomaly.confidence} />
        )}
        {anomaly.symbol_density && (
          <DetailScoreDisplay
            label="Symbol Density"
            {...anomaly.symbol_density}
          />
        )}
        {anomaly.line_breaks && (
          <DetailScoreDisplay label="Line Breaks" {...anomaly.line_breaks} />
        )}
      </div>
    </CardContent>
  </Card>
);

const VariationsDisplay = ({ variations }) => (
  <ScrollArea className="h-[500px]">
    <div className="space-y-4 p-2">
      {variations.map((variation, index) => (
        <Card key={`variation-${index}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">
                Pages {variation.from_page} - {variation.to_page}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {variation.changes.map((change, changeIndex) => (
                <div
                  key={`change-${changeIndex}`}
                  className={`p-4 rounded-lg ${
                    change.type === "major" ? "bg-destructive/10" : "bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant={
                        change.type === "major" ? "destructive" : "secondary"
                      }
                    >
                      {change.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-medium ml-auto">
                      {(change.difference * 100).toFixed(1)}% Different
                    </span>
                  </div>
                  <p className="text-sm">{change.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </ScrollArea>
);

export const ComparisonDetails = ({ comparison }) => {
  const { result } = comparison;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div className="space-y-8 p-4">
        <div className="grid gap-6 md:grid-cols-3">
          <ScoreDisplay
            label="Overall Similarity"
            value={result.similarity_index}
            icon={Sparkles}
          />
          <ScoreDisplay
            label="Text Similarity"
            value={result.text_similarity}
            icon={FileText}
          />
          <ScoreDisplay
            label="Handwriting Similarity"
            value={result.handwriting_similarity}
            icon={PenTool}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Feature Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <ScoreDisplay
                label="Confidence Similarity"
                value={result.feature_scores.confidence_similarity}
              />
              <ScoreDisplay
                label="Symbol Density Similarity"
                value={result.feature_scores.symbol_density_similarity}
              />
              <ScoreDisplay
                label="Line Break Similarity"
                value={result.feature_scores.line_break_similarity}
              />
              <ScoreDisplay
                label="Average Confidence Similarity"
                value={result.feature_scores.average_confidence_similarity}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="anomalies" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
                <TabsTrigger
                  value="anomalies"
                  className="data-[state=active]:border-b-2 rounded-none"
                >
                  Anomalies
                </TabsTrigger>
                <TabsTrigger
                  value="consistency"
                  className="data-[state=active]:border-b-2 rounded-none"
                >
                  Consistency
                </TabsTrigger>
                <TabsTrigger
                  value="variations"
                  className="data-[state=active]:border-b-2 rounded-none"
                >
                  Variations
                </TabsTrigger>
                <TabsTrigger
                  value="detailed_report"
                  className="data-[state=active]:border-b-2 rounded-none"
                >
                  Detailed Report
                </TabsTrigger>
              </TabsList>

              <div className="p-4">
                <TabsContent value="anomalies" className="m-0">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-lg font-medium mb-4">Document 1</h4>
                      <ScrollArea className="h-[500px] pr-4">
                        {result.anomalies.document1.map((anomaly, idx) => (
                          <AnomalyDisplay
                            key={`anomaly1-${idx}`}
                            anomaly={anomaly}
                          />
                        ))}
                      </ScrollArea>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-4">Document 2</h4>
                      <ScrollArea className="h-[500px] pr-4">
                        {result.anomalies.document2.map((anomaly, idx) => (
                          <AnomalyDisplay
                            key={`anomaly2-${idx}`}
                            anomaly={anomaly}
                          />
                        ))}
                      </ScrollArea>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="consistency" className="m-0">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-lg font-medium mb-4">Document 1</h4>
                      <ConsistencyDisplay
                        consistency={result.text_consistency.doc1}
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-4">Document 2</h4>
                      <ConsistencyDisplay
                        consistency={result.text_consistency.doc2}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="variations" className="m-0">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-lg font-medium mb-4">Document 1</h4>
                      <VariationsDisplay
                        variations={result.variations.document1}
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-4">Document 2</h4>
                      <VariationsDisplay
                        variations={result.variations.document2}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="detailed_report" className="m-0">
                  <div
                    style={{
                      border: "1px solid rgba(0, 0, 0, 0.3)",
                      height: "750px",
                    }}
                  >
                    <Viewer
                      plugins={[defaultLayoutPluginInstance]}
                      fileUrl={`https://ls8sw8cgwwkwws04scoow8c8.13.76.121.152.sslip.io/${result.report_url}`}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {result.report_url && (
          <div className="flex justify-end">
            <a
              href={
                result.report_url.startsWith("http")
                  ? result.report_url
                  : `https://ls8sw8cgwwkwws04scoow8c8.13.76.121.152.sslip.io/${result.report_url}`
              }
              className="inline-flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Full Report
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </Worker>
  );
};

export default ComparisonDetails;
