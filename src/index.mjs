import core from '@actions/core';

import handleRequire from './handlers/require.mjs';
import handleExport from './handlers/export.mjs';
import handleCond from './handlers/cond.mjs';

import { renderBashExpressions } from './expression-renderer.mjs';

const formatOutput = str =>
  str
    .split('\n')
    .map(line => '>  ' + line)
    .join('\n');

const logYaml = yaml => {
  console.log('');
  console.log('rendered yaml:');
  console.log('');
  console.log(formatOutput(yaml));
  console.log('');
};

const logExportedVars = exportedVars => {
  if (exportedVars) {
    core.info(`Environment variables exported:\n${formatOutput(exportedVars)}`);
  }
};

const handleInput = (inputName, handler) => {
  const yaml = renderBashExpressions(core.getInput(inputName));

  if (yaml) {
    logYaml(yaml);

    const { exportedVars } = handler(yaml);

    logExportedVars(exportedVars);
  }
};

try {
  handleInput('export', handleExport);
  handleInput('cond', handleCond);

  handleInput('require', handleRequire);
} catch (error) {
  core.setFailed(error.message);
}
