# env-var-action

A GitHub Action to dynamically export and require environment variables based on conditional logic.

## Features

- **Export Environment Variables**: Easily export multiple environment variables.
- **Conditional Exporting**: Use conditions to determine which variables should be exported based on the current workflow context.
- **Required Variables**: Ensure that certain variables are present and throw errors if they are missing.

## Usage

### Basic Setup

In your `.github/workflows/your-workflow-file.yml`, use the action as follows:

```yml
steps:
  - name: Export Environment Variables
    uses: grandcestry/env-var-action@main
    with:
      export: |
        TEST: true
```

This will export the environment variable `TEST` to `true`.

### Requiring Variables

To ensure that specific environment variables are present, use the `require` input:

```yml
steps:
  - name: Export and Require Environment Variables
    uses: grandcestry/env-var-action@main
    with:
      export: |
        TEST: true
      require: |
        - TEST
        - TEST2
        - TEST3
```

In the above example, if `TEST2` or `TEST3` are not exported previously in the workflow or by this action, the action will fail.

### Conditional Variable Exporting

You can use conditions to export environment variables based on the current workflow context:

```yml
steps:
  - name: Export Environment Variables Conditionally
    uses: grandcestry/env-var-action@main
    with:
      cond: |
        - if: ${{ github.ref == 'refs/heads/main' }}
          export:
            DEPLOY_ENV: staging
            TF_WORKSPACE: staging-frontend-app-ci-vars

        - if: ${{ startsWith(github.ref, 'refs/tags/v') }}
          export:
            DEPLOY_ENV: production
            TF_WORKSPACE: production-frontend-app-ci-vars

        # Bash expressions
        - if: $(( $GITHUB_REF == refs/tags/* ))
          export:
            VERSION_NAME: $(( ${GITHUB_REF#refs/tags/} ))

        # Default
        - if: true
          export:
            DEPLOY_ENV: DEFAULT
```

In the above example:

- If the current ref is `main`, the environment variables `DEPLOY_ENV` and `TF_WORKSPACE` will be set to `staging` and `staging-frontend-app-ci-vars` respectively.
- If the current ref starts with `v` (indicating a version tag), the `DEPLOY_ENV` and `TF_WORKSPACE` will be set to `production` and `production-frontend-app-ci-vars`.
- If neither of the above conditions are met, `DEPLOY_ENV` will be set to `DEFAULT`.

## Inputs

| Name    | Description                                                  | Required |
|---------|--------------------------------------------------------------|----------|
| `export`   | Key-value pairs of environment variables to export.             | No       |
| `require` | List of environment variable keys that must be present.     | No       |
| `cond`  | Conditional logic for exporting environment variables.         | No       |

## License

This project is licensed under the MIT License.

## Contributing

We welcome contributions!

## Feedback and Issues

If you have feedback or issues, please open an issue on the [GitHub repository](https://github.com/grandcestry/env-var-action).
