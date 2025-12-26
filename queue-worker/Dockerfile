# Queue Worker Dockerfile
# Processes votes from Redis queue asynchronously

FROM php:8.2-cli-alpine

WORKDIR /var/www

# Install dependencies
RUN apk add --no-cache \
    bash \
    mysql-client \
    && docker-php-ext-install -j$(nproc) pdo pdo_mysql pcntl

# Install Redis extension
RUN apk add --no-cache pcre-dev $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del pcre-dev $PHPIZE_DEPS

# Copy application from backend
COPY --from=quickvote-backend:latest /var/www /var/www

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD ps aux | grep -q "[a]rtisan queue:work" || exit 1

# Run queue worker
CMD ["php", "artisan", "queue:work", "redis", \
    "--queue=votes,default", \
    "--tries=3", \
    "--timeout=90", \
    "--memory=512", \
    "--sleep=3"]
