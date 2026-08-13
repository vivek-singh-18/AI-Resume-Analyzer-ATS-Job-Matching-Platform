import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Target,
  FileText,
  Briefcase,
  View,
} from "lucide-react";
import { toast } from "sonner";
import { getDoc } from "@/utils/document";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function ViewButton({ doc }) {
  const [loading, setLoading] = useState(false);
  const [docData, setData] = useState(null);
  const [isOpen, setIsOpen] = useState(false); 

  const handleView = async () => {
    try {
      setLoading(true);
      const res = await getDoc(doc);

      if (res?.analysis?.summary) {
        res.analysis.summary = res.analysis.summary.replace(/\s+/g, " ");
      }

      if (res?.analysis) {
        setData(res);
        setIsOpen(true); 
        toast.success(res?.message || "Data retrieved successfully");
      } else {
        toast.error("No Data Available.");
        setIsOpen(false);
      }
    } catch (err) {
      toast.error("Failed to get data");
      console.error(err);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasResumeAnalysis =
    docData?.analysis?.resumeScore !== undefined &&
    docData?.analysis?.resumeScore !== null;

  return (
    <>
      <Button
        size="sm"
        className="bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2"
        onClick={handleView}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Viewing...</span>
          </>
        ) : (
          <>
            <View className="h-4 w-4" />
            <span className="hidden md:inline">View</span>
          </>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[85%] max-h-[90vh] overflow-hidden p-0">
          <div className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
            <DialogTitle className="text-2xl font-bold mb-2">
              {docData?.originalName || "Document Preview"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {docData?.jobDescription
                ? "Resume Analysis Against Job Description"
                : "Document Analysis & Insights"}
            </p>
            {docData?.analysis?.processedAt && (
              <p className="text-xs text-muted-foreground mt-2">
                Analyzed: {formatDate(docData.analysis.processedAt)}
              </p>
            )}
          </div>

          <div
            className="p-6 overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 140px)" }}
          >
            {!docData ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading content...</p>
                </div>
              </div>
            ) : (
              <Tabs
                defaultValue={hasResumeAnalysis ? "resume-score" : "summary"}
                className="w-full"
              >
                <TabsList className="mb-6 w-full justify-start flex-wrap h-auto gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                  {docData.analysis && (
                    <>
                      {hasResumeAnalysis && (
                        <>
                          {docData?.jobDescription && (
                            <TabsTrigger
                              value="job-description"
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Briefcase className="h-4 w-4" />
                              Job Description
                            </TabsTrigger>
                          )}
                          <TabsTrigger
                            value="resume-score"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <TrendingUp className="h-4 w-4" />
                            Resume Score
                          </TabsTrigger>
                          <TabsTrigger
                            value="matching-skills"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Matching Skills
                          </TabsTrigger>
                          <TabsTrigger
                            value="skill-gaps"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <AlertCircle className="h-4 w-4" />
                            Skill Gaps
                          </TabsTrigger>
                          <TabsTrigger
                            value="recommendations"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Target className="h-4 w-4" />
                            Recommendations
                          </TabsTrigger>
                        </>
                      )}
                      <TabsTrigger value="summary" className="cursor-pointer">
                        Summary
                      </TabsTrigger>
                      <TabsTrigger value="keyPoints" className="cursor-pointer">
                        Key Points
                      </TabsTrigger>
                      <TabsTrigger value="sentiment" className="cursor-pointer">
                        Sentiment
                      </TabsTrigger>
                      <TabsTrigger value="keywords" className="cursor-pointer">
                        Keywords
                      </TabsTrigger>
                      <TabsTrigger value="questions" className="cursor-pointer">
                        Questions
                      </TabsTrigger>
                    </>
                  )}
                </TabsList>

                {docData.analysis && (
                  <div className="space-y-6">
                    {hasResumeAnalysis && (
                      <>
                        {docData?.jobDescription && (
                          <TabsContent value="job-description" className="mt-0">
                            <div className="border rounded-lg p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
                              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                Job Description
                              </h3>
                              <div className="bg-white dark:bg-slate-800 p-4 rounded border border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                  {docData.jobDescription}
                                </p>
                              </div>
                            </div>
                          </TabsContent>
                        )}
                        <TabsContent value="resume-score" className="mt-0">
                          <div className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              Resume Match Score
                            </h3>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <div className="relative w-32 h-32">
                                  <svg className="w-32 h-32 transform -rotate-90">
                                    <circle
                                      cx="64"
                                      cy="64"
                                      r="56"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      fill="none"
                                      className="text-slate-200 dark:text-slate-700"
                                    />
                                    <circle
                                      cx="64"
                                      cy="64"
                                      r="56"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      fill="none"
                                      strokeDasharray={`${
                                        (docData.analysis.resumeScore / 100) *
                                        351.85
                                      } 351.85`}
                                      className="text-blue-600 dark:text-blue-400 transition-all"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        {docData.analysis.resumeScore}%
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Match
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-muted-foreground mb-2">
                                    This resume has a{" "}
                                    <strong className="text-blue-600 dark:text-blue-400">
                                      {docData.analysis.resumeScore}%
                                    </strong>{" "}
                                    match against the provided job description.
                                  </p>
                                  <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-800 rounded border border-blue-200 dark:border-blue-700">
                                    <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                                      {docData.analysis.resumeScore >= 80
                                        ? "✓ Excellent match for this position"
                                        : docData.analysis.resumeScore >= 60
                                        ? "✓ Good match with some development areas"
                                        : "⚠ Consider addressing skill gaps"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="matching-skills" className="mt-0">
                          <div className="border rounded-lg p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                              Matching Skills (
                              {docData.analysis.matchingSkills?.length || 0})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {docData.analysis.matchingSkills &&
                              docData.analysis.matchingSkills.length > 0 ? (
                                docData.analysis.matchingSkills.map(
                                  (skill, i) => (
                                    <Badge
                                      key={i}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      ✓ {skill}
                                    </Badge>
                                  )
                                )
                              ) : (
                                <p className="text-sm text-muted-foreground italic">
                                  No matching skills identified
                                </p>
                              )}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="skill-gaps" className="mt-0">
                          <div className="border rounded-lg p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                              Skill Gaps (
                              {docData.analysis.skillGaps?.length || 0})
                            </h3>
                            <div className="space-y-2">
                              {docData.analysis.skillGaps &&
                              docData.analysis.skillGaps.length > 0 ? (
                                docData.analysis.skillGaps.map((gap, i) => (
                                  <div
                                    key={i}
                                    className="flex gap-2 items-start bg-white dark:bg-slate-800 p-3 rounded border border-orange-200 dark:border-orange-700"
                                  >
                                    <span className="text-orange-600 dark:text-orange-400 font-bold mt-0.5">
                                      •
                                    </span>
                                    <p className="text-sm text-muted-foreground">
                                      {gap}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground italic">
                                  No skill gaps identified - you match all
                                  requirements!
                                </p>
                              )}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="recommendations" className="mt-0">
                          <div className="border rounded-lg p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                              <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              Recommendations (
                              {docData.analysis.recommendations?.length || 0})
                            </h3>
                            <div className="space-y-3">
                              {docData.analysis.recommendations &&
                              docData.analysis.recommendations.length > 0 ? (
                                docData.analysis.recommendations.map(
                                  (rec, i) => (
                                    <div
                                      key={i}
                                      className="flex gap-3 items-start bg-white dark:bg-slate-800 p-3 rounded border border-purple-200 dark:border-purple-700"
                                    >
                                      <div className="bg-purple-600 dark:bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                                        {i + 1}
                                      </div>
                                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                                        {rec}
                                      </p>
                                    </div>
                                  )
                                )
                              ) : (
                                <p className="text-sm text-muted-foreground italic">
                                  No recommendations at this time
                                </p>
                              )}
                            </div>
                          </div>
                        </TabsContent>
                      </>
                    )}

                    <TabsContent value="summary" className="mt-0">
                      <div className="border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-3">
                          Executive Summary
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {docData.analysis.summary}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="keyPoints" className="mt-0">
                      <div className="border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Key Takeaways
                        </h3>
                        <div className="space-y-3">
                          {docData.analysis.keyPoints?.map((kp, i) => (
                            <div key={i} className="flex gap-3 items-start">
                              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 font-medium text-xs">
                                {i + 1}
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                                {kp}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="sentiment" className="mt-0">
                      <div className="border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Sentiment Analysis
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
                            <p className="text-xs text-muted-foreground mb-1">
                              Sentiment
                            </p>
                            <p className="text-xl font-semibold capitalize">
                              {docData.analysis.sentiment?.label}
                            </p>
                          </div>
                          <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
                            <p className="text-xs text-muted-foreground mb-1">
                              Confidence Score
                            </p>
                            <p className="text-xl font-semibold">
                              {(
                                docData.analysis.sentiment?.score * 100
                              ).toFixed(0)}
                              %
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="keywords" className="mt-0">
                      <div className="border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Extracted Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {docData.analysis.keywords?.map((keyword, i) => (
                            <Badge key={i} variant="secondary">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="questions" className="mt-0">
                      <div className="border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Suggested Questions
                        </h3>
                        <div className="space-y-3">
                          {docData.analysis.questions?.map((q, i) => (
                            <div
                              key={i}
                              className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800"
                            >
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                <span className="font-semibold text-foreground mr-2">
                                  Q{i + 1}:
                                </span>
                                {q}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                )}
              </Tabs>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
