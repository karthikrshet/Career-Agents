# Interview Preparation Example: Behavioral STAR Stories

This guide shows how to draft structured behavioral answers that survive rigorous cultural loops.

---

## 🛠️ The STAR Story Template

Every mock story should contain:
- **Situation**: Set the context (company name, role, scope, complexity).
- **Task**: Define the core challenge, goal, or conflict.
- **Action**: Explain the exact steps **you** took, tools/languages used, and decisions made.
- **Result**: Quantified outcomes, adoption stats, learning takeaways.

---

## 💬 Sample Mock Transcripts

```text
Interviewer: Tell me about a time you had a technical disagreement with a peer.
Candidate: (STAR Structured Response)
- Situation: While building a real-time messaging dispatcher at Uber, a peer proposed using MongoDB, while I advocated for Apache Cassandra to handle high write concurrency.
- Task: We had a tight deadline and needed to decide on a schema architecture that could scale to 100,000 requests/sec.
- Action: I drafted a comparative performance prototype benchmarking latency and query throughput. I presented this data to the team to show Cassandra's write latency stayed below 5ms under concurrent load.
- Result: We deployed Cassandra, achieving a 99.99% service uptime during peak rides hours.
```

---

## 📊 Run Mock Interview Session
Launch the mock interviewer locally to practice behavioral loops:
```bash
node scripts/cli.js run behavioral-interview-specialist
```
Practice answering situational and conflict prompts.
