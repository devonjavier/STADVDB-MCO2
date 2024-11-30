# Use the official MySQL image as the base image
FROM mysql:latest

# Set environment variables for MySQL configuration
ENV MYSQL_ROOT_PASSWORD=rootpass
ENV MYSQL_DATABASE=mco1_datawarehouse

# Copy database dump into the container
# Replace 'mco1_datawarehouse.sql' with your actual SQL dump file
COPY mco1_datawarehouse.sql /docker-entrypoint-initdb.d/

# Expose the default MySQL port
EXPOSE 3306