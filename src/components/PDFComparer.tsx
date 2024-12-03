import type React from "react";
import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Root } from "./types";
import { ComparisonDetails } from "./PDFComparer/ComparisonDetails";

const SIMILARITY_THRESHOLD = 0.8; // 80%

const PDFComparer = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Root | null>(null);
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
      const data: Root = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Comparison failed:", error);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const highSimilarityComparisons =
    results?.comparisons.filter(
      (comp) => comp.result.similarity_index >= SIMILARITY_THRESHOLD
    ) || [];

  const regularComparisons =
    results?.comparisons.filter(
      (comp) => comp.result.similarity_index < SIMILARITY_THRESHOLD
    ) || [];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Plgrzr Checker</CardTitle>
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
            <div className="mt-4 space-y-8">
              {highSimilarityComparisons.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-red-600 mb-4">
                    High Similarity Detected ({highSimilarityComparisons.length}
                    )
                  </h2>
                  <div className="space-y-4">
                    {highSimilarityComparisons.map((comparison, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <Card key={index} className="border-red-200">
                        <CardContent className="pt-4">
                          <Sheet>
                            <SheetTrigger asChild>
                              <div className="cursor-pointer p-4 hover:bg-gray-50">
                                <h3 className="text-lg font-medium text-red-600">
                                  {comparison.file1} vs {comparison.file2}
                                </h3>
                                <p className="text-red-500">
                                  Similarity Index:{" "}
                                  {(
                                    comparison.result.similarity_index * 100
                                  ).toFixed(1)}
                                  %
                                </p>
                              </div>
                            </SheetTrigger>
                            <SheetContent
                              side="right"
                              className="w-full sm:w-[90vw] max-w-[1000px] overflow-y-auto"
                            >
                              <SheetHeader>
                                <SheetTitle>Comparison Details</SheetTitle>
                              </SheetHeader>
                              <ComparisonDetails comparison={comparison} />
                            </SheetContent>
                          </Sheet>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {regularComparisons.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Other Comparisons ({regularComparisons.length})
                  </h2>
                  <div className="space-y-4">
                    {regularComparisons.map((comparison, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <Sheet>
                            <SheetTrigger asChild>
                              <div className="cursor-pointer p-4 hover:bg-gray-50">
                                <h3 className="text-lg font-medium">
                                  {comparison.file1} vs {comparison.file2}
                                </h3>
                                <p>
                                  Similarity Index:{" "}
                                  {(
                                    comparison.result.similarity_index * 100
                                  ).toFixed(1)}
                                  %
                                </p>
                              </div>
                            </SheetTrigger>
                            <SheetContent
                              side="right"
                              className="w-full sm:w-[90vw] max-w-[1000px] overflow-y-auto"
                            >
                              <SheetHeader>
                                <SheetTitle>Comparison Details</SheetTitle>
                              </SheetHeader>
                              <ComparisonDetails comparison={comparison} />
                            </SheetContent>
                          </Sheet>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFComparer;
