# Speak a task. Keep control.

> Heliox can turn opt-in voice input into the same typed, permission-checked action flow used by the desktop app—so speaking does not bypass planning, approvals, or verification.

Status: **Implemented; hardware-dependent**

## What Heliox does

- Recognizes a wake phrase or an explicit listening session and converts speech to a command.
- Routes the command through Heliox's declared action registry and specialist agents.
- Keeps listening after a completed command when continuous mode remains enabled.
- Can speak status, interruption prompts, and results through the configured local or operating-system voice.
- Runs Pocket or Kokoro inference in a bounded worker process that is reused for a short speech burst, then exits so heavy model libraries are not retained by the control daemon.

## Typical flow

1. Enable voice and select a microphone.
2. Say the wake phrase and a concrete request.
3. Review any required approval.
4. Hear and read the verified result.

## Safety boundary

Voice is an input channel, not extra authority. A spoken request cannot elevate permissions, accept its own approval, or remove a deterministic safety warning.

## Known limitations

Recognition quality and response time depend on the microphone, room, platform speech service, selected model, and requested action. Neural voice cold-start time depends on the host; the worker temporarily uses model memory while active. Physical capture and audible output must be tested on each device.

## Verify the implementation

- [Machine-readable capability catalog](https://www.helioxos.dev/capabilities.json)
- [Evidence and limitations](https://www.helioxos.dev/proof.md)
- [Source repository](https://github.com/VyomKulshrestha/Heliox-OS)

Heliox OS is MIT-licensed. [Download the current release](https://github.com/VyomKulshrestha/Heliox-OS/releases).
