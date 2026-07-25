'use server';

import { GroupSyncSchema, GroupSyncResult, GroupSyncInput } from '@/lib/validations/group-sync';

export async function evaluateGroupSyncAction(input: GroupSyncInput): Promise<{
  success: boolean;
  data?: GroupSyncResult;
  error?: string;
}> {
  try {
    const validated = GroupSyncSchema.parse(input);

    const syncedParticipants = validated.participants.filter((p) => p.isSynced);
    const syncedCount = syncedParticipants.length;
    const totalCount = validated.participants.length || 1;

    const calculatedScore = Math.min(100, Math.round((syncedCount / totalCount) * 100));
    const harmonicChordFreq = 440 + calculatedScore * 4;

    let mergedGlowColor = 'rgba(56, 189, 248, 0.5)';
    if (calculatedScore >= 100) {
      mergedGlowColor = 'rgba(168, 85, 247, 0.8)';
    } else if (calculatedScore > 50) {
      mergedGlowColor = 'rgba(14, 165, 233, 0.6)';
    }

    let statusHebrew = 'מחכה למשתתפים';
    let descriptionHebrew = 'לחצו יחד כדי לסנכרן את ההילה הקבוצתית במרחב';

    if (calculatedScore >= 100) {
      statusHebrew = 'הרמוניה קבוצתית מלאה';
      descriptionHebrew = 'כל חברי הקבוצה מסונכרנים בתדר קולנועי מאוחד!';
    } else if (calculatedScore > 0) {
      statusHebrew = 'מבצע סנכרון תדרים';
      descriptionHebrew = `${syncedCount} מתוך ${totalCount} חברים מסונכרנים כעת`;
    }

    return {
      success: true,
      data: {
        resonanceScore: calculatedScore,
        harmonicChordFreq,
        statusHebrew,
        descriptionHebrew,
        mergedGlowColor,
        syncedCount,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'הערכת הסנכרון הקבוצתי נכשלה';
    return { success: false, error: msg };
  }
}
