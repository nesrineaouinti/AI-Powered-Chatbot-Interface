# GitHub Actions CI/CD Workflows

This directory contains GitHub Actions workflows for automated testing and continuous integration.

## 📋 Workflows

### 1. **CI Pipeline** (`ci.yml`)
Runs on pushes and pull requests to `main` and `develop` branches.

**Jobs:**
- **Frontend Tests**: Linting, unit tests, and coverage reports
- **Backend Tests**: Django tests with PostgreSQL database
- **Build Check**: Verifies production build succeeds

**Artifacts:**
- Frontend coverage reports
- Backend coverage reports  
- Production build files

### 2. **Tests** (`test.yml`)
Quick test suite that runs on all branches and pull requests.

**Jobs:**
- **Quick Test Suite**: Fast tests for both frontend and backend using SQLite

## 🚀 Setup Instructions

### 1. Update README Badges
Replace `YOUR_USERNAME` in `README.md` with your GitHub username:
```markdown
![CI Pipeline](https://github.com/YOUR_USERNAME/AI-Powered-Chatbot-Interface/actions/workflows/ci.yml/badge.svg)
![Tests](https://github.com/YOUR_USERNAME/AI-Powered-Chatbot-Interface/actions/workflows/test.yml/badge.svg)
```

### 2. Push to GitHub
```bash
git add .github/
git commit -m "Add GitHub Actions CI/CD pipeline"
git push origin main
```

### 3. View Workflow Results
- Go to your repository on GitHub
- Click the "Actions" tab
- View running/completed workflows

## 🔧 Configuration

### Environment Variables
The workflows use these environment variables (automatically set):
- `SECRET_KEY`: Test secret key for Django
- `DATABASE_URL`: PostgreSQL connection string (CI) or SQLite (quick tests)
- `GROQ_API_KEY`: Test API key

### Customization

**Change trigger branches:**
```yaml
on:
  push:
    branches: [ main, develop, staging ]  # Add your branches
```

**Change Node.js version:**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # Change version
```

**Change Python version:**
```yaml
- name: Setup Python
  uses: actions/setup-python@v5
  with:
    python-version: '3.12'  # Change version
```

## 📊 Coverage Reports

Coverage reports are uploaded as artifacts and retained for 7 days:
- **Frontend**: `front-end/coverage/`
- **Backend**: `Back-end/htmlcov/`

To download:
1. Go to Actions → Select workflow run
2. Scroll to "Artifacts" section
3. Download coverage reports

## 🐛 Troubleshooting

### Tests fail locally but pass in CI
- Ensure your local environment matches CI (Node 18, Python 3.11)
- Check for missing dependencies in `package.json` or `requirements.txt`

### Database connection errors
- CI uses PostgreSQL for backend tests
- Ensure migrations are up to date
- Check `DATABASE_URL` configuration

### Build failures
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`
- Verify all dependencies are in `package.json`

## 📝 Best Practices

1. **Always run tests locally before pushing:**
   ```bash
   # Frontend
   cd front-end && npm test
   
   # Backend
   cd Back-end && pytest
   ```

2. **Keep workflows fast:**
   - Use caching for dependencies
   - Run quick tests on all branches
   - Run full suite only on main/develop

3. **Monitor workflow runs:**
   - Fix failing tests immediately
   - Review coverage reports regularly
   - Update dependencies when needed

## 🔗 Useful Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)
