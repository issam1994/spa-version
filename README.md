# ABOUT SPA-VERSION

This library consists of two things.

- A node.js based script that:

  - reads your app version on package.json and then updates a .env file with that version (consumed by the component) plus an optional random string everytime the script runs (in case you want to make versioning automatic).
  - creates a meta.json file in the public folder of your react app project to be used at runtime to compare the version of the code that a user is using with the version of the code is in the server (in other words, to make sure that the user is not using an older version of the app we compare the local version (in code) with the remote version(in meta.json)).

- A react component that:
    - receives the version of the app that is automatically added to the .env file after the script runs. it also accepts a loading component that will show up during the process for a good UX.
    - the component compares the version that is in the code with the version is in the downloaded meta.json from server. If the versions are not the same, the scripts clears cache and simply reload the window.

## getting started

### instalation

```
yarn add spa-version
```

### confguration

1 - add these to your scripts in package.json to run the script each time you build or start your react app.

```
"prebuild": "node node_modules/spa-version/src/script",
"prestart": "node node_modules/spa-version/src/script"
```

2 - create a .env file in the root directory of your app and add this (you can set it to false if you want to manage versioning yourself by constantly updating the package.json version before every build):

```
REACT_APP_SPAVERSION_RANDOM=true
```

3 - import the component and wrap your app root with it.

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
