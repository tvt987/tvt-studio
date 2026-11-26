import React, { useState } from 'react';
import { formatMoney, STUDIO_CONTACT } from '../engines/catalog';
import type { Currency, Locale, ThemeMode } from '../engines/types';
import {
  IconArrowUpRight,
  IconCart,
  IconClose,
  IconMenu,
  IconMoon,
  IconSun,
} from './Icons';

interface NavbarProps {
  locale: Locale;
  currency: Currency;
  theme: ThemeMode;
  cartItemCount: number;
  cartPayableNow: number;
  onToggleLocale: (next: Locale) => void;
  onToggleCurrency: (next: Currency) => void;
  onToggleTheme: () => void;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  locale,
  currency,
  theme,
  cartItemCount,
  cartPayableNow,
  onToggleLocale,
  onToggleCurrency,
  onToggleTheme,
  onOpenCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#catalog', label: locale === 'vi' ? 'Kho Website Mẫu' : 'Templates' },
    { href: '#estimator', label: locale === 'vi' ? 'Code Theo Yêu Cầu' : 'Custom Build' },
    { href: '#process', label: locale === 'vi' ? 'Quy Trình & SLA' : 'Process & SLA' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        backgroundColor: 'var(--bg-glass)',
        borderColor: 'var(--border-hairline)',
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <a
          href="#top"
          className="flex min-w-0 shrink items-center gap-2 focus:outline-none sm:gap-2.5"
          aria-label="TVT Studio Home"
        >
          <img
            src="./media/studio-emblem.webp"
            alt="TVT Studio Emblem"
            width={34}
            height={34}
            className="h-8 w-8 shrink-0 rounded-lg border object-cover sm:h-8.5 sm:w-8.5"
            style={{ borderColor: 'var(--border-strong)' }}
          />
          <div className="flex min-w-0 flex-col leading-none">
            <span className="font-display whitespace-nowrap text-sm font-extrabold tracking-tight sm:font-brand sm:text-base sm:tracking-wider">
              TVT STUDIO
            </span>
            <span
              className="font-mono-num hidden text-[10px] tracking-widest uppercase sm:block"
              style={{ color: 'var(--ink-muted)' }}
            >
              ARCHITECTURAL IT
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-[var(--ink-primary)]"
              style={{ color: 'var(--ink-secondary)' }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Controls Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* VI / EN Switcher */}
          <div
            className="flex items-center rounded-lg border p-0.5 text-[11px] font-semibold"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-hairline)',
            }}
            role="group"
            aria-label="Language toggle"
          >
            <button
              type="button"
              onClick={() => onToggleLocale('vi')}
              className="rounded-md px-2 py-1 transition-colors"
              style={{
                backgroundColor: locale === 'vi' ? 'var(--bg-surface)' : 'transparent',
                color: locale === 'vi' ? 'var(--ink-primary)' : 'var(--ink-muted)',
              }}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => onToggleLocale('en')}
              className="rounded-md px-2 py-1 transition-colors"
              style={{
                backgroundColor: locale === 'en' ? 'var(--bg-surface)' : 'transparent',
                color: locale === 'en' ? 'var(--ink-primary)' : 'var(--ink-muted)',
              }}
            >
              EN
            </button>
          </div>

          {/* VND / USD Switcher */}
          <div
            className="hidden items-center rounded-lg border p-0.5 text-[11px] font-semibold sm:flex"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-hairline)',
            }}
            role="group"
            aria-label="Currency toggle"
          >
            <button
              type="button"
              onClick={() => onToggleCurrency('VND')}
              className="rounded-md px-2 py-1 font-mono-num transition-colors"
              style={{
                backgroundColor: currency === 'VND' ? 'var(--bg-surface)' : 'transparent',
                color: currency === 'VND' ? 'var(--ink-primary)' : 'var(--ink-muted)',
              }}
            >
              VNĐ
            </button>
            <button
              type="button"
              onClick={() => onToggleCurrency('USD')}
              className="rounded-md px-2 py-1 font-mono-num transition-colors"
              style={{
                backgroundColor: currency === 'USD' ? 'var(--bg-surface)' : 'transparent',
                color: currency === 'USD' ? 'var(--ink-primary)' : 'var(--ink-muted)',
              }}
            >
              USD
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="btn-ghost flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={onOpenCart}
            className="btn-primary relative flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold sm:h-9 sm:gap-2 sm:px-3.5"
            aria-label={locale === 'vi' ? 'Mở giỏ hàng' : 'Open cart'}
            data-testid="navbar-cart-btn"
          >
            <IconCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">
              {cartItemCount > 0
                ? formatMoney(cartPayableNow, currency)
                : locale === 'vi'
                  ? 'Giỏ hàng'
                  : 'Cart'}
            </span>
            <span className="font-mono-num flex h-4.5 min-w-4.5 items-center justify-center rounded-md bg-black/25 px-1 text-[10px] font-bold sm:h-5 sm:min-w-5 sm:text-[11px]">
              {cartItemCount}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="btn-ghost flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <IconClose className="h-4 w-4" /> : <IconMenu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Drawer */}
      {mobileMenuOpen && (
        <div
          className="border-t px-4 py-4 lg:hidden"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-hairline)',
          }}
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                style={{ color: 'var(--ink-primary)', backgroundColor: 'var(--bg-elevated)' }}
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center justify-between pt-2">
              <div
                className="flex items-center rounded-lg border p-0.5 text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-hairline)',
                }}
              >
                <button
                  type="button"
                  onClick={() => onToggleCurrency('VND')}
                  className="rounded-md px-3 py-1.5 font-mono-num"
                  style={{
                    backgroundColor: currency === 'VND' ? 'var(--bg-surface)' : 'transparent',
                    color: currency === 'VND' ? 'var(--ink-primary)' : 'var(--ink-muted)',
                  }}
                >
                  VNĐ
                </button>
                <button
                  type="button"
                  onClick={() => onToggleCurrency('USD')}
                  className="rounded-md px-3 py-1.5 font-mono-num"
                  style={{
                    backgroundColor: currency === 'USD' ? 'var(--bg-surface)' : 'transparent',
                    color: currency === 'USD' ? 'var(--ink-primary)' : 'var(--ink-muted)',
                  }}
                >
                  USD
                </button>
              </div>
              <a
                href={STUDIO_CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
              >
                <span>Zalo {STUDIO_CONTACT.phoneDisplay}</span>
                <IconArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
