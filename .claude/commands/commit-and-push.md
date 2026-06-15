Commit all current changes and push to the remote repository.

1. Run `git status` and `git diff --staged` to review what will be committed.
2. Stage all modified and new files relevant to the current work (avoid staging secrets or large binaries).
3. Write a concise commit message summarizing the changes.
4. Commit the changes.
5. Push to the current remote tracking branch. If no upstream is set, push with `-u origin <current-branch>`.
