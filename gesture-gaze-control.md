# On-device visual intent, bounded by safety.

> The camera pipeline derives hand gestures and a coarse gaze region on the user's device. It combines temporal and spatial checks to reduce face-driven and single-frame false positives.

Status: **Implemented; calibration required**

## What Heliox does

- Tracks hand landmarks and uses depth-aware geometry for supported gesture labels.
- Requires stable evidence across frames before emitting consequential gesture events.
- Rejects candidates without a valid hand and applies face-exclusion checks.
- Publishes only a coarse gaze label and confidence; camera frames are not sent to Heliox's daemon.

## Typical flow

1. Start the camera and confirm the preview.
2. Allow the model to acquire a hand or face.
3. Hold a supported gesture long enough for temporal confirmation.
4. Use a non-camera control to stop or approve when required.

## Safety boundary

A gesture may respond to an already-pending approval only under the configured policy. Gaze remains a fusion signal and cannot authorize an action by itself.

## Known limitations

Lighting, camera placement, occlusion, skin visibility, motion blur, and model availability affect accuracy. Software tests do not prove performance on a user's physical camera.

## Verify the implementation

- [Machine-readable capability catalog](https://www.helioxos.dev/capabilities.json)
- [Evidence and limitations](https://www.helioxos.dev/proof.md)
- [Source repository](https://github.com/VyomKulshrestha/Heliox-OS)

Heliox OS is MIT-licensed. [Download the current release](https://github.com/VyomKulshrestha/Heliox-OS/releases).
