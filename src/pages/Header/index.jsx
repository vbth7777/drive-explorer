import { FaGoogleDrive } from "react-icons/fa";
import Button from "../../components/Button";
function Header() {
  return (
    <div className="flex flex-row items-center justify-between border-b-2 border-gray-500 p-5">
      <div className="">
        <FaGoogleDrive className="text-8xl" />
      </div>
      <div className="flex flex-row gap-5 h-10">
        <input
          placeholder="Search"
          type="text"
          className="rounded-lg border-2 border-gray-500 px-2 py-1"
        />
        <Button value="Search" />
        <Button value="Login" />
      </div>
    </div>
  );
}
export default Header;
