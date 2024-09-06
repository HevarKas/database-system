import { useState, useEffect, useCallback } from 'react';

const useTooltip = () => {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = useCallback((id: string) => {
    setTooltip(id);
    setShowTooltip(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showTooltip) {
      timer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showTooltip]);

  return { tooltip, showTooltip, handleMouseEnter, handleMouseLeave };
};

export default useTooltip;
