// apps/web/src/hooks/use-career-memory.ts
import { useStore } from "@/lib/store";
import { UserProfile } from "@/types";

export function useCareerMemory() {
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const metrics = useStore((s) => s.metrics);
  const resumeAnalysis = useStore((s) => s.resumeAnalysis);
  const githubAnalysis = useStore((s) => s.GitHubAnalysis);
  const linkedinAnalysis = useStore((s) => s.linkedinAnalysis);
  const interviewSessions = useStore((s) => s.interviewSessions);
  const jobApplications = useStore((s) => s.jobApplications);

  const updateProfileField = (fields: Partial<UserProfile & {
    targetSalary?: string;
    targetLocation?: string;
    preferredCompanies?: string[];
    weakAreas?: string[];
    strongAreas?: string[];
    certifications?: string[];
  }>) => {
    if (!profile) return;
    setProfile({
      ...profile,
      ...fields,
      updatedAt: new Date().toISOString(),
    } as any);
  };

  const getMemoryPayload = () => {
    return {
      profile: profile || {},
      metrics: metrics || {},
      resumeAnalysis,
      githubAnalysis,
      linkedinAnalysis,
      interviewSessions,
      jobApplications,
    };
  };

  const clearMemory = () => {
    localStorage.removeItem("career-agents-store");
    window.location.reload();
  };

  return {
    profile,
    metrics,
    resumeAnalysis,
    githubAnalysis,
    linkedinAnalysis,
    interviewSessions,
    jobApplications,
    updateProfileField,
    getMemoryPayload,
    clearMemory,
  };
}
