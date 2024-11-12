function Breadcrumb({ path, navigate }) {
  let paths = ["", ...(path || "").split("/").filter((e) => e)];
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {paths.map((p, index) => {
          return (
            <li
              className={
                "breadcrumb-item " + (index == paths.length - 1 ? "active" : "")
              }
              key={index}
            >
              <a
                onClick={() => navigate(paths.slice(0, index + 1).join("/"))}
                style={{
                  cursor: "pointer",
                }}
              >
                {!p ? "Home" : p}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
export default Breadcrumb;
