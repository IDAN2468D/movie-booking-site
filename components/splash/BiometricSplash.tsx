"use client";

import React, { useState, useEffect } from "react";
import { ElementalSplash } from "./ElementalSplash";
import { ElementalVariant } from "./ElementalSplashControls";

/**
 * BiometricSplash / HomeElementalSplash
 * User-controlled opt-in Elemental Splash screen (Water, Lightning, Fire).
 * Does NOT run automatically; user selects when to open and can pick initial element.
 */
export function BiometricSplash() {
  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState<ElementalVariant>('all');

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ variant?: ElementalVariant }>;
      if (customEvent.detail?.variant) {
        setVariant(customEvent.detail.variant);
      } else {
        setVariant('all');
      }
      setIsVisible(true);
    };

    window.addEventListener('open-elemental-splash', handleOpen);
    return () => window.removeEventListener('open-elemental-splash', handleOpen);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <ElementalSplash
      initialVariant={variant}
      onComplete={() => setIsVisible(false)}
    />
  );
}

export { BiometricSplash as HomeElementalSplash };
