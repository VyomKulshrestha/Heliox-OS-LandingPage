# A safe software pipeline—not a live brain-control claim.

> Heliox includes a bounded neural-input research path for BrainFlow synthetic signals, recorded EEG playback, and the public PhysioNet EEGBCI motor-imagery dataset.

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

## Verify the implementation

- [Machine-readable capability catalog](https://www.helioxos.dev/capabilities.json)
- [Evidence and limitations](https://www.helioxos.dev/proof.md)
- [Source repository](https://github.com/VyomKulshrestha/Heliox-OS)

Heliox OS is MIT-licensed. [Download the current release](https://github.com/VyomKulshrestha/Heliox-OS/releases).
