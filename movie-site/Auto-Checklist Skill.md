---
tags:
  - skill
type: skill
status: active
---
# 📋 Auto-Checklist Manager

## Purpose
This skill ensures that `WorkPlan.md` (or any equivalent roadmap checklist) is automatically updated whenever a feature, task, or phase is completed in the project.

## Trigger
- The Agent finishes implementing a requested feature, bugfix, or task.
- The User confirms a feature is complete.
- The Agent runs tests and verifies a phase is done.

## Execution Steps
1. **Identify the Completed Task**: Determine exactly which item from the `WorkPlan.md` was just implemented.
2. **Read the File**: View `movie-site/WorkPlan.md` to find the exact line containing the uncompleted task (indicated by `- [ ]`).
3. **Update the File**: Use a file-editing tool (`replace_file_content` or `multi_replace_file_content`) to change the `- [ ]` to `- [x]` for the completed task.
4. **Report**: Inform the user that the checklist has been automatically updated in accordance with this skill.

## Rules
- ALWAYS update the checklist proactively—do not wait for the user to explicitly ask if a feature was clearly completed.
- Make sure to match the exact text of the feature in the checklist.
- If a task is partially done, you may use `- [/]` if the standard allows, or keep it as `- [ ]` and inform the user.
