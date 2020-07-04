# Platziverse-DB
## Usage
``` JS
	const setupDatabase = require('platziverse-db');
	setupDatabase(config)
		.then((data) => {
			const { Agent, Metric } = data;
		})
		.catch((err) => console.error(err) );
```
