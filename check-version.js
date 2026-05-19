import fs from "fs";

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const currentVersion = packageJson.version;
const lastUpdate = new Date().toISOString().slice(0, 10);
let [major, minor, patch] = currentVersion.split(".");
major = parseInt(major);
minor = parseInt(minor);
patch = parseInt(patch);

let newVersion;

if (patch === 9) {
    let newPatch = 0;
    let newMinor = minor + 1;
    let newMajor = major;

    if (newMinor > 9) {
        newMinor = 0;
        newMajor = major + 1;
    }

    newVersion = `${newMajor}.${newMinor}.${newPatch}`;
} else {
    let newPatch = patch + 1;
    let newMinor = minor;
    let newMajor = major;

    newVersion = `${newMajor}.${newMinor}.${newPatch}`;
}

if (newVersion !== currentVersion) {
    packageJson.version = newVersion;
    packageJson.lastupdate = lastUpdate;
    fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
    console.log(`Version updated to ${newVersion}`);
    console.log(`Lastupdate to ${lastUpdate}`);
} else {
    console.log("No version update required");
}