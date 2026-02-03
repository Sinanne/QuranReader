const { getConfig } = require('@expo/config');
const path = require('path');

try {
    const projectRoot = process.cwd();
    console.log('Attempting to load config for:', projectRoot);
    const config = getConfig(projectRoot);
    console.log('Config loaded successfully:');
    console.log(JSON.stringify(config, null, 2));
} catch (error) {
    console.error('FAILED TO LOAD CONFIG');
    console.error(error);
    process.exit(1);
}
