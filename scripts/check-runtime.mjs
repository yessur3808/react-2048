const minNode = [20, 19, 0];
const minNpm = [10, 0, 0];

const stripPrefix = (value, prefix) =>
  value.startsWith(prefix) ? value.slice(prefix.length) : value;

const parseVersion = (value) =>
  stripPrefix(value.trim(), 'v').split('.').map((part) => Number.parseInt(part, 10));

const isMeetingMinimum = (current, minimum) => {
  const currentParts = parseVersion(current);
  for (let i = 0; i < minimum.length; i++) {
    if (currentParts[i] > minimum[i]) return true;
    if (currentParts[i] < minimum[i]) return false;
  }
  return true;
};

const npmUserAgent = process.env.npm_config_user_agent ?? '';
const npmMatch = npmUserAgent.match(/npm\/(\d+\.\d+\.\d+)/);
const currentNode = process.version;
const currentNpm = npmMatch?.[1] ?? 'unknown';

const mismatches = [];

const minNodeStr = minNode.join('.');
const minNpmStr = minNpm.join('.');

if (!isMeetingMinimum(currentNode, minNode)) {
  mismatches.push(`Node.js >=${minNodeStr} is required, found ${currentNode}.`);
}

if (currentNpm === 'unknown') {
  mismatches.push(`npm >=${minNpmStr} is required, but the current npm version could not be detected.`);
} else if (!isMeetingMinimum(currentNpm, minNpm)) {
  mismatches.push(`npm >=${minNpmStr} is required, found ${currentNpm}.`);
}

if (mismatches.length > 0) {
  console.error('\nreact-2048 runtime check failed.');
  console.error(mismatches.join('\n'));
  console.error('\nUse `nvm use` or install a compatible version before running npm install.');
  process.exit(1);
}
