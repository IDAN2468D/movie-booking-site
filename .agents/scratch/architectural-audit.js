const fs = require('fs');
const path = require('path');

const DIRECTORIES_TO_SCAN = ['components', 'app', 'hooks', 'lib', 'pages', 'src'];
const ROOT_DIR = path.resolve(__dirname, '..');

const lineOverLimitFiles = [];
const connectionStringsFound = [];
const stateStoreViolations = [];
const missingZodValidations = [];

function scanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        scanDirectory(fullPath);
      }
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx'))) {
      analyzeFile(fullPath);
    }
  }
}

function analyzeFile(filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // 1. Check line count (Atomic File Isolation)
  if (lines.length > 200) {
    lineOverLimitFiles.push({ path: relativePath, lines: lines.length });
  }

  // 2. Check MongoDB client exposure (Zero MongoDB Client Exposure)
  if (content.includes('mongodb+srv://') || (content.includes('idankzm') && content.includes('purdk'))) {
    connectionStringsFound.push({ path: relativePath });
  }

  // 3. Check Zustand state selectors (State Management)
  // Check if store is imported and destructuring is used without specific selectors
  // e.g. const { x, y } = useStore() instead of const x = useStore(state => state.x)
  if (content.includes('useCriticStore') || content.includes('useTransactionStore') || content.includes('useDiscoveryContext')) {
    const destructureMatch = content.match(/const\s+\{[^}]+\}\s*=\s*(useCriticStore|useTransactionStore|useDiscoveryContext)\(\)/);
    if (destructureMatch) {
      stateStoreViolations.push({ path: relativePath, store: destructureMatch[1], line: destructureMatch[0] });
    }
  }
}

console.log('Starting Architectural Audit...');
DIRECTORIES_TO_SCAN.forEach(dir => scanDirectory(path.join(ROOT_DIR, dir)));

console.log('\n--- Atomic File Isolation Violations (Files > 200 lines) ---');
console.log(`Found ${lineOverLimitFiles.length} files:`);
lineOverLimitFiles.sort((a, b) => b.lines - a.lines).forEach(f => {
  console.log(`- ${f.path}: ${f.lines} lines`);
});

console.log('\n--- Security Check: MongoDB Connection String Exposure ---');
if (connectionStringsFound.length === 0) {
  console.log('✓ No exposed connection strings in scanned files.');
} else {
  console.log(`⚠️ WARNING: Connection strings found in ${connectionStringsFound.length} files:`);
  connectionStringsFound.forEach(f => console.log(`- ${f.path}`));
}

console.log('\n--- State Management: Destructured Store Selectors Check ---');
if (stateStoreViolations.length === 0) {
  console.log('✓ Zustand stores accessed correctly with selectors (no destructuring).');
} else {
  console.log(`⚠️ WARNING: Zustand store destructured without selectors in ${stateStoreViolations.length} files:`);
  stateStoreViolations.forEach(f => console.log(`- ${f.path}: ${f.line}`));
}

console.log('\nAudit complete.');
