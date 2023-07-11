module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['xo', 'plugin:@next/next/recommended'],
	overrides: [
		{
			extends: ['xo-typescript'],
			files: ['*.ts', '*.tsx'],
			rules: {
				'@typescript-eslint/naming-convention': 'off',
				'@typescript-eslint/object-curly-spacing': 'off',
				'@typescript-eslint/comma-dangle': 'off',
				'@typescript-eslint/no-unsafe-assignment': 'off',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['react'],
	rules: {
		'@typescript-eslint/naming-convention': 'off',
		semi: ['warn', 'always'],
		quotes: ['warn', 'single'],
		'operator-linebreak': 'off',
		'new-cap': 'off',
		'comma-dangle': 'off',
		'@next/next/no-img-element': 'off',
		curly: 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'no-inner-declarations': 'off',
	},
};
