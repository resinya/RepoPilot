const { format } = require("../src/format.cjs");
const value = process.argv[2];
if (!value) { process.stderr.write("value required\n"); process.exitCode = 1; }
else process.stdout.write(format(value) + "\n");
