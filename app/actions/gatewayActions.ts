'use server';

import { OmniRequestSchema, OmniResponse, GatewayFeatureData } from '@/lib/validations/gatewaySchema';

export async function processOmniQueryAction(prevState: any, formData: FormData): Promise<OmniResponse> {
  const query = formData.get('query') as string;
  const parsed = OmniRequestSchema.safeParse({ query });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { query: queryText } = parsed.data;
  const lowerQuery = queryText.toLowerCase();

  // Controlled artificial delay of 800ms for premium transition feel
  await new Promise((resolve) => setTimeout(resolve, 800));

  try {
    if (lowerQuery.includes('כרטיס') || lowerQuery.includes('ticket') || lowerQuery.includes('הזמנה')) {
      return {
        success: true,
        data: {
          intent: 'TICKET_RETRIEVAL',
          redirectUrl: '/tickets',
          payload: { query: queryText }
        }
      };
    } else if (
      lowerQuery.includes('מצב רוח') ||
      lowerQuery.includes('mood') ||
      lowerQuery.includes('גילוי') ||
      lowerQuery.includes('נוירון')
    ) {
      return {
        success: true,
        data: {
          intent: 'MOOD_DISCOVERY',
          redirectUrl: `/discover/neural?mood=${encodeURIComponent(queryText)}`,
          payload: { query: queryText }
        }
      };
    } else {
      return {
        success: true,
        data: {
          intent: 'SEARCH_MOVIE',
          redirectUrl: `/?search=${encodeURIComponent(queryText)}`,
          payload: { query: queryText }
        }
      };
    }
  } catch (error) {
    return { success: false, error: 'אירעה שגיאה בעיבוד השאילתה שלך' };
  }
}

export async function getGatewayFeaturesAction(): Promise<{ success: boolean; data?: GatewayFeatureData[]; error?: string }> {
  try {
    const features: GatewayFeatureData[] = [
      {
        id: "90ca119a-0988-4dc2-9454-0b7b09f9ed57",
        featureId: "NEURAL_DISCOVERY",
        title: "גילוי נוירוני",
        description: "מערכת המלצות חכמה המבוססת על מצב הרוח וההעדפות הביומטריות שלך בזמן אמת.",
        iconSvg: "brain",
        callToAction: {
          label: "התחל גילוי",
          href: "/discover/neural"
        },
        glassEffectSettings: {
          backdropBlur: "blur-xl",
          borderOpacity: 0.15
        }
      },
      {
        id: "417712b5-e011-4289-8564-73959b0471fe",
        featureId: "KINETIC_TICKET",
        title: "כרטיס קינטי",
        description: "חווית כרטיס תלת-ממדית אינטראקטיבית עם הדמיות שברים המגיבות לתנועת העכבר.",
        iconSvg: "ticket",
        callToAction: {
          label: "צפה בכרטיסים שלי",
          href: "/tickets"
        },
        glassEffectSettings: {
          backdropBlur: "blur-xl",
          borderOpacity: 0.15
        }
      }
    ];

    return { success: true, data: features };
  } catch (error) {
    return { success: false, error: 'אירעה שגיאה בטעינת התכונות' };
  }
}
