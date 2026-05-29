// Floating confirmation toast.

function Toast({ toast }) {
  return (
    <div
      className={'toast' + (toast ? ' toast--on' : '')}
      role="status"
      aria-live="polite"
    >
      {toast && (
        <>
          <span className="tdot" style={{ background: toast.color }} />
          {toast.msg}
        </>
      )}
    </div>
  )
}

export default Toast
