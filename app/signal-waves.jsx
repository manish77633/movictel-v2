export function SignalWaves() {
  return <div className="signal-waves" aria-hidden="true">
    <svg viewBox="0 0 1440 440" preserveAspectRatio="none" focusable="false">
      <g className="signal-wave-paths" fill="none">
        {Array.from({ length: 12 }, (_, index) => {
          const path = `M-60 ${270 + index * 13} C260 ${155 + index * 15} 495 ${300 + index * 11} 750 ${213 + index * 13} S1165 ${32 + index * 15} 1500 ${200 + index * 18}`
          return <path key={index} d={path} pathLength="100"
            className={index % 4 === 2 ? 'signal-wave-pulse' : undefined}
            style={{ '--wave-delay': `${-index * 1.7}s` }}/>
        })}
      </g>
    </svg>
  </div>
}
