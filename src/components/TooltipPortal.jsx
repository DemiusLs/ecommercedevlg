import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

const TooltipPortal = ({ children, targetRef }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null); // Ref per il div del tooltip stesso

 
  useEffect(() => {
    if (!targetRef.current) return;

    const handleMouseEnter = () => setShowTooltip(true);
    const handleMouseLeave = () => setShowTooltip(false);

    const targetElement = targetRef.current;
    targetElement.addEventListener('mouseenter', handleMouseEnter);
    targetElement.addEventListener('mouseleave', handleMouseLeave);

    //rimuovi gli event listener quando il componente si smonta
    return () => {
      targetElement.removeEventListener('mouseenter', handleMouseEnter);
      targetElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [targetRef]); 

  // ✨ Effetto per calcolare la posizione del tooltip quando showTooltip cambia
  useEffect(() => {
    if (showTooltip && targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect(); // Posizione del bottone
    
      setCoords({
        // window.scrollX e window.scrollY aggiungono lo scroll della pagina per posizionare rispetto al documento
        x: targetRect.left + window.scrollX + targetRect.width / 2, // `targetRect.width / 2` centra orizzontalmente
        y: targetRect.top + window.scrollY - 15, // ✨ Sposta il tooltip di 15px sopra il bottone
      });
    }

    // Aggiungi un listener per il resize della finestra per riposizionare il tooltip
    const handleResize = () => {
        if (showTooltip && targetRef.current && tooltipRef.current) {
            const targetRect = targetRef.current.getBoundingClientRect();
            setCoords({
                x: targetRect.left + window.scrollX + targetRect.width / 2,
                y: targetRect.top + window.scrollY - 15,
            });
        }
    };
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };

  }, [showTooltip, targetRef]); 

  // Se showTooltip è false, non renderizzare nulla
  if (!showTooltip) return null;

  // ✨ Renderizza il children (il testo del tooltip) in un elemento al di fuori dell'albero DOM corrente
  return createPortal(
    <div
      ref={tooltipRef} // Assegna il ref al div del tooltip per misurare le sue dimensioni
      style={{
        position: 'absolute',
        left: coords.x,
        top: coords.y,
        transform: 'translateX(-50%) translateY(-100%)', // Centra il tooltip orizzontalmente e lo sposta sopra la posizione 'top'
        zIndex: 9999, // Un z-index molto alto per essere sicuro che sia sopra tutto
        pointerEvents: 'none', // Importante: non blocca gli eventi del mouse sugli elementi sottostanti
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        padding: '5px 8px',
        borderRadius: '6px',
        whiteSpace: 'nowrap', // Impedisce al testo di andare a capo
        fontSize: '0.8rem',
        fontWeight: `600`,
        opacity: 1, // Assicura che sia visibile
        transition: 'opacity 0.3s, transform 0.3s', // Animazione di comparsa
      }}
    >
      {children}
      {/* Freccetta del tooltip (se desiderata, puoi crearla qui con un pseudo-elemento o un div extra) */}
      <div style={{
          position: 'absolute',
          top: '100%', // Sotto il tooltip
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '7px',
          borderStyle: 'solid',
          borderColor: 'rgba(0, 0, 0, 0.8) transparent transparent transparent',
      }}></div>
    </div>,
    document.body // ✨ Renderizza nel body del documento HTML
  );
};

export default TooltipPortal;