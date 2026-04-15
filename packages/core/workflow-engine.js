// packages/core/workflow-engine.js
// Career Agents Stateful Workflow Engine

class WorkflowEngine {
  constructor() {
    this.workflows = new Map();
    this.activeSessions = new Map();
  }

  registerWorkflow(id, steps) {
    this.workflows.set(id, {
      id,
      steps, // Array of step keys: ['resume', 'ats', 'github', 'linkedin', 'interview', 'reports']
    });
  }

  startSession(workflowId, userId) {
    const wf = this.workflows.get(workflowId);
    if (!wf) throw new Error(`Workflow '${workflowId}' not registered.`);

    const session = {
      sessionId: `${workflowId}-${userId}-${Date.now()}`,
      workflowId,
      userId,
      currentStep: 0,
      history: [],
      data: {},
      status: "active",
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.activeSessions.set(session.sessionId, session);
    return session;
  }

  getSession(sessionId) {
    return this.activeSessions.get(sessionId);
  }

  transitionStep(sessionId, data) {
    const session = this.activeSessions.get(sessionId);
    if (!session) throw new Error(`Session '${sessionId}' not found.`);
    if (session.status !== "active") return session;

    const wf = this.workflows.get(session.workflowId);
    session.history.push({
      stepIndex: session.currentStep,
      stepName: wf.steps[session.currentStep],
      timestamp: new Date().toISOString(),
    });

    session.data = { ...session.data, ...data };
    
    if (session.currentStep < wf.steps.length - 1) {
      session.currentStep++;
    } else {
      session.status = "completed";
    }

    session.updatedAt = new Date().toISOString();
    this.activeSessions.set(sessionId, session);
    return session;
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
  "generate_report"
]);

export default globalWorkflowEngine;
export { WorkflowEngine };
