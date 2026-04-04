module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Metro/Hermes 웹 번들링에서 import.meta를 process.env 기반 객체로 변환
      ({ types: t }) => ({
        visitor: {
          MetaProperty(path) {
            if (
              t.isIdentifier(path.node.meta, { name: 'import' }) &&
              t.isIdentifier(path.node.property, { name: 'meta' })
            ) {
              path.replaceWith(
                t.objectExpression([
                  t.objectProperty(
                    t.identifier('env'),
                    t.memberExpression(t.identifier('process'), t.identifier('env'))
                  ),
                  t.objectProperty(
                    t.identifier('url'),
                    t.stringLiteral('')
                  ),
                ])
              );
            }
          },
        },
      }),
    ],
  };
};
