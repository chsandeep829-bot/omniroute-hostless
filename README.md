# OmniRoute — Hostless Deployment

This repository wraps the published OmniRoute Docker image for Dockerfile-based hosting.

## SQLite permission fix

The Dockerfile now switches to root during image build, creates /app/data, assigns it to the image's node user, and switches back to node for runtime. This addresses SQLite errors such as:

    EACCES: permission denied, open '/app/data/storage.sqlite.tmp-...'

### Important: rebuild the image

A host that deploys this repository using its Dockerfile must rebuild/redeploy the image after this commit. Merely restarting the old public image will not apply the change.

If your host mounts a persistent volume at /app/data, the mounted volume can override the directory ownership baked into the image. In that case, configure the volume to be writable by UID/GID 1000 (the node user), or use the hosting provider's supported volume-permission setting. Do not delete or recreate the volume to troubleshoot permissions.

## Deploy

1. Connect this repository, chsandeep829-bot/omniroute-hostless, to a Dockerfile-based hosting service.
2. Ensure the service builds from the repository's Dockerfile, rather than continuing to use diegosouzapw/omniroute:latest directly.
3. Trigger a new build/redeploy.
4. Check logs for any remaining sqljsAdapter save failed or EACCES messages.
5. Verify that a harmless setting persists after an application restart.

## Notes

- This repository reuses the upstream prebuilt OmniRoute application; it does not build OmniRoute from source.
- The upstream image, startup command, required environment variables, and listening port are not independently verified by this repository.
- Do not commit API keys, passwords, or other secrets. Set secrets through the hosting provider's environment-variable settings.