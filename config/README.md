# Configuration Directory

This directory contains all configuration files for the Aricious platform. It centralizes variables, constants, and links to maintain a single source of truth for the application.

## Structure

- **`index.ts`** - Main configuration file that exports all configurations and re-exports from other config files
- **`constants.ts`** - Application constants that don't depend on environment variables
- **`theme.ts`** - Theme and styling related configurations
- **`env.example.ts`** - Reference for environment variables used in the application

## Usage

Import configuration values from the centralized config:

```typescript
// Import specific configurations
import { API, AUTH, PATHS } from '../config';

// Use configurations
const apiEndpoint = API.ENDPOINTS.USERS;
const loginRoute = AUTH.ROUTES.SIGN_IN;
const dashboardPath = PATHS.DASHBOARD;

// Import specific constants
import { Constants } from '../config';

// Use constants
const userStatus = Constants.USER_STATUS.ACTIVE;
const sessionStatus = Constants.SESSION_STATUS.SCHEDULED;
```

## Environment Variables

The application uses environment variables for sensitive information and deployment-specific configurations. Create a `.env` file in the root directory based on the reference in `env.example.ts`.

## Extending Configuration

When adding new configuration values:

1. Place them in the appropriate category in `index.ts` or create a new section if needed
2. If the configuration is complex, consider creating a separate file in the `config` directory
3. For constants that don't depend on environment variables, add them to `constants.ts`
4. For theme-related configurations, add them to `theme.ts`
5. Update the `env.example.ts` file if adding new environment variables

## Benefits

- **Single Source of Truth**: All configuration is centralized for easy reference
- **Maintainability**: Changes only need to be made in one place
- **Type Safety**: TypeScript provides type checking for configuration values
- **Organization**: Logical grouping of related configuration values 