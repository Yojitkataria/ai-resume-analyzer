import { useState } from "react";
import { FileText, Loader2, Sparkles, Target } from "lucide-react";

import AnalysisSection from "../components/AnalysisSection";
import Navbar from "../components/Navbar";
import ScoreGauge from "../components/ScoreGauge";
import SkillMatchChart from "../components/SkillMatchChart";
import UploadCard from "../components/UploadCard";
import { analyzeResume } from "../services/api";
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

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!resumeFile) {
        throw new Error("Please upload a PDF resume first.");
      }

      const result = await analyzeResume({ resumeFile, jobDescription });
      setAnalysis(result.analysis);
      setAnalyzedFileName(result.fileName || resumeFile.name);
    } catch (requestError) {
      setAnalysis(null);
      setAnalyzedFileName("");
      setError(requestError.message);
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
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <Badge variant="outline">Production UI upgrade</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Upload. Analyze. Visualize your resume match.
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Premium AI resume analysis for PDF resumes with role matching,
              charts, ATS keywords, and action-focused recommendations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:w-auto">
            <Card className="min-w-[150px] border-none bg-white/70 shadow-none">
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Input
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  PDF only
                </p>
              </CardContent>
            </Card>
            <Card className="min-w-[150px] border-none bg-white/70 shadow-none">
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Output
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  Smart dashboard
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[390px_minmax(0,1fr)] xl:grid-cols-[420px_minmax(0,1fr)]">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <UploadCard
              file={resumeFile}
              onFileSelect={setResumeFile}
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
            />

            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Ready to analyze
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Upload a resume PDF and optionally paste a job description
                      for richer skill matching.
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing your resume...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Analyze Resume
                    </>
                  )}
                </Button>

                {error ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </form>

          <section className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <Card className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white">
                <CardHeader>
                  <Badge className="w-fit bg-white/10 text-white hover:bg-white/10">
                    Results Dashboard
                  </Badge>
                  <CardTitle className="text-2xl text-white">
                    {analyzedFileName || "No resume analyzed yet"}
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    {analysis
                      ? "Visual signals, ATS keywords, and tailored next-step guidance."
                      : "Your analysis dashboard will appear here after upload."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analysis ? (
                    <div className="space-y-4">
                      <p className="text-sm leading-6 text-slate-200">
                        {analysis.summary}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(analysis.atsKeywords || []).length > 0 ? (
                          analysis.atsKeywords.map((keyword) => (
                            <Badge
                              key={keyword}
                              className="bg-white/10 text-white hover:bg-white/10"
                            >
                              {keyword}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-slate-300">
                            ATS keywords will show here after analysis.
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
                      Upload a PDF on the left and hit Analyze to unlock the
                      dashboard.
                    </div>
                  )}
                </CardContent>
              </Card>

              {isLoading ? (
                <Card className="flex min-h-[360px] items-center justify-center">
                  <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-foreground">
                        Analyzing your resume...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Parsing your PDF, comparing skills, and generating
                        recommendations.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <ScoreGauge score={score} />
              )}
            </div>

            {analysis ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <SkillMatchChart data={skillMatchData} />

                <Card>
                  <CardHeader>
                    <CardTitle>ATS Keyword Coverage</CardTitle>
                    <CardDescription>
                      Keywords identified by the AI for stronger ATS alignment.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {(analysis.atsKeywords || []).map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="outline"
                        className="rounded-full px-3 py-1.5"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>

                <AnalysisSection
                  title="Strengths"
                  items={analysis.strengths ?? []}
                  emptyMessage="No strengths were identified."
                />

                <AnalysisSection
                  title="Gaps"
                  items={analysis.gaps ?? []}
                  emptyMessage="No major gaps were identified."
                />

                <div className="lg:col-span-2">
                  <AnalysisSection
                    title="Suggestions"
                    items={analysis.suggestions ?? []}
                    emptyMessage="No suggestions were returned."
                  />
                </div>
              </div>
            ) : (
              <Card className="border-dashed bg-white/70">
                <CardContent className="flex min-h-[340px] flex-col items-center justify-center gap-4 p-8 text-center">
                  <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-foreground">
                      Dashboard waiting for your first PDF
                    </p>
                    <p className="max-w-md text-sm text-muted-foreground">
                      Once you upload a resume, you&apos;ll see a speedometer
                      match score, skill graph, keyword coverage, and structured
                      strengths/gaps/suggestions cards.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default ResumeAnalyzerPage;
