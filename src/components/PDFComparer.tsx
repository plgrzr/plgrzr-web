import type React from "react";
import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const PDFComparer = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [results, setResults] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    for (const file of files) {
      formData.append(file.name, file);
    }
    

    try {
      const response = await fetch("http://localhost:3001/compare-multiple", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Comparison failed:", error);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>PDF Comparison Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">Drop PDFs here or click to upload</p>
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Selected Files ({files.length})</h3>
              {files.map((file) => (
                <div key={file.name} className="text-sm text-gray-600">
                  {file.name}
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={files.length < 2 || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Comparing...
              </>
            ) : (
              "Compare PDFs"
            )}
          </Button>

          {loading && <Progress value={progress} />}

          {results && (
            <div className="mt-4 space-y-4">
              {results.comparisons.map((comparison: any, index: number) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2">
                      {comparison.file1} vs {comparison.file2}
                    </h4>
                    {comparison.error ? (
                      <p className="text-red-500">{comparison.error}</p>
                    ) : (
                      <div className="space-y-2">
                        <p>
                          Similarity Index:{" "}
                          {(comparison.result.similarity_index * 100).toFixed(
                            1
                          )}
                          %
                        </p>
                        <p>
                          Text Similarity:{" "}
                          {(comparison.result.text_similarity * 100).toFixed(1)}
                          %
                        </p>
                        <p>
                          Handwriting Similarity:{" "}
                          {(
                            comparison.result.handwriting_similarity * 100
                          ).toFixed(1)}
                          %
                        </p>
                        {comparison.result.report_url && (
                          <a
                            href={`http://localhost:5001/report/${comparison.result.report_url}`}
                            className="text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Full Report
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFComparer;
