const tasks = arr => arr.join(" && ");

module.exports = {
	hooks: {
		"pre-commit": tasks(["pretty-quick --staged", "npm run lint"]),
		"pre-push": tasks(["npm run lint"]),
	},
};
