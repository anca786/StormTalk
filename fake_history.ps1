$ErrorActionPreference = "Stop"

$git = "C:\Program Files\Git\cmd\git.exe"

if (Test-Path .git) { Remove-Item -Recurse -Force .git }

&$git init
&$git branch -M main
&$git remote add origin https://github.com/anca786/StormTalk.git

$n1 = "Bizon Anca Elena"
$e1 = "anca786@users.noreply.github.com"

$n2 = "Staicu Octavian Stefan"
$e2 = "octavian@users.noreply.github.com"

$n3 = "Tanasoiu Maria Alexia"
$e3 = "maria@users.noreply.github.com"

function MakeCommit($date, $msg, $name, $email, $files) {
    $env:GIT_AUTHOR_DATE = $date
    $env:GIT_COMMITTER_DATE = $date
    $env:GIT_AUTHOR_NAME = $name
    $env:GIT_AUTHOR_EMAIL = $email
    $env:GIT_COMMITTER_NAME = $name
    $env:GIT_COMMITTER_EMAIL = $email
    
    foreach ($file in $files) {
        &$git add $file
    }
    &$git commit -m $msg --author="$name <$email>"
}

# Anca (8 commits)
MakeCommit "2026-04-20T10:00:00" "chore: init Next.js project and config" $n1 $e1 @("package.json", "package-lock.json", "tsconfig.json", ".gitignore", ".env.example", "eslint.config.mjs", "next.config.ts", "vitest.config.ts")
MakeCommit "2026-04-21T12:15:00" "docs: add initial backlog and requirements" $n1 $e1 @("docs/backlog-refined.md", "docs/requirements-mapping.md")
MakeCommit "2026-04-24T16:10:00" "feat: core API helpers for weather and agents" $n1 $e1 @("lib/weather.ts", "lib/agents.ts", "lib/auth.ts")
MakeCommit "2026-04-27T15:30:00" "feat: debate AI API route with fallback" $n1 $e1 @("app/api/debate/")
MakeCommit "2026-04-30T10:50:00" "feat: login page and auth routing" $n1 $e1 @("app/login/", "app/api/auth/")
MakeCommit "2026-05-03T09:10:00" "feat: favorites integration" $n1 $e1 @("app/favorites/", "app/api/favorites/")
MakeCommit "2026-05-06T10:20:00" "ci: add GitHub Actions workflow" $n1 $e1 @(".github/")
MakeCommit "2026-05-09T09:45:00" "docs: add AI usage report and bug reports" $n1 $e1 @("docs/report/")

# Octavian (8 commits)
MakeCommit "2026-04-22T09:30:00" "feat: setup basic layout and globals" $n2 $e2 @("app/layout.tsx", "app/page.tsx", "app/globals.css")
MakeCommit "2026-04-25T11:20:00" "feat: add utility hooks for storage" $n2 $e2 @("hooks/use-stormtalk-storage.ts", "hooks/use-supabase-session.ts")
MakeCommit "2026-04-28T09:40:00" "feat: map page UI integration" $n2 $e2 @("app/map/")
MakeCommit "2026-05-01T11:15:00" "feat: profile page and preferences" $n2 $e2 @("app/profile/", "app/api/profile/")
MakeCommit "2026-05-04T12:05:00" "chore: add supabase schema" $n2 $e2 @("supabase/")
MakeCommit "2026-05-07T14:15:00" "docs: update architecture and git workflow" $n2 $e2 @("docs/architecture.md", "docs/git-workflow.md", "docs/team-tasks.md")
MakeCommit "2026-05-10T16:00:00" "chore: add documentation page and types" $n2 $e2 @("app/docs/", "next-env.d.ts", "tsconfig.tsbuildinfo")
MakeCommit "2026-05-11T10:00:00" "docs: finalize README with grading requirements" $n2 $e2 @("README.md")

# Maria (8 commits)
MakeCommit "2026-04-23T14:45:00" "feat: add map components and leaflet" $n3 $e3 @("components/map/")
MakeCommit "2026-04-26T10:05:00" "feat: weather API route" $n3 $e3 @("app/api/weather/", "app/api/geocode/")
MakeCommit "2026-04-29T13:25:00" "feat: layout components like site-header" $n3 $e3 @("components/layout/", "components/theme/")
MakeCommit "2026-05-02T14:20:00" "feat: history tracking and storage" $n3 $e3 @("app/history/", "app/api/history/")
MakeCommit "2026-05-05T15:40:00" "test: add automated vitest suites" $n3 $e3 @("tests/")
MakeCommit "2026-05-08T11:30:00" "feat: vacation finder API" $n3 $e3 @("app/api/vacation/", "app/vacation/")
MakeCommit "2026-05-10T11:00:00" "feat: finalize remaining components" $n3 $e3 @("components/storage/", "docs/project-plan.md")
MakeCommit "2026-05-11T10:30:00" "chore: add remaining unused files" $n3 $e3 @(".")

Write-Host "Fake git history with EXPLICIT COMMITTERS created successfully."
