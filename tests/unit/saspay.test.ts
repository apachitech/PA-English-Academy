import { describe, it, expect } from 'vitest';
import {
  createSasPayCheckoutSession,
  initiateSasPaySoftpay,
  verifySasPayPayment,
  verifySasPayWebhookSignature,
} from '../../src/lib/saspay';
import crypto from 'crypto';

describe('SasPay (sapay.me) Gateway Integration', () => {
  it('creates a hosted checkout session in sandbox mode with return_url', async () => {
    const res = await createSasPayCheckoutSession({
      amount: 15,
      currency: 'USD',
      description: 'Pass Tout Accès PA³',
      customer_email: 'naomi.k@gmail.com',
      customer_name: 'Naomi Kabamba',
      return_url: 'http://localhost:3000/tarifs?payment=success',
      metadata: { plan_id: 'plan_all_access' },
    });

    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data?.id).toContain('saspay_sess_');
    expect(res.data?.checkout_url).toContain('payment=success');
    expect(res.data?.amount).toBe('15.00');
    expect(res.data?.status).toBe('PENDING');
  });

  it('initiates direct Softpay Mobile Money push in sandbox mode', async () => {
    const res = await initiateSasPaySoftpay({
      amount: 5,
      currency: 'USD',
      country: 'CD',
      network: 'mpesa_cd',
      description: 'Pass A2 PA³',
      customer: {
        email: 'apprenant@pa3.cd',
        first_name: 'Naomi',
        last_name: 'Kabamba',
        phone: '0812345678',
      },
    });

    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data?.status).toBe('PENDING');
    expect(res.data?.instructions).toContain('+243812345678');
    expect(res.data?.instructions).toContain('PIN');
  });

  it('initiates direct Softpay push for Afrimoney (Africell RDC)', async () => {
    const res = await initiateSasPaySoftpay({
      amount: 10,
      currency: 'USD',
      country: 'CD',
      network: 'afrimoney_cd',
      description: 'Pass Pro PA³ - Afrimoney',
      customer: {
        email: 'dieudonne@pa3.cd',
        first_name: 'Dieudonné',
        last_name: 'Mutombo',
        phone: '0901234567',
      },
    });

    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data?.status).toBe('PENDING');
    expect(res.data?.instructions).toContain('+243901234567');
    expect(res.data?.instructions).toContain('AFRIMONEY_CD');
  });

  it('verifies payment status for transaction', async () => {
    const res = await verifySasPayPayment('test_tx_123');
    expect(res.success).toBe(true);
    expect(res.status).toBe('SUCCESS');
  });

  it('verifies SasPay webhook signatures with HMAC SHA256', () => {
    const secret = 'whsec_my_test_secret_123';
    const rawBody = JSON.stringify({
      event: 'transaction.success',
      data: { id: 'tx_999', amount: '15.00' },
    });
    const timestamp = '1771500000';

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${timestamp}.${rawBody}`);
    const validSignature = hmac.digest('hex');

    const isValid = verifySasPayWebhookSignature(rawBody, validSignature, timestamp, secret);
    expect(isValid).toBe(true);

    const isInvalid = verifySasPayWebhookSignature(rawBody, 'invalid_sig', timestamp, secret);
    expect(isInvalid).toBe(false);
  });
});
