# Career Agents Readiness Scoring Regression Test Report
Generated: 2026-08-14T22:01:16.614Z

## Test Results Summary
- **Total Tests**: 12
- **Passed**: 12
- **Failed (Known Bugs to Fix)**: 0

## Detailed Test Results
### Test A: Cross-tool readiness consistency (career_assessment vs career_gap_analysis vs career_action_plan)
- **Status**: ✅ PASS
- **Details**: career_assessment=54, career_gap_analysis=54, career_action_plan=54

### Test B: Adding verified relevant target skills increases/maintains readiness
- **Status**: ✅ PASS
- **Details**: Baseline (Profile A)=0, Enhanced (Profile B)=54

### Test C: Removing relevant target skills decreases/maintains readiness
- **Status**: ✅ PASS
- **Details**: Strong Profile=74, Weaker Profile=0

### Test D: Zero matching skills must not receive artificial Math.max(40, ...) floor
- **Status**: ✅ PASS
- **Details**: scoreZero=0

### Test E: Missing evidence must not fabricate fallback strengths (e.g. Software Engineering / Problem Solving)
- **Status**: ✅ PASS
- **Details**: Strengths returned=[], Confidence=0

### Test F: career_action_plan readiness estimate varies by profile evidence (not hard-coded 85%)
- **Status**: ✅ PASS
- **Details**: Weak Candidate ready_estimate=0%, Strong Candidate ready_estimate=23%

### Test G: Readiness scores remain within bounded range [0, 100] or null
- **Status**: ✅ PASS
- **Details**: Empty Profile: null, Fully Matching: 74, Partial Matching: 27

### Test H: Score-summary proxy without skills evidence marked provisional/insufficient with low confidence
- **Status**: ✅ PASS
- **Details**: Score=null, Confidence=20, Strengths=[]

### Test I: Company requirements sourced from authoritative registry (companies/google.json) without hard-coded COMPANY_STACKS override
- **Status**: ✅ PASS
- **Details**: Authoritative Skills in companies/google.json=["Data Structures & Algorithms (graphs, dynamic programming, trees)","System Design & Scalability","Googliness (cultural fit, collaboration, ambiguity navigation)","Space & Time Complexity Analysis"], hardcoded COMPANY_STACKS present in server.js=false

### Test J: Candidate readiness reflects target company/role requirements (Apple iOS vs Google Distributed Systems)
- **Status**: ✅ PASS
- **Details**: Apple Readiness=24, Google Readiness=0

### Test K: Readiness calculation is pure and deterministic across repeated executions
- **Status**: ✅ PASS
- **Details**: Run 1=40, Run 2=40, Run 3=40

### Section 4 Contract: Readiness evaluation exposes canonical schema: { readinessScore, components, confidence, dataCoverage, missingEvidence }
- **Status**: ✅ PASS
- **Details**: readinessScore=true, components=true, confidence=true, dataCoverage=true, missingEvidence=true
