const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// node_modules 내 expo 관련 패키지도 Babel 변환 적용 (import.meta 처리 포함)
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
