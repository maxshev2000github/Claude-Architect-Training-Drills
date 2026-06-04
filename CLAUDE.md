# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Claude Architect Training Drills** — a hands-on practice repo for preparing for the **Claude Certified Architect – Foundations (CCA-F)** exam. Code here exists to build and reinforce exam-relevant skills; treat it as a learning sandbox, not production software.

## Goal

Pass the CCA-F exam (60 scenario-based MCQs, 120 min, pass at 720/1000). Skills are practiced by building small artifacts across the five exam domains.

## Exam domains (weights)

1. Agentic Architecture & Orchestration — 27% (multi-agent design, orchestrator-worker/hub-and-spoke, agentic loops, termination conditions, subagent coordination, reliability patterns)
2. Claude Code Configuration & Workflows — 20% (CLAUDE.md hierarchy & precedence, custom slash commands, CI/CD, persistent context)
3. Prompt Engineering & Structured Output — 20% (JSON schemas, few-shot, XML tags, prefilling, data extraction)
4. Tool Design & MCP Integration — 18% (MCP servers/clients, tool boundaries, stdio vs SSE/HTTP, auth, reliable tool schemas)
5. Context Management & Reliability — 15% (context window management, compaction, escalation, human-in-the-loop)

## Daily workflow

A scheduled tutor task (`cca-f-daily-tutor`, runs 8am daily) drives study:

- Generates a fresh mixed Q&A set saved to the Cowork outputs folder (`CCA-F_Daily_<date>.md`).
- Reviews this repo against CCA-F best practices and assigns one ~15-min hands-on drill.
- Appends each drill to `DRILLS.md` in this repo (newest first, with a dated heading).

`DRILLS.md` is the running log of assigned practice. When working in this repo, check the latest drill at the top of `DRILLS.md` for the current task and its acceptance criteria.

## Conventions

- Organize practice work by domain — suggested top-level folders as they get created: `agents/`, `mcp/`, `prompting/`, `claude-code/`, `context-reliability/`.
- Keep each drill self-contained and small; favor clarity over completeness.
- Update this file as the repo evolves (new folders, tooling, run instructions).
