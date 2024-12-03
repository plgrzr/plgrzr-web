import type {
  Comparison,
  Document1,
  Document12,
  TextConsistency,
} from "../types";

const AnomalyDisplay = ({ anomaly }: { anomaly: Document1 }) => (
  <div className="p-2 border rounded-lg mb-2">
    <p className="font-medium">
      Page {anomaly.page_number}, Paragraph {anomaly.paragraph_index}
    </p>
    {anomaly.confidence && (
      <div className="ml-4">
        <p>Confidence: {(anomaly.confidence.value * 100).toFixed(1)}%</p>
        <p>Mean: {(anomaly.confidence.mean * 100).toFixed(1)}%</p>
        <p>Deviation: {(anomaly.confidence.deviation * 100).toFixed(1)}%</p>
      </div>
    )}
    {anomaly.symbol_density && (
      <div className="ml-4">
        <p>Symbol Density: {anomaly.symbol_density.value.toFixed(2)}</p>
        <p>Mean: {anomaly.symbol_density.mean.toFixed(2)}</p>
        <p>Deviation: {anomaly.symbol_density.deviation.toFixed(2)}</p>
      </div>
    )}
    {anomaly.line_breaks && (
      <div className="ml-4">
        <p>Line Breaks: {anomaly.line_breaks.value.toFixed(2)}</p>
        <p>Mean: {anomaly.line_breaks.mean.toFixed(2)}</p>
        <p>Deviation: {anomaly.line_breaks.deviation.toFixed(2)}</p>
      </div>
    )}
  </div>
);

const ConsistencyDisplay = ({
  consistency,
}: {
  consistency: TextConsistency["doc1"];
}) => (
  <div className="space-y-2">
    {consistency.map((segment, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
      <div key={index} className="p-2 border rounded-lg">
        <p className="font-medium">Segment {segment.segment_index}</p>
        <p className="text-sm">Current: {segment.segment_text}</p>
        <p className="text-sm">Next: {segment.next_segment_text}</p>
        <p className="text-sm">
          Similarity: {(segment.similarity_score * 100).toFixed(1)}%
        </p>
      </div>
    ))}
  </div>
);

const VariationsDisplay = ({ variations }: { variations: Document12[] }) => (
  <div className="space-y-2">
    {variations.map((variation, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
      <div key={index} className="p-2 border rounded-lg">
        <p className="font-medium">
          Pages {variation.from_page} to {variation.to_page}
        </p>
        {variation.changes.map((change, changeIndex) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={changeIndex} className="ml-4">
            <p>Type: {change.type}</p>
            <p>Difference: {(change.difference * 100).toFixed(1)}%</p>
            <p>Description: {change.description}</p>
          </div>
        ))}
      </div>
    ))}
  </div>
);

export const ComparisonDetails = ({
  comparison,
}: {
  comparison: Comparison;
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium">Overview</h4>
        <div className="ml-4 space-y-1">
          <p>
            Similarity Index:{" "}
            {(comparison.result.similarity_index * 100).toFixed(1)}%
          </p>
          <p>
            Text Similarity:{" "}
            {(comparison.result.text_similarity * 100).toFixed(1)}%
          </p>
          <p>
            Handwriting Similarity:{" "}
            {(comparison.result.handwriting_similarity * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Feature Scores</h4>
        <div className="ml-4 space-y-1">
          <p>
            Confidence:{" "}
            {(
              comparison.result.feature_scores.confidence_similarity * 100
            ).toFixed(1)}
            %
          </p>
          <p>
            Symbol Density:{" "}
            {(
              comparison.result.feature_scores.symbol_density_similarity * 100
            ).toFixed(1)}
            %
          </p>
          <p>
            Line Break:{" "}
            {(
              comparison.result.feature_scores.line_break_similarity * 100
            ).toFixed(1)}
            %
          </p>
          <p>
            Average Confidence:{" "}
            {(
              comparison.result.feature_scores.average_confidence_similarity *
              100
            ).toFixed(1)}
            %
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Anomalies</h4>
        <div className="ml-4 space-y-4">
          <div>
            <h5 className="font-medium mb-2">Document 1</h5>
            {comparison.result.anomalies.document1.map((anomaly, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <AnomalyDisplay key={idx} anomaly={anomaly} />
            ))}
          </div>
          <div>
            <h5 className="font-medium mb-2">Document 2</h5>
            {comparison.result.anomalies.document2.map((anomaly, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <AnomalyDisplay key={idx} anomaly={anomaly} />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Text Consistency</h4>
        <div className="ml-4 space-y-4">
          <div>
            <h5 className="font-medium mb-2">Document 1</h5>
            <ConsistencyDisplay
              consistency={comparison.result.text_consistency.doc1}
            />
          </div>
          <div>
            <h5 className="font-medium mb-2">Document 2</h5>
            <ConsistencyDisplay
              consistency={comparison.result.text_consistency.doc2}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Variations</h4>
        <div className="ml-4 space-y-4">
          <div>
            <h5 className="font-medium mb-2">Document 1</h5>
            <VariationsDisplay
              variations={comparison.result.variations.document1}
            />
          </div>
          <div>
            <h5 className="font-medium mb-2">Document 2</h5>
            <VariationsDisplay
              variations={comparison.result.variations.document2}
            />
          </div>
        </div>
      </div>

      {comparison.result.report_url && (
        <div className="mt-4">
          <a
            href={`http://localhost:5001/report/${comparison.result.report_url}`}
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Full Report
          </a>
        </div>
      )}
    </div>
  );
};
