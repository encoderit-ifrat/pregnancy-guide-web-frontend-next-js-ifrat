import { InvitationTemplate } from "../_types/invitation_types";

/** Visual styling per built-in template (used for live preview without image assets). */
export const TEMPLATE_STYLES: Record<
  InvitationTemplate,
  { name: string; gradient: string }
> = {
  scandinavian_minimal: {
    name: "Scandinavian Minimal",
    gradient: "from-slate-100 to-slate-200",
  },
  baby_pink: {
    name: "Baby Pink Celebration",
    gradient: "from-pink-100 to-rose-200",
  },
  neutral_beige: {
    name: "Neutral Beige Modern",
    gradient: "from-amber-50 to-stone-200",
  },
  elegant_lavender: {
    name: "Elegant Lavender",
    gradient: "from-violet-100 to-purple-200",
  },
  custom: {
    name: "Custom",
    gradient: "from-primary-light to-primary-muted",
  },
};
