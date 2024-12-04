import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, AlertTriangle, Shuffle, GitCompare } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Comparison } from "../types";

const ScoreDisplay = ({ label, value, className = "" }) => (
  <div className={`space-y-1 ${className}`}>
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{(value * 100).toFixed(1)}%</span>
    </div>
    <Progress value={value * 100} className="h-2" />
  </div>
);

const DetailScoreDisplay = ({ label, value, mean, deviation }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-sm">
        <span className="font-medium">{value.toFixed(1)}</span>
        <span className="text-muted-foreground ml-2">
          (μ: {mean.toFixed(1)}, σ: {deviation.toFixed(2)})
        </span>
      </div>
    </div>
    <Progress value={(value / (mean + deviation * 3)) * 100} className="h-2" />
  </div>
);

const ConsistencyDisplay = ({ consistency }) => (
  <ScrollArea className="h-[400px]">
    <div className="space-y-4">
      {consistency.map((segment, index) => (
        <Card key={`consistency-${index}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Shuffle className="h-4 w-4 text-blue-500" />
              <h4 className="font-medium">Segment {segment.segment_index}</h4>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Current</span>
                <p className="text-sm bg-muted p-3 rounded-md">
                  {segment.segment_text}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Next</span>
                <p className="text-sm bg-muted p-3 rounded-md">
                  {segment.next_segment_text}
                </p>
              </div>
              <ScoreDisplay
                label="Similarity"
                value={segment.similarity_score}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </ScrollArea>
);

const AnomalyDisplay = ({ anomaly }) => (
  <Card className="mb-4">
    <CardContent className="pt-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <h4 className="font-medium">
          Page {anomaly.page_number}, Paragraph {anomaly.paragraph_index}
        </h4>
      </div>
      <div className="space-y-4 pl-6">
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
  <ScrollArea className="h-[400px]">
    <div className="space-y-4">
      {variations.map((variation, index) => (
        <Card key={`variation-${index}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <GitCompare className="h-4 w-4 text-blue-500" />
              <h4 className="font-medium">
                Pages {variation.from_page} to {variation.to_page}
              </h4>
            </div>
            <div className="space-y-4 pl-6">
              {variation.changes.map((change, changeIndex) => (
                <div key={`change-${changeIndex}`} className="space-y-2">
                  <Badge
                    variant={
                      change.type === "major" ? "destructive" : "secondary"
                    }
                  >
                    {change.type}
                  </Badge>
                  <ScoreDisplay label="Difference" value={change.difference} />
                  <p className="text-sm text-muted-foreground">
                    {change.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </ScrollArea>
);

export const ComparisonDetails = ({
  comparison,
}: {
  comparison: Comparison;
}) => {
  const { result } = comparison;

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <ScoreDisplay
                label="Similarity Index"
                value={result.similarity_index}
              />
              <ScoreDisplay
                label="Text Similarity"
                value={result.text_similarity}
              />
              <ScoreDisplay
                label="Handwriting Similarity"
                value={result.handwriting_similarity}
              />
            </div>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="feature-scores">
            <AccordionTrigger>Feature Scores</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-4">
                <ScoreDisplay
                  label="Confidence"
                  value={result.feature_scores.confidence_similarity}
                />
                <ScoreDisplay
                  label="Symbol Density"
                  value={result.feature_scores.symbol_density_similarity}
                />
                <ScoreDisplay
                  label="Line Break"
                  value={result.feature_scores.line_break_similarity}
                />
                <ScoreDisplay
                  label="Average Confidence"
                  value={result.feature_scores.average_confidence_similarity}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Tabs defaultValue="anomalies" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
            <TabsTrigger value="consistency">Consistency</TabsTrigger>
            <TabsTrigger value="variations">Variations</TabsTrigger>
          </TabsList>

          <TabsContent value="anomalies">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium mb-4">Document 1</h4>
                <ScrollArea className="h-[400px]">
                  {result.anomalies.document1.map((anomaly, idx) => (
                    <AnomalyDisplay key={`anomaly1-${idx}`} anomaly={anomaly} />
                  ))}
                </ScrollArea>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-4">Document 2</h4>
                <ScrollArea className="h-[400px]">
                  {result.anomalies.document2.map((anomaly, idx) => (
                    <AnomalyDisplay key={`anomaly2-${idx}`} anomaly={anomaly} />
                  ))}
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="consistency">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium mb-4">Document 1</h4>
                <ConsistencyDisplay
                  consistency={result.text_consistency.doc1}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-4">Document 2</h4>
                <ConsistencyDisplay
                  consistency={result.text_consistency.doc2}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="variations">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium mb-4">Document 1</h4>
                <VariationsDisplay variations={result.variations.document1} />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-4">Document 2</h4>
                <VariationsDisplay variations={result.variations.document2} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {result.report_url && (
          <div className="flex justify-end">
            <a
              href={`http://localhost:5001/report/${result.report_url}`}
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
    </>
  );
};

export default ComparisonDetails;
