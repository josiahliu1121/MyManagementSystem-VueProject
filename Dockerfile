# Use the official nginx image
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom config
COPY nginx/nginx.conf /etc/nginx/conf.d/

# Copy built Vue files into Nginx's web root
COPY --chown=nginx:nginx dist/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80