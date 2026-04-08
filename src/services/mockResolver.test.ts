import { describe, it, expect } from 'vitest';
import { mockResolver } from './mockResolver';
import { MOCK_TICKETS, MOCK_DOCUMENTS, MOCK_NOTIFICATIONS } from '@/services/mock';

describe('mockResolver', () => {
  it('returns the ticket list for GET /tickets', () => {
    const r = mockResolver({ method: 'GET', url: '/tickets' });
    expect(r?.success).toBe(true);
    expect(r?.data).toEqual(MOCK_TICKETS);
  });

  it('returns a single ticket for GET /tickets/:id', () => {
    const r = mockResolver({ method: 'GET', url: '/tickets/tk-1001' });
    expect(r?.success).toBe(true);
    expect((r?.data as { id: string }).id).toBe('tk-1001');
  });

  it('returns success=false for an unknown ticket id', () => {
    const r = mockResolver({ method: 'GET', url: '/tickets/does-not-exist' });
    expect(r?.success).toBe(false);
  });

  it('returns the document list for GET /documents', () => {
    const r = mockResolver({ method: 'GET', url: '/documents' });
    expect(r?.data).toEqual(MOCK_DOCUMENTS);
  });

  it('returns the notification list for GET /notifications', () => {
    const r = mockResolver({ method: 'GET', url: '/notifications' });
    expect(r?.data).toEqual(MOCK_NOTIFICATIONS);
  });

  it('returns null for an unmocked route (so the interceptor propagates the error)', () => {
    expect(mockResolver({ method: 'GET', url: '/unknown' })).toBeNull();
    expect(mockResolver({ method: 'POST', url: '/tickets' })).toBeNull();
  });

  it('strips query strings and absolute origins', () => {
    expect(
      mockResolver({ method: 'GET', url: 'http://localhost:8081/api/tickets?foo=bar' }),
    ).not.toBeNull();
  });
});
