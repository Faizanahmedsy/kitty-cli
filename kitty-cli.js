#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the feature name from the CLI argument
const featureName = process.argv[2];

if (!featureName) {
  console.error('Error: Please provide a feature name.');
  console.log('Example: npm run kitty-cli customer');
  process.exit(1);
}

// Capitalize the feature name for use in function names (e.g., customer -> Customer)
const capitalizedFeatureName = featureName.charAt(0).toUpperCase() + featureName.slice(1);

// Define the base directory where the structure will be created (inside src/features)
const baseDir = path.join(process.cwd(), 'src', 'features', featureName);

// Function to create a directory if it doesn't exist
const createDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Function to create a file with optional content
const createFile = (filePath, content = '') => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  }
};

// Content for the feature.actions.ts file, dynamically generated based on the feature name
const actionsContent = `import API from '@/instance/api';
import { QueryParams } from '@/hooks/api-request/api-request.types';
import useFetchData from '@/hooks/api-request/use-fetch-data';
import useFetchDetails from '@/hooks/api-request/use-fetch-details-data';
import usePostData from '@/hooks/api-request/use-post-data';
import useUpdateData from '@/hooks/api-request/use-update-data';

export const useCreate${capitalizedFeatureName} = () => {
  return usePostData({
    url: API.${featureName}.create,
  });
};

export const useUpdate${capitalizedFeatureName} = () => {
  return useUpdateData({
    url: API.${featureName}.update,
  });
};

export const useFetch${capitalizedFeatureName}List = (params: QueryParams) => {
  return useFetchData({
    url: API.${featureName}.list,
    params,
  });
};

export const useFetch${capitalizedFeatureName}Details = (id: string) => {
  return useFetchDetails({
    url: API.${featureName}.details,
    id,
  });
};
`;

// Enhanced success message with ASCII art and additional elements
const successMessage = `

.·:'''''''''''''''''''''''''''''''''''':·.
: : ░█░█░▀█▀░▀█▀░▀█▀░█░█░░░█▀▀░█░░░▀█▀ : :
: : ░█▀▄░░█░░░█░░░█░░░█░░░░█░░░█░░░░█░ : :
: : ░▀░▀░▀▀▀░░▀░░░▀░░░▀░░░░▀▀▀░▀▀▀░▀▀▀ : :
'·:....................................:·'

🎉 Module "${featureName}" created successfully inside src/features! 🎉


Docs: https://github.com/Faizanahmedsy/kitty-cli/blob/master/README.md

 ∧,,,∧
( •·• ) 
/  づ♡  Happy Coding! Let's make something awesome! 🌟
`;

// Create the folder structure
try {
  // Root directory for the feature (inside src/features)
  createDirectory(baseDir);

  // Subdirectories under the feature name
  const featureDir = path.join(baseDir);
  createDirectory(path.join(featureDir, 'actions'));
  
  // Components directory with subfolders
  const componentsDir = path.join(featureDir, 'components');
  createDirectory(componentsDir);
  createDirectory(path.join(componentsDir, 'details'));
  createDirectory(path.join(componentsDir, 'list'));
  createDirectory(path.join(componentsDir, 'mutate'));

  createDirectory(path.join(featureDir, 'constants'));
  createDirectory(path.join(featureDir, 'hooks'));
  createDirectory(path.join(featureDir, 'utils'));
  createDirectory(path.join(featureDir, 'types'));

  // Files under the feature subdirectories
  createFile(path.join(featureDir, 'actions', `${featureName}.actions.ts`), actionsContent);
  createFile(path.join(featureDir, 'constants', `${featureName}.constants.ts`));
  createFile(path.join(featureDir, 'utils', `${featureName}.utils.ts`));
  createFile(path.join(featureDir, 'types', `${featureName}.types.ts`));

  // Display the enhanced success message
  console.log(successMessage);
} catch (error) {
  console.error('Error creating folder structure:', error.message);
  process.exit(1);
}
