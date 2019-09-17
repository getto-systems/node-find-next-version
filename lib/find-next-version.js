"use strict";

var FindNextVersion = {
  find: function(opts) {
    var from = opts.from;
    var url = opts.url;

    var next_patch = function(version) {
      var numbers = version.slice(0.3);
      if (numbers.length > 2) {
        numbers[2] = parseInt(numbers[2]) + 1;
      }
      return numbers.join(".");
    };
    var next_minor = function(version) {
      var numbers = version.slice(0,2);
      if (numbers.length > 1) {
        numbers[1] = parseInt(numbers[1]) + 1;
      }
      numbers.push(0);
      return numbers.join(".");
    };
    var next_major = function(version) {
      var numbers = version.slice(0,1);
      if (numbers.length > 0) {
        numbers[0] = parseInt(numbers[0]) + 1;
      }
      numbers.push(0);
      numbers.push(0);
      return numbers.join(".");
    };

    var next_versions = function(version) {
      var numbers = version.split(".");

      return [
        next_patch(numbers),
        next_minor(numbers),
        next_major(numbers),
      ];
    };

    return new Promise(function(resolve, reject) {
      var found = [];
      var map = {};

      var check = function(versions, detected){
        if (versions.length == 0) {
          if (found.length > 0) {
            var next = found.pop();
            found = [];
            check(next_versions(next), next);
          } else {
            if (detected) {
              resolve(detected);
            } else {
              reject();
            }
          }
          return;
        }

        var version = versions.shift();

        if (!map[version]) {
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function(){
            if (xhr.readyState == 4) {
              var exists = (xhr.status == 200);

              map[version] = {exists: exists};

              if (exists) {
                found.push(version);
              }

              check(versions, detected);
            }
          };
          xhr.open("HEAD", url(version), true);
          xhr.send();
        } else {
          if (map[version].exists) {
            found.push(version);
          }

          check(versions, detected);
        }
      };

      check(next_versions(from));
    });
  },

  url: {
    index: function(version) { return "/" + version + "/index.html"; },
  },

  parse_pathname: function(pathname) {
    var pathnames = pathname.split("/");
    if (!pathnames[1] || !(pathnames[1] + "").match(/^[0-9.-]+$/)) {
      return {
        version: "0.0.0",
        path: "",
      };
    } else {
      return {
        version: pathnames[1],
        path: pathnames.slice(2).join("/"),
      };
    }
  },
};
