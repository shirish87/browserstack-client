import { AutomateClient } from "@dot-slash/browserstack-automate";
import { AccessibilityClient } from "@dot-slash/browserstack-accessibility";
import { AppAutomateClient } from "@dot-slash/browserstack-app-automate";
import { TestManagementClient } from "@dot-slash/browserstack-test-management";

// BrowserStack Automate API
const automateClient = new AutomateClient();
const plan = await automateClient.getPlan();
console.log(plan);

// BrowserStack Accessibility API
const accessibilityClient = new AccessibilityClient();
const reports = await accessibilityClient.getWorkflowAnalyzerReports();
console.log(reports);

// BrowserStack Test Management API
const tmClient = new TestManagementClient();
const projects = await tmClient.getProjects();
console.log(projects);
