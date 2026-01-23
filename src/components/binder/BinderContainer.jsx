// Binder container with ring binding visual

function BinderContainer({ children, showRings = true }) {
  // Generate 12 rings for the binding
  const rings = Array.from({ length: 12 }, (_, i) => i)

  return (
    <div className="binder-container relative">
      {/* Ring Binding */}
      {showRings && (
        <div className="binder-rings hidden md:flex">
          {rings.map(i => (
            <div key={i} className="binder-ring" />
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="binder-content">
        {children}
      </div>
    </div>
  )
}

export default BinderContainer
