import { useEffect, useState } from "react";
/**
 *
 * @param {Object} props
 * @param {ReactElement} props.children the app comp to return when there is no conflict in versions
 * @param {ReactElement} props.LoadingComponent the comp to show when checking version
 * @param {boolean} props.disabled disable the component feature and simply return children
 * @param {string} props.localVersion the version imported from the .env file
 * @param {string} props.baseurl the path where the app is hosted like '/myapp
 * @returns
 */
export const VersionChecker = ({
  LoadingComponent = null,
  disabled = false,
  children,
  localVersion,
  baseurl
}) => {
  // else check the version in meta.json file
  const [loading, setLoading] = useState(true);

  const [remoteVersion, setRemoteVersion] = useState(null);

  const url = `${baseurl}/meta.json`;

  const getMetaJson = async () => {
    try {
      const res = await fetch(url, {
        cache: "reload",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const meta = await res.json();
      setRemoteVersion(meta.version);
    } catch (e) {
      console.log("@spa-version, couldn't fetch meta.json");
      console.error("@spa-version, error:", e);
    } finally {
      setLoading(false);
    }
  };

  const clearCacheAndReload = () => {
    console.log("Clearing cache and hard reloading...");
    if (caches) {
      // Service worker cache should be cleared with caches.delete()
      caches.keys().then(function (names) {
        for (let name of names) caches.delete(name);
      });
    }
    // delete browser cache and hard reload
    window.location.reload(true);
  };

  // if disabled, just return the children
  if (disabled) {
    return children;
  }

  // on mount , get remote version
  useEffect(() => {
    getMetaJson();
  }, []);

  // on remote version received
  useEffect(() => {
    if (remoteVersion) {
      if (remoteVersion === localVersion) {
        clearCacheAndReload();
      }
    }
  }, [remoteVersion]);

  return loading ? LoadingComponent : children;
};
