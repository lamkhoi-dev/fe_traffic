import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

/**
 * Renders text with LaTeX math expressions
 * Supports both inline ($...$) and block ($$...$$) math
 */
export const MathText = ({ children, className = '' }) => {
  if (!children || typeof children !== 'string') {
    return <span className={className}>{children}</span>
  }

  const text = children

  // Split by block math first ($$...$$)
  const blockParts = text.split(/(\$\$[^$]+\$\$)/g)
  
  const rendered = blockParts.map((part, index) => {
    // Check if it's block math
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const math = part.slice(2, -2).trim()
      try {
        return (
          <span key={index} className="block my-2">
            <BlockMath math={math} />
          </span>
        )
      } catch (e) {
        return <span key={index} className="text-red-400">{part}</span>
      }
    }
    
    // Process inline math ($...$)
    const inlineParts = part.split(/(\$[^$]+\$)/g)
    
    return inlineParts.map((inlinePart, inlineIndex) => {
      if (inlinePart.startsWith('$') && inlinePart.endsWith('$')) {
        const math = inlinePart.slice(1, -1).trim()
        try {
          return <InlineMath key={`${index}-${inlineIndex}`} math={math} />
        } catch (e) {
          return <span key={`${index}-${inlineIndex}`} className="text-red-400">{inlinePart}</span>
        }
      }
      
      // Handle \( ... \) notation as well
      if (inlinePart.includes('\\(') && inlinePart.includes('\\)')) {
        const parts = inlinePart.split(/(\\\([^)]+\\\))/g)
        return parts.map((p, pIndex) => {
          if (p.startsWith('\\(') && p.endsWith('\\)')) {
            const math = p.slice(2, -2).trim()
            try {
              return <InlineMath key={`${index}-${inlineIndex}-${pIndex}`} math={math} />
            } catch (e) {
              return <span key={`${index}-${inlineIndex}-${pIndex}`}>{p}</span>
            }
          }
          return <span key={`${index}-${inlineIndex}-${pIndex}`}>{p}</span>
        })
      }
      
      return <span key={`${index}-${inlineIndex}`}>{inlinePart}</span>
    })
  })

  return <span className={className}>{rendered}</span>
}

export default MathText
