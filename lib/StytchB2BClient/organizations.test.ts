import { Organizations } from './organizations';
import { MOCK_FETCH_CONFIG, mockRequest } from './testHelpers';
import { request, SearchOperator } from './base';

jest.mock('./base');
beforeEach(() => {
  (request as jest.Mock).mockReset();
  (request as jest.Mock).mockImplementation((_, config) => {
    return Promise.resolve({
      method: config.method,
      path: config.url,
      data: config.data,
      params: config.params,
    });
  });
});

const organizations = new Organizations(MOCK_FETCH_CONFIG);

describe('organizations.create', () => {
  test('success', () => {
    return expect(
      organizations.create({
        organization_name: 'organization_name',
        organization_slug: 'slug',
        organization_logo_url: 'https://example.com',
        trusted_metadata: { a: 1, b: 'two' },
        sso_jit_provisioning: 'ALL_ALLOWED',
        email_allowed_domains: ['stytch.co', 'example.io'],
        email_jit_provisioning: 'RESTRICTED',
        email_invites: 'ALL_ALLOWED',
      }),
    ).resolves.toMatchObject({
      method: 'POST',
      path: 'organizations',
      data: {
        organization_name: 'organization_name',
        organization_slug: 'slug',
        organization_logo_url: 'https://example.com',
        trusted_metadata: { a: 1, b: 'two' },
        sso_jit_provisioning: 'ALL_ALLOWED',
        email_allowed_domains: ['stytch.co', 'example.io'],
        email_jit_provisioning: 'RESTRICTED',
        email_invites: 'ALL_ALLOWED',
      },
    });
  });
});

describe('organizations.get', () => {
  test('success', () => {
    return expect(organizations.get('organization-id-1234')).resolves.toMatchObject({
      method: 'GET',
      path: 'organizations/organization-id-1234',
    });
  });
});

describe('organizations.search', () => {
  test('success', () => {
    mockRequest((req) => {
      expect(req).toEqual({
        method: 'POST',
        path: 'organizations/search',
        data: {
          limit: 200,
          query: {
            operator: SearchOperator.OR,
            operands: [
              { filter_name: 'organization_id', filter_value: ['organization-id-1234'] },
              { filter_name: 'organization_slug_fuzzy', filter_value: '1234' },
            ],
          },
        },
      });

      const data = {
        request_id: 'request-id-test-55555555-5555-4555-8555-555555555555',
        results: [
          {
            organization_id: 'organization-id-1234',
          },
        ],
        results_metadata: {
          total: 0,
          next_cursor: null,
        },
        status_code: 200,
      };
      return { status: 200, data };
    });

    return expect(
      organizations.search({
        limit: 200,
        query: {
          operator: SearchOperator.OR,
          operands: [
            { filter_name: 'organization_id', filter_value: ['organization-id-1234'] },
            { filter_name: 'organization_slug_fuzzy', filter_value: '1234' },
          ],
        },
      }),
    ).resolves.toMatchObject({
      request_id: 'request-id-test-55555555-5555-4555-8555-555555555555',
      results: [
        {
          organization_id: 'organization-id-1234',
        },
      ],
      results_metadata: {
        total: 0,
        next_cursor: null,
      },
      status_code: 200,
    });
  });
});

describe('organizations.update', () => {
  test('success', () => {
    return expect(
      organizations.update('organization-id-1234', {
        organization_name: 'organization_name',
        organization_slug: 'slug',
        organization_logo_url: 'https://example.com',
        trusted_metadata: { a: 1, b: 'two' },
        sso_default_connection_id: 'saml-connection-1234',
        sso_jit_provisioning: 'ALL_ALLOWED',
        sso_jit_provisioning_allowed_connections: ['saml-connection-1234'],
        email_allowed_domains: ['stytch.co', 'example.io'],
        email_jit_provisioning: 'RESTRICTED',
        email_invites: 'ALL_ALLOWED',
      }),
    ).resolves.toMatchObject({
      method: 'PUT',
      path: 'organizations/organization-id-1234',
      data: {
        organization_name: 'organization_name',
        organization_slug: 'slug',
        organization_logo_url: 'https://example.com',
        trusted_metadata: { a: 1, b: 'two' },
        sso_default_connection_id: 'saml-connection-1234',
        sso_jit_provisioning: 'ALL_ALLOWED',
        sso_jit_provisioning_allowed_connections: ['saml-connection-1234'],
        email_allowed_domains: ['stytch.co', 'example.io'],
        email_jit_provisioning: 'RESTRICTED',
        email_invites: 'ALL_ALLOWED',
      },
    });
  });
});

describe('organizations.delete', () => {
  test('success', () => {
    return expect(organizations.delete('organization-id-1234')).resolves.toMatchObject({
      method: 'DELETE',
      path: 'organizations/organization-id-1234',
    });
  });
});