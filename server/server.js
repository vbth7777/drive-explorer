const jsdom = require("jsdom");
const { exec } = require("child_process");
const express = require("express");
const path = require("path");
const async = require("async");
const fs = require("fs");
const axios = require("axios");

const app = express();
const port = 9000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const API = "https://yummy-worms-sell.loca.lt";

async function getDir(dir) {
  return await axios
    .get(API + "/" + dir, {
      // headers: {
      //   Accept: "video/mp4;charset=UTF-8",
      // },
      // responseType: "blob",
    })
    .then(async (res) => {
      const win = new jsdom.JSDOM(res.data);
      const dom = win.window.document;
      let type = "path";
      if (await isFile(API + "/" + dir)) {
        type = "file";
      }

      return Array.from(dom.querySelectorAll("a")).map((a) => {
        return {
          title: a.textContent,
          url: a.href,
          type,
        };
      });
    });
}
async function isFile(url) {
  try {
    // Make a HEAD request to just fetch the headers
    const response = await axios.head(url);

    // Check for a 200 status code
    if (response.status !== 200) {
      return false;
    }

    const contentType = response.headers["content-type"];
    const contentLength = response.headers["content-length"];
    const contentDisposition = response.headers["content-disposition"];

    // Basic check: if the content type is not HTML and there's a content-length, it might be a file.
    // Alternatively, a Content-Disposition header indicating an attachment is a strong signal.
    if (
      (contentType &&
        !contentType.includes("text/html") &&
        contentLength &&
        Number(contentLength) > 0) ||
      (contentDisposition && contentDisposition.includes("attachment"))
    ) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error fetching URL:", error);
    return false;
  }
}
async function isMp4(url) {
  try {
    const response = await axios.head(url);
    const contentType = response.headers["content-type"];
    // Check if the content-type indicates an mp4 video.
    return contentType && contentType.includes("video/mp4");
  } catch (error) {
    console.error("Error fetching the URL:", error);
    return false;
  }
}
app.get("/", async (req, res) => {
  const path = encodeURI(req.query.path);
  const dirs = await getDir(path);

  res.send(
    dirs.map((dir) => {
      dir.title.replace(/\/$/, "");
      return dir;
    }),
  );
});
app.get("/file", async (req, res) => {
  const path = encodeURI(req.query.path);
  if (await isMp4(API + "/" + path)) {
    console.log(`${API}/${path}`);
    exec(`mpv ${API}/${path}`, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(stdout);
    });
    res.send("ok");
    return;
  }
});
app.get("/thumbnail", async (req, res) => {
  // Get the file path from query parameters
  const filePath = encodeURI(req.query.path);
  const videoUrl = `${API}/${filePath}`;

  // Verify that the URL points to an MP4 video
  if (!(await isMp4(videoUrl))) {
    res.status(400).send("Invalid MP4 file");
    return;
  }

  // Ensure the thumbnails directory exists
  const thumbDir = path.join(__dirname, "public", "thumbnails");
  if (!fs.existsSync(thumbDir)) {
    fs.mkdirSync(thumbDir, { recursive: true });
  }

  // Generate a unique filename for the thumbnail
  const thumbnailFile = path.join(thumbDir, `thumb_${Date.now()}.png`);

  // Build the ffmpeg command to capture a thumbnail at the 1-second mark
  const command = `ffmpeg -i "${videoUrl}" -ss 00:00:01.000 -vframes 1 "${thumbnailFile}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("Error generating thumbnail:", err);
      res.status(500).send("Error generating thumbnail");
      return;
    }
    // Send the thumbnail file to the client
    res.sendFile(thumbnailFile);
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
