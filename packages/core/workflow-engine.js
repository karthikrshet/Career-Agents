// packages/core/workflow-engine.js
// Career Agents Stateful Workflow Engine with Checkpointing & Branching

class WorkflowEngine {
  constructor() {
    this.workflows = new Map();
    this.activeSessions = new Map();
    this.checkpoints = new Map(); // sessionId -> array of snapshot checkpoints
  }

  registerWorkflow(id, steps, options = {}) {
    this.workflows.set(id, {
      id,
      name: options.name || id,
      description: options.description || "",
      steps, // Array of step keys: ['resume', 'ats', 'github', 'linkedin', 'interview', 'reports']
      branchRules: options.branchRules || {},
    });
  }

  startSession(workflowId, userId, initialData = {}) {
    const wf = this.workflows.get(workflowId);
    if (!wf) throw new Error(`Workflow '${workflowId}' not registered.`);

    const session = {
      sessionId: `${workflowId}-${userId}-${Date.now()}`,
      workflowId,
      userId,
      currentStep: 0,
      history: [],
      data: { ...initialData },
      metrics: {
        readinessScore: 0,
        atsMatchRate: 0,
        interviewConfidence: 0,
      },
      status: "active",
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.activeSessions.set(session.sessionId, session);
    this.saveCheckpoint(session.sessionId, "session_start");
    return session;
  }

  getSession(sessionId) {
    return this.activeSessions.get(sessionId);
  }

  saveCheckpoint(sessionId, label = "checkpoint") {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    if (!this.checkpoints.has(sessionId)) {
      this.checkpoints.set(sessionId, []);
    }

    const snapshot = {
      label,
      stepIndex: session.currentStep,
      data: JSON.parse(JSON.stringify(session.data)),
      metrics: JSON.parse(JSON.stringify(session.metrics)),
      timestamp: new Date().toISOString(),
    };

    this.checkpoints.get(sessionId).push(snapshot);
    return snapshot;
  }

  rollbackToCheckpoint(sessionId, checkpointIndex) {
    const session = this.activeSessions.get(sessionId);
    const snaps = this.checkpoints.get(sessionId);
    if (!session || !snaps || !snaps[checkpointIndex]) {
      throw new Error(`Checkpoint not found for session ${sessionId}`);
    }

    const targetSnap = snaps[checkpointIndex];
    session.currentStep = targetSnap.stepIndex;
    session.data = JSON.parse(JSON.stringify(targetSnap.data));
    session.metrics = JSON.parse(JSON.stringify(targetSnap.metrics));
    session.updatedAt = new Date().toISOString();

    this.activeSessions.set(sessionId, session);
    return session;
  }

  transitionStep(sessionId, data = {}, metricUpdates = {}) {
    const session = this.activeSessions.get(sessionId);
    if (!session) throw new Error(`Session '${sessionId}' not found.`);
    if (session.status !== "active") return session;

    const wf = this.workflows.get(session.workflowId);
    const currentStepName = wf.steps[session.currentStep];

    session.history.push({
      stepIndex: session.currentStep,
      stepName: currentStepName,
      timestamp: new Date().toISOString(),
      snapshot: { ...data },
    });

    session.data = { ...session.data, ...data };
    session.metrics = { ...session.metrics, ...metricUpdates };

    // Dynamic branch check
    if (wf.branchRules && wf.branchRules[currentStepName]) {
      const nextStep = wf.branchRules[currentStepName](session);
      if (nextStep !== undefined) {
        const foundIdx = wf.steps.indexOf(nextStep);
        if (foundIdx !== -1) {
          session.currentStep = foundIdx;
        }
      }
    } else {
      if (session.currentStep < wf.steps.length - 1) {
        session.currentStep++;
      } else {
        session.status = "completed";
      }
    }

    session.updatedAt = new Date().toISOString();
    this.saveCheckpoint(sessionId, `after_${currentStepName}`);
    this.activeSessions.set(sessionId, session);
    return session;
  }

  listWorkflows() {
    return Array.from(this.workflows.values());
  }
}

const globalWorkflowEngine = new WorkflowEngine();

// Register standard career track workflow
globalWorkflowEngine.registerWorkflow("core-career-track", [
  "resume_studio",
  "ats_check",
  "resume_improve",
  "github_audit",
  "linkedin_optimize",
  "job_match",
  "mock_interview",
  "job_tracker",
  "generate_report",
], {
  name: "End-to-End Career Accelerator Track",
  description: "Comprehensive 9-stage career optimization pipeline from ATS resume tuning to offer tracking.",
});

// Register FAANG Onsite Sprint
globalWorkflowEngine.registerWorkflow("faang-onsite-sprint", [
  "jd_deep_parse",
  "system_design_studio",
  "bar_raiser_deliberation",
  "algorithmic_crunch",
  "offer_negotiation_prep",
], {
  name: "FAANG Onsite Sprint",
  description: "Targeted high-intensity track for Tier-1 Tech Onsite loops & Bar Raiser calibration.",
});

// Register Rapid Job Automation Pipeline
globalWorkflowEngine.registerWorkflow("rapid-job-pipeline", [
  "ats_board_scan",
  "jd_match_matrix",
  "tailored_cv_gen",
  "cover_letter_gen",
  "recruiter_outreach",
  "kanban_sync",
], {
  name: "Rapid Autonomous Job Pipeline",
  description: "High-throughput pipeline that scans boards, tailors materials, and updates application trackers.",
});

export default globalWorkflowEngine;
export { WorkflowEngine };
