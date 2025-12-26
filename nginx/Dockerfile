# Nginx Load Balancer Dockerfile
FROM nginx:alpine

# Copy custom configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

# Create cache directory
RUN mkdir -p /var/cache/nginx/client_temp \
    && chown -R nginx:nginx /var/cache/nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
