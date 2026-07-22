"use client";

import { useEffect, useRef, useState } from "react";
import { QUOTE_STEPS } from "./quoteSteps";
import { getLenis } from "./lenisRef";
import { pushToDataLayer } from "@/lib/gtm";
import styles from "./QuoteBuilder.module.css";

const STORAGE_KEY = "lalo-quote-v3";
const TOTAL = QUOTE_STEPS.length;
const ADVANCE_DELAY = 250; // ms: let the selected state show before auto-advancing

const EMPTY_CONTACT = { name: "", email: "", phone: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TITLE_ID = "quote-step-title";
const CONFIRM_ID = "quote-confirm-title";

export default function QuoteBuilder() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // occasion, lookingFor, vision
  const [contact, setContact] = useState(EMPTY_CONTACT);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [confirming, setConfirming] = useState(false);

  const hydrated = useRef(false);
  const headingRef = useRef(null);
  const dialogRef = useRef(null);
  const bodyRef = useRef(null);
  const triggerRef = useRef(null);
  const keepBtnRef = useRef(null);
  const successCloseRef = useRef(null);
  const advanceTimer = useRef(null);
  const tracked = useRef(false); // one conversion event per submission
  const stateRef = useRef({ index: 0, status: "idle", confirming: false });
  stateRef.current = { index, status, confirming };

  // ---- Persistence -------------------------------------------------------

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.answers) setAnswers(saved.answers);
        if (saved.contact) setContact({ ...EMPTY_CONTACT, ...saved.contact });
        if (typeof saved.index === "number") {
          setIndex(Math.min(Math.max(saved.index, 0), TOTAL - 1));
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ index, answers, contact })
      );
    } catch {
      /* storage full or unavailable, non-fatal */
    }
  }, [index, answers, contact]);

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  // ---- Step logic --------------------------------------------------------

  const step = QUOTE_STEPS[index];
  const isLast = index === TOTAL - 1;

  const goTo = (next) => {
    clearTimeout(advanceTimer.current);
    setIndex(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  // Card selection: mark it, then auto-advance after a short beat (only on
  // explicit activation — click or Enter/Space — never on focus).
  const select = (value) => {
    setAnswers((a) => ({ ...a, [step.id]: value }));
    clearTimeout(advanceTimer.current);
    const next = index + 1;
    advanceTimer.current = setTimeout(() => goTo(next), ADVANCE_DELAY);
  };

  const updateVision = (e) => {
    const value = e.target.value;
    setAnswers((a) => ({ ...a, [step.id]: value }));
  };

  const updateContact = (e) => {
    const { name, value } = e.target;
    setContact((c) => ({ ...c, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const back = () => {
    if (index > 0) goTo(index - 1);
  };

  // Continue/Send only exists on textarea (advance) and contact (submit).
  const onContinue = () => {
    if (step.type === "contact") {
      submit();
      return;
    }
    goTo(index + 1);
  };

  const validateContact = () => {
    const next = {};
    for (const f of step.fields) {
      const value = (contact[f.name] || "").trim();
      if (f.required && !value) next[f.name] = `${f.label} is required.`;
      else if (f.name === "email" && value && !EMAIL_RE.test(value))
        next.email = "Please enter a valid email.";
    }
    return next;
  };

  const submit = async () => {
    const fieldErrors = validateContact();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }
    setStatus("submitting");
    setErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, ...contact }),
      });

      if (res.ok) {
        // Single conversion event, fired once per submission, just before the
        // confirmation screen. No PII (name / email / phone) ever goes here.
        if (!tracked.current) {
          tracked.current = true;
          pushToDataLayer({
            event: "quote_submitted",
            occasion: answers.occasion,
            looking_for: answers.lookingFor,
          });
        }
        setStatus("success");
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  // ---- Modal plumbing ----------------------------------------------------

  const lockScroll = () => {
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (sw > 0) document.body.style.paddingRight = `${sw}px`;
    getLenis()?.stop();
  };
  const unlockScroll = () => {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    getLenis()?.start();
  };

  const focusFirst = () => {
    requestAnimationFrame(() => {
      const el = bodyRef.current?.querySelector(
        "button:not([disabled]), input, textarea, a[href]"
      );
      el?.focus();
    });
  };

  const openModal = (trigger) => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    triggerRef.current = trigger || null;
    setConfirming(false);
    d.showModal();
    lockScroll();
    focusFirst();
  };

  const doClose = () => dialogRef.current?.close();

  const requestClose = () => {
    const { index: i, status: s } = stateRef.current;
    if (s === "success" || i === 0) {
      doClose();
      return;
    }
    setConfirming(true);
  };

  const keepDesigning = () => {
    setConfirming(false);
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  // Focus the confirmation's default action when it appears.
  useEffect(() => {
    if (confirming) requestAnimationFrame(() => keepBtnRef.current?.focus());
  }, [confirming]);

  // Focus the Close button when the success screen appears.
  useEffect(() => {
    if (status === "success")
      requestAnimationFrame(() => successCloseRef.current?.focus());
  }, [status]);

  // Every #start CTA opens the modal (capture phase runs before smooth-scroll).
  useEffect(() => {
    const onDocClick = (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = e.target.closest?.('a[href="#start"]');
      if (!a) return;
      e.preventDefault();
      openModal(a);
    };
    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, []);

  // Native dialog events. ESC never closes directly:
  //  - while confirming, ESC = "Keep designing"
  //  - otherwise ask (or close if no progress)
  // On close after success, reset state so the next visitor starts fresh.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onCancel = (e) => {
      e.preventDefault();
      const { status: s, index: i, confirming: c } = stateRef.current;
      if (c) {
        setConfirming(false);
        requestAnimationFrame(() => headingRef.current?.focus());
        return;
      }
      if (s === "success" || i === 0) {
        d.close();
        return;
      }
      setConfirming(true);
    };
    const onClose = () => {
      clearTimeout(advanceTimer.current);
      setConfirming(false);
      unlockScroll();
      triggerRef.current?.focus?.();
      if (stateRef.current.status === "success") {
        setStatus("idle");
        setIndex(0);
        setAnswers({});
        setContact(EMPTY_CONTACT);
        setErrors({});
        tracked.current = false; // allow a fresh submission to fire again
      }
    };
    d.addEventListener("cancel", onCancel);
    d.addEventListener("close", onClose);
    return () => {
      d.removeEventListener("cancel", onCancel);
      d.removeEventListener("close", onClose);
    };
  }, []);

  // ---- Render ------------------------------------------------------------
  const isSuccess = status === "success";

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={TITLE_ID}>
      <div className={styles.modalHeader} inert={confirming || undefined}>
        <div className={styles.modalHeaderTop}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logotipos/lalostylings-logo.svg"
            alt="Lalo Stylings"
            width={1809}
            height={793}
            className={styles.modalLogo}
          />
          <button
            type="button"
            className={styles.close}
            onClick={requestClose}
            aria-label="Close design tool"
          >
            <span className={styles.closeIcon} aria-hidden="true" />
          </button>
        </div>
        {!isSuccess && <Progress index={index} total={TOTAL} />}
      </div>

      <div className={styles.modalBody} ref={bodyRef} inert={confirming || undefined}>
        <div className={styles.modalInner}>
          {isSuccess ? (
            <Success onClose={doClose} titleId={TITLE_ID} closeRef={successCloseRef} />
          ) : (
            <>
              <h3
                className={styles.question}
                tabIndex={-1}
                ref={headingRef}
                id={TITLE_ID}
              >
                {step.title}
              </h3>
              {step.subtitle && (
                <p className={styles.subtitle}>{step.subtitle}</p>
              )}
              <span className={styles.headDivider} aria-hidden="true" />

              {step.type === "cards" ? (
                <div className={styles.opts} role="group" aria-label={step.title}>
                  {step.options.map((opt) => {
                    const selected = answers[step.id] === opt.value;
                    const Icon = opt.icon;
                    return (
                      <button
                        type="button"
                        key={opt.value}
                        className={`${styles.opt} ${selected ? styles.optOn : ""}`}
                        aria-pressed={selected}
                        onClick={() => select(opt.value)}
                      >
                        {Icon && <Icon className={styles.optIcon} />}
                        <span className={styles.optLabel}>{opt.value}</span>
                        {opt.hint && (
                          <span className={styles.optHint}>{opt.hint}</span>
                        )}
                        <span className={styles.check} aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              ) : step.type === "textarea" ? (
                <div className={styles.visionField}>
                  <textarea
                    className={styles.textarea}
                    value={answers[step.id] || ""}
                    onChange={updateVision}
                    placeholder={step.placeholder}
                    rows={5}
                    aria-label={step.title}
                  />
                </div>
              ) : (
                <ContactStep
                  fields={step.fields}
                  values={contact}
                  errors={errors}
                  onChange={updateContact}
                />
              )}

              {status === "error" && (
                <p className={styles.formError} role="alert">
                  Something went wrong sending your request. Please try again.
                </p>
              )}

              {/* Back on every step except the first; Continue/Send only on
                  the non-card steps (cards auto-advance). Step 1 has neither. */}
              {(index > 0 || step.type !== "cards") && (
                <div className={styles.nav}>
                  {index > 0 && (
                    <button
                      type="button"
                      className={`btn btn--secondary ${styles.back}`}
                      onClick={back}
                    >
                      ← Back
                    </button>
                  )}
                  {step.type !== "cards" && (
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={onContinue}
                      disabled={status === "submitting"}
                    >
                      {isLast
                        ? status === "submitting"
                          ? "Sending…"
                          : step.submitLabel || "Send"
                        : "Continue →"}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {confirming && (
        <div
          className={styles.confirmOverlay}
          role="alertdialog"
          aria-labelledby={CONFIRM_ID}
        >
          <div className={styles.confirmBox}>
            <p id={CONFIRM_ID} className={styles.confirmText}>
              You&rsquo;re partway through your design. Close for now? Your
              answers are saved.
            </p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                ref={keepBtnRef}
                className="btn btn--primary"
                onClick={keepDesigning}
              >
                Keep designing
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={doClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

function Progress({ index, total }) {
  const pct = ((index + 1) / total) * 100;
  return (
    <div className={styles.progressRow}>
      <div
        className={styles.progress}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={index + 1}
        aria-label={`Step ${index + 1} of ${total}`}
      >
        <span className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.progressLabel}>
        Step {index + 1} of {total}
      </span>
    </div>
  );
}

function ContactStep({ fields, values, errors, onChange }) {
  return (
    <div className={styles.contact}>
      {fields.map((f) => {
        const id = `q-${f.name}`;
        const err = errors[f.name];
        const describedBy = err ? `${id}-error` : undefined;
        return (
          <div key={f.name} className={styles.field}>
            <label className={styles.label} htmlFor={id}>
              {f.label} {f.required && <span aria-hidden="true">*</span>}
            </label>
            <input
              id={id}
              name={f.name}
              type={f.type}
              className={styles.input}
              value={values[f.name]}
              onChange={onChange}
              autoComplete={f.autoComplete}
              aria-invalid={Boolean(err)}
              aria-describedby={describedBy}
            />
            {err && (
              <p id={`${id}-error`} className={styles.fieldError}>
                {err}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Success({ onClose, titleId, closeRef }) {
  return (
    <div className={styles.success} role="status">
      <span className={styles.successIcon} aria-hidden="true">
        <span className={styles.successDiamond} />
      </span>
      <h3 className={`font-display ${styles.successTitle}`} id={titleId} tabIndex={-1}>
        Your Project Is On Its Way
      </h3>
      <p className={styles.successBody}>
        Thank you. One of our master jewelers is already reading through your
        idea. You&rsquo;ll hear back from us within 24 hours with first thoughts
        on your piece, and answers to anything you&rsquo;re still wondering
        about. No obligation, no pressure. Just the beginning of something made
        only for you.
      </p>
      <p className={styles.successNote}>
        Keep an eye on your inbox, and check your spam folder just in case.
      </p>
      <button
        type="button"
        ref={closeRef}
        className="btn btn--primary"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}
