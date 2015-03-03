var generators = require('yeoman-generator');
var path = require('path');
var fs = require('fs');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    // Next, add your custom code
    //this.option('coffee'); // This method adds support for a `--coffee` flag

    this.argument('componentName', {type: String, required: false});
    this.option('path', {type: String, defaults: './'});

    console.log('componentName: ' + this.componentName);
    console.log('path: ' + this.options.path);
  },

  promptUser: function () {
    // 已输入名字的情况跳过询问
    if (this.componentName) {
      return;
    }

    var done = this.async();

    var prompts = [];
    if (!this.componentName) {
      prompts.push({
        type: 'input',
        name: 'componentName',
        message: 'Enter your component name'
      });
    }

    if (!this.option.path) {
      prompts.push({
        type: 'input',
        name: 'path',
        message: 'Enter the creating path'
      });
    }

    this.prompt(prompts, function(props) {
      this.componentName = props.compName;
      this.options.path = props.path;
      done();
    }.bind(this));
  },
  createFolders: function() {
    var createPath = this.options.path;
    var componentPath = path.join(createPath, this.componentName);

    // 若不存在目录，则创建
    if (!fs.existsSync(createPath)) {
      this.mkdir(createPath);
    }

    this.mkdir(componentPath);
  },
  copyFiles: function() {
    var componentName = this.componentName;

    var files = {
      htmlFle: {
        tmpFile: '_component.html',
        suffix: 'html'
      },
      jsFile: {
        tmpFile: '_component.js',
        suffix: 'js'
      },
      cssFile: {
        tmpFile: '_component.scss',
        suffix: 'scss'
      }
    };

    for (var key in files) {
      var item = files[key];
      var targetPath = path.join(this.options.path, componentName, componentName + '.' + item.suffix);
      this.copy(item.tmpFile, targetPath);
    }
  }
});
