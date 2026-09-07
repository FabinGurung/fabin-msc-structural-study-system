import {CONFIG} from "./config.js";
export function feedbackUrl(q){
  const title=`MTH504 study UX / content feedback · ${q.id}`;
  const body=[
    `Question: ${q.id}`,
    `Classification: ${q.classification}`,
    `Shell: v${CONFIG.shellVersion}`,
    "",
    "Issue type: [wrong answer / unclear explanation / equation / visual / mobile / navigation / other]",
    "",
    "What I found:",
    "",
    "Suggested correction (optional):",
    ""
  ].join("\n");
  return CONFIG.feedbackBase+"?"+new URLSearchParams({title,body}).toString();
}
