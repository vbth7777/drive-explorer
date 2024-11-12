import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DriveBox.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);
function DriveBox({ files, path, search, setSearch }) {
  const [isNavigated, setIsNavigated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsNavigated(false);
  }, [files]);
  return (
    <ul className={cx("container")}>
      {Array.from(files)
        .filter(
          (e) =>
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.mimeType == "Back",
        )
        .map((e, i) => {
          const isBack = e.mimeType.includes("Back");
          let isFile = !e.mimeType.includes("folder");
          if (e.mimeType.includes("shortcut")) {
            isFile = !e.shortcutDetails.targetMimeType.includes("folder");
          }
          return (
            <li key={i}>
              <button
                className={cx("btn btn-light")}
                disabled={isNavigated}
                onClick={() => {
                  setSearch("");
                  if (isBack) {
                    if (!path.includes("/")) {
                      navigate("");
                      return;
                    }
                    navigate(path.replace(/\/.+$/, ""));
                  } else if (!isFile) {
                    navigate((path || "").replace(/\/$/, "") + "/" + e.name);
                  }
                  setIsNavigated(true);
                }}
              >
                {isBack ? `← ${e.name}` : `${isFile ? "🗎" : "📁"} ${e.name}`}
              </button>
            </li>
          );
        })}
    </ul>
  );
}
export default DriveBox;
