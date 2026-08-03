export interface DeliverySchedule {
  estimatedPrepTimeMinutes: number;
  dispatchTime: string;
  exactDeliveryTime: string;
  seatId: string;
  status: 'scheduled' | 'preparing' | 'in_transit' | 'delivered';
}

export function calculatePredictiveDelivery(
  movieStartTimestamp: number,
  deliveryTiming: 'before_movie' | 'intermission',
  seatId: string,
  itemCount: number
): DeliverySchedule {
  const prepDuration = Math.max(5, itemCount * 3); // 3 mins per item, min 5 mins

  let deliveryTarget: number;
  if (deliveryTiming === 'before_movie') {
    deliveryTarget = movieStartTimestamp - 2 * 60 * 1000; // 2 mins before showtime
  } else {
    deliveryTarget = movieStartTimestamp + 50 * 60 * 1000; // 50 mins into movie (intermission)
  }

  const dispatchTarget = deliveryTarget - prepDuration * 60 * 1000;

  return {
    estimatedPrepTimeMinutes: prepDuration,
    dispatchTime: new Date(dispatchTarget).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
    exactDeliveryTime: new Date(deliveryTarget).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
    seatId,
    status: 'scheduled',
  };
}
