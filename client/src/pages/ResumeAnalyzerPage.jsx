import { useEffect, useState } from "react";
import { FileText, Loader2, Sparkles, Target } from "lucide-react";

import AnalysisSection from "../components/AnalysisSection";
import Navbar from "../components/Navbar";
import ScoreGauge from "../components/ScoreGauge";
import SkillMatchChart from "../components/SkillMatchChart";
import UploadCard from "../components/UploadCard";
import { analyzeResume, prewarmBackend } from "../services/api";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

function ResumeAnalyzerPage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analyzedFileName, setAnalyzedFileName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing resume...");

  useEffect(() => {
    prewarmBackend();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setLoadingMessage("Analyzing resume...");

    try {
      if (!resumeFile) throw new Error("Please upload a PDF resume first.");

      const result = await analyzeResume({
        resumeFile,
        jobDescription,
        onStatusChange: setLoadingMessage,
      });
      setAnalysis(result.analysis);
      setAnalyzedFileName(result.fileName || resumeFile.name);
    } catch (err) {
      setAnalysis(null);
      setAnalyzedFileName("");
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const score = analysis?.matchScore ?? 0;

  const skillMatchData =
    analysis?.skillMatch?.length > 0
      ? analysis.skillMatch
      : (analysis?.atsKeywords || []).slice(0, 6).map((skill, index) => ({
          skill,
          score: Math.max(35, 78 - index * 8),
        }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <Badge variant="outline">Production UI upgrade</Badge>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Upload. Analyze. Visualize your resume match.
            </h1>

            <p className="text-lg text-gray-600">
              AI-powered resume analysis with ATS keywords, match score, and
              actionable improvements.
            </p>
          </div>

          {/* SMALL INFO CARDS */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white shadow-sm border">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Input</p>
                <p className="text-lg font-semibold">PDF only</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Output</p>
                <p className="text-lg font-semibold">Smart dashboard</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          {/* LEFT SIDE */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <UploadCard
              file={resumeFile}
              onFileSelect={setResumeFile}
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
            />

            <Card className="shadow-md">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
                    <Target className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold">Ready to analyze</p>
                    <p className="text-sm text-gray-500">
                      Upload resume + optional job description.
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {loadingMessage}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Analyze Resume
                    </>
                  )}
                </Button>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </form>

          {/* RIGHT SIDE */}
          <section className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* RESULT CARD */}
              <Card className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white shadow-lg">
                <CardHeader>
                  <CardTitle>
                    {analyzedFileName || "No resume analyzed yet"}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {analysis
                      ? "AI insights & keywords"
                      : "Upload resume to see results"}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {analysis ? (
                    <>
                      <p className="text-sm mb-4">{analysis.summary}</p>

                      <div className="flex flex-wrap gap-2">
                        {analysis.atsKeywords?.map((k) => (
                          <Badge key={k}>{k}</Badge>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-300">
                      Waiting for analysis...
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* SCORE */}
              {isLoading ? (
                <Card className="flex items-center justify-center h-[300px]">
                  <div className="flex flex-col items-center gap-3 text-center px-4">
                    <Loader2 className="animate-spin h-8 w-8" />
                    <p className="text-sm font-medium">{loadingMessage}</p>
                    <p className="text-xs text-gray-500">
                      Server wake-up on free tier can take 30-60 seconds.
                    </p>
                  </div>
                </Card>
              ) : (
                <ScoreGauge score={score} />
              )}
            </div>

            {/* LOWER SECTION */}
            {analysis ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <SkillMatchChart data={skillMatchData} />

                <AnalysisSection title="Strengths" items={analysis.strengths} />
                <AnalysisSection title="Gaps" items={analysis.gaps} />
                <AnalysisSection
                  title="Suggestions"
                  items={analysis.suggestions}
                />
              </div>
            ) : (
              <Card className="border-dashed text-center p-10">
                <FileText className="mx-auto mb-4 h-10 w-10 text-gray-400" />
                <p className="text-gray-600">
                  Upload a resume to see dashboard
                </p>
              </Card>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default ResumeAnalyzerPage;