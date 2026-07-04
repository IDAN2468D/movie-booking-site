---
name: Agent Stack Framework
description: Run the agent using the 5 layers of the Agent Stack (Loop, Plan, PRD, Spec, Markdown) for autonomous long-running tasks.
---

# Agent Stack Execution Skill

When tasked with a complex feature or long-running objective, execute the task strictly using the Agent Stack methodology.

## Execution Steps:

1. **State Restoration & Research (Markdown & MCPs)**
   - Before starting, read the central Markdown file (e.g. `latest.md` or a specific feature markdown) to restore memory and context.
   - **Crucial:** Always query and search through your available MCP servers (e.g., `StitchMCP`, `notebooklm`, `mcp-obsidian`, `mongodb-mcp-server`, `github-mcp-server`, etc.) for any relevant documents, past solutions, or references related to the task before planning.

2. **Definition (PRD & Spec)**
   - Write a short PRD detailing the Product, User, and Core requirements.
   - Write a Technical Spec defining the inputs, outputs, architecture, and edge cases.
   - Ensure the user explicitly reviews these definitions before moving on.

3. **Planning (Plan)**
   - Draft a step-by-step implementation plan based on the PRD and Spec.
   - **PAUSE** execution and ask the user for explicit approval. Do not write any code until the Plan is approved.

4. **Execution (Loop)**
   - Write the code according to the approved Plan and Spec.
   - Run automated tests immediately after making changes.
   - If tests fail, autonomously self-heal by reading errors, fixing the code, and re-running the tests in a continuous loop until they pass.
   - **Crucial:** Do not ask for user intervention during the fix-test loop unless absolutely stuck. The loop must complete on its own.

5. **State Update (Markdown)**
   - Once the loop completes successfully, document the changes, current state, and any lessons learned back into the central Markdown memory file.
