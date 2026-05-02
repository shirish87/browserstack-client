FROM sonarqube:community

# Remove all plugins except the ones we need for this project (TS, JS, Go, Python, Text)
# This keeps the server startup fast and memory footprint low.
USER root
RUN find lib/extensions -maxdepth 1 -type f \
    ! -name 'sonar-javascript-plugin-*.jar' \
    ! -name 'sonar-go-plugin-*.jar' \
    ! -name 'sonar-python-plugin-*.jar' \
    ! -name 'sonar-text-plugin-*.jar' \
    -delete
USER sonarqube
