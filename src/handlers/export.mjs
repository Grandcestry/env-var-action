import core from '@actions/core';
import yaml from 'js-yaml';

import exportVariables from '../variable-exporter.mjs';

const handle = yamlInput => {
  if (!yamlInput.trim()) return;

  let variables;
  try {
    variables = yaml.load(yamlInput);
  } catch (error) {
    core.setFailed(
      `Failed to parse YAML input: ${yamlInput}\nError: ${error.message}`,
    );
    return;
  }

  if (typeof variables !== 'object') {
    core.setFailed(
      `The input must be an object of key-value pairs. Given input:\n${yamlInput}`,
    );
    return;
  }

  const { missingVars, exportedVars } = exportVariables(variables);

  if (missingVars) {
    core.setFailed(
      `The following required environment variables aren't exported:\n${missingVars}`,
    );
  }

  return { exportedVars };
};

export default handle;
