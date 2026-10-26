# Speak a task. Keep control.

> Heliox can turn opt-in voice input into the same typed, permission-checked action flow used by the desktop app—so speaking does not bypass planning, approvals, or verification.

Status: **Implemented; hardware-dependent**

## What Heliox does

- Recognizes a wake phrase or an explicit listening session and converts speech to a command.
- Routes the command through Heliox's declared action registry and specialist agents.
- Keeps listening after a completed command when continuous mode remains enabled.
- Can speak status, interruption prompts, and results through the configured local or operating-system voice.
- Runs Pocket or Kokoro inference in a bounded worker process that is reused for a short speech burst, then exits so heavy model libraries are not retained by the control daemon.
- Handles built-in commands such as undo, reminders, timers, notes, focus, to-dos, watchers, habits, and quick answers right away, in code and without planning.

## Built-in voice commands

These work by voice or in chat as written. Undo, reminders, notes, focus, setups, and routines arrived in v0.15.0; v0.16.0 adds the to-do list, watchers, repeating and app reminders, good morning and good night, habits, quick answers, file and computer questions, clipboard history, and snippets. Press Ctrl+K or say "what can I say?" to open the command palette with every built-in command. In the 26 October 2026 benchmark all 91 palette examples were handled in code with zero model calls and zero actions executed; that measures the control path, not speech recognition or voice latency.

- Start and end the day: "good morning", "what's my day look like", "good night". The date, today's reminders, your list, habit streaks to keep, and a nearly full drive or low battery; at night, focus time, finished to-dos, and tomorrow's first reminder.
- Undo: "undo that", "undo the last two tasks". Opens the undo preview; every undo still needs your click.
- Your day: "what did you do today", "what was I working on this morning", "where did you put my report". Answered in code from task receipts, the opt-in activity timeline, and undo history on this computer.
- Reminders and timers: "remind me tomorrow at 9 am to send the report", "set a timer for 10 minutes", "remind me every hour to stand up", "remind me to submit my timesheet when I open Outlook", "stop reminding me to stand up". Kept across restarts and spoken when due. Interval reminders skip 10 PM to 7 AM; app reminders wait for that app to come to the front.
- Notes: "note that the plumber comes Tuesday", "read my notes". Short notes kept on this computer.
- To-do list: "add call the bank to my list", "what's on my list", "mark call the bank as done", "clear finished items". Kept on this computer; open items show in the Today tab and the daily brief.
- Focus: "focus for 45 minutes", "start a pomodoro", "focus every weekday from 9 to 12", "during focus, tell me if I open YouTube", "how long did I focus this week". Holds reminders and the daily brief; approvals, results, errors, and answers still come through. A focus heads-up comes once per session and blocks nothing.
- Setups: "save this as my coding setup", "open my coding setup". Remembers which apps are open; opening a setup is an ordinary request with normal approvals.
- Routines and shortcuts: "do that every day at 9", "do that again", "when I say start work, open VS Code and Slack". A routine may use only the actions the original task used, and you confirm it on screen; a repeat asks for fresh approvals.
- Tell me when: "tell me when Chrome closes", "let me know when my download finishes", "tell me when my battery is full", "tell me when my computer calms down". Watches until it happens and tells you once. Watchers only look, never change anything, and give up after a day.
- Quick answers: "what's 15 percent of 240", "convert 5 miles to km", "how many days until Christmas", "what time is it in Tokyo", "how long until 5 pm". Worked out exactly on this computer; arithmetic is parsed, never run as code.
- Your files and this computer: "what did I download today", "where is my budget spreadsheet", "why is my computer slow", "how much disk space do I have". File questions read folder listings and file dates in your own folders and open nothing; computer questions read processor, memory, and disks. Closing anything still asks first.
- Clipboard history and snippets: "what did I copy earlier", "copy the second one back", "save that as my signature", "copy my signature". Clipboard history is off until you turn it on and stays in memory only. Nothing is kept from password managers or private windows, and text that looks like a password or key is never kept.
- Habits: "log a workout", "I drank a glass of water", "how many workouts this week", "what's my workout streak". Kept on this computer. "I did …" only logs habits you already track.
- Helpers: "generate a password", "flip a coin", "roll a die", "start a stopwatch". A generated password goes to the clipboard only and is never spoken, shown, or kept.
- Settings: "turn on the activity timeline", "turn on clipboard history", "send me a daily brief at 7 pm". Everyday settings only; security, gateway, approval, and model settings never change by voice.
- Help: "what can I say". Opens the command palette, which Ctrl+K also opens.

## Typical flow

1. Enable voice and select a microphone.
2. Say the wake phrase and a concrete request.
3. Review any required approval.
4. Hear and read the verified result.

## Safety boundary

Voice is an input channel, not extra authority. A spoken request cannot elevate permissions, accept its own approval, or remove a deterministic safety warning. Saying "undo that" only opens the undo preview, which still needs your click. Watchers, the computer health check, and the file finder only read; closing an app or opening a file is an ordinary request with the usual approvals.

## Known limitations

Recognition quality and response time depend on the microphone, room, platform speech service, selected model, and requested action. Neural voice cold-start time depends on the host; the worker temporarily uses model memory while active. Physical capture and audible output must be tested on each device.

## Verify the implementation

- [Machine-readable capability catalog](https://www.helioxos.dev/capabilities.json)
- [Evidence and limitations](https://www.helioxos.dev/proof.md)
- [Source repository](https://github.com/VyomKulshrestha/Heliox-OS)

Heliox OS is MIT-licensed. [Download the current release](https://github.com/VyomKulshrestha/Heliox-OS/releases).
