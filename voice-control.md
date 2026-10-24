# Speak a task. Keep control.

> Heliox can turn opt-in voice input into the same typed, permission-checked action flow used by the desktop app—so speaking does not bypass planning, approvals, or verification.

Status: **Implemented; hardware-dependent**

## What Heliox does

- Recognizes a wake phrase or an explicit listening session and converts speech to a command.
- Routes the command through Heliox's declared action registry and specialist agents.
- Keeps listening after a completed command when continuous mode remains enabled.
- Can speak status, interruption prompts, and results through the configured local or operating-system voice.
- Runs Pocket or Kokoro inference in a bounded worker process that is reused for a short speech burst, then exits so heavy model libraries are not retained by the control daemon.
- Handles built-in commands such as undo, reminders, timers, notes, and focus right away, in code and without planning.

## Built-in voice commands

Since v0.15.0, these work by voice or in chat as written. Press Ctrl+K or say "what can I say?" to open the command palette with every built-in command; a test runs each palette example through the real handlers.

- Undo: "undo that", "undo the last two tasks". Opens the undo preview; every undo still needs your click.
- Your day: "what did you do today", "what was I working on this morning", "where did you put my report". Answered in code from task receipts, the opt-in activity timeline, and undo history on this computer.
- Reminders and timers: "remind me tomorrow at 9 am to send the report", "set a timer for 10 minutes". Kept across restarts and spoken when due.
- Notes: "note that the plumber comes Tuesday", "read my notes". Short notes kept on this computer.
- Focus: "focus for 45 minutes", "start a pomodoro", "focus every weekday from 9 to 12". Holds reminders and the daily brief; approvals, results, errors, and answers still come through.
- Setups: "save this as my coding setup", "open my coding setup". Remembers which apps are open; opening a setup is an ordinary request with normal approvals.
- Routines and shortcuts: "do that every day at 9", "do that again", "when I say start work, open VS Code and Slack". A routine may use only the actions the original task used, and you confirm it on screen; a repeat asks for fresh approvals.
- Settings: "turn on the activity timeline", "send me a daily brief at 7 pm". Everyday settings only; security, gateway, approval, and model settings never change by voice.
- Help: "what can I say". Opens the command palette, which Ctrl+K also opens.

## Typical flow

1. Enable voice and select a microphone.
2. Say the wake phrase and a concrete request.
3. Review any required approval.
4. Hear and read the verified result.

## Safety boundary

Voice is an input channel, not extra authority. A spoken request cannot elevate permissions, accept its own approval, or remove a deterministic safety warning. Saying "undo that" only opens the undo preview, which still needs your click.

## Known limitations

Recognition quality and response time depend on the microphone, room, platform speech service, selected model, and requested action. Neural voice cold-start time depends on the host; the worker temporarily uses model memory while active. Physical capture and audible output must be tested on each device.

## Verify the implementation

- [Machine-readable capability catalog](https://www.helioxos.dev/capabilities.json)
- [Evidence and limitations](https://www.helioxos.dev/proof.md)
- [Source repository](https://github.com/VyomKulshrestha/Heliox-OS)

Heliox OS is MIT-licensed. [Download the current release](https://github.com/VyomKulshrestha/Heliox-OS/releases).
