const fs = require("fs");
const env = {...process.env};
fs.readFile("./src/services/get-environment.ts", "utf8", (err, data) => {
    if (err) {
        console.error(`Error reading getEnvironment file: ${err}`);
        return;
    }
    const environment = env.ENVIRONMENT ?? 'local';
    const updatedData = data.replace(/(const Environment = )[^;]+(;)/, `$1'${environment}'$2`);

    // Write the updated contents back to the getEnvironment file
    fs.writeFile("./src/services/get-environment.ts", updatedData, "utf8", err => {
        if (err) {
            console.error(`Error writing getEnvironment file: ${err}`);
            return;
        }
        console.log(`Updated getEnvironment file with ENVIRONMENT from .env file.`);
    });
});