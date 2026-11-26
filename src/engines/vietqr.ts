import type { BankVietQrConfig } from './types';

export interface VietnamBankInfo {
  bin: string;
  shortName: string;
  fullName: string;
}

export const VIETNAM_BANKS: VietnamBankInfo[] = [
  { bin: '970422', shortName: 'MB Bank', fullName: 'Ngân hàng TMCP Quân Đội (MB)' },
  { bin: '970436', shortName: 'Vietcombank', fullName: 'Ngân hàng TMCP Ngoại Thương Việt Nam (VCB)' },
  { bin: '970407', shortName: 'Techcombank', fullName: 'Ngân hàng TMCP Kỹ Thương Việt Nam (TCB)' },
  { bin: '970416', shortName: 'ACB', fullName: 'Ngân hàng TMCP Á Châu (ACB)' },
  { bin: '970423', shortName: 'TPBank', fullName: 'Ngân hàng TMCP Tiên Phong (TPBank)' },
  { bin: '970418', shortName: 'BIDV', fullName: 'Ngân hàng TMCP Đầu Tư và Phát Triển Việt Nam' },
  { bin: '970415', shortName: 'VietinBank', fullName: 'Ngân hàng TMCP Công Thương Việt Nam' },
  { bin: '970432', shortName: 'VPBank', fullName: 'Ngân hàng TMCP Việt Nam Thịnh Vượng' },
  { bin: '970403', shortName: 'Sacombank', fullName: 'Ngân hàng TMCP Sài Gòn Thương Tín' },
  { bin: '970441', shortName: 'VIB', fullName: 'Ngân hàng TMCP Quốc Tế Việt Nam' },
];

export const BANK_CONFIG_STORAGE_KEY = 'tvt_studio_bank_vietqr_v2';

export function sanitizeAccountNumber(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9]/g, '').trim();
}

export function sanitizeAccountName(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

/**
 * Strips hyphens/spaces from `TVT-ORD-4821` -> `TVTORD4821` because several
 * Vietnamese banks strip `-` characters from inbound transfer memos.
 */
export function formatBankSafeMemo(orderCode: string): string {
  return orderCode.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 25);
}

/**
 * Extracts and normalizes any TVT Studio order code from raw bank statements
 * (handles `TVT-ORD-4821`, `TVTORD4821`, `MBVCB.9182.TVT ORD 4821.CT`).
 */
export function extractNormalizedOrderCode(rawMemo: string): string | null {
  const match = rawMemo.toUpperCase().match(/TVT[\s_-]*ORD[\s_-]*(\d{4})/);
  return match ? `TVT-ORD-${match[1]}` : null;
}

export function isValidBankVietQrConfig(config: BankVietQrConfig | null | undefined): config is BankVietQrConfig {
  if (!config) return false;
  const acct = sanitizeAccountNumber(config.accountNumber);
  return Boolean(config.bankBin.trim() && acct.length >= 6 && config.accountName.trim().length >= 2);
}

/**
 * Builds an official NAPAS VietQR dynamic image URL via img.vietqr.io
 * that auto-fills bank account, exact VND amount, and order transfer memo
 * in every Vietnamese banking app.
 */
export function buildVietQrImageUrl(
  config: BankVietQrConfig,
  amountVnd: number,
  transferMemo: string
): string {
  const bin = encodeURIComponent(config.bankBin.trim());
  const acct = encodeURIComponent(sanitizeAccountNumber(config.accountNumber));
  const safeAmount = Math.max(0, Math.round(amountVnd));
  const memo = encodeURIComponent(transferMemo.trim().slice(0, 50));
  const accName = encodeURIComponent(sanitizeAccountName(config.accountName));
  return `https://img.vietqr.io/image/${bin}-${acct}-compact2.png?amount=${safeAmount}&addInfo=${memo}&accountName=${accName}`;
}

export function loadBankVietQrConfig(): BankVietQrConfig | null {
  // 1. Check build-time Vite env vars first (for zero-touch production deployment)
  const envBin = (import.meta.env?.VITE_BANK_BIN as string | undefined)?.trim();
  const envAcct = (import.meta.env?.VITE_BANK_ACCOUNT as string | undefined)?.trim();
  const envName = (import.meta.env?.VITE_BANK_ACCOUNT_NAME as string | undefined)?.trim();
  if (envBin && envAcct && envName) {
    const bank = VIETNAM_BANKS.find((b) => b.bin === envBin);
    const envConfig: BankVietQrConfig = {
      bankBin: envBin,
      bankShortName: bank?.shortName ?? envBin,
      accountNumber: sanitizeAccountNumber(envAcct),
      accountName: sanitizeAccountName(envName),
    };
    if (isValidBankVietQrConfig(envConfig)) {
      return envConfig;
    }
  }

  // 2. Check Owner Console local configuration
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(BANK_CONFIG_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BankVietQrConfig;
    return isValidBankVietQrConfig(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveBankVietQrConfig(config: BankVietQrConfig | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!config || !isValidBankVietQrConfig(config)) {
      window.localStorage.removeItem(BANK_CONFIG_STORAGE_KEY);
      return;
    }
    const normalized: BankVietQrConfig = {
      bankBin: config.bankBin.trim(),
      bankShortName:
        config.bankShortName.trim() ||
        VIETNAM_BANKS.find((b) => b.bin === config.bankBin.trim())?.shortName ||
        config.bankBin.trim(),
      accountNumber: sanitizeAccountNumber(config.accountNumber),
      accountName: sanitizeAccountName(config.accountName),
    };
    window.localStorage.setItem(BANK_CONFIG_STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // Ignore storage quota errors
  }
}
