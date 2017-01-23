#!/usr/bin/env node

const fs = require('fs');
const zlib = require('zlib');
const readline = require('readline');

let filesList, projectStructure;

const askForBoilerplateName = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

askForBoilerplateName.question('Boilerplate name: ', name => {
    if (!name) {
        console.log('Wrong boilerplate name!');
        askForBoilerplateName.close();

        return;
    }

    let templatesDirPath = __dirname + '/../templates/' + name;

    if (!fs.existsSync(templatesDirPath)) {
        console.log('"' + name + '": boilerplate not exist');
        askForBoilerplateName.close();

        return;
    }

    if (fs.existsSync(templatesDirPath + '/files.js.gz')) {
        fs.writeFileSync(templatesDirPath + '/files.js', zlib.gunzipSync(fs.readFileSync(templatesDirPath + '/files.js.gz')));
    } else {
        console.log('files.js.gz not found in template directory');
        askForBoilerplateName.close();

        return;
    }

    if (fs.existsSync(templatesDirPath + '/projectStructure.js.gz')) {
        fs.writeFileSync(templatesDirPath + '/projectStructure.js', zlib.gunzipSync(fs.readFileSync(templatesDirPath + '/projectStructure.js.gz')));
    } else {
        console.log('projectStructure.js.gz not found in template directory');
        askForBoilerplateName.close();

        return;
    }

    filesList = require(templatesDirPath + '/files.js').files;
    projectStructure = require(templatesDirPath + '/projectStructure.js').projectStructure;

    console.log('"' + name + '" template selected...' );

    if (projectStructure.directories) {
        createProject(projectStructure.directories, process.cwd());
    }

    if (projectStructure.files) {
        projectStructure.files.forEach(function (fileName) {
            createFile(fileName, filesList[fileName])
        });
    }

    fs.unlinkSync(templatesDirPath + '/files.js');
    fs.unlinkSync(templatesDirPath + '/projectStructure.js');
    askForBoilerplateName.close();
});

function createProject(directories, path) {
    directories.forEach(function(dir) {
        let currentPath = path ? path + '/' + dir.name : process.cwd() + '/' + dir.name;

        fs.mkdir(currentPath, function() {
            if (dir.files) {
                dir.files.forEach(function(file) {
                    let fileName = currentPath.slice(process.cwd().length + 1) + '/' + file;

                    createFile(fileName, filesList[fileName]);
                });
            }
        });

        if (dir.directories) {
            createProject(dir.directories, currentPath);
        }
    });
}

function createFile(fileName, fileText) {
    let text = fileText ? fileText : '';

    fs.writeFile(fileName, text, function(error) {
        console.log(fileName);

        if (error) {
            console.log(error);
            console.log('File ' + fileName + ' not created');
        }
    });
}
