FROM diegosouzapw/omniroute:3.8.54

# OmniRoute writes its SQLite database and provider configuration under DATA_DIR.
# The existing Hostless persistent disk is mounted at /data, so point the app
# there instead of the image default /app/data.
USER root
RUN mkdir -p /data && chown -R node:node /data

ENV DATA_DIR=/data \
    PORT=20128 \
    HOSTNAME=0.0.0.0 \
    OMNIROUTE_MEMORY_MB=768 \
    REQUIRE_API_KEY=true

USER node
