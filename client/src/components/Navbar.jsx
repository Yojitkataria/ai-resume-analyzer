import { Github, Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/60 bg-background/80 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Resume Analyzer
            </p>
            <p className="text-xs text-muted-foreground">
              AI-powered PDF screening dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://github.com/Yojitkataria/ai-resume-analyzer"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border bg-white px-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-secondary dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
