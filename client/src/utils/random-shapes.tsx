export const RandomShapesSVG = () => {
  // Crea un array de círculos con atributos aleatorios
  const circles = Array.from({ length: 12 }).map((_, index) => {
    const cx = Math.random() * 200
    const cy = Math.random() * 200
    const r = Math.random() * 2 + 1 // radios de 1 a 4
    const fill = Math.random() > 0.5 ? 'none' : ['#A6A7D1', '#C0ECDF', '#FDF3B6'][Math.floor(Math.random() * 3)]
    const stroke = fill === 'none' ? ['#A6A7D1', '#C0ECDF', '#FDF3B6'][Math.floor(Math.random() * 3)] : 'none'
    const strokeWidth = fill === 'none' ? 1 : 0
    const rotate = Math.random() * 360
    return { cx, cy, r, fill, stroke, strokeWidth, rotate }
  })

  // Crea un array de triángulos con atributos aleatorios
  const triangles = Array.from({ length: 5 }).map((_, index) => {
    const points = '50,61.4 52,66.8 48,66.8'
    const fill = Math.random() > 0.5 ? 'none' : ['#A6A7D1', '#C0ECDF', '#FDF3B6'][Math.floor(Math.random() * 3)]
    const stroke = fill === 'none' ? ['#A6A7D1', '#C0ECDF', '#FDF3B6'][Math.floor(Math.random() * 3)] : 'none'
    const strokeWidth = fill === 'none' ? 0.5 : 0
    const rotate = Math.random() * 360
    const rotateX = Math.random() * 200
    const rotateY = Math.random() * 200
    return { points, fill, stroke, strokeWidth, rotate, rotateX, rotateY }
  })

  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute w-full h-full">
      {circles.map((circle, index) => (
        <circle
          key={index}
          cx={circle.cx}
          cy={circle.cy}
          r={circle.r}
          fill={circle.fill}
          stroke={circle.stroke}
          strokeWidth={circle.strokeWidth}
          transform={`rotate(${circle.rotate} ${circle.cx} ${circle.cy})`}
          className=""
        />
      ))}
      {triangles.map((triangle, index) => (
        <polygon
          key={index}
          points={triangle.points}
          fill={triangle.fill}
          stroke={triangle.stroke}
          strokeWidth={triangle.strokeWidth}
          transform={`rotate(${triangle.rotate} ${triangle.rotateX} ${triangle.rotateY})`}
        />
      ))}
    </svg>
  )
}
