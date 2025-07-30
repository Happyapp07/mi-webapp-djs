#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const extensions = ['.tsx', '.ts', '.jsx', '.js'];
const rootDir = path.resolve(__dirname, '..');
const fixMode = process.argv.includes('--fix');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Counter for statistics
let stats = {
  filesChecked: 0,
  filesWithIssues: 0,
  issuesFound: 0,
  issuesFixed: 0,
};

/**
 * Find all files with specified extensions recursively
 */
function findFiles(dir, extensions) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    // Skip node_modules and .git directories
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') {
      return;
    }
    
    if (stat && stat.isDirectory()) {
      // Recursively search directories
      results = results.concat(findFiles(filePath, extensions));
    } else {
      // Check if file has one of the specified extensions
      const ext = path.extname(file).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

/**
 * Check a file for improperly escaped quotes
 */
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let hasIssues = false;
  let fixedContent = '';
  let issuesInFile = 0;
  
  lines.forEach((line, lineIndex) => {
    // Check for escaped quotes in JSX attributes
    const jsxAttributeRegex = /className=\\"/g;
    const jsxAttributeMatches = line.match(jsxAttributeRegex);
    
    if (jsxAttributeMatches) {
      hasIssues = true;
      issuesInFile += jsxAttributeMatches.length;
      
      console.log(`${colors.red}Issue found in ${colors.yellow}${filePath}${colors.reset} at line ${lineIndex + 1}:`);
      console.log(`${colors.cyan}${line}${colors.reset}`);
      
      // Highlight the issue
      let highlightLine = '';
      let lastIndex = 0;
      
      const regex = /className=\\"/g;
      let match;
      while ((match = regex.exec(line)) !== null) {
        const spaces = ' '.repeat(match.index - lastIndex);
        highlightLine += spaces + `${colors.red}^${colors.reset}`;
        lastIndex = match.index + 1;
      }
      
      console.log(highlightLine);
      
      if (fixMode) {
        // Fix the issue by replacing escaped quotes with regular quotes
        const fixedLine = line.replace(/className=\\"/g, 'className="');
        fixedContent += fixedLine + '\n';
        stats.issuesFixed += jsxAttributeMatches.length;
      } else {
        fixedContent += line + '\n';
      }
    } else {
      fixedContent += line + '\n';
    }
  });
  
  if (hasIssues) {
    stats.filesWithIssues++;
    stats.issuesFound += issuesInFile;
    
    if (fixMode) {
      // Remove the trailing newline
      fixedContent = fixedContent.slice(0, -1);
      fs.writeFileSync(filePath, fixedContent);
      console.log(`${colors.green}Fixed ${issuesInFile} issues in ${filePath}${colors.reset}`);
    }
  }
  
  return hasIssues;
}

/**
 * Main function
 */
function main() {
  console.log(`${colors.cyan}Checking for improperly escaped quotes in ${extensions.join(', ')} files...${colors.reset}`);
  
  if (fixMode) {
    console.log(`${colors.yellow}Running in FIX mode - issues will be automatically corrected${colors.reset}`);
  } else {
    console.log(`${colors.yellow}Running in CHECK mode - issues will only be reported${colors.reset}`);
    console.log(`${colors.yellow}Run with --fix to automatically fix issues${colors.reset}`);
  }
  
  const files = findFiles(rootDir, extensions);
  
  console.log(`${colors.blue}Found ${files.length} files to check${colors.reset}`);
  
  let hasIssues = false;
  
  files.forEach(file => {
    stats.filesChecked++;
    const fileHasIssues = checkFile(file);
    hasIssues = hasIssues || fileHasIssues;
  });
  
  // Print summary
  console.log('\n' + '-'.repeat(50));
  console.log(`${colors.blue}Summary:${colors.reset}`);
  console.log(`${colors.blue}Files checked: ${colors.reset}${stats.filesChecked}`);
  console.log(`${colors.blue}Files with issues: ${colors.reset}${stats.filesWithIssues}`);
  console.log(`${colors.blue}Issues found: ${colors.reset}${stats.issuesFound}`);
  
  if (fixMode) {
    console.log(`${colors.blue}Issues fixed: ${colors.reset}${stats.issuesFixed}`);
  }
  
  if (hasIssues && !fixMode) {
    console.log(`\n${colors.yellow}Issues found! Run with --fix to automatically fix them.${colors.reset}`);
    process.exit(1);
  } else if (hasIssues && fixMode) {
    console.log(`\n${colors.green}All issues have been fixed!${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${colors.green}No issues found!${colors.reset}`);
    process.exit(0);
  }
}

// Run the main function
main();