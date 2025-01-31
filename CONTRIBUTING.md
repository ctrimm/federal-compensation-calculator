# Contributing to Federal Compensation Calculator

Thank you for your interest in contributing to the Federal Compensation Calculator! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

1. Fork the repository
2. Create a new branch for your feature/fix: `git checkout -b feature-name`
3. Make your changes
4. Submit a pull request

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting (Prettier configuration)
- Maintain type safety - avoid using `any`
- Use functional components with hooks for React components

### Project Structure

- `/src/components/` - React components
- `/src/utils/` - Calculation and helper functions
- `/src/types/` - TypeScript type definitions
- `/public/data/` - Static data files (e.g., GS pay tables)

### Calculations

When modifying benefit calculations:
1. Verify formulas against official OPM documentation
2. Update relevant test cases
3. Document the source of any constants or rates
4. Consider edge cases (e.g., pay caps, special rates)

### UI/UX Guidelines

- Follow existing component patterns using shadcn/ui
- Maintain responsive design principles
- Include tooltips for complex terms/calculations
- Keep visualizations clear and informative

## Testing

Before submitting a PR:
1. Test your changes locally
2. Verify calculations against official sources
3. Check responsive design on different screen sizes
4. Ensure all existing functionality remains intact

## Pull Request Process

1. Update documentation if needed
2. Add comments explaining complex logic
3. Reference any related issues
4. Provide a clear PR description explaining:
   - What changes were made
   - Why the changes were necessary
   - How to test the changes

## Updating Data

When updating GS pay tables or locality rates:
1. Provide source documentation
2. Update the year in relevant comments/documentation
3. Test calculations with new values
4. Update any hardcoded maximums (e.g., TSP limits)

## Questions or Issues?

- Check existing issues before creating new ones
- Use issue templates when available
- Provide clear reproduction steps for bugs
- Include browser/system information for technical issues

## License

By contributing to this project, you agree that your contributions will be licensed under the same MIT License that covers the project.
