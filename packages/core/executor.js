import fs from 'fs';
import path from 'path';
import readline from 'readline';

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  purple: '\x1b[35m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m'
};

export async function executeAgent(agentData, agentFilePath) {
  const agentName = agentData.name;
  const systemPrompt = fs.readFileSync(agentFilePath, 'utf8');
  const vibe = agentData.vibe;

  console.log(`\n${c.purple}=== Initializing Agent Runtime: ${agentName} ===${c.reset}`);
  console.log(`${c.gray}Vibe: ${vibe}${c.reset}`);

  // Detect API Keys
  const geminiKey = process.env.GEMINI_API_KEY;
  const claudeKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  let mode = 'simulated';
  let provider = '';
  let apiKey = '';

  if (claudeKey) {
    mode = 'live';
    provider = 'anthropic';
    apiKey = claudeKey;
    console.log(`${c.green}[Live Mode] Connected via Anthropic API (Claude)${c.reset}`);
  } else if (geminiKey) {
    mode = 'live';
    provider = 'gemini';
    apiKey = geminiKey;
    console.log(`${c.green}[Live Mode] Connected via Google Gemini API${c.reset}`);
  } else if (openaiKey) {
    mode = 'live';
    provider = 'openai';
    apiKey = openaiKey;
    console.log(`${c.green}[Live Mode] Connected via OpenAI API (ChatGPT)${c.reset}`);
  } else {
    console.log(`${c.yellow}[Simulated Sandbox Mode] No API keys detected.${c.reset}`);
    console.log(`${c.gray}Configure GEMINI_API_KEY or ANTHROPIC_API_KEY in your env to enable live chat execution.${c.reset}`);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const conversationHistory = [];

  console.log(`\n${c.cyan}Agent matches loaded. Type 'exit' to end session.${c.reset}`);
  console.log(`${c.bold}${agentName}:${c.reset} Hello! I am the ${agentName}. How can I assist you with your career milestones today?`);

  const promptUser = () => {
    rl.question(`\n${c.bold}You:${c.reset} `, async (input) => {
      const trimmed = input.trim();
      if (trimmed.toLowerCase() === 'exit') {
        console.log(`\n${c.purple}Agent execution finished.${c.reset}`);
        rl.close();
        return;
      }

      if (!trimmed) {
        promptUser();
        return;
      }

      conversationHistory.push({ role: 'user', content: trimmed });

      if (mode === 'live') {
        console.log(`${c.gray}... thinking ...${c.reset}`);
        try {
          let agentReply = '';
          if (provider === 'anthropic') {
            const formattedHistory = conversationHistory.map(m => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.content
            }));
            const res = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1500,
                system: systemPrompt,
                messages: formattedHistory
              })
            });
            if (!res.ok) {
              const errBody = await res.json().catch(() => ({}));
              throw new Error(`Anthropic API returned status ${res.status}: ${JSON.stringify(errBody)}`);
            }
            const data = await res.json();
            agentReply = data.content?.[0]?.text || 'No response text received.';
          } else if (provider === 'gemini') {
            // Build full thread payload
            const contents = [
              { role: 'user', parts: [{ text: `SYSTEM INSTRUCTIONS:\n${systemPrompt}` }] },
              { role: 'model', parts: [{ text: `Acknowledged system rules. I am active as the ${agentName}.` }] }
            ];
            conversationHistory.forEach(m => {
              contents.push({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
              });
            });

            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents })
            });
            if (!res.ok) {
              const errBody = await res.json().catch(() => ({}));
              throw new Error(`Gemini API returned status ${res.status}: ${JSON.stringify(errBody)}`);
            }
            const data = await res.json();
            agentReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response text received.';
          } else if (provider === 'openai') {
            const messages = [
              { role: 'system', content: systemPrompt },
              ...conversationHistory.map(m => ({ role: m.role, content: m.content }))
            ];
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages
              })
            });
            if (!res.ok) {
              const errBody = await res.json().catch(() => ({}));
              throw new Error(`OpenAI API returned status ${res.status}: ${JSON.stringify(errBody)}`);
            }
            const data = await res.json();
            agentReply = data.choices?.[0]?.message?.content || 'No response text received.';
          }

          console.log(`\n${c.bold}${agentName}:${c.reset} ${agentReply}`);
          conversationHistory.push({ role: 'assistant', content: agentReply });
        } catch (e) {
          console.error(`${c.red}API request failed: ${e.message}${c.reset}`);
          console.log(`${c.yellow}[Fallback] Switched to simulated feedback loop.${c.reset}`);
          mode = 'simulated';
          handleSimulatedResponse(trimmed, agentName, vibe);
        }
      } else {
        handleSimulatedResponse(trimmed, agentName, vibe);
      }
      promptUser();
    });
  };

  const handleSimulatedResponse = (userInput, agentName, vibe) => {
    const responses = [
      `I have audited your inputs. Let's align this directly with our critical metrics. Here is your initial action items checklist:\n  [ ] Structure details alignment\n  [ ] Performance metric integration\n  [ ] Context optimization check`,
      `Understood. Focusing on the ${vibe} tone, I recommend addressing the following structural guidelines first. Tell me more about your target milestones so we can draft a customized scorecard.`,
      `Analyzing details... Please provide your current project summary or resume block so I can write action items mapped directly to this phase.`
    ];
    // Deterministic match based on length
    const idx = userInput.length % responses.length;
    const reply = responses[idx];
    console.log(`\n${c.bold}${agentName} (Simulated):${c.reset} ${reply}`);
    conversationHistory.push({ role: 'assistant', content: reply });
  };

  promptUser();
}
