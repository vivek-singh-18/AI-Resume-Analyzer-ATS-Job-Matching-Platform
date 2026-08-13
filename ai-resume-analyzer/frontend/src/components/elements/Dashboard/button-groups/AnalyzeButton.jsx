import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { analyzeDoc, getDoc } from "@/utils/document";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AnalyzeButton({ doc, onStatusUpdate }) {
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const startPolling = async () => {
    intervalRef.current = setInterval(async () => {
      try {
        const updatedDoc = await getDoc(doc);

        // Ensure dates are properly formatted
        if (updatedDoc?.analysis?.processedAt) {
          updatedDoc.analysis.processedAt = new Date(
            updatedDoc.analysis.processedAt
          ).toISOString();
        }
        if (updatedDoc?.createdAt) {
          updatedDoc.createdAt = new Date(updatedDoc.createdAt).toISOString();
        }
        if (updatedDoc?.updatedAt) {
          updatedDoc.updatedAt = new Date(updatedDoc.updatedAt).toISOString();
        }

        onStatusUpdate(updatedDoc);

        if (
          updatedDoc.analysis?.status === "done" ||
          updatedDoc.analysis?.status === "failed"
        ) {
          clearInterval(intervalRef.current);
          if (updatedDoc.analysis?.status === "done") {
            toast.success("Analysis completed!");
          } else {
            toast.error("Analysis failed");
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Polling failed:", err);
      }
    }, 3000);
  };

  const handleAnalyze = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await analyzeDoc(doc);
      toast.success(res?.message || "Analysis started");
      startPolling();
    } catch (err) {
      toast.error("Failed to start analysis");
      console.error(err);
      setLoading(false);
    }
  };

  const isProcessing =
    doc.analysis?.status === "processing" || doc.analysis?.status === "done";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="sm"
          onClick={handleAnalyze}
          disabled={loading || isProcessing}
          className={`flex items-center gap-2 ${
            loading || isProcessing
              ? "bg-blue-300 cursor-not-allowed hover:bg-blue-300"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span className="hidden md:inline">Analyze</span>
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {loading
          ? "Triggering analysis..."
          : isProcessing
          ? doc.analysis?.status === "processing"
            ? "Analysis in progress"
            : "Analysis done"
          : "Click to analyze"}
      </TooltipContent>
    </Tooltip>
  );
}
