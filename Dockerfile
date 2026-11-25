FROM diegosouzapw/omniroute:3.8.54

# Support either common Hostless disk mount path:
# - /app/data (OmniRoute's documented default)
# - /data (used by the earlier Hostless setup)
# If the disk is mounted at /app/data it overlays this symlink; if mounted at
# /data the symlink forwards OmniRoute's default data directory to that disk.
USER root
RUN mkdir -p /data \
    && chown -R node:node /data \
    && rm -rf /app/data \
    && ln -s /data /app/data

ENV DATA_DIR=/app/data \
    PORT=20128 \
    HOSTNAME=0.0.0.0 \
    OMNIROUTE_MEMORY_MB=768 \
    REQUIRE_API_KEY=true

USER node
