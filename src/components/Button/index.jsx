function Button({ value, onClick }) {
  return (
    <button
      className="rounded-lg bg-gray-800 px-3 py-1.5 text-white cursor-pointer"
      onClick={onClick}
    >
      {value}
    </button>
  );
}
export default Button;
