import { NextRequest, NextResponse } from 'next/server';
import {
  createSasPayCheckoutSession,
  initiateSasPaySoftpay,
  CreateCheckoutSessionParams,
  formatDrcPhoneNumber,
} from '@/lib/saspay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      planId,
      title,
      amountUsd,
      customerEmail,
      customerName,
      customerPhone,
      method, // 'checkout' | 'softpay'
      network, // 'mpesa_cd' | 'airtel_cd' | 'orange_cd' | 'card'
    } = body;

    if (!amountUsd || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Champs requis manquants (montant, email, nom)' },
        { status: 400 }
      );
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
    const returnUrl = `${siteUrl}/tarifs?payment=success&plan_id=${planId || 'pass'}&email=${encodeURIComponent(customerEmail)}`;

    // Mode 1: Direct Softpay (Push USSD)
    if (method === 'softpay' && customerPhone && network) {
      const nameParts = customerName.trim().split(' ');
      const firstName = nameParts[0] || 'Apprenant';
      const lastName = nameParts.slice(1).join(' ') || 'PA3';

      const softpayRes = await initiateSasPaySoftpay({
        amount: amountUsd,
        currency: 'USD',
        country: 'CD',
        network,
        description: `Souscription ${title || 'Pass PA³ English Academy'}`,
        customer: {
          email: customerEmail,
          first_name: firstName,
          last_name: lastName,
          phone: formatDrcPhoneNumber(customerPhone),
        },
        return_url: returnUrl,
        metadata: { planId, customerEmail },
      });

      if (!softpayRes.success) {
        return NextResponse.json({ error: softpayRes.error }, { status: 422 });
      }

      return NextResponse.json({
        success: true,
        method: 'softpay',
        data: softpayRes.data,
      });
    }

    // Mode 2: Hosted Checkout Session (SasPay checkout page)
    const checkoutParams: CreateCheckoutSessionParams = {
      amount: amountUsd,
      currency: 'USD',
      description: `Souscription ${title || 'Pass PA³ English Academy'}`,
      customer_email: customerEmail,
      customer_name: customerName,
      customer_phone: customerPhone || '',
      country: 'CD',
      return_url: returnUrl,
      metadata: { planId, customerEmail },
    };

    const sessionRes = await createSasPayCheckoutSession(checkoutParams);

    if (!sessionRes.success || !sessionRes.data) {
      return NextResponse.json(
        { error: sessionRes.error || 'Impossible d’initialiser la session SasPay' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      method: 'checkout',
      data: sessionRes.data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur interne du serveur lors de l’appel SasPay' },
      { status: 500 }
    );
  }
}
