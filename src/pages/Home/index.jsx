import { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useParams,
  Link,
} from "react-router-dom";
import styles from "./Home.module.scss";
import className from "classnames/bind";
import Breadcrumb from "../components/Breadcrumb";
import DriveBox from "../components/DriveBox";
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const cx = className.bind(styles);

const initalGapi = () => {
  function start() {
    gapi.client.init({
      clientId: clientId,
      scope: "https://www.googleapis.com/auth/drive.readonly",
    });
  }
  gapi.load("client:auth2", start);
};
const clientId =
  "281696086517-19d7gtmglok4j61ml5vesrfnmg2j1f2e.apps.googleusercontent.com"; // Replace with your actual client ID from Google Cloud
const getFilesFromId = async (folderId = "root", countError = 0) => {
  try {
    const response = await gapi.client.request({
      path: "https://www.googleapis.com/drive/v3/files",
      method: "GET",
      params: {
        q: `'${folderId}' in parents`,
        // pageSize: 100,
        // fields: "files(id, name)",
        fields: "files(id, name, mimeType, shortcutDetails)",
      },
    });
    return [
      {
        id: "",
        name: "../",
        mimeType: "Back",
      },
      ...response.result.files.sort((a, b) => {
        return a.name.localeCompare(b.name, undefined, { numeric: true });
      }),
    ];
  } catch (error) {
    console.error("Error fetching files", error);
    if (countError <= 5) {
      await sleep(1000);
      return getFilesFromId(folderId, countError + 1);
    }
  }
};
const listFilesAndFolders = async (path) => {
  if (!path) path = "root";
  const dirs = path.split("/").filter((e) => e);
  let files = await getFilesFromId();
  for (const dir of dirs) {
    for (const file of files) {
      if (file.name.toLowerCase().includes(dir.toLowerCase())) {
        if (file.mimeType.includes("folder")) {
          files = await getFilesFromId(file.id);
        } else if (file.shortcutDetails.targetMimeType.includes("folder")) {
          files = await getFilesFromId(file.shortcutDetails.targetId);
        }
      }
    }
  }
  return files;
};

const handleLogin = async () => {
  try {
    const authInstance = gapi.auth2.getAuthInstance();
    await authInstance.signIn();
    const user = authInstance.currentUser.get();
    const accessToken = user.getAuthResponse().access_token;
    console.log("Access Token:", accessToken);
  } catch (error) {
    console.error("Error during login", error);
  }
};
const Home = () => {
  const { "*": path } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState();
  const [isLogin, setIsLogin] = useState(true);
  const [searchContent, setSearchContent] = useState("");
  useEffect(() => {
    initalGapi();
  }, []);
  useEffect(() => {
    (async () => {
      if (isLogin) {
        setFiles(await listFilesAndFolders(path));
      }
    })();
  }, [isLogin, path]);
  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <Breadcrumb path={path} navigate={navigate}></Breadcrumb>
        <input
          className="form-control"
          placeholder="Search"
          value={searchContent}
          onChange={(e) => setSearchContent(e.target.value)}
        ></input>
        <button
          // className={cx("btn-login")}
          className="btn btn-outline-dark"
          onClick={async () => {
            await handleLogin();
            setIsLogin(true);
          }}
        >
          Login to Google Drive
        </button>
      </div>
      {files && (
        <DriveBox
          files={files}
          path={path}
          search={searchContent}
          setSearch={setSearchContent}
        ></DriveBox>
      )}
    </div>
  );
};

export default Home;
