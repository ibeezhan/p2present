/* @ds-bundle: {"format":3,"namespace":"MoaVDesignSystem_fd264d","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"StatusPill","sourcePath":"components/feedback/StatusPill.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"},{"name":"StatStrip","sourcePath":"components/layout/StatStrip.jsx"},{"name":"Terminal","sourcePath":"components/layout/Terminal.jsx"},{"name":"TerminalLine","sourcePath":"components/layout/Terminal.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"b2f217f429f2","components/buttons/IconButton.jsx":"293a36979f03","components/feedback/Badge.jsx":"647ac76477c1","components/feedback/StatusPill.jsx":"620ddfd78c4f","components/feedback/Tag.jsx":"522c36137625","components/feedback/Toast.jsx":"0f738ae45f88","components/forms/Input.jsx":"e49a8a631ae4","components/forms/Select.jsx":"a8380ce7992e","components/forms/Switch.jsx":"b83d1f61a691","components/layout/Card.jsx":"03aba9933667","components/layout/StatStrip.jsx":"5d0bca629b47","components/layout/Terminal.jsx":"d6704c72c042","ui_kits/admin_dashboard/Dashboard.jsx":"3a6f4af544f1","ui_kits/client_dashboard/ClientDashboard.jsx":"cbe76f13b885","ui_kits/website/App.jsx":"af1c927dbda3"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MoaVDesignSystem_fd264d = window.MoaVDesignSystem_fd264d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MoaV Button — works in both the neon (marketing) and ops (.theme-ops) themes
 * via semantic tokens. Variants map to the real site + dashboard button styles.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  mono = false,
  tone,
  disabled = false,
  type = "button",
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const sizes = {
    sm: {
      padding: "0.35rem 0.75rem",
      fontSize: "0.72rem",
      radius: "var(--radius-xs)",
      gap: "0.3rem"
    },
    md: {
      padding: "10px 18px",
      fontSize: "13px",
      radius: "var(--radius-md)",
      gap: "8px"
    },
    lg: {
      padding: "14px 28px",
      fontSize: "15px",
      radius: "var(--radius-md)",
      gap: "10px"
    }
  };
  const s = sizes[size] || sizes.md;

  // tone lets ops buttons pick a semantic edge (success/info/warn/danger)
  const toneColor = {
    success: "var(--signal-success)",
    info: "var(--signal-info)",
    warn: "var(--signal-warn)",
    danger: "var(--signal-danger)",
    accent: "var(--accent)",
    accent2: "var(--accent-2)"
  }[tone];
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: s.gap,
    padding: s.padding,
    fontSize: s.fontSize,
    fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
    fontWeight: 500,
    lineHeight: 1,
    borderRadius: s.radius,
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    textDecoration: "none",
    whiteSpace: "nowrap",
    transition: "transform .15s ease, box-shadow .15s ease, border-color .15s ease, background .15s ease, color .15s ease",
    transform: !disabled && hover && !press ? "translateY(-2px)" : "translateY(0)",
    ...style
  };
  const variants = {
    // Gradient hero CTA — dark text on cyan→purple, neon glow on hover
    primary: {
      background: "var(--moav-gradient-primary)",
      color: "var(--moav-ink-900)",
      fontWeight: 600,
      boxShadow: !disabled && hover ? "var(--moav-glow-cyan)" : "none"
    },
    // Accent-tinted outline (site btn-secondary / ops colored buttons)
    secondary: {
      background: hover ? "var(--moav-cyan-dim)" : "transparent",
      color: toneColor || "var(--accent)",
      borderColor: toneColor || "var(--accent)"
    },
    // Quiet hairline button (ops default .btn)
    ghost: {
      background: "var(--surface-card)",
      color: "var(--text-body)",
      borderColor: hover ? "var(--border-active)" : "var(--border-strong)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      ...base,
      ...(variants[variant] || variants.primary)
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MoaV IconButton — a square, quiet control for a single glyph (copy, refresh,
 * dismiss, expand). Pass a unicode glyph or an inline SVG as children.
 */
function IconButton({
  children,
  size = "md",
  tone = "default",
  disabled = false,
  title,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const dims = {
    sm: 28,
    md: 34,
    lg: 40
  }[size] || 34;
  const font = {
    sm: "0.8rem",
    md: "0.95rem",
    lg: "1.1rem"
  }[size] || "0.95rem";
  const toneColor = {
    default: "var(--text-muted)",
    accent: "var(--accent)",
    success: "var(--signal-success)",
    danger: "var(--signal-danger)"
  }[tone] || "var(--text-muted)";
  const hoverColor = {
    default: "var(--text-strong)",
    accent: "var(--accent)",
    success: "var(--signal-success)",
    danger: "var(--signal-danger)"
  }[tone] || "var(--text-strong)";
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    title: title,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: dims,
      height: dims,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-mono)",
      fontSize: font,
      lineHeight: 1,
      background: hover ? "var(--surface-raised)" : "transparent",
      color: hover ? hoverColor : toneColor,
      border: `1px solid ${hover ? "var(--border-active)" : "var(--border-strong)"}`,
      borderRadius: "var(--radius-sm)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "color .15s ease, background .15s ease, border-color .15s ease",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
/**
 * MoaV Badge — a small inline count/label. Pill or square. Use for counts on
 * tabs, "16+" protocol counters, version chips. (For statuses use StatusPill;
 * for protocol labels use Tag.)
 */
function Badge({
  children,
  tone = "neutral",
  pill = true,
  style
}) {
  const map = {
    neutral: {
      color: "var(--text-body)",
      bg: "var(--surface-raised)",
      border: "var(--border-strong)"
    },
    accent: {
      color: "var(--moav-ink-900)",
      bg: "var(--accent)",
      border: "transparent"
    },
    cyan: {
      color: "var(--moav-cyan)",
      bg: "var(--moav-cyan-dim)",
      border: "var(--moav-cyan-line)"
    },
    purple: {
      color: "var(--moav-purple)",
      bg: "var(--moav-purple-dim)",
      border: "var(--moav-purple-line)"
    }
  };
  const c = map[tone] || map.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: pill ? "1.2rem" : undefined,
      fontFamily: "var(--font-mono)",
      fontSize: "0.65rem",
      fontWeight: 600,
      lineHeight: 1,
      padding: "0.2rem 0.5rem",
      borderRadius: pill ? "var(--radius-pill)" : "var(--radius-xs)",
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.color,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusPill.jsx
try { (() => {
/**
 * MoaV StatusPill — the rounded, uppercase mono status chip from the dashboards
 * (running / ok / timeout / disabled / healthy). Semantic color with a dim wash
 * and a matching translucent border; optional leading dot.
 */
const TONES = {
  ok: "success",
  running: "success",
  healthy: "success",
  active: "success",
  warn: "warn",
  starting: "warn",
  inactive: "warn",
  error: "danger",
  timeout: "danger",
  down: "danger",
  info: "info",
  disabled: "muted",
  unknown: "muted"
};
function StatusPill({
  status = "unknown",
  children,
  dot = true,
  tone,
  style
}) {
  const t = tone || TONES[String(status).toLowerCase()] || "muted";
  const color = {
    success: "var(--signal-success)",
    warn: "var(--signal-warn)",
    danger: "var(--signal-danger)",
    info: "var(--signal-info)",
    muted: "var(--text-muted)"
  }[t];
  const bg = {
    success: "var(--ops-green-dim)",
    warn: "var(--ops-yellow-dim)",
    danger: "var(--ops-red-dim)",
    info: "var(--ops-blue-dim)",
    muted: "rgba(110,118,129,0.15)"
  }[t];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      padding: "0.15rem 0.55rem",
      borderRadius: "var(--radius-pill)",
      fontSize: "0.65rem",
      fontWeight: 600,
      fontFamily: "var(--font-mono)",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      color,
      background: bg,
      border: `1px solid ${color}44`,
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: color,
      boxShadow: t === "success" ? `0 0 5px ${color}` : "none",
      flexShrink: 0
    }
  }), children ?? status);
}
Object.assign(__ds_scope, { StatusPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusPill.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag.jsx
try { (() => {
/**
 * MoaV Tag — the small mono protocol/label chip from the admin user table
 * (Reality, Hy2, WG, AWG …). Default is a quiet surface chip; `accent` tints it
 * blue (the "donated" style), and other tones recolor for emphasis.
 */
function Tag({
  children,
  tone = "default",
  style
}) {
  const map = {
    default: {
      color: "var(--text-muted)",
      bg: "var(--surface-raised)",
      border: "var(--border-strong)"
    },
    accent: {
      color: "var(--signal-info)",
      bg: "var(--ops-blue-dim)",
      border: "var(--signal-info)"
    },
    success: {
      color: "var(--signal-success)",
      bg: "var(--ops-green-dim)",
      border: "var(--signal-success)"
    },
    warn: {
      color: "var(--signal-warn)",
      bg: "var(--ops-yellow-dim)",
      border: "var(--signal-warn)"
    },
    danger: {
      color: "var(--signal-danger)",
      bg: "var(--ops-red-dim)",
      border: "var(--signal-danger)"
    }
  };
  const c = map[tone] || map.default;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      fontFamily: "var(--font-mono)",
      fontSize: "0.62rem",
      lineHeight: 1.4,
      padding: "0.12rem 0.45rem",
      borderRadius: "var(--radius-xs)",
      background: c.bg,
      border: `1px solid ${tone === "default" ? c.border : c.border + "66"}`,
      color: c.color,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
/**
 * MoaV Toast — the dashboard notification. Mono, bordered, with a left status
 * accent. Static presentational component; manage visibility/queue yourself.
 */
function Toast({
  children,
  tone = "info",
  onDismiss,
  style
}) {
  const map = {
    info: {
      color: "var(--signal-info)",
      bg: "var(--surface-card)"
    },
    success: {
      color: "var(--signal-success)",
      bg: "var(--ops-green-dim)"
    },
    warn: {
      color: "var(--signal-warn)",
      bg: "var(--ops-yellow-dim)"
    },
    error: {
      color: "var(--signal-danger)",
      bg: "var(--ops-red-dim)"
    }
  };
  const c = map[tone] || map.info;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.6rem",
      fontFamily: "var(--font-mono)",
      fontSize: "0.75rem",
      padding: "0.6rem 0.9rem",
      borderRadius: "var(--radius-sm)",
      border: `1px solid ${c.color}`,
      background: c.bg,
      color: "var(--text-strong)",
      maxWidth: 380,
      boxShadow: "var(--shadow-pop)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: c.color,
      fontWeight: 700
    }
  }, "\u25CF"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, children), onDismiss && /*#__PURE__*/React.createElement("button", {
    onClick: onDismiss,
    "aria-label": "Dismiss",
    style: {
      background: "none",
      border: "none",
      color: "var(--text-muted)",
      cursor: "pointer",
      fontSize: "0.9rem",
      lineHeight: 1,
      padding: 0
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MoaV Input — a single-line text/number field. Mono by default (the brand's
 * fields are technical); focus brings the accent border. Optional leading label.
 */
function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  mono = true,
  disabled = false,
  invalid = false,
  prefix,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const borderColor = invalid ? "var(--signal-danger)" : focus ? "var(--focus-ring)" : "var(--border-strong)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      background: "var(--surface-sunken)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-md)",
      padding: "0 0.7rem",
      transition: "border-color .15s ease",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      fontFamily: "var(--font-mono)",
      fontSize: "0.8rem"
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      background: "transparent",
      border: "none",
      outline: "none",
      color: "var(--text-strong)",
      fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
      fontSize: "0.8rem",
      padding: "0.5rem 0"
    }
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MoaV Select — a native dropdown styled to match the dark fields. Pass options
 * as [{value, label}] or plain strings. Mono, with a custom chevron.
 */
function Select({
  value,
  onChange,
  options = [],
  disabled = false,
  mono = true,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const opts = options.map(o => typeof o === "string" ? {
    value: o,
    label: o
  } : o);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "inline-flex",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    value: value,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: "none",
      WebkitAppearance: "none",
      background: "var(--surface-sunken)",
      color: "var(--text-strong)",
      border: `1px solid ${focus ? "var(--focus-ring)" : "var(--border-strong)"}`,
      borderRadius: "var(--radius-md)",
      padding: "0.5rem 2rem 0.5rem 0.7rem",
      fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
      fontSize: "0.8rem",
      cursor: disabled ? "not-allowed" : "pointer",
      outline: "none",
      transition: "border-color .15s ease",
      width: "100%"
    }
  }, rest), opts.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value,
    style: {
      background: "var(--surface-card)",
      color: "var(--text-strong)"
    }
  }, o.label))), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      right: "0.6rem",
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      color: "var(--text-muted)",
      fontSize: "0.7rem"
    }
  }, "\u25BE"));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/**
 * MoaV Switch — the toggle from the moav-client endpoint table. Track fills with
 * the accent (green/cyan) when on; a white knob slides 16px.
 */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  label,
  style
}) {
  const control = /*#__PURE__*/React.createElement("button", {
    role: "switch",
    "aria-checked": checked,
    onClick: onChange,
    disabled: disabled,
    style: {
      width: 36,
      height: 20,
      borderRadius: "var(--radius-pill)",
      border: "none",
      padding: 2,
      background: checked ? "var(--signal-success)" : "var(--border-active)",
      cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex",
      alignItems: "center",
      transition: "background .15s ease",
      opacity: disabled ? 0.6 : 1,
      flexShrink: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: "#fff",
      transform: checked ? "translateX(16px)" : "translateX(0)",
      transition: "transform .15s ease"
    }
  }));
  if (!label) return control;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.55rem",
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "var(--font-mono)",
      fontSize: "0.75rem",
      color: "var(--text-body)"
    }
  }, control, label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
/**
 * MoaV Card — the surface container in both worlds.
 *   • Default: a flat dark card (1px hairline, soft radius).
 *   • interactive: marketing hover — lifts 4px, border brightens, and a cyan→purple
 *     top edge lights up.
 *   • title/action: renders an uppercase mono header row (the ops "section" look).
 */
function Card({
  children,
  title,
  action,
  interactive = false,
  padded = true,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: "relative",
      background: "var(--surface-card)",
      border: `1px solid ${interactive && hover ? "var(--border-strong)" : "var(--border-default)"}`,
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      transition: "transform .3s ease, border-color .3s ease",
      transform: interactive && hover ? "translateY(-4px)" : "translateY(0)",
      ...style
    }
  }, interactive && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      insetInline: 0,
      top: 0,
      height: 2,
      background: "var(--moav-gradient-primary)",
      opacity: hover ? 1 : 0,
      transition: "opacity .3s ease"
    }
  }), title && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.75rem",
      padding: "0.75rem 1rem",
      borderBottom: "1px solid var(--border-default)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.75rem",
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, title), action), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: padded ? title ? "1rem" : "1.5rem" : 0
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

// components/layout/StatStrip.jsx
try { (() => {
/**
 * MoaV StatStrip — the dashboard's joined stats row. Cells sit on a hairline grid
 * (1px gaps reveal the border color). Each item: {label, value, tone}.
 */
function StatStrip({
  items = [],
  style
}) {
  const toneColor = {
    ok: "var(--signal-success)",
    success: "var(--signal-success)",
    info: "var(--signal-info)",
    warn: "var(--signal-warn)",
    danger: "var(--signal-danger)",
    muted: "var(--text-muted)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 1,
      background: "var(--border-default)",
      borderRadius: "var(--radius-sm)",
      overflow: "hidden",
      ...style
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      background: "var(--surface-card)",
      padding: "0.85rem 1rem",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.6rem",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "var(--text-muted)",
      marginBottom: "0.3rem",
      whiteSpace: "nowrap"
    }
  }, it.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "1.15rem",
      fontWeight: 600,
      fontVariantNumeric: "tabular-nums",
      color: it.tone ? toneColor[it.tone] || "var(--text-strong)" : "var(--text-strong)"
    }
  }, it.value))));
}
Object.assign(__ds_scope, { StatStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/StatStrip.jsx", error: String((e && e.message) || e) }); }

// components/layout/Terminal.jsx
try { (() => {
/**
 * MoaV Terminal — the install/code box with the traffic-light header. The brand's
 * single most recognizable UI motif. Children are the body (commands, output);
 * pass `title` for the window label and an optional `onCopy` action.
 */
function Terminal({
  title = "bash",
  children,
  onCopy,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-sunken)",
      border: "1px solid var(--border-strong)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      fontFamily: "var(--font-mono)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.7rem 0.9rem",
      background: "var(--surface-raised)",
      borderBottom: "1px solid var(--border-default)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: "var(--moav-red)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: "var(--moav-yellow)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: "var(--moav-green)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontSize: "0.7rem",
      color: "var(--text-muted)"
    }
  }, title), onCopy && /*#__PURE__*/React.createElement("button", {
    onClick: onCopy,
    title: "Copy",
    style: {
      background: "transparent",
      border: "1px solid var(--border-strong)",
      borderRadius: "var(--radius-xs)",
      color: "var(--text-muted)",
      cursor: "pointer",
      fontFamily: "var(--font-mono)",
      fontSize: "0.7rem",
      padding: "0.15rem 0.45rem"
    }
  }, "\u29C9 copy")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "1rem 1.1rem",
      fontSize: "0.85rem",
      lineHeight: 1.7,
      color: "var(--text-strong)",
      overflowX: "auto"
    }
  }, children));
}

/** A prompt line for use inside <Terminal>: green $ then the command. */
function TerminalLine({
  prompt = "$",
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      whiteSpace: "pre"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--moav-green)"
    }
  }, prompt, " "), /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Terminal, TerminalLine });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Terminal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin_dashboard/Dashboard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* MoaV server admin dashboard (:9443) — recreation of admin/templates/dashboard.html. */

const SERVICES = [{
  name: "sing-box",
  port: "443",
  status: "running"
}, {
  name: "xray",
  port: "2096",
  status: "running"
}, {
  name: "wireguard",
  port: "51820",
  status: "running"
}, {
  name: "amneziawg",
  port: "51821",
  status: "running"
}, {
  name: "trusttunnel",
  port: "4443",
  status: "running"
}, {
  name: "telemt",
  port: "993",
  status: "running"
}, {
  name: "dns-router",
  port: "53",
  status: "running"
}, {
  name: "admin",
  port: "9443",
  status: "running"
}, {
  name: "conduit",
  port: "—",
  status: "running"
}, {
  name: "snowflake",
  port: "—",
  status: "starting"
}, {
  name: "grafana",
  port: "9444",
  status: "stopped"
}, {
  name: "prometheus",
  port: "—",
  status: "stopped"
}];
const INITIAL_USERS = [{
  username: "alice",
  created: "2026-05-21",
  tags: ["Reality", "Hy2", "WG", "AWG", "XHTTP"]
}, {
  username: "bob",
  created: "2026-05-23",
  tags: ["Reality", "Trojan", "Hy2", "WG"]
}, {
  username: "team-mahsa-01",
  created: "2026-05-28",
  tags: ["Reality", "Hy2", "MDNS"],
  donated: true
}, {
  username: "carol",
  created: "2026-06-01",
  tags: ["Reality", "AWG", "TT", "XDNS"]
}];
function ServiceCard({
  name,
  port,
  status
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "svc-card " + status
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot " + status
  }), /*#__PURE__*/React.createElement("span", {
    className: "svc-name"
  }, name), port && port !== "—" && /*#__PURE__*/React.createElement("span", {
    className: "svc-port"
  }, ":", port));
}
function AdminDashboard() {
  const [clock, setClock] = React.useState(new Date());
  const [users, setUsers] = React.useState(INITIAL_USERS);
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [result, setResult] = React.useState(null);
  React.useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const running = SERVICES.filter(s => s.status === "running").length;
  const create = e => {
    e.preventDefault();
    const name = newName.trim();
    if (!/^[a-zA-Z0-9_\-]+$/.test(name)) return;
    setUsers(u => [...u, {
      username: name,
      created: new Date().toISOString().slice(0, 10),
      tags: ["Reality", "Hy2", "WG", "AWG"]
    }]);
    setResult(`✓ Created ${name} — bundle written to outputs/bundles/${name}/ (configs + QR codes + subscription.txt)`);
    setNewName("");
    setTimeout(() => setResult(null), 4000);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("h1", null, /*#__PURE__*/React.createElement("img", {
    className: "logo",
    src: "../../assets/logo.png",
    alt: ""
  }), "MoaV", /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "\xB7admin")), /*#__PURE__*/React.createElement("div", {
    className: "topbar-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, clock.toISOString().slice(11, 19), " UTC"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-orange"
  }, "Grafana"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => window.location.reload()
  }, "\u21BB Refresh"))), /*#__PURE__*/React.createElement("div", {
    className: "banner"
  }, /*#__PURE__*/React.createElement("span", null, "Update available: ", /*#__PURE__*/React.createElement("strong", null, "v1.8.4"), " (current: v1.8.3)"), /*#__PURE__*/React.createElement("span", null, "Run ", /*#__PURE__*/React.createElement("code", null, "moav update"))), /*#__PURE__*/React.createElement("div", {
    className: "stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-label"
  }, "Active Users"), /*#__PURE__*/React.createElement("div", {
    className: "stat-val"
  }, users.length)), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-label"
  }, "Users"), /*#__PURE__*/React.createElement("div", {
    className: "stat-val"
  }, users.length)), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-label"
  }, "Connections"), /*#__PURE__*/React.createElement("div", {
    className: "stat-val"
  }, "348")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-label"
  }, "Proxy \u2191 / \u2193"), /*#__PURE__*/React.createElement("div", {
    className: "stat-val"
  }, "1.2G", /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, " / "), "8.4G")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-label"
  }, "Conduit \u2191 / \u2193"), /*#__PURE__*/React.createElement("div", {
    className: "stat-val ok"
  }, "240M", /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, " / "), "1.1G"))), /*#__PURE__*/React.createElement("div", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Services \xB7 ", running, "/", SERVICES.length, " running")), /*#__PURE__*/React.createElement("div", {
    className: "section-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc-grid"
  }, SERVICES.map(s => /*#__PURE__*/React.createElement(ServiceCard, _extends({
    key: s.name
  }, s)))))), /*#__PURE__*/React.createElement("div", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("h2", null, "MahsaNet"), /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-green"
  }, "+ Donate"))), /*#__PURE__*/React.createElement("div", {
    className: "section-body",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "0.75rem",
      display: "flex",
      gap: "1.5rem"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ops-text-dim)"
    }
  }, "Total: "), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ops-blue)",
      fontWeight: 600
    }
  }, "18")), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ops-text-dim)"
    }
  }, "Active: "), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ops-green)",
      fontWeight: 600
    }
  }, "15")), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ops-text-dim)"
    }
  }, "Inactive: "), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ops-yellow)",
      fontWeight: 600
    }
  }, "3")))), /*#__PURE__*/React.createElement("div", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Users"), /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-green",
    onClick: () => setPanelOpen(o => !o)
  }, panelOpen ? "- Close" : "+ New"))), panelOpen && /*#__PURE__*/React.createElement("div", {
    className: "create-panel"
  }, /*#__PURE__*/React.createElement("form", {
    className: "create-form",
    onSubmit: create
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Username"), /*#__PURE__*/React.createElement("input", {
    value: newName,
    onChange: e => setNewName(e.target.value),
    placeholder: "alice",
    autoFocus: true
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-green"
  }, "Create")), result && /*#__PURE__*/React.createElement("div", {
    className: "create-result"
  }, result)), /*#__PURE__*/React.createElement("div", {
    className: "section-body"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "User"), /*#__PURE__*/React.createElement("th", null, "Created"), /*#__PURE__*/React.createElement("th", null, "Protocols"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Bundle"))), /*#__PURE__*/React.createElement("tbody", null, users.map(u => /*#__PURE__*/React.createElement("tr", {
    key: u.username
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "user-name"
  }, u.username)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "user-date"
  }, u.created)), /*#__PURE__*/React.createElement("td", null, u.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "tag"
  }, t)), u.donated && /*#__PURE__*/React.createElement("span", {
    className: "tag tag-donated"
  }, "donated")), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "dl-link",
    href: "#",
    onClick: e => e.preventDefault()
  }, ".zip")))))))), /*#__PURE__*/React.createElement("div", {
    className: "footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-row"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "MoaV.sh"), /*#__PURE__*/React.createElement("span", {
    className: "footer-sep"
  }, "|"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Documentation"), /*#__PURE__*/React.createElement("span", {
    className: "footer-sep"
  }, "|"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "GitHub"), /*#__PURE__*/React.createElement("span", {
    className: "footer-sep"
  }, "|"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Issues")), /*#__PURE__*/React.createElement("div", {
    className: "footer-row",
    style: {
      opacity: 0.7
    }
  }, /*#__PURE__*/React.createElement("span", null, "v1.8.3"), /*#__PURE__*/React.createElement("span", {
    className: "footer-sep"
  }, "|"), /*#__PURE__*/React.createElement("span", null, "89.***.***.42"), /*#__PURE__*/React.createElement("span", {
    className: "footer-sep"
  }, "|"), /*#__PURE__*/React.createElement("span", null, "vpn.example.net"), /*#__PURE__*/React.createElement("span", {
    className: "footer-sep"
  }, "|"), /*#__PURE__*/React.createElement("span", null, "up 12d 4h 31m"))));
}
window.AdminDashboard = AdminDashboard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin_dashboard/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/client_dashboard/ClientDashboard.jsx
try { (() => {
/* MoaV-client dashboard (localhost:3001) — recreation of moav-client web-ui.
   Endpoints tab is fully interactive (toggle, priority); other tabs preview. */

const TABS = ["Endpoints", "Sources", "Analytics", "Plugins", "Settings", "Debug", "Diagnostics", "Config"];
const INITIAL = [{
  id: "vless:1",
  name: "reality-de",
  source: "frankfurt",
  protocol: "vless",
  address: "89.58.x.x:443",
  latency: 38,
  status: "ok",
  priority: 0,
  enabled: true
}, {
  id: "hy2:1",
  name: "hysteria-de",
  source: "frankfurt",
  protocol: "hysteria2",
  address: "89.58.x.x:443",
  latency: 41,
  status: "ok",
  priority: 1,
  enabled: true
}, {
  id: "trojan:1",
  name: "trojan-nl",
  source: "amsterdam",
  protocol: "trojan",
  address: "51.15.x.x:8443",
  latency: 52,
  status: "ok",
  priority: 2,
  enabled: true
}, {
  id: "side:awg",
  name: "amneziawg",
  source: "frankfurt",
  protocol: "sidecar",
  kind: "amneziawg",
  address: "awg0 · microsocks",
  latency: 47,
  status: "ok",
  priority: 1,
  enabled: true
}, {
  id: "xhttp:1",
  name: "xhttp-fi",
  source: "helsinki",
  protocol: "vless",
  address: "65.21.x.x:2096",
  latency: 88,
  status: "timeout",
  priority: 3,
  enabled: true
}, {
  id: "side:psi",
  name: "psiphon",
  source: "—",
  protocol: "sidecar",
  kind: "psiphon",
  address: "embedded",
  latency: -1,
  status: "unknown",
  priority: 5,
  enabled: false
}, {
  id: "side:tor",
  name: "tor",
  source: "—",
  protocol: "sidecar",
  kind: "tor",
  address: ":9150",
  latency: 240,
  status: "ok",
  priority: 6,
  enabled: false
}];
function statusStyle(status, enabled) {
  const map = {
    ok: ["var(--ops-green)", "var(--ops-green-dim)"],
    timeout: ["var(--ops-red)", "var(--ops-red-dim)"],
    error: ["var(--ops-red)", "var(--ops-red-dim)"],
    unknown: ["var(--ops-text-dim)", "rgba(110,118,129,0.15)"]
  };
  const [c, b] = enabled ? map[status] || map.unknown : ["var(--ops-text-dim)", "rgba(110,118,129,0.15)"];
  return {
    color: c,
    background: b,
    border: `1px solid ${c}44`
  };
}
function Switch({
  checked,
  onChange
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onChange,
    role: "switch",
    "aria-checked": checked,
    style: {
      width: 36,
      height: 20,
      borderRadius: 999,
      border: "none",
      padding: 2,
      background: checked ? "var(--ops-green)" : "var(--ops-border)",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      transition: "background .15s"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: "#fff",
      transform: checked ? "translateX(16px)" : "translateX(0)",
      transition: "transform .15s"
    }
  }));
}
function StatusChip({
  status,
  enabled
}) {
  const label = enabled ? status : "disabled";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      padding: "0.15rem 0.55rem",
      borderRadius: 999,
      fontSize: "0.65rem",
      fontWeight: 600,
      fontFamily: "var(--font-mono)",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      ...statusStyle(status, enabled)
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "currentColor",
      boxShadow: enabled && status === "ok" ? "0 0 5px currentColor" : "none"
    }
  }), label);
}
function Endpoints({
  rows,
  setRows
}) {
  const toggle = id => setRows(r => r.map(e => e.id === id ? {
    ...e,
    enabled: !e.enabled
  } : e));
  const prio = (id, v) => setRows(r => r.map(e => e.id === id ? {
    ...e,
    priority: +v
  } : e));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "kill"
  }, /*#__PURE__*/React.createElement(Switch, {
    checked: false,
    onChange: () => {}
  }), "Block direct (kill-switch) \u2014 drop the involuntary direct fallback so a downed pool can't leak the real IP."), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ["Name", "Source", "Protocol", "Address", "Latency", "Status", "Priority", "Enabled"].map(h => /*#__PURE__*/React.createElement("th", {
    key: h
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, rows.map(e => /*#__PURE__*/React.createElement("tr", {
    key: e.id,
    style: {
      opacity: e.enabled ? 1 : 0.5
    }
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "mono"
  }, e.name), e.kind && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "0.62rem",
      color: "var(--ops-text-dim)",
      fontFamily: "var(--font-mono)"
    }
  }, e.kind)), /*#__PURE__*/React.createElement("td", {
    className: "src"
  }, e.source), /*#__PURE__*/React.createElement("td", {
    className: "proto"
  }, e.protocol), /*#__PURE__*/React.createElement("td", {
    className: "addr"
  }, e.address), /*#__PURE__*/React.createElement("td", {
    className: "lat"
  }, e.latency >= 0 ? `${e.latency}ms` : "—"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusChip, {
    status: e.status,
    enabled: e.enabled
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("select", {
    value: e.priority,
    onChange: ev => prio(e.id, ev.target.value)
  }, Array.from({
    length: 11
  }, (_, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    value: i
  }, i)))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Switch, {
    checked: e.enabled,
    onChange: () => toggle(e.id)
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, "Priority: ", /*#__PURE__*/React.createElement("strong", null, "lower"), " picked first under ", /*#__PURE__*/React.createElement("code", null, "priority"), "; ", /*#__PURE__*/React.createElement("strong", null, "higher"), " = more traffic under ", /*#__PURE__*/React.createElement("code", null, "weighted"), "; ignored under ", /*#__PURE__*/React.createElement("code", null, "latency"), ". Toggling a sidecar also stops/starts its docker container."));
}
function Placeholder({
  tab
}) {
  const copy = {
    Sources: "Drop a MoaV server's bundle .zip to import its endpoints. List / remove sources, then reload.",
    Analytics: "Per-protocol upload/download cards with rolling 2-min sparklines and a throughput overlay chart.",
    Plugins: "First-match-wins routing rules. Add from the template catalog (LAN-direct, IR geoip, trackers, telemetry). Changes hot-apply.",
    Settings: "Load-balancing strategy, network exposure (loopback / LAN / public), SNI-spoof, config backup / restore.",
    Debug: "Streaming log tail with per-level ring buffers, level chips, substring filter, and a per-connection flow table.",
    Diagnostics: "Run TCP connect, DNS lookup, or TCP-TTL traceroute — optionally through a chosen endpoint's tunnel.",
    Config: "Live-loaded config.yaml editor with atomic write-back."
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "placeholder"
  }, "\u25A6 ", tab, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ops-text-dim)",
      fontSize: "0.72rem",
      maxWidth: 480,
      display: "inline-block",
      lineHeight: 1.7
    }
  }, copy[tab]));
}
function ClientDashboard() {
  const [tab, setTab] = React.useState("Endpoints");
  const [rows, setRows] = React.useState(INITIAL);
  const [clock, setClock] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const healthy = rows.filter(e => e.status === "ok" && e.enabled).length;
  const total = rows.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("h1", null, /*#__PURE__*/React.createElement("img", {
    className: "logo",
    src: "../../assets/logo.png",
    alt: ""
  }), "MoaV", /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "-client"), /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "mother of all VPNs")), /*#__PURE__*/React.createElement("div", {
    className: "topbar-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ts"
  }, clock.toISOString().slice(11, 19), " UTC"), /*#__PURE__*/React.createElement("span", {
    className: "pill ok"
  }, "\u25CF ", healthy, "/", total, " healthy"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-blue"
  }, "\u21BB Refresh"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-yellow"
  }, "\u21BB Apply / restart"))), /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    className: "tab" + (t === tab ? " active" : ""),
    onClick: () => setTab(t)
  }, t))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, tab === "Endpoints" ? /*#__PURE__*/React.createElement(Endpoints, {
    rows: rows,
    setRows: setRows
  }) : /*#__PURE__*/React.createElement(Placeholder, {
    tab: tab
  })), /*#__PURE__*/React.createElement("div", {
    className: "footer"
  }, /*#__PURE__*/React.createElement("span", null, "moav-client v0.9.2 \xB7 7 endpoints \xB7 strategy: latency"), /*#__PURE__*/React.createElement("span", null, "egress 89.58.x.x \xB7 DE \xB7 SOCKS5 localhost:1080")));
}
window.ClientDashboard = ClientDashboard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client_dashboard/ClientDashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/App.jsx
try { (() => {
/* MoaV marketing site — the page composition. Uses primitives from _kit.jsx. */

const ASCII = String.raw`███╗   ███╗ ██████╗  █████╗ ██╗   ██╗
████╗ ████║██╔═══██╗██╔══██╗██║   ██║
██╔████╔██║██║   ██║███████║██║   ██║
██║╚██╔╝██║██║   ██║██╔══██║╚██╗ ██╔╝
██║ ╚═╝ ██║╚██████╔╝██║  ██║ ╚████╔╝
╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝  ╚═══╝`;
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero"
  }, /*#__PURE__*/React.createElement(window.NetworkBG, null), /*#__PURE__*/React.createElement("div", {
    className: "hero-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-brand"
  }, /*#__PURE__*/React.createElement("img", {
    className: "hero-logo",
    src: "../../assets/logo.png",
    alt: "MoaV"
  }), /*#__PURE__*/React.createElement("div", {
    className: "brand-text"
  }, /*#__PURE__*/React.createElement("pre", {
    className: "ascii"
  }, ASCII), /*#__PURE__*/React.createElement("div", {
    className: "tagline"
  }, "Mother of all VPNs"))), /*#__PURE__*/React.createElement("p", {
    className: "subtitle"
  }, "A multi-protocol Internet censorship circumvention stack. ", /*#__PURE__*/React.createElement("strong", null, "One command. A $5 server."), " ", "And you're part of the network that keeps people connected."), /*#__PURE__*/React.createElement("div", {
    className: "install"
  }, /*#__PURE__*/React.createElement("div", {
    className: "term-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot r"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot y"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot g"
  }), /*#__PURE__*/React.createElement("span", {
    className: "term-title"
  }, "install.sh")), /*#__PURE__*/React.createElement("div", {
    className: "term-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "prompt"
  }, "$"), /*#__PURE__*/React.createElement("span", {
    className: "cmd"
  }, "curl -fsSL moav.sh/install.sh | bash"), /*#__PURE__*/React.createElement(window.CopyButton, {
    text: "curl -fsSL moav.sh/install.sh | bash"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cta-row"
  }, /*#__PURE__*/React.createElement(window.CTA, {
    variant: "primary"
  }, "Read the docs \u2192"), /*#__PURE__*/React.createElement(window.CTA, {
    variant: "secondary"
  }, "View on GitHub"))));
}
const PROTOCOLS = [{
  name: "Reality (VLESS)",
  port: "443/tcp",
  stars: 5,
  desc: "Primary and most reliable. Every flow looks like normal HTTPS to a real site."
}, {
  name: "Hysteria2",
  port: "443/udp",
  stars: 4,
  desc: "Fast QUIC-based transport — keeps working when TCP is throttled."
}, {
  name: "WireGuard",
  port: "51820/udp",
  stars: 3,
  desc: "Full VPN, simple setup. Direct UDP or tunneled over WebSocket when UDP is blocked."
}, {
  name: "AmneziaWG",
  port: "51821/udp",
  stars: 5,
  desc: "Obfuscated WireGuard that defeats deep packet inspection."
}, {
  name: "TrustTunnel",
  port: "4443/tcp",
  stars: 5,
  desc: "HTTP/2 and QUIC transport — indistinguishable from ordinary HTTPS."
}, {
  name: "DNS tunnels",
  port: "53/udp",
  stars: 3,
  desc: "dnstt, Slipstream, MasterDNS and XDNS — four tunnels sharing port 53. The last resort."
}];
function Protocols() {
  return /*#__PURE__*/React.createElement("section", {
    className: "alt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sec-title"
  }, "16+ protocols, one stack"), /*#__PURE__*/React.createElement("p", {
    className: "sec-sub"
  }, "Every censorship scenario has a path through. All traffic looks like normal HTTPS, WebSocket, DNS, or IMAPS."), /*#__PURE__*/React.createElement("div", {
    className: "proto-grid"
  }, PROTOCOLS.map(p => /*#__PURE__*/React.createElement(window.ProtocolCard, {
    key: p.name,
    name: p.name,
    port: p.port,
    stars: p.stars
  }, p.desc)), /*#__PURE__*/React.createElement("div", {
    className: "proto-card proto-cta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proto-top"
  }), /*#__PURE__*/React.createElement("div", {
    className: "proto-icon"
  }, "\u2197"), /*#__PURE__*/React.createElement("div", {
    className: "proto-head"
  }, /*#__PURE__*/React.createElement("h3", null, "Donate bandwidth")), /*#__PURE__*/React.createElement("p", null, "Run Psiphon Conduit, Tor Snowflake, or donate configs to MahsaNet \u2014 help 2M+ people bypass censorship."), /*#__PURE__*/React.createElement("div", {
    className: "proto-links"
  }, /*#__PURE__*/React.createElement(window.CTA, {
    variant: "secondary",
    small: true
  }, "Conduit"), /*#__PURE__*/React.createElement(window.CTA, {
    variant: "secondary",
    small: true
  }, "Snowflake")))), /*#__PURE__*/React.createElement("p", {
    className: "proto-foot"
  }, "See the full protocol table and stealth/speed ratings in the ", /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "documentation \u2192"))));
}
function Why() {
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sec-title"
  }, "Why MoaV exists"), /*#__PURE__*/React.createElement("p", {
    className: "why-intro"
  }, "Internet freedom doesn't happen by accident. It doesn't come from governments deciding to be generous. It comes from people \u2014 ", /*#__PURE__*/React.createElement("strong", null, "engineers, activists, diaspora communities, strangers with a spare VPS"), " \u2014 building the infrastructure that makes it real."), /*#__PURE__*/React.createElement("div", {
    className: "why-grid"
  }, /*#__PURE__*/React.createElement(window.WhyCard, {
    kicker: "The friction problem",
    title: "Ten minutes, not a week"
  }, "The tools already existed but running a reliable multi-protocol server took a week of config and a systems-engineering background. MoaV makes it one command."), /*#__PURE__*/React.createElement(window.WhyCard, {
    kicker: "Not someone else's job",
    title: "Run your own node"
  }, "This is not someone else's problem to solve. A $5 box turns you into part of the network that keeps people connected when their governments decide they shouldn't be."), /*#__PURE__*/React.createElement(window.WhyCard, {
    kicker: "Stealth first",
    title: "Built for hostile networks"
  }, "Per-user credentials with instant revocation, a decoy website for unauthenticated visitors, TLS 1.3 everywhere, and minimal logging. The window to act is between blackouts, not during them."))));
}
function QuickStart() {
  return /*#__PURE__*/React.createElement("section", {
    className: "alt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sec-title"
  }, "Up in three steps"), /*#__PURE__*/React.createElement("p", {
    className: "sec-sub"
  }, "A domain is optional \u2014 MoaV runs in domainless mode too."), /*#__PURE__*/React.createElement("div", {
    className: "steps"
  }, /*#__PURE__*/React.createElement("div", {
    className: "step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "step-n"
  }, "1"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Install on any Linux box"), /*#__PURE__*/React.createElement("div", {
    className: "code"
  }, /*#__PURE__*/React.createElement("div", {
    className: "code-head"
  }, /*#__PURE__*/React.createElement("span", null, "bash"), /*#__PURE__*/React.createElement(window.CopyButton, {
    text: "curl -fsSL moav.sh/install.sh | bash"
  })), /*#__PURE__*/React.createElement("pre", null, "curl -fsSL moav.sh/install.sh | bash")), /*#__PURE__*/React.createElement("p", {
    className: "step-note"
  }, "Installs Docker, clones to ", /*#__PURE__*/React.createElement("code", null, "/opt/moav"), ", and launches the interactive setup."))), /*#__PURE__*/React.createElement("div", {
    className: "step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "step-n"
  }, "2"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Add a user"), /*#__PURE__*/React.createElement("div", {
    className: "code"
  }, /*#__PURE__*/React.createElement("div", {
    className: "code-head"
  }, /*#__PURE__*/React.createElement("span", null, "moav"), /*#__PURE__*/React.createElement(window.CopyButton, {
    text: "moav user add alice"
  })), /*#__PURE__*/React.createElement("pre", null, "moav user add alice    # configs + QR codes moav user add --batch 10")), /*#__PURE__*/React.createElement("p", {
    className: "step-note"
  }, "Each user gets a bundle with config files, QR codes, and a ", /*#__PURE__*/React.createElement("code", null, "subscription.txt"), "."))), /*#__PURE__*/React.createElement("div", {
    className: "step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "step-n"
  }, "3"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Connect from any device"), /*#__PURE__*/React.createElement("p", {
    className: "step-note",
    style: {
      marginTop: 0
    }
  }, "Import the subscription into Happ, Hiddify, v2rayNG, or WireGuard on iOS, Android, macOS, Windows, and Linux. Scan the QR and you're through."))))));
}
function SiteFooter() {
  return /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "foot-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "foot-brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "foot-logo"
  }, "MoaV"), /*#__PURE__*/React.createElement("p", null, "Mother of all VPNs \xB7 Internet freedom infrastructure")), /*#__PURE__*/React.createElement("div", {
    className: "foot-links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Docs"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "GitHub"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Protocols"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Clients"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "OpSec"))), /*#__PURE__*/React.createElement("div", {
    className: "foot-bottom"
  }, /*#__PURE__*/React.createElement("p", null, "MIT licensed \xB7 v1.8.3"), /*#__PURE__*/React.createElement("p", {
    className: "disc"
  }, "This project provides general-purpose open-source networking software only. It is not a service and not an operated network. All usage, deployment, and operation are the sole responsibility of third parties."))));
}
function MoaVSite() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("nav", {
    className: "lang-nav"
  }, /*#__PURE__*/React.createElement("a", {
    className: "active",
    href: "#"
  }, "EN"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "/"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "\u0641\u0627\u0631\u0633\u06CC")), /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(Protocols, null), /*#__PURE__*/React.createElement(Why, null), /*#__PURE__*/React.createElement(QuickStart, null), /*#__PURE__*/React.createElement(SiteFooter, null));
}
window.MoaVSite = MoaVSite;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/App.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.StatusPill = __ds_scope.StatusPill;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StatStrip = __ds_scope.StatStrip;

__ds_ns.Terminal = __ds_scope.Terminal;

__ds_ns.TerminalLine = __ds_scope.TerminalLine;

})();
