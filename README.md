# deprecation-notice package

This is a package that helps with notifying someone that a module they are using is deprecated. Its uses the atom-linter will lint the current files require statements

> This is still super early development expect api changes

![screen shot](https://cloud.githubusercontent.com/assets/578259/13378406/6d48566a-ddba-11e5-8bc5-7bcd6cabb533.png)

## Usage

This handles your projects deprecated modules. So in the root directory of your project in the package.json add the object deprecated.

```json
...
    "deprecated": {
        "FileInputOld": "NewHotness"
    }
...
```

The key is the file name that is deprecated. Plz omit extension unless the reference to the file in the require statements always will have the extension. `FileInputOld` in the example will become `/FileInputOld/gi` when matching the required statements. The value of the key will be the intended replacement for the deprecated file if there is none just leave the value as `null`.

## Future

Better support for custom deprecation messages. A better place for the config.
