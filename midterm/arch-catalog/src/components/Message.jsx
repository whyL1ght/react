function Message({ type, text, onRetry }) {
  return (
    <div className={"message " + type}>
      <p>{text}</p>
      {type === "error" && onRetry && <button onClick={onRetry}>Try again</button>}
    </div>
  );
}

export default Message;
