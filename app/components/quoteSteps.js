// ============================================================================
// Quote builder — declarative 4-step schema (definitive). No budget step.
// Edit steps / options here WITHOUT touching QuoteBuilder logic.
//
// Each step:
//   id         stable key used in the answers object and the emailed brief
//   title      the question
//   subtitle   optional supporting line
//   type       "cards" (single-select, auto-advance) | "textarea" | "contact"
//   options    cards steps: [{ value, hint? }]  — hint is a small description line
//   placeholder  textarea step
//   fields     contact step: [{ name, label, type, required, autoComplete }]
//   submitLabel  contact step: final button label
//
// Card steps (1-2) auto-advance on selection. No copy uses em dashes.
// ============================================================================

import {
  RingIcon,
  EngagementRingIcon,
  WeddingBandIcon,
  BraceletIcon,
  NecklaceIcon,
  EarringsIcon,
  NotSureIcon,
} from "./QuoteIcons";

export const QUOTE_STEPS = [
  {
    id: "occasion",
    title: "What brings you here?",
    subtitle: "Tell us what inspired your piece.",
    type: "cards",
    options: [
      { value: "Engagement", hint: "Proposal ring" },
      { value: "Wedding", hint: "Bands and rings" },
      { value: "Anniversary", hint: "A love milestone" },
      { value: "Birthday", hint: "A meaningful gift" },
      { value: "Quinceañera", hint: "Her big moment" },
      { value: "Graduation", hint: "A lasting achievement" },
      { value: "Just for me", hint: "Personal collection" },
      { value: "Corporate gifts", hint: "Your logo" },
      { value: "Other", hint: "Tell us more" },
    ],
  },
  {
    id: "lookingFor",
    title: "What are you looking for?",
    type: "cards",
    // Many options: legibility over imagery (2 cols mobile, 3 desktop).
    options: [
      { value: "Ring", icon: RingIcon },
      { value: "Engagement ring", icon: EngagementRingIcon },
      { value: "Wedding band", icon: WeddingBandIcon },
      { value: "Bracelet", icon: BraceletIcon },
      { value: "Necklace or pendant", icon: NecklaceIcon },
      { value: "Earrings", icon: EarringsIcon },
      { value: "Not sure yet", icon: NotSureIcon },
    ],
  },
  {
    id: "vision",
    title: "Tell us about your vision",
    type: "textarea",
    placeholder:
      "Describe your idea: the occasion, the style, any details that inspire you...",
  },
  {
    id: "contact",
    title: "Where can we reach you?",
    subtitle:
      "One of our master jewelers will get back to you within 24 hours. Free consultation, no obligation.",
    type: "contact",
    submitLabel: "Send My Project",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, autoComplete: "name" },
      { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
      { name: "phone", label: "Phone", type: "tel", required: false, autoComplete: "tel" },
    ],
  },
];
