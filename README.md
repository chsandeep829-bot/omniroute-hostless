# OmniRoute — Hostless Deployment

This repository supports two separate deployment paths:

- **Dockerfile hosting:** runs the pinned upstream OmniRoute Docker image with persistent-data and volume-permission handling.
- **Cloudflare Containers:** deploys the separate Worker wrapper with Wrangler. It is not the Dockerfile hosting path.

## Dockerfile deployment

1. Connect `chsandeep829-bot/omniroute-hostless` to Hostless.
2. Set the build system to **Docker** and Dockerfile path to `Dockerfile`.
3. Expose container port `20128`.
4. Keep exactly one replica because OmniRoute uses a local SQLite database.
5. Attach the existing persistent disk at either `/app/data` or `/data`. The image supports both paths.
6. Push a commit or trigger a redeploy.

The Dockerfile pins `diegosouzapw/omniroute:3.8.54`. The startup wrapper repairs ownership of the mounted data directory, then runs the upstream permission guard and OmniRoute as UID 1000 (`node`). It does not run the app as root.

## Runtime settings

- `PORT=20128`
- `HOSTNAME=0.0.0.0`
- `DATA_DIR=/app/data`
- `OMNIROUTE_MEMORY_MB=768`
- `REQUIRE_API_KEY=true`

Complete the first-run dashboard setup and create a password/API key before using the public endpoint. Do not commit provider keys or passwords to GitHub.

## Hostless resource profile

`hostless.yaml` requests one replica, up to 0.5 vCPU and 1 GiB RAM. This is the full published shared free allowance, not a guaranteed per-app allocation; other resources in the same Hostless account share it. The 8 GiB build-memory ceiling is for image builds, which Hostless documents as unbilled.

## Verify after deployment

- Container is healthy on port `20128`.
- Logs contain no `EACCES`, `sqljsAdapter save failed`, or SQLite write errors.
- Add a harmless setting, restart the app, and confirm the setting remains.
- Confirm the existing disk is still attached; do not delete or recreate it while troubleshooting.

## Cloudflare Containers

The Cloudflare Worker wrapper is separate from Dockerfile hosting. It uses `src/index.ts` and Wrangler. Its container has an idle-sleep setting, so it is not the always-on Hostless Docker deployment.
