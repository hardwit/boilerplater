#!/usr/bin/env node

const fs = require('fs');
const zlib = require('zlib');
const toSource = require('tosource-polyfill');
const readline = require('readline');

let filesList = {};
let projectStructure = {};
let newBoilerplateName = 'Main';

const askForBoilerplateName = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

askForBoilerplateName.question('Boilerplate name: ', name => {
    if (name) {
        newBoilerplateName = name;
    }

    readDirectory(process.cwd(), projectStructure);
    createTemplates();

    askForBoilerplateName.close();
});

function readDirectory(path, initialState) {
    fs.readdirSync(path).forEach(function(elem) {
        let newState;

        if (elem.includes('.')) {
            try {
                updateFilesList(elem, path + '/');
                updateProjectStructure(elem, initialState, 'file');
            } catch (err) {
                readDirectory(path + '/' + elem, initialState);
            }
        } else {
            try {
               newState = updateProjectStructure(elem, initialState, 'dir');

                readDirectory(path + '/' + elem, newState);
            } catch (err) {
                console.log(err);
            }
        }
    });
};

function updateFilesList(fileName, path) {
    filesList[(path + fileName).slice(process.cwd().length + 1)] = fs.readFileSync(path + fileName).toString('utf8');
};

function updateProjectStructure(elemName, initialState, type) {
    if (type === 'file') {
        if (!initialState.files) {
            initialState.files = [];
            initialState.files.push(elemName);

            return;
        }

        initialState.files.push(elemName);
    }

    if (type === 'dir') {
        if (!initialState.directories) {
            initialState.directories = [];
        }

        initialState.directories.push({
            name: elemName,
            files: []
        });

        let newState;

        initialState.directories.forEach(function(dir) {
            if (dir.name === elemName) {
                newState = dir;
            }
        });

        return newState;
    }
};

function createTemplates() {
    let filesTemplate = 'exports.files = ';
    let projectStructureTemplate = 'exports.projectStructure = ';
    let templatesDirPath = __dirname + '/../templates/' + newBoilerplateName;

    if (!fs.existsSync(__dirname + '/../templates/')) {
        fs.mkdirSync(__dirname + '/../templates/');
    }

    filesTemplate  += toSource(filesList);
     projectStructureTemplate += toSource(projectStructure);

    if (fs.existsSync(templatesDirPath)) {
        removeDirectory(templatesDirPath);
    }

    fs.mkdirSync(templatesDirPath);

    fs.writeFile(templatesDirPath + '/files.js.gz', zlib.gzipSync(filesTemplate), function(error) {
        if (error) {
            console.log(error);
            console.log('File "files.js.gz" ' + ' not created');

            return;
        }

        console.log(templatesDirPath + '/files.js.gz successfully created');
    });

    fs.writeFile(templatesDirPath + '/projectStructure.js.gz', zlib.gzipSync(projectStructureTemplate), function(error) {
        if (error) {
            console.log(error);
            console.log('File "projectStructure.js.gz" ' + ' not created');

            return;
        }

        console.log(templatesDirPath + '/projectStructure.js.gz successfully created');
    });
};

function removeDirectory(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            const curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) {
                removeDirectory(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

