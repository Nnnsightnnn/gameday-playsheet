// Page transition wrapper for animated section changes
// Uses CSS animations triggered by key changes

function PageTransition({ children, transitionKey }) {
  return (
    <div className="page-flip-container relative">
      <div key={transitionKey} className="page-enter">
        {children}
      </div>
    </div>
  )
}

export default PageTransition
