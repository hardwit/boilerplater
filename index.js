#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const action = process.argv[2];

switch (action) {
    case 'templates': {
        showTemplates();

        break;
    }
    case 'rmtemplate': {
        removeTemplate();

        break;
    }
    default: {
        showCommands();
    }
}

function showTemplates() {
    fs.readdirSync(__dirname+ '/templates').forEach(function(dir) {
        console.log(dir);
    });
}

function removeTemplate() {
    const askForBoilerplateName = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    askForBoilerplateName.question('Boilerplate name: ', name => {
        if (!name) {
            askForBoilerplateName.close();

            return;
        }

        const path = __dirname + '/templates/' + name;

        if (!fs.existsSync(path)) {
            console.log('\n"' + name + '" boilerplate does not exist!');
            askForBoilerplateName.close();

            return;
        }

        fs.readdirSync(path).forEach(function(file){
            const currentPath = path + "/" + file;

            if(fs.lstatSync(currentPath).isDirectory()) {
                removeDirectory(currentPath);
            } else {
                fs.unlinkSync(currentPath);
            }
        });

        fs.rmdirSync(path);

        console.log('\n"' + name + '" boilerplate successfully deleted');
        askForBoilerplateName.close();
    });
}

function showCommands() {
    console.log(`Boilerplater commands: 
        \nTo create your boilerplate use:  "boilerplater-create-boilerplate" 
        \nTo install your boilerplate use: "boilerplater-create-project"
        \nTo show boilerplates list use: "boilerplater templates"
        \nTo remove boilerplate use: "boilerplater rmtemplate"`);
}