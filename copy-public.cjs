const path = require("path");
const child_process = require("child_process");

const isWindows = process.platform === "win32";
const source = path.join(__dirname, "node_modules", "client-library", "public");
const destination = path.join(__dirname, "public");

if (isWindows) {
  const xcopy = child_process.spawn("xcopy", [source, destination, "/E", "/Y", "/I"]);
  xcopy.stdout.pipe(process.stdout);
  xcopy.stderr.pipe(process.stderr);
  xcopy.on("close", (code) => {
    if (code !== 0) {
      console.error(`Copy /public folder exited with code ${code}`);
      process.exit(code);
    }
  });
} else {
  try {
    const cp = child_process.spawn("/bin/cp", ["-R", source, destination]);
    cp.stdout.pipe(process.stdout);
    cp.stderr.pipe(process.stderr);
    cp.on("close", (code) => {
      if (code !== 0) {
        console.error(`Copy /public folder exited with code ${code}`);
        process.exit(code);
      }
    });
  } catch (err) {
    console.error(`Copy /public folder exited with error - ${code}`);
    process.exit(1);
  }
}
