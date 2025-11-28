/**
 * UiPath SDK Client Configuration for Action Apps
 *
 * This file configures the UiPath TypeScript SDK client for Action Center integration.
 * The SDK provides access to TaskEventsService for communicating with Action Center.
 *
 * For Action Apps, the SDK is typically initialized at runtime with credentials
 * received from Action Center via the loadApp event.
 */

import { UiPath } from 'uipath-sdk';

/**
 * Default UiPath SDK client
 *
 * For Action Apps, credentials are provided at runtime by Action Center.
 * This initial instance uses environment variables as fallback for local development.
 */
let uipathClient = new UiPath({
  baseUrl: import.meta.env.VITE_UIPATH_BASE_URL || 'https://cloud.uipath.com',
  orgName: import.meta.env.VITE_UIPATH_ORG_NAME || '',
  tenantName: import.meta.env.VITE_UIPATH_TENANT_NAME || '',
  secret: import.meta.env.VITE_UIPATH_ACCESS_TOKEN || '',
});

/**
 * Initialize or reinitialize the SDK with runtime configuration from Action Center
 *
 * This is called when Action Center sends credentials via the loadApp event.
 *
 * @param config - Runtime configuration from Action Center
 */
export function initializeSdk(config: {
  baseUrl: string;
  orgName: string;
  tenantName: string;
  token: string;
}): void {
  uipathClient = new UiPath({
    baseUrl: config.baseUrl,
    orgName: config.orgName,
    tenantName: config.tenantName,
    secret: config.token,
  });
  console.log('[UiPath SDK] Initialized with Action Center config');
}

/**
 * Update the SDK token when Action Center refreshes it
 *
 * @param newToken - The refreshed authentication token
 */
export function updateToken(newToken: string): void {
  uipathClient.updateToken(newToken);
  console.log('[UiPath SDK] Token updated');
}

/**
 * Get the current UiPath SDK client instance
 */
export function getUiPathClient(): UiPath {
  return uipathClient;
}

/**
 * Default export for convenience
 */
export const uipath = uipathClient;

/**
 * Type exports for UiPath SDK types
 */
export type { UiPath } from 'uipath-sdk';
