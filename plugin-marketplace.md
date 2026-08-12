# Extend Heliox without hiding trust decisions.

> Plugins add actions and integrations through declared manifests. The public marketplace is repository-governed so a submission can be reviewed, tested, and distributed without rebuilding the desktop application for every listing change.

Status: **Implemented with moderated catalog**

## What Heliox does

- Lists approved marketplace packages from a versioned public catalog.
- Verifies package files against approved SHA-256 metadata during installation.
- Shows requested capabilities before the plugin becomes active.
- Allows contributors to propose marketplace entries through a reviewed pull request.

## Typical flow

1. Author a plugin and its manifest.
2. Submit the package metadata through the marketplace contribution path.
3. Pass automated validation and maintainer review.
4. Users install the approved, integrity-checked package from the app.

## Safety boundary

Marketplace approval does not make arbitrary plugin code harmless. Plugins remain constrained by declared capabilities and Heliox's runtime policy, and sensitive integrations still require user credentials.

## Known limitations

Platform dependencies, external API changes, revoked credentials, and plugin-specific bugs can prevent a listed integration from working. Availability is not a guarantee of every third-party service.

## Verify the implementation

- [Machine-readable capability catalog](https://www.helioxos.dev/capabilities.json)
- [Evidence and limitations](https://www.helioxos.dev/proof.md)
- [Source repository](https://github.com/VyomKulshrestha/Heliox-OS)

Heliox OS is MIT-licensed. [Download the current release](https://github.com/VyomKulshrestha/Heliox-OS/releases).
