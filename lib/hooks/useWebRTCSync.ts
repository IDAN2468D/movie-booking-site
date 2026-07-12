import { useEffect, useRef } from 'react';
import { useSetPeerCoordinates, useSetPlaybackState } from '@/lib/store/phantomStore';
import { PeerSignalPayload } from '@/lib/validations/phantom';

export function useWebRTCSync(sessionId: string) {
  const setPeerCoordinates = useSetPeerCoordinates();
  const setPlaybackState = useSetPlaybackState();

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19002' }],
    });

    const setupDataChannel = (channel: RTCDataChannel) => {
      channel.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as PeerSignalPayload;
          if (payload.type === 'cursor_move' && payload.coordinates) {
            setPeerCoordinates(payload.coordinates);
          }
        } catch (err) {
          console.error('Failed to parse WebRTC data message:', err);
        }
      };
      dcRef.current = channel;
    };

    // Create host channel
    const dc = pc.createDataChannel('sync-channel');
    setupDataChannel(dc);

    pc.ondatachannel = (event) => {
      setupDataChannel(event.channel);
    };

    pcRef.current = pc;

    return () => {
      pc.close();
    };
  }, [sessionId, setPeerCoordinates, setPlaybackState]);

  const sendCursorMove = (coords: { row: number; col: number; x: number; y: number }) => {
    if (dcRef.current && dcRef.current.readyState === 'open') {
      dcRef.current.send(
        JSON.stringify({
          type: 'cursor_move',
          coordinates: coords,
        })
      );
    }
  };

  return { sendCursorMove };
}
