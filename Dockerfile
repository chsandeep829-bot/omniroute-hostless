FROM diegosouzapw/omniroute:latest

# The upstream image runs OmniRoute as the unprivileged "node" user.
# Prepare the database directory at image-build time so node can create
# SQLite files and temporary files there when no host volume overrides it.
USER root
RUN mkdir -p /app/data \
    && chown -R node:node /app/data

# Keep the application running without root privileges.
USER node
