import core from '@actions/core';
import { execSync } from 'child_process';

const bashExec = expression => {
  try {
    expression = expression.replace(/'/g, "\\'");

    console.log(`bash -c '${expression}'`);

    return execSync(`bash -c '${expression}'`, { encoding: 'utf-8' }).trim();
  } catch (error) {
    core.setFailed(
      `Failed to bashExec bash expression: ${expression}\nError: ${error.message}`,
    );
    return null;
  }
};

const ifPattern = /if:\s*\$\(\(\s*(.*?)\s*\)\)/g;
const expressionPattern = /\$\(\(\s*(.*?)\s*\)\)/g;

export const renderBashExpressions = yamlInput =>
  yamlInput
    .replace(ifPattern, (_, condition) => {
      const result = bashExec(
        `[[ ${condition} ]] && echo "true" || echo "false"`,
      );

      return `if: "${result}"`;
    })
    .replace(expressionPattern, (_, expression) => {
      const result = bashExec(expression);

      return `"${result}"`;
    });
