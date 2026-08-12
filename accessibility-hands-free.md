# More ways to operate a computer.

> Voice, gesture, gaze-region signals, keyboard shortcuts, and ordinary text can be combined so a user is not forced into a single input method.

Status: **Research-grade accessibility support**

## What Heliox does

- Supports voice commands for common desktop and browser workflows.
- Provides opt-in gesture cursor control and coarse gaze-region input.
- Preserves keyboard, pointer, and in-app stop controls when sensor features are enabled.
- Allows features to coexist without one sensor silently disabling another.

## Typical flow

1. Choose only the input modes that help.
2. Calibrate device-dependent gesture or gaze behavior.
3. Keep a non-sensor stop method available.
4. Review results in the visible activity history.

## Safety boundary

Camera and microphone features are off until enabled, and their signals do not grant action authority. Emergency stop and approval controls remain separate from learned signals.

## Known limitations

Heliox is not certified assistive technology and should not be the only control path for safety-critical use. Individual accessibility needs and hardware accuracy require human evaluation.

## Verify the implementation

- [Machine-readable capability catalog](https://www.helioxos.dev/capabilities.json)
- [Evidence and limitations](https://www.helioxos.dev/proof.md)
- [Source repository](https://github.com/VyomKulshrestha/Heliox-OS)

Heliox OS is MIT-licensed. [Download the current release](https://github.com/VyomKulshrestha/Heliox-OS/releases).
