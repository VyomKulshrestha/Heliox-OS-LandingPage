# Synthetic and recorded EEG research—not validated live brain control.

> Heliox OS includes a bounded neural-intent research path for BrainFlow synthetic signals, recorded EEG playback, and the public PhysioNet EEGBCI motor-imagery dataset.

Status: **Software-verified; no live EEG claim**

## What Heliox does

- Streams BrainFlow synthetic-board data through the neural ingestion contract.
- Replays recorded EEG so the classifier and action proposal pipeline can be tested deterministically.
- Benchmarks motor-imagery decoding with public EEGBCI data and an MNE CSP/LDA workflow.
- Maps a recognized neural intent only to a bounded proposal that still needs independent arming and confirmation.

## Typical flow

1. Select synthetic or recorded input.
2. Run preprocessing and a reproducible classifier benchmark.
3. Map the result to a bounded Heliox intent proposal.
4. Use a separate non-neural control to arm or confirm any action.

## Safety boundary

A neural signal cannot self-arm, widen permissions, or directly control a dangerous physical action. The research path is not a medical device and has no clinical claim.

## Known limitations

Synthetic and recorded-data results are not evidence of live EEG accuracy, individual calibration, brain control, medical utility, or clinical validation. Physical hardware work remains unverified until tested with participants and an actual device.

## Neural intent FAQ

### Can Heliox OS be controlled by the brain today?

Not as a validated live product. Heliox OS currently provides software-verified BrainFlow synthetic-board and recorded PhysioNet EEGBCI paths. A real headset, participant calibration, and human validation are still required before any live brain-control claim.

### What neural or EEG evidence exists for Heliox OS?

The public implementation covers synthetic signal ingestion, recorded EEG replay, and a reproducible motor-imagery CSP/LDA benchmark. These tests validate the software pipeline, not live EEG accuracy or medical utility.

### Can a neural signal approve a dangerous Heliox action?

No. Neural input can only propose a bounded intent. Independent non-neural arming, Heliox policy checks, and any required user approval remain mandatory.

## Verify the implementation

- [Machine-readable capability catalog](https://www.helioxos.dev/capabilities.json)
- [Evidence and limitations](https://www.helioxos.dev/proof.md)
- [Source repository](https://github.com/VyomKulshrestha/Heliox-OS)

Heliox OS is MIT-licensed. [Download the current release](https://github.com/VyomKulshrestha/Heliox-OS/releases).
