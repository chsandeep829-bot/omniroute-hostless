FROM diegosouzapw/omniroute:3.8.54

# Support either Hostless disk mount path:
# - /app/data (OmniRoute's documented default)
# - /data (used by the earlier Hostless setup)
# If mounted at /app/data it overlays the symlink; if mounted at /data the
# symlink forwards OmniRoute's default data directory to that disk.
USER root
RUN mkdir -p /data \
    && chown -R node:node /data \
    && rm -rf /app/data \
    && ln -s /data /app/data

COPY --chmod=755 hostless-entrypoint.mjs /usr/local/bin/hostless-entrypoint.mjs

ENV DATA_DIR=/app/data \
    PORT=20128 \
    HOSTNAME=0.0.0.0 \
    OMNIROUTE_MEMORY_MB=768 \
    REQUIRE_API_KEY=true

# The entrypoint fixes the mounted disk ownership as root, then launches the
# actual OmniRoute process as the image's unprivileged node user (UID 1000).
ENTRYPOINT ["node", "/usr/local/bin/hostless-entrypoint.mjs"]
CMD ["node", "dev/run-standalone.mjs"]
