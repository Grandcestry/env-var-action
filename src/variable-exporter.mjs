import core from '@actions/core';

const exportVariables = variables => {
  let missingVars = '';
  let exportedVars = '';

  for (const [key, value] of Object.entries(variables)) {
    if (!key || value === null || value === undefined || value === '') {
      missingVars += `- ${key}\n`;
    } else {
      core.exportVariable(key, value);
      exportedVars += `${key}=${value}\n`;
    }
  }

  return { missingVars, exportedVars };
};

export default exportVariables;
