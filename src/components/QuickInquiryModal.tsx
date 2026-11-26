import React, { useState } from 'react';
import { STUDIO_CONTACT } from '../engines/catalog';
import { PREFERRED_STACK_OPTIONS } from '../engines/estimator';
import {
  dispatchInquiryToCloud,
  generateInquiryCode,
} from '../engines/orderLedger';
import type { Locale, QuickInquiryRecord, TemplateProduct } from '../engines/types';
import { IconCheck, IconClose, IconPhone } from './Icons';

interface QuickInquiryModalProps {
  isOpen: boolean;
  targetProduct: TemplateProduct | null;
  locale: Locale;
  onClose: () => void;
  onInquirySaved: (record: QuickInquiryRecord) => void;
}

export const QuickInquiryModal: React.FC<QuickInquiryModalProps> = ({
  isOpen,
  targetProduct,
  locale,
  onClose,
  onInquirySaved,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneOrZalo, setPhoneOrZalo] = useState('');
  const [email, setEmail] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<string>(PREFERRED_STACK_OPTIONS[0].vi);
  const [budgetNote, setBudgetNote] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<QuickInquiryRecord | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneOrZalo.trim()) return;
    setSubmitting(true);

    const draft: QuickInquiryRecord = {
      inquiryCode: generateInquiryCode(),
      createdAtIso: new Date().toISOString(),
      productId: targetProduct?.id,
      productName: targetProduct?.name,
      fullName: fullName.trim(),
      phoneOrZalo: phoneOrZalo.trim(),
      email: email.trim() || 'Chưa cung cấp',
      preferredLanguage,
      budgetNote: budgetNote.trim() || 'Thương lượng linh hoạt',
      message:
        message.trim() ||
        (targetProduct
          ? `Muốn tư vấn & tinh chỉnh mẫu ${targetProduct.name}`
          : 'Muốn tư vấn thiết kế website / phần mềm theo yêu cầu'),
      syncState: 'local_idb_only',
    };

    const syncState = await dispatchInquiryToCloud(draft);
    const finalRecord: QuickInquiryRecord = { ...draft, syncState };
    onInquirySaved(finalRecord);
    setSubmittedRecord(finalRecord);
    setSubmitting(false);
  };

  const handleResetAndClose = () => {
    setSubmittedRecord(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Quick Consultation & Negotiation"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-strong)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: 'var(--border-hairline)' }}
        >
          <div>
            <span className="font-mono-num text-[11px] font-semibold uppercase" style={{ color: 'var(--accent)' }}>
              {targetProduct ? `TƯ VẤN & TINH CHỈNH · ${targetProduct.name}` : 'TƯ VẤN DỰ ÁN RIÊNG · 0₫ PHÍ TƯ VẤN'}
            </span>
            <h2 className="font-display text-lg font-extrabold">
              {locale === 'vi'
                ? 'Trao Đổi Yêu Cầu & Thương Lượng Giá Trực Tiếp'
                : 'Consult Requirements & Negotiate Directly'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="btn-ghost flex h-9 w-9 items-center justify-center rounded-lg"
            aria-label="Close inquiry modal"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          {submittedRecord ? (
            <div className="space-y-4 text-center">
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: 'var(--emerald-soft)', color: 'var(--emerald)' }}
              >
                <IconCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-extrabold">
                {locale === 'vi'
                  ? `Đã Ghi Nhận Yêu Cầu ${submittedRecord.inquiryCode}`
                  : `Inquiry ${submittedRecord.inquiryCode} Received`}
              </h3>
              <p className="text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--ink-secondary)' }}>
                {locale === 'vi'
                  ? 'Thông tin của bạn đã được lưu an toàn. Trương Văn Tình sẽ liên hệ trực tiếp qua Zalo/SĐT trong vòng 15 phút để tư vấn phương án & báo giá hợp lý nhất.'
                  : 'Your inquiry has been logged safely. Truong Van Tinh will reach out directly via Zalo or Email within 15 minutes.'}
              </p>
              <div className="flex flex-wrap justify-center gap-2.5 pt-2">
                <a
                  href={STUDIO_CONTACT.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold"
                >
                  <IconPhone className="h-4 w-4" />
                  <span>Nhắn Zalo Ngay ({STUDIO_CONTACT.phoneDisplay})</span>
                </a>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="btn-secondary rounded-xl px-5 py-3 text-xs font-semibold"
                >
                  Đóng
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="inq-name" className="block text-xs font-semibold">
                    {locale === 'vi' ? 'Họ và tên *' : 'Full Name *'}
                  </label>
                  <input
                    id="inq-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="inq-phone" className="block text-xs font-semibold">
                    {locale === 'vi' ? 'Số điện thoại / Zalo *' : 'Phone / Zalo *'}
                  </label>
                  <input
                    id="inq-phone"
                    type="tel"
                    required
                    value={phoneOrZalo}
                    onChange={(e) => setPhoneOrZalo(e.target.value)}
                    placeholder="0909 123 456"
                    className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="inq-email" className="block text-xs font-semibold">
                    Email ({locale === 'vi' ? 'Tùy chọn' : 'Optional'})
                  </label>
                  <input
                    id="inq-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.vn"
                    className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="inq-lang" className="block text-xs font-semibold">
                    {locale === 'vi' ? 'Ngôn ngữ lập trình mong muốn' : 'Preferred Language / Stack'}
                  </label>
                  <select
                    id="inq-lang"
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="input-studio mt-1.5 h-10 w-full rounded-xl px-3 text-xs"
                  >
                    {PREFERRED_STACK_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt[locale]}>
                        {opt[locale]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="inq-budget" className="block text-xs font-semibold">
                  {locale === 'vi' ? 'Ngân sách dự kiến (Hoặc để trống để thương lượng)' : 'Target Budget (Optional)'}
                </label>
                <input
                  id="inq-budget"
                  type="text"
                  value={budgetNote}
                  onChange={(e) => setBudgetNote(e.target.value)}
                  placeholder="VD: Khoảng 2–4 triệu, muốn chỉnh thêm phần đặt lịch..."
                  className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 text-sm"
                />
              </div>

              <div>
                <label htmlFor="inq-msg" className="block text-xs font-semibold">
                  {locale === 'vi' ? 'Yêu cầu chi tiết / Tính năng cần tinh chỉnh' : 'Requirements / Custom Refinements'}
                </label>
                <textarea
                  id="inq-msg"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    targetProduct
                      ? `Mình quan tâm mẫu ${targetProduct.name}, muốn đổi màu nhận diện và thêm tính năng...`
                      : 'Mô tả ngắn ý tưởng website/phần mềm bạn muốn làm...'
                  }
                  className="input-studio mt-1.5 w-full rounded-xl p-3 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold disabled:opacity-60"
                data-testid="submit-quick-inquiry-btn"
              >
                <IconCheck className="h-4 w-4" />
                <span>
                  {submitting
                    ? locale === 'vi'
                      ? 'Đang gửi yêu cầu...'
                      : 'Sending...'
                    : locale === 'vi'
                      ? 'Gửi Yêu Cầu Tư Vấn (Miễn Phí)'
                      : 'Send Free Consultation Request'}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
