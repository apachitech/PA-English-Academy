import { NextRequest, NextResponse } from 'next/server';
import { verifySasPayWebhookSignature, SASPAY_CONFIG } from '@/lib/saspay';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature');
    const timestamp = req.headers.get('x-webhook-timestamp');

    // In production with a webhook secret configured, verify HMAC signature
    if (SASPAY_CONFIG.webhookSecret && SASPAY_CONFIG.webhookSecret !== 'whsec_pa3_demo_secret') {
      const isValid = verifySasPayWebhookSignature(
        rawBody,
        signature,
        timestamp,
        SASPAY_CONFIG.webhookSecret
      );

      if (!isValid) {
        return NextResponse.json(
          { error: 'Signature de webhook SasPay invalide' },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(rawBody || '{}');
    const eventType = payload.event || payload.type || 'transaction.success';
    const transaction = payload.data || payload.transaction || payload;

    // Handle events
    switch (eventType) {
      case 'transaction.success':
      case 'payment.success':
        // Transaction completed successfully - unlock user tier
        console.log('✅ SasPay Payment Success:', {
          id: transaction.id,
          amount: transaction.amount,
          customer: transaction.customer || transaction.customer_email,
          metadata: transaction.metadata,
        });
        break;

      case 'transaction.failed':
      case 'payment.failed':
        console.warn('❌ SasPay Payment Failed:', {
          id: transaction.id,
          reason: transaction.failure_reason || transaction.message,
        });
        break;

      default:
        console.log(`ℹ️ Unhandled SasPay webhook event: ${eventType}`);
        break;
    }

    return NextResponse.json({ received: true, event: eventType });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur lors du traitement du webhook' },
      { status: 400 }
    );
  }
}
