#!/bin/bash
set -e

# Get the absolute path of the project root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Generate a strong random password for this session
SONAR_ADMIN_PASS=$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | head -c 20)"!A1"
echo "Session Password generated."

# 1. Start Lean SonarQube
echo "Starting Lean Latest SonarQube..."
docker compose -f "$SCRIPT_DIR/docker-compose.sonarqube.yml" down -v || true
docker compose -f "$SCRIPT_DIR/docker-compose.sonarqube.yml" up -d --build

# 2. Wait for SonarQube
echo "Waiting for SonarQube to be ready..."
for i in {1..40}; do
  STATUS=$(curl -s -f http://localhost:9000/api/system/status | grep -o '"status":"[^"]*"' | cut -d'"' -f4 || echo "DOWN")
  if [ "$STATUS" == "UP" ] && docker logs sonarqube-local 2>&1 | grep -q "SonarQube is operational"; then
      echo -e "\nSonarQube is UP and operational!"
      break
  fi
  printf "."
  sleep 5
done

if [ "$STATUS" != "UP" ]; then
  echo -e "\nFailed to start. Logs:"
  docker compose -f "$SCRIPT_DIR/docker-compose.sonarqube.yml" logs --tail 100
  exit 1
fi

# 3. Configure Security and generate Token
echo "Configuring SonarQube..."
curl -s -u admin:admin -X POST "http://localhost:9000/api/users/change_password?login=admin&previousPassword=admin&password=$SONAR_ADMIN_PASS"
TOKEN_JSON=$(curl -s -u admin:$SONAR_ADMIN_PASS -X POST "http://localhost:9000/api/user_tokens/generate?name=scanner-token")
SONAR_TOKEN=$(echo $TOKEN_JSON | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 4. Run SonarQube Scan
echo "Running SonarQube Scan..."
docker run --rm \
  --network="host" \
  -v "$PROJECT_ROOT:/usr/src" \
  sonarsource/sonar-scanner-cli \
  -Dsonar.projectKey=browserstack-client \
  -Dsonar.sources=. \
  -Dsonar.tests=. \
  -Dsonar.test.inclusions="**/*.test.ts,**/*.spec.ts,**/*_test.go,**/__tests__/**,**/test/**" \
  -Dsonar.exclusions="**/node_modules/**,**/dist/**,**/dist-binary/**" \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=$SONAR_TOKEN

# 5. Generate Report inside the SonarQube container
echo "Generating Report via sonar-cnes-report 5.0.4..."
docker exec sonarqube-local sh -c "
  curl -L -s -o /tmp/cnes.jar https://github.com/cnescatlab/sonar-cnes-report/releases/download/5.0.4/sonar-cnes-report-5.0.4.jar
  java -jar /tmp/cnes.jar \
    -s http://localhost:9000 \
    -t $SONAR_TOKEN \
    -p browserstack-client \
    -o /opt/sonarqube/temp
"

# 6. Copy the report out, convert to PDF, and Cleanup
echo "Copying report to host..."
mkdir -p "$PROJECT_ROOT/sonarqube-reports"
docker cp sonarqube-local:/opt/sonarqube/temp/. "$PROJECT_ROOT/sonarqube-reports/"

echo "Converting report to PDF..."
DOCX_FILE=$(ls "$PROJECT_ROOT"/sonarqube-reports/*-analysis-report.docx | head -n 1)
if [ -f "$DOCX_FILE" ]; then
  libreoffice --headless --convert-to pdf "$DOCX_FILE" --outdir "$PROJECT_ROOT/sonarqube-reports/"
fi

echo "Shutting down SonarQube..."
docker compose -f "$SCRIPT_DIR/docker-compose.sonarqube.yml" down -v

echo -e "\nSuccess! Your reports are in the 'sonarqube-reports/' directory."
