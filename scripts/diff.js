const stdin = process.openStdin();

let data = '';

stdin.on('data', function (chunk) {
	data += chunk;
});

stdin.on('end', function () {
	const input = JSON.parse(data);
	const flatpack = input.tasks.reduce((acc, task) => {
		if (task.command == '\u003cNONEXISTENT\u003e') {
			return acc;
		}

		if (task.cache.status == 'MISS') {
			acc.push(task.package);
		}
		return acc;
	}, []);

	const uniq = [...new Set(flatpack)];
	console.log(uniq.join(' '));
});
