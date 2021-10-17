# ABOUT SPA-VERSION

This library consists of two things.

- A node.js based script that:

  - reads your app version on package.json and then writes it in a .env file. Optionally, t can attach a random string to the version number everytime the script runs (in case you want to make versioning automatic).
  - creates a meta.json file in the /public folder of your react app project. the file will contain the app version number. the file will be downloaded each time your app runs to compare the version that is inside the code with the version that coming with the meta.json.

- A react component that:
    - receives the version of the app that you will have to extract from the .env file. it also accepts a loading component that will show up during the process for a good UX.
    - the component compares the version that is in the code with the version that is in the downloaded meta.json. If the versions are not the same, the component will clear cache and simply reload the window to make sure the user is running the latest version of your app.

## getting started

### instalation

```
yarn add spa-version
```

### confguration

1 - Add these to your scripts in package.json to run the script each time you build or start your react app.

```
"prebuild": "node node_modules/spa-version/src/script",
"prestart": "node node_modules/spa-version/src/script"
```

2 - Create a .env file in the root directory of your app and add this (you can set it to false if you want to manage versioning yourself by constantly updating the package.json version before every build):

```
REACT_APP_SPAVERSION_RANDOM=true
```

3 - Import the component and wrap your app root with it and pass to it the version of your app after extracting it from the .env file.

```js
import { VersionChecker } from "spa-version/src/component";
import Loading from "components/Loading";

// can be used to disable the process for when in a development environment
const isDev = process.env.NODE_ENV === "development";
// this is the app version that was extracted from the package.json by the script and added to the .env file
const version = process.env.REACT_APP_SPAVERSION_VERSION;

const App = () => {

    return (
        <VersionChecker
        localVersion={version}
        LoadingComponent={<Loading />}
        // disabled={isDev}
        >
            <MyAppRoot>
        </VersionChecker>
    );
}
```
