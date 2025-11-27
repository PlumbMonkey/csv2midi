# Contributing to CSV → MIDI Converter

Thank you for your interest in contributing! This document outlines how to contribute to the project.

## Code of Conduct

Be respectful and inclusive. Treat all contributors with courtesy and professionalism.

## How to Contribute

### Reporting Bugs

1. Check if the bug is already reported in [Issues](../../issues)
2. Include:
   - CSV input that reproduces the issue
   - Command or settings used
   - Expected vs. actual behavior
   - Environment (OS, Node.js version)
   - Error messages or logs

### Suggesting Features

1. Check [Discussions](../../discussions) or [Issues](../../issues) first
2. Describe the use case and benefit
3. Provide examples if applicable
4. Reference the PRD if relevant

### Code Contributions

1. **Fork** the repository
2. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/descriptive-name
   ```
3. **Make changes** and commit:
   ```bash
   git commit -m "Add descriptive commit message"
   ```
4. **Add tests** for new features
5. **Ensure tests pass:**
   ```bash
   npm test
   npm run lint
   npm run format
   ```
6. **Push to your fork:**
   ```bash
   git push origin feature/descriptive-name
   ```
7. **Open a Pull Request** with:
   - Clear title and description
   - Reference to related issues
   - Summary of changes
   - Any breaking changes noted

### Documentation Contributions

1. Update relevant `.md` files
2. Ensure clarity and examples
3. Keep formatting consistent
4. Test links and references

## Development Setup

```bash
npm install
npm run build
npm test
```

See [DEVELOPMENT.md](./DEVELOPMENT.md) for details.

## Coding Standards

- **TypeScript**: Strict mode enabled
- **Naming**: camelCase for functions/variables, PascalCase for classes
- **Comments**: JSDoc for public APIs
- **Tests**: Unit + integration tests required
- **Formatting**: Run `npm run format` before committing

## PR Review Process

- At least one approval required
- All checks must pass
- Comments addressed before merge
- Squash commits before merging (optional)

## Areas for Contribution

- **Bug fixes**: Check [Issues](../../issues) for tagged bugs
- **MIDI features**: See PRD section 5 (Scope)
- **DAW testing**: Import in FL Studio, Ableton, Logic
- **Documentation**: Examples, guides, troubleshooting
- **Performance**: Optimize large conversions
- **Testing**: Expand test coverage

## Questions?

1. Check [Documentation](./docs)
2. Post in [Discussions](../../discussions)
3. Open an issue for clarification

---

**Thank you for contributing! 🎵**
