# Contributing to Stock Market Simulator 🤝

Thank you for your interest in contributing to the Stock Market Simulator! We welcome contributions from developers of all skill levels. This document provides guidelines and information you need to contribute effectively.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Documentation](#documentation)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful** and inclusive to all contributors
- **Be constructive** in discussions and code reviews
- **Focus on the issue**, not the person
- **Help others learn** - we were all beginners once
- **Be patient** with questions and different skill levels

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:
- Node.js (v14.0 or higher)
- npm (v6.0 or higher)
- Git
- A code editor (VS Code recommended)
- Basic knowledge of React and JavaScript

### First-Time Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/stock-simulator.git
   cd stock-simulator
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/stock-simulator.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Add your Finnhub API key to .env
   ```

## 🔄 Development Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:
- `feature/` - New features (e.g., `feature/portfolio-analytics`)
- `fix/` - Bug fixes (e.g., `fix/api-error-handling`)
- `docs/` - Documentation updates (e.g., `docs/installation-guide`)
- `refactor/` - Code refactoring (e.g., `refactor/component-structure`)
- `test/` - Adding tests (e.g., `test/portfolio-calculations`)

### Making Changes

1. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Keep your fork updated**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

3. **Make your changes** following our coding standards

4. **Test your changes**:
   ```bash
   npm test
   npm start # Verify in browser
   ```

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add portfolio performance charts"
   ```

## 📝 Coding Standards

### JavaScript/React Guidelines

**Component Structure:**
```jsx
import React, { useState, useEffect } from 'react';
import { ComponentName } from 'lucide-react';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  const handleFunction = () => {
    // Handler logic
  };

  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

**Code Style Rules:**
- Use **functional components** with hooks
- **2 spaces** for indentation
- **camelCase** for variables and functions
- **PascalCase** for component names
- **kebab-case** for CSS classes
- **Destructure props** when possible
- **Use const/let** instead of var
- **Add comments** for complex logic

### CSS Guidelines

**Naming Convention:**
```css
/* Component-specific styles */
.dashboard-container {
  /* Main container styles */
}

.dashboard-header {
  /* Header specific styles */
}

.dashboard-header__title {
  /* BEM methodology for nested elements */
}

.dashboard-header--dark {
  /* BEM modifier for variants */
}
```

**CSS Rules:**
- Use **Tailwind classes** when possible
- Custom CSS only when Tailwind is insufficient
- Follow **BEM methodology** for custom CSS
- **Mobile-first** responsive design
- Use **CSS custom properties** for theming

### File Organization

```
src/components/NewComponent/
├── NewComponent.jsx      # Main component
├── NewComponent.css      # Component styles
├── NewComponent.test.js  # Component tests
└── index.js             # Export file
```

## 📤 Submitting Changes

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat(portfolio): add performance analytics dashboard"
git commit -m "fix(api): handle rate limit errors gracefully"
git commit -m "docs(readme): update installation instructions"
```

### Pull Request Process

1. **Update your branch** with latest main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request** on GitHub with:
   - **Clear title** describing the change
   - **Detailed description** of what was changed and why
   - **Screenshots** for UI changes
   - **Testing instructions** for reviewers
   - **Link related issues** using keywords (fixes #123)

4. **PR Template:**
   ```markdown
   ## Description
   Brief description of changes made.

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Refactoring

   ## Testing
   - [ ] Manual testing completed
   - [ ] All existing tests pass
   - [ ] New tests added (if applicable)

   ## Screenshots (if applicable)
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No breaking changes
   ```

## 🐛 Reporting Issues

### Before Submitting an Issue

1. **Search existing issues** to avoid duplicates
2. **Check the FAQ** and troubleshooting guide
3. **Try the latest version** to see if it's already fixed

### Bug Report Template

```markdown
**Bug Description**
Clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g., Windows 10, macOS 12.0]
- Browser: [e.g., Chrome 96, Firefox 95]
- Node.js version: [e.g., 16.13.0]
- Project version: [e.g., 1.2.3]

**Additional Context**
Screenshots, console errors, etc.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Mockups, examples, etc.
```

## 🛠️ Development Setup

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-react",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

**Component Test Example:**
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
  test('renders portfolio value correctly', () => {
    const mockProps = {
      portfolio: [
        { symbol: 'AAPL', shares: 10, currentPrice: 150 }
      ]
    };
    
    render(<Dashboard {...mockProps} />);
    
    expect(screen.getByText('$1,500.00')).toBeInTheDocument();
  });
});
```

### Test Guidelines

- **Test user interactions**, not implementation details
- **Use descriptive test names**
- **Test edge cases** and error conditions
- **Mock external dependencies** (API calls)
- **Aim for 80%+ code coverage**

## 📚 Documentation

### Documentation Standards

- **Update README** for new features
- **Add JSDoc comments** for complex functions
- **Include examples** in documentation
- **Keep docs up-to-date** with code changes

**JSDoc Example:**
```jsx
/**
 * Calculates portfolio performance metrics
 * @param {Array} portfolio - Array of stock holdings
 * @param {number} initialInvestment - Starting portfolio value
 * @returns {Object} Performance metrics including total value and gains
 */
const calculatePortfolioMetrics = (portfolio, initialInvestment) => {
  // Implementation
};
```

## 🎯 Good First Issues

New contributors should look for issues labeled:
- `good first issue` - Perfect for newcomers
- `help wanted` - Community input needed  
- `documentation` - Documentation improvements
- `enhancement` - Feature improvements

## 📞 Getting Help

- **GitHub Issues** - Technical problems
- **GitHub Discussions** - General questions
- **Code Review** - Ask for feedback on draft PRs

## 🙏 Recognition

Contributors will be:
- **Listed in README** acknowledgments
- **Tagged in release notes** for significant contributions
- **Invited to join** the core contributor team for regular contributors

---

Thank you for contributing to the Stock Market Simulator! Your efforts help make this project better for everyone. 🚀