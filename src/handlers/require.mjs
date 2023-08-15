import core from '@actions/core';
import yaml from 'js-yaml';

const validateRequiredVariables = requiredVars => {
  let missingVars = '';

  for (const varName of requiredVars) {
    if (
      process.env[varName] === undefined ||
      process.env[varName] === null ||
      process.env[varName] === ''
    ) {
      missingVars += `- ${varName} (Expected: non-empty value)\n`;
    }
  }

  return missingVars;
};

const handle = yamlInput => {
  if (!yamlInput.trim()) return;

  let requiredVars;
  try {
    requiredVars = yaml.load(yamlInput);
  } catch (error) {
    core.setFailed(
      `Failed to parse YAML input: ${yamlInput}\nError: ${error.message}`,
    );
    return;
  }

  if (!Array.isArray(requiredVars)) {
    core.setFailed(
      `The input must be an array of variable names. Given input:\n${yamlInput}`,
    );
    return;
  }

  const missingVars = validateRequiredVariables(requiredVars);

  if (missingVars) {
    core.setFailed(
      `The following required environment variables aren't exported:\n${missingVars}`,
    );
  }
};

export default handle;
