import type React from "react";
import { useState, useCallback } from "react";
import {
  Upload,
  Loader2,
  FileText,
  AlertTriangle,
  X,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Root } from "./types";
import { ComparisonDetails } from "./PDFComparer/ComparisonDetails";

const SIMILARITY_THRESHOLD = 0.8;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const PDFComparer = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Root | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFiles = (fileList: FileList | File[]): File[] => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of Array.from(fileList)) {
      if (!file.type.includes("pdf")) {
        errors.push(`${file.name} is not a PDF file`);
      } else if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} exceeds 10MB size limit`);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length) {
      setError(errors.join("\n"));
    }
    return validFiles;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      const validFiles = validateFiles(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...validFiles]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validFiles = validateFiles(e.target.files);
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    for (const file of files) {
      formData.append(file.name, file);
    }

    try {
      const response = await fetch(
        "https://ls8sw8cgwwkwws04scoow8c8.13.76.121.152.sslip.io/compare-multiple",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Comparison failed");
      }

      const data: Root = await response.json();
      setResults(data);
      setProgress(100);
    } catch (error) {
      setError("Failed to compare documents. Please try again.");
      console.error("Comparison failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const sortedComparisons =
    results?.comparisons.slice().sort((a, b) => {
      const diff = b.result.similarity_index - a.result.similarity_index;
      return sortOrder === "asc" ? -diff : diff;
    }) || [];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Plgrzr Checker
          </CardTitle>
          <CardDescription>
            Upload multiple PDF files to check for similarities and potential
            plagiarism
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-border"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2">Drop PDFs here or click to upload</p>
              <p className="text-sm text-muted-foreground">
                Maximum file size: 10MB
              </p>
            </label>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Selected Files ({files.length})</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                  >
                    <span className="text-sm text-muted-foreground">
                      {file.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
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
                Analyzing Documents...
              </>
            ) : (
              "Compare PDFs"
            )}
          </Button>

          {loading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-center text-muted-foreground">
                Analyzing document similarities...
              </p>
            </div>
          )}

          {results && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-xl">Comparison Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Documents</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={toggleSortOrder}
                          className="h-8 flex items-center gap-1"
                        >
                          Similarity
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedComparisons.map((comparison) => {
                      const similarityPercent = (
                        comparison.result.similarity_index * 100
                      ).toFixed(1);
                      const isHighSimilarity =
                        comparison.result.similarity_index >=
                        SIMILARITY_THRESHOLD;

                      return (
                        <TableRow key={comparison.file1 + comparison.file2}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {isHighSimilarity && (
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                              )}
                              <span>{comparison.file1}</span>
                              <span className="text-muted-foreground">vs</span>
                              <span>{comparison.file2}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-bold ${
                                isHighSimilarity ? "text-destructive" : ""
                              }`}
                            >
                              {similarityPercent}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </SheetTrigger>
                              <SheetContent
                                side="right"
                                className="w-full min-w-[90vw] h-screen p-6 overflow-y-auto border-l"
                              >
                                <SheetHeader>
                                  <SheetTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Document Comparison Results
                                  </SheetTitle>
                                </SheetHeader>
                                <ComparisonDetails comparison={comparison} />
                              </SheetContent>
                            </Sheet>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFComparer;
