import core from '@actions/core';
import yaml from 'js-yaml';

import exportVariables from '../variable-exporter.mjs';

const handleCondition = condition => {
  if (
    typeof condition.if === 'undefined' ||
    typeof condition.export !== 'object'
  ) {
    const errorMessage = `Conditions must include 'if' and 'export' in the correct format. \
Given input: ${JSON.stringify(condition)}. \
Expected input: {if: [condition], export: {key: value}}.`;
    core.setFailed(errorMessage);
    return { error: true };
  }

  if (condition.if) {
    const { missingVars, exportedVars } = exportVariables(condition.export);

    return {
      error: false,
      missingVars,
      exportedVars,
    };
  }

  return { error: false, missingVars: '' };
};

const handle = yamlInput => {
  if (!yamlInput.trim()) return;

  let conditions;
  try {
    conditions = yaml.load(yamlInput);
  } catch (error) {
    core.setFailed(
      `Failed to parse YAML input: ${yamlInput}\nError: ${error.message}`,
    );
    return;
  }

  if (!Array.isArray(conditions)) {
    core.setFailed(
      `The input must be an array of conditions. Given input:\n${yamlInput}`,
    );
    return;
  }

  let missingVars = '';
  let exportedVars = '';
  let atLeastOneConditionMet = false;

  for (const condition of conditions) {
    if (condition.if === 'false' || condition.if === false) continue; // Skip the condition if 'if' is false

    if (condition.if !== 'true' && condition.if !== true) {
      core.setFailed(
        `An 'if' condition must evaluate to 'true' or 'false'. Instead got: ${condition.if}`,
      );
      continue;
    }

    const result = handleCondition(condition);
    if (result.error) continue;

    missingVars += result.missingVars;
    exportedVars += result.exportedVars;

    atLeastOneConditionMet =
      atLeastOneConditionMet || result.missingVars === '';
  }

  if (missingVars) {
    core.setFailed(
      `The following required environment variables aren't exported:\n${missingVars}`,
    );
  }

  if (!atLeastOneConditionMet) {
    core.setFailed(
      `No 'if' conditions were met! Use 'if: true' to specify a default condition. Processed the following conditions:\n${JSON.stringify(
        conditions,
      )}`,
    );
  }

  return { exportedVars };
};

export default handle;
