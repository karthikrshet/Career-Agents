import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Activates the Career-Agents VS Code Extension.
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Career-Agents VS Code Extension is now active.');

  // Command: Search AI Agent Catalog
  const searchCommand = vscode.commands.registerCommand('career-agents.search', async () => {
    const config = vscode.workspace.getConfiguration('careerAgents');
    const apiUrl = config.get<string>('apiUrl') || 'https://career-agents.dev';

    try {
      const response = await fetch(`${apiUrl}/api/v1/agents`);
      if (!response.ok) {
        throw new Error(`Failed to load catalog: ${response.statusText}`);
      }
      const agents = await response.json() as any[];

      const items = agents.map(a => ({
        label: `${a.emoji || '🤖'} ${a.name}`,
        description: a.description,
        detail: `Vibe: ${a.vibe} | Difficulty: ${a.difficulty}`,
        slug: a.slug
      }));

      const selection = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a Career AI Agent to view details'
      });

      if (selection) {
        const detailResponse = await fetch(`${apiUrl}/api/v1/agents/${selection.slug}`);
        if (!detailResponse.ok) {
          throw new Error('Failed to retrieve agent details.');
        }
        const agentFull = await detailResponse.json() as any;

        // Open text document with system prompt preview
        const document = await vscode.workspace.openTextDocument({
          content: `# ${agentFull.name} (${agentFull.vibe})\n\n> ${agentFull.description}\n\n## System Instructions\n\n\`\`\`markdown\n${agentFull.systemPrompt}\n\`\`\``,
          language: 'markdown'
        });
        await vscode.window.showTextDocument(document);
      }
    } catch (error: any) {
      vscode.window.showErrorMessage(`Career-Agents Error: ${error.message}`);
    }
  });

  // Command: Inject Agent Prompt into Workspace Rules
  const injectCommand = vscode.commands.registerCommand('career-agents.inject', async () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('Open a workspace folder first to inject rules.');
      return;
    }

    const config = vscode.workspace.getConfiguration('careerAgents');
    const apiUrl = config.get<string>('apiUrl') || 'https://career-agents.dev';

    try {
      const response = await fetch(`${apiUrl}/api/v1/agents`);
      if (!response.ok) {
        throw new Error('Failed to load agent catalog.');
      }
      const agents = await response.json() as any[];

      const items = agents.map(a => ({
        label: `${a.emoji || '🤖'} ${a.name}`,
        description: a.description,
        slug: a.slug
      }));

      const selection = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select Agent to inject into workspace instructions'
      });

      if (selection) {
        const detailResponse = await fetch(`${apiUrl}/api/v1/agents/${selection.slug}`);
        const agentFull = await detailResponse.json() as any;

        const rulesOptions = [
          { label: '.cursorrules (Cursor)', file: '.cursorrules' },
          { label: '.windsurfrules (Windsurf)', file: '.windsurfrules' },
          { label: '.claudecode.instructions.md (Claude Code)', file: '.claudecode.instructions.md' },
          { label: '.aider.instructions.md (Aider)', file: '.aider.instructions.md' },
          { label: '.github/copilot-instructions.md (Copilot)', file: '.github/copilot-instructions.md' }
        ];

        const target = await vscode.window.showQuickPick(rulesOptions, {
          placeHolder: 'Select destination rules file'
        });

        if (target) {
          const rootPath = workspaceFolders[0].uri.fsPath;
          const targetPath = path.join(rootPath, target.file);

          const dir = path.dirname(targetPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          let fileContent = '';
          if (target.file === '.cursorrules' || target.file === '.windsurfrules') {
            fileContent = JSON.stringify({
              instruction: agentFull.systemPrompt,
              rules: ["Maintain clean architectural boundaries", "Verify system constraints"]
            }, null, 2);
          } else {
            fileContent = `# Career Agent: ${agentFull.name}\n\n${agentFull.systemPrompt}`;
          }

          fs.writeFileSync(targetPath, fileContent, 'utf8');
          vscode.window.showInformationMessage(`Successfully injected ${agentFull.name} rules into ${target.file}!`);
        }
      }
    } catch (error: any) {
      vscode.window.showErrorMessage(`Career-Agents Error: ${error.message}`);
    }
  });

  context.subscriptions.push(searchCommand, injectCommand);
}

/**
 * Deactivates the extension.
 */
export function deactivate() {}
