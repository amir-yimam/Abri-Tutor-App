const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const config = getDefaultConfig(__dirname);

const projectRoot = __dirname;

// Resolve "@/*" path aliases (matching tsconfig.json) for the Metro bundler.
// TypeScript handles these at compile time, but Metro needs runtime resolution.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@/')) {
    const resolvedPath = path.join(projectRoot, moduleName.slice(2));
    // Try exact file, then common extensions
    const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.json', '/index.ts', '/index.tsx', '/index.js'];
    for (const ext of extensions) {
      const candidate = resolvedPath + ext;
      if (fs.existsSync(candidate)) {
        return context.resolveRequest(
          { ...context, resolveRequest: undefined },
          candidate,
          platform
        );
      }
    }
  }
  // Fall back to default resolution
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
