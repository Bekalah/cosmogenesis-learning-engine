# Repository Sync Guide

This guide captures the enhancements and fixes applied to **Cosmogenesis Learning Engine** so they can be mirrored across your other projects.

## Core Enhancements

- **Node.js 18+ environment** for modern ECMAScript support and built-in `node --test` framework.
- **Prettier** formatting with `npm run format` to enforce a consistent code style.
- **Automated tests** under the `test/` directory executed with `npm test`.
- **Python utility scripts** for generating art assets.
- Clear documentation including `README.md`, `TASKS.md`, and `CONTRIBUTING.md`.

## Applying These Improvements Elsewhere

1. **Upgrade Tooling**
   - Set `"engines": { "node": ">=18" }` in `package.json`.
   - Add scripts for development, testing, and formatting.
2. **Adopt Consistent Formatting**
   - Install Prettier and include `format` and `check` commands.
3. **Establish Automated Testing**
   - Organize tests in a dedicated `test/` folder and run them with `npm test`.
4. **Maintain Documentation**
   - Provide project overviews, contribution guidelines, and task tracking.
5. **Use Auxiliary Scripts**
   - Add Python or shell scripts to automate asset or data generation as needed.

By implementing these practices, your other repositories can achieve the same robustness and clarity as the Cosmogenesis Learning Engine.
