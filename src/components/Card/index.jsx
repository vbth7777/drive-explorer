function Card({ title, date }) {
  return (
    <div className="w-48 h-48 p-2 border-2 rounded-2xl cursor-pointer ">
      <div className="h-2/3 mb-2 rounded-xl border-gray-500 border"></div>
      <span className="text-base block overflow-clip overflow-ellipsis ">
        {title}
      </span>
      <span className="text-base block">{date}</span>
    </div>
  );
}
export default Card;
