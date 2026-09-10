import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ElementalSplashControls } from '@/components/splash/ElementalSplashControls';
import { ElementalSplash } from '@/components/splash/ElementalSplash';
import { BiometricSplash } from '@/components/splash/BiometricSplash';

let currentPathname = '/';
vi.mock('next/navigation', () => ({
  usePathname: () => currentPathname,
}));

vi.mock('@/lib/hooks/useAcousticEngine', () => ({
  useAcousticEngine: () => ({
    playCinematicImpact: vi.fn(),
    playSubBassDrop: vi.fn(),
    playSpatializedClick: vi.fn(),
    initAudio: vi.fn(),
    isAudioSuspended: () => false,
  }),
}));

describe('Elemental Splash Screen Suite (Sprint 173)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    currentPathname = '/';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders all elemental variants and controls in ElementalSplashControls', () => {
    const onSelectVariant = vi.fn();
    const onEnter = vi.fn();
    const onSkip = vi.fn();
    const onToggleAudio = vi.fn();

    render(
      <ElementalSplashControls
        activeVariant="all"
        onSelectVariant={onSelectVariant}
        onEnter={onEnter}
        onSkip={onSkip}
        audioMuted={false}
        onToggleAudio={onToggleAudio}
      />
    );

    expect(screen.getByText('כל הסרטים (TMDB)')).toBeDefined();
    expect(screen.getByText('אווטאר · מים')).toBeDefined();
    expect(screen.getByText('בין כוכבים · ברק')).toBeDefined();
    expect(screen.getByText('חולית 2 · אש')).toBeDefined();
    expect(screen.getByText('כניסה לקולנוע')).toBeDefined();
    expect(screen.getByText('דלג / SKIP')).toBeDefined();

    fireEvent.click(screen.getByText('אווטאר · מים'));
    expect(onSelectVariant).toHaveBeenCalledWith('water');

    fireEvent.click(screen.getByText('כניסה לקולנוע'));
    expect(onEnter).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('דלג / SKIP'));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('renders ElementalSplash with MOVIEBOOK branding and handles autoDismissDelay', () => {
    const onComplete = vi.fn();

    render(<ElementalSplash onComplete={onComplete} autoDismissDelay={3000} />);

    expect(screen.getByText('MOVIE')).toBeDefined();
    expect(screen.getByText('BOOK')).toBeDefined();
    expect(screen.getByText(/CinePulse · חוויית קולנוע פרימיום ועתידנית/i)).toBeDefined();

    const iframe = screen.getByTitle('CinePulse Elemental Splash');
    expect(iframe).toBeDefined();
    expect(iframe.getAttribute('src')).toBe('/splash/elemental-splash.html');

    // Advance timer past autoDismissDelay (3000ms) + exit transition (600ms)
    act(() => {
      vi.advanceTimersByTime(3700);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('does NOT trigger automatically on home page load, and opens upon user choice', () => {
    currentPathname = '/';
    const { container } = render(<BiometricSplash />);

    // Must NOT be visible by default (user wants to choose, not automatic)
    expect(container.firstChild).toBeNull();

    // User chooses to open elemental splash
    act(() => {
      window.dispatchEvent(
        new CustomEvent('open-elemental-splash', { detail: { variant: 'lightning' } })
      );
    });

    expect(screen.getByText('MOVIE')).toBeDefined();
    expect(screen.getByText('BOOK')).toBeDefined();
  });
});
