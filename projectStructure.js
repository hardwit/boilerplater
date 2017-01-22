exports.projectStructure = {
  directories: [
    {
      name: "copyright",
      files: ["profiles_settings.xml"]
    },
    {
      name: "node_modules",
      files: [],
      directories: [{
          name: "tosource-polyfill",
          files: [
            ".npmignore",
            ".travis.yml",
            "index.js",
            "package.json",
            "Readme.md",
            "test.js"
          ],
          directories: [{
              name: "LICENSE",
              files: []
            }]
        }]
    },
    {
      name: "templates",
      files: [
        "files.js",
        "projectStructure.js"
      ],
      directories: [{
          name: "asd",
          files: [
            "asd.da",
            "files.js",
            "projectStructure.js"
          ]
        }]
    }
  ],
  files: [
    "jsLibraryMappings.xml",
    "misc.xml",
    "modules.xml",
    "start.iml",
    "watcherTasks.xml",
    "workspace.xml",
    "create-new-project.js",
    "package.json",
    "scan-project.js"
  ]
}