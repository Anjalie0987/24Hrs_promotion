const { PrismaClient } = require('@prisma/client');
const client = new PrismaClient();
console.log("CLIENT OPTIONS KEYS:", Object.keys(client));
// Let's try to find the constructor options type
// Actually, I'll just check if it has datasourceUrl or datasource property
console.log("CLIENT HAS datasourceUrl:", 'datasourceUrl' in client);
console.log("CLIENT HAS datasource:", 'datasource' in client);
process.exit(0);
