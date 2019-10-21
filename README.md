# find-next-version

find next version

status: production ready

```html
<script src="/path/to/find-next-version.js" defer></script>
<script defer>
(function(info) {
  FindNextVersion.find({ from: info.version, url: FindNextVersion.url.index })
    .then(function(version) {
      location.href = "/" + version + "/" + info.path + location.search;
    });
})(FindNextVersion.parse_pathname(location.pathname));
</script>
```


###### Table of Contents

- [Requirements](#Requirements)
- [Usage](#Usage)
- [License](#License)


## Requirements

- Promise


## Usage

### Install

```bash
npm install find-next-version
cp node_modules/find-next-version/dist/find-next-version.js path/to/find-next-version.js
```

### find

find next version

```javascript
FindNextVersion.find({
  from: "0.0.0", // start finding from this version
  url: function(version) {
    // construct search url
    return "/" + version + "/index.html";
  },
}) // => Promise
  .then(function(version) {
    // next version found
  })
  .catch(function() {
    // next version not found
  });
```

1. request to `HEAD /1.0.1/index.html`, `HEAD /1.1.0/index.html`, `HEAD /2.0.0/index.html`
1. if response status is 200, re-check (1) with next version
1. finally, resolve with (2) version

version number must follow semantic version rule


### url

construct search url functions

```javascript
FindNextVersion.url.index("1.0.0") // => "/1.0.0/index.html"
```


### parse_pathname

get version and path from pathname

```javascript
FindNextVersion.parse_pathname("/1.0.0/path/to/request")
// => { version: "1.0.0", path: "path/to/request" }

FindNextVersion.parse_pathname("/")
// => { version: "0.0.0", path: "" }

FindNextVersion.parse_pathname("/", {fallback_version: "2.0.0"})
// => { version: "2.0.0", path: "" }
```


## License

find-next-version is licensed under the [MIT](LICENSE) license.

Copyright &copy; since 2019 shun@getto.systems

