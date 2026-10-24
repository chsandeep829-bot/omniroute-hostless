# OmniRoute — Hostless Deployment

This repository contains a minimal Dockerfile wrapper intended to deploy the OmniRoute Docker image on a Docker-compatible hosting platform such as Hostless.

## Repository contents

- `Dockerfile` — uses the published image `diegosouzapw/omniroute:latest`.

## Deploy

1. Sign in to your hosting provider and connect your GitHub account.
2. Select this repository: `chsandeep829-bot/omniroute-hostless`.
3. Choose Dockerfile-based deployment and deploy.
4. Check the provider's logs and configure any required environment variables or port settings according to the image's documentation.

## Important notes

- This repository reuses a prebuilt image; it does not build OmniRoute from source.
- The image tag, startup command, required environment variables, and listening port have not been independently verified here. Confirm these details before relying on the deployment.
- Do not commit API keys, passwords, or other secrets to this repository. Store secrets in your hosting provider's environment-variable settings.

## Dockerfile

```dockerfile
FROM diegosouzapw/omniroute:latest
```
