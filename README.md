# OmniRoute — Hostless Deployment

This repository supports two distinct deployment paths:

- **Dockerfile-based hosting:** builds the upstream OmniRoute image with the SQLite directory permission fix.
- **Cloudflare Containers:** deploys the Worker wrapper with Wrangler. Run `npm run deploy` from a Node.js 22+ environment after configuring Cloudflare access.

## Fixes included

- Adds an `npm run build` compatibility script for platforms that automatically invoke that command. It intentionally does not compile OmniRoute; the application is supplied by the upstream Docker image.
- The Dockerfile creates `/app/data`, assigns it to the image's `node` user, and returns to the unprivileged user at runtime to help prevent SQLite permission errors.

## Dockerfile-based hosting

1. Connect `chsandeep829-bot/omniroute-hostless` to your Dockerfile-based hosting service.
2. Set the Dockerfile path to the repository-root `Dockerfile`.
3. Ensure the service builds this repository's Dockerfile, rather than deploying `diegosouzapw/omniroute:latest` directly or using an unrelated generated Dockerfile.
4. Trigger a new build/redeploy.
5. Check logs for any remaining `sqljsAdapter save failed` or `EACCES` messages.
6. Verify that a harmless setting persists after an application restart.

### Persistent-volume permissions

If the host mounts a persistent volume at `/app/data`, the mounted volume can override the directory ownership baked into the image. Configure the volume to be writable by UID/GID 1000 (the `node` user), or use the hosting provider's supported volume-permission setting. Do not delete or recreate the volume to troubleshoot permissions.

## Cloudflare Containers deployment

1. Use a Node.js 22+ environment.
2. Install dependencies with `npm install`.
3. Configure Wrangler authentication and the Cloudflare resources required by the Containers/Durable Objects setup.
4. Deploy with `npm run deploy`.

The root Dockerfile is for Dockerfile-based hosting. It is not the build process for the Cloudflare Worker wrapper.

## Important limitations

- The `build` script only prevents an automatic `npm run build` step from failing with “Missing script: build”; it does not fix a hosting platform that ignores this repository's Dockerfile.
- The container wrapper is configured with `sleepAfter = "10m"`, so it may sleep after inactivity. This is not a guarantee of uninterrupted 24/7 runtime.
- This repository reuses the upstream prebuilt OmniRoute application; it does not build OmniRoute from source.
- The upstream image's startup command, required environment variables, and listening port are not independently verified by this repository.
- Never commit API keys, passwords, or other secrets. Set secrets through the hosting provider's environment-variable settings.
