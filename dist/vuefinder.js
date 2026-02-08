import { inject as ht, reactive as yt, watch as ie, ref as A, computed as R, shallowRef as pn, markRaw as qn, defineComponent as te, onMounted as fe, nextTick as Be, createElementBlock as h, openBlock as u, withKeys as vt, unref as a, createElementVNode as s, createCommentVNode as L, withModifiers as ae, renderSlot as xe, toDisplayString as y, createBlock as U, resolveDynamicComponent as _n, withCtx as se, createVNode as N, Fragment as ve, renderList as pe, withDirectives as ue, vModelCheckbox as Ze, vModelText as We, onUnmounted as ke, useTemplateRef as Je, createTextVNode as ce, resolveComponent as hn, normalizeClass as ne, customRef as Gn, Teleport as bt, normalizeStyle as Oe, isRef as Wn, vModelSelect as mt, onBeforeUnmount as mn, vModelRadio as Dt, mergeProps as Ae, toHandlers as He, vShow as Ue, normalizeProps as Ke, guardReactiveProps as je, onUpdated as Yn, mergeModels as Qn, useModel as gn, Transition as Xn, provide as Jn } from "vue";
import Zn from "mitt";
import { useStore as W } from "@nanostores/vue";
import { persistentAtom as wn } from "@nanostores/persistent";
import { toast as _t, Toaster as eo } from "vue-sonner";
import { normalizeFeatures as yn } from "./features.js";
import { atom as Fe, computed as Ne } from "nanostores";
import { QueryClient as to } from "@tanstack/vue-query";
import no from "@uppy/core";
import { Cropper as oo } from "vue-advanced-cropper";
import bn from "vanilla-lazyload";
import { OverlayScrollbars as at, SizeObserverPlugin as so } from "overlayscrollbars";
import { computePosition as et, offset as rt, flip as lt, shift as dt, autoUpdate as zt } from "@floating-ui/dom";
import io from "@viselect/vanilla";
import ao from "@uppy/xhr-upload";
const Lt = /* @__PURE__ */ new Map(), It = /* @__PURE__ */ Symbol("ServiceContainerId");
function ro(n, e) {
  Lt.set(n, e);
}
function lo(n) {
  Lt.delete(n);
}
function ee(n) {
  const e = n ?? ht(It);
  if (!e)
    throw new Error(
      "No VueFinder app instance found. Make sure VueFinder component is mounted and provide the id explicitly or use within a VueFinder component tree."
    );
  const t = Lt.get(e);
  if (!t)
    throw new Error(
      `VueFinder app instance with id "${e}" was not found. Make sure the VueFinder component with id="${e}" is mounted.`
    );
  return t;
}
function co(n) {
  const e = localStorage.getItem(n + "_storage"), t = yt(JSON.parse(e ?? "{}"));
  ie(t, o);
  function o() {
    Object.keys(t).length ? localStorage.setItem(n + "_storage", JSON.stringify(t)) : localStorage.removeItem(n + "_storage");
  }
  function i(c, v) {
    t[c] = v;
  }
  function l(c) {
    delete t[c];
  }
  function r() {
    Object.keys(t).forEach((c) => l(c));
  }
  return { getStore: (c, v = null) => c in t ? t[c] : v, setStore: i, removeStore: l, clearStore: r };
}
function Pe(n, e = "An error occurred") {
  if (!n)
    return e;
  if (typeof n == "string")
    return n || e;
  if (n instanceof Error)
    return n.message || e;
  if (typeof n == "object" && n !== null) {
    const t = n;
    if (typeof t.message == "string" && t.message)
      return t.message;
    if (typeof t.error == "string" && t.error)
      return t.error;
  }
  return e;
}
function uo(n, e) {
  return wn(n, e, {
    encode: JSON.stringify,
    decode: JSON.parse
  });
}
function vo(n) {
  if (!n?.config?.get)
    return !0;
  try {
    return !!n.config.get("notificationsEnabled");
  } catch {
    return !0;
  }
}
function Xe(n, e, t) {
  const o = { type: e, message: t };
  if (n?.emitter?.emit?.("vf-notify", o), !!vo(n))
    switch (e) {
      case "success":
        _t.success(t);
        break;
      case "error":
        _t.error(t);
        break;
      case "warning":
        _t.warning(t);
        break;
      default:
        _t.info(t);
        break;
    }
}
function De(n) {
  return {
    success(e) {
      Xe(n, "success", e);
    },
    error(e) {
      Xe(n, "error", e);
    },
    info(e) {
      Xe(n, "info", e);
    },
    warning(e) {
      Xe(n, "warning", e);
    },
    emit(e, t) {
      Xe(n, e, t);
    }
  };
}
const Tt = /* @__PURE__ */ new Map();
async function Et(n, e) {
  const t = e[n];
  return typeof t == "function" ? (await t()).default : t;
}
function fo(n, e, t, o, i) {
  const l = De({ emitter: t, config: i }), r = "vuefinder_locale", d = "global";
  let c;
  if (Tt.has(d))
    c = Tt.get(d), e && e !== c.get() && c.set(e);
  else {
    const k = localStorage.getItem(r) ? JSON.parse(localStorage.getItem(r)) : null;
    c = uo(r, e || k || "en"), Tt.set(d, c);
  }
  const v = "vuefinder_translations", f = (k) => {
    try {
      const x = localStorage.getItem(v);
      if (x)
        return JSON.parse(x)[k] || null;
    } catch {
    }
    return null;
  }, w = (k, x) => {
    try {
      const b = localStorage.getItem(v), D = b ? JSON.parse(b) : {};
      D[k] = x, localStorage.setItem(v, JSON.stringify(D));
    } catch {
    }
  }, p = W(c), S = String(p.value), F = f(S), C = A(F || {});
  let m = !1;
  !F && Object.keys(o).length > 0 && Et(S, o).then((k) => {
    C.value = k, w(S, k);
  }).catch(() => {
  }), ie(
    p,
    async (k, x) => {
      if (x && k === x)
        return;
      if (!m) {
        m = !0;
        const D = f(String(k));
        if (D)
          C.value = D;
        else if (Object.keys(o).length > 0)
          try {
            const E = await Et(String(k), o);
            C.value = E, w(String(k), E);
          } catch {
          }
        return;
      }
      const b = f(String(k));
      if (b)
        C.value = b;
      else
        try {
          const D = await Et(String(k), o);
          C.value = D, w(String(k), D);
        } catch (D) {
          const E = Pe(D, "Locale cannot be loaded!");
          l.error(E);
          return;
        }
      Object.values(o).length > 1 && (l.success("The language is set to " + k), t.emit("vf-language-saved"));
    },
    { immediate: !1 }
  );
  const g = (k, ...x) => x.length ? g(k = k.replace("%s", String(x.shift())), ...x) : k;
  function $(k, ...x) {
    return C.value && Object.prototype.hasOwnProperty.call(C.value, k) ? g(C.value[k] || k, ...x) : g(k, ...x);
  }
  const _ = R({
    get: () => p.value,
    set: (k) => {
      c.set(k);
    }
  });
  return yt({ t: $, locale: _, localeAtom: c });
}
const po = "4.0.33";
function Bt(n, e, t, o, i) {
  return e = Math, t = e.log, o = 1024, i = t(n) / t(o) | 0, (n / e.pow(o, i)).toFixed(0) + " " + (i ? "KMGTPEZY"[--i] + "iB" : "B");
}
function kn(n, e, t, o, i) {
  return e = Math, t = e.log, o = 1e3, i = t(n) / t(o) | 0, (n / e.pow(o, i)).toFixed(0) + " " + (i ? "KMGTPEZY"[--i] + "B" : "B");
}
function _o(n) {
  if (typeof n == "number") return n;
  const e = { k: 1, m: 2, g: 3, t: 4 }, o = /(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i.exec(n);
  if (!o) return 0;
  const i = parseFloat(o[1] || "0"), l = (o[2] || "").toLowerCase(), r = e[l] ?? 0;
  return Math.round(i * Math.pow(1024, r));
}
function ho(n) {
  const e = pn(null), t = A(!1), o = A(), i = A(!1);
  return { visible: t, type: e, data: o, open: (c, v = null) => {
    n.get("fullScreen") || (document.querySelector("body").style.overflow = "hidden"), t.value = !0, e.value = c, o.value = v;
  }, close: () => {
    n.get("fullScreen") || (document.querySelector("body").style.overflow = ""), t.value = !1, e.value = null;
  }, setEditMode: (c) => {
    i.value = c;
  }, editMode: i };
}
const gt = {
  view: "grid",
  theme: "silver",
  fullScreen: !1,
  showTreeView: !1,
  showHiddenFiles: !0,
  metricUnits: !1,
  showThumbnails: !0,
  persist: !1,
  path: "",
  pinnedFolders: [],
  notificationsEnabled: !0,
  expandTreeByDefault: !1,
  expandedTreePaths: []
}, wt = {
  initialPath: null,
  maxFileSize: null,
  loadingIndicator: "circular",
  showMenuBar: !0,
  showToolbar: !0,
  gridItemWidth: 96,
  gridItemHeight: 80,
  gridItemGap: 8,
  gridIconSize: 48,
  listItemHeight: 32,
  listItemGap: 2,
  listIconSize: 16,
  notificationPosition: "bottom-center",
  notificationDuration: 3e3,
  notificationVisibleToasts: 4,
  notificationRichColors: !0
}, mo = new Set(
  Object.keys(wt)
);
function go(n) {
  return n || "silver";
}
function $n(n) {
  return mo.has(n);
}
function tn(n) {
  const e = {}, t = {}, o = n;
  for (const i in o)
    if ($n(i))
      t[i] = o[i];
    else if (i in gt) {
      const l = i;
      e[l] = o[i];
    }
  return { persistenceConfig: e, nonPersistenceConfig: t };
}
function nn(n, e) {
  const t = { ...gt, ...e, ...n };
  return t.theme = go(t.theme), t;
}
function on(n, e) {
  return { ...wt, ...e, ...n };
}
const wo = (n, e = {}) => {
  const t = `vuefinder_config_${n}`, { persistenceConfig: o, nonPersistenceConfig: i } = tn(e), l = nn(
    o,
    gt
  ), r = on(
    i,
    wt
  ), d = wn(
    t,
    l,
    {
      encode: JSON.stringify,
      decode: JSON.parse
    }
  ), c = Fe(r), v = Ne(
    [d, c],
    (m, g) => ({
      ...m,
      ...g
    })
  ), f = (m = {}) => {
    const g = d.get(), $ = c.get(), { persistenceConfig: _, nonPersistenceConfig: k } = tn(m), x = nn(_, g), b = on(
      k,
      $
    );
    d.set(x), c.set(b);
  }, w = (m) => $n(m) ? c.get()[m] : d.get()[m], p = () => ({
    ...d.get(),
    ...c.get()
  }), S = (m, g) => {
    const $ = d.get();
    typeof m == "object" && m !== null ? d.set({ ...$, ...m }) : d.set({
      ...$,
      [m]: g
    });
  };
  return {
    // Store atom (combined)
    state: v,
    // Methods
    init: f,
    get: w,
    set: S,
    toggle: (m) => {
      const g = d.get();
      S(m, !g[m]);
    },
    all: p,
    reset: () => {
      d.set({ ...gt }), c.set({ ...wt });
    }
  };
};
function yo(n, e) {
  if (typeof n == "string" && typeof e == "string")
    return n.toLowerCase().localeCompare(e.toLowerCase());
  const t = Number(n) || 0, o = Number(e) || 0;
  return t === o ? 0 : t < o ? -1 : 1;
}
const bo = () => {
  const n = Fe(""), e = Fe([]), t = Fe(!1), o = Fe([]), i = Fe({ active: !1, column: "", order: "" }), l = Fe({
    kind: "all",
    showHidden: !1
  }), r = Fe(/* @__PURE__ */ new Set()), d = Fe({
    type: "copy",
    path: "",
    items: /* @__PURE__ */ new Set()
  }), c = Fe(null), v = Fe(0), f = Fe(!1), w = Fe([]), p = Fe(-1), S = Ne([n], (H) => {
    const K = (H ?? "").trim(), Q = K.indexOf("://"), oe = Q >= 0 ? K.slice(0, Q) : "", Ee = (Q >= 0 ? K.slice(Q + 3) : K).split("/").filter(Boolean);
    let Ie = "";
    const nt = Ee.map((Se) => (Ie = Ie ? `${Ie}/${Se}` : Se, {
      basename: Se,
      name: Se,
      path: oe ? `${oe}://${Ie}` : Ie,
      type: "dir"
    }));
    return { storage: oe, breadcrumb: nt, path: K };
  }), F = Ne([o, i, l], (H, K, Q) => {
    let oe = H;
    Q.kind === "files" ? oe = oe.filter((Se) => Se.type === "file") : Q.kind === "folders" && (oe = oe.filter((Se) => Se.type === "dir")), Q.showHidden || (oe = oe.filter((Se) => !Se.basename.startsWith(".")));
    const { active: Le, column: Ee, order: Ie } = K;
    if (!Le || !Ee) return oe;
    const nt = Ie === "asc" ? 1 : -1;
    return oe.slice().sort((Se, Ft) => yo(Se[Ee], Ft[Ee]) * nt);
  }), C = Ne([o, r], (H, K) => K.size === 0 ? [] : H.filter((Q) => K.has(Q.path))), m = (H, K) => {
    const Q = n.get();
    if ((K ?? !0) && Q !== H) {
      const oe = w.get(), Le = p.get();
      Le < oe.length - 1 && oe.splice(Le + 1), oe.length === 0 && Q && oe.push(Q), oe.push(H), w.set([...oe]), p.set(oe.length - 1);
    }
    n.set(H);
  }, g = (H) => {
    o.set(H ?? []);
  }, $ = (H) => {
    e.set(H ?? []);
  }, _ = (H, K) => {
    i.set({ active: !0, column: H, order: K });
  }, k = (H) => {
    const K = i.get();
    K.active && K.column === H ? i.set({
      active: K.order === "asc",
      column: H,
      order: "desc"
    }) : i.set({
      active: !0,
      column: H,
      order: "asc"
    });
  }, x = () => {
    i.set({ active: !1, column: "", order: "" });
  }, b = (H, K) => {
    l.set({ kind: H, showHidden: K });
  }, D = () => {
    l.set({ kind: "all", showHidden: !1 });
  }, E = (H, K = "multiple") => {
    const Q = new Set(r.get());
    K === "single" && Q.clear(), Q.add(H), r.set(Q);
  }, V = (H, K = "multiple") => {
    const Q = new Set(r.get());
    K === "single" && Q.clear(), H.forEach((oe) => Q.add(oe)), r.set(Q);
  }, j = (H) => {
    const K = new Set(r.get());
    K.delete(H), r.set(K);
  }, O = (H) => r.get().has(H), q = (H, K = "multiple") => {
    const Q = new Set(r.get());
    Q.has(H) ? Q.delete(H) : (K === "single" && Q.clear(), Q.add(H)), r.set(Q);
  }, M = (H = "multiple", K) => {
    if (H === "single") {
      const Q = o.get()[0];
      if (Q) {
        const oe = Q.path;
        r.set(/* @__PURE__ */ new Set([oe])), v.set(1);
      }
    } else {
      if (K?.selectionFilterType || K?.selectionFilterMimeIncludes && K.selectionFilterMimeIncludes.length > 0) {
        const Q = o.get().filter((oe) => {
          const Le = K.selectionFilterType, Ee = K.selectionFilterMimeIncludes;
          return Le === "files" && oe.type === "dir" || Le === "dirs" && oe.type === "file" ? !1 : Ee && Array.isArray(Ee) && Ee.length > 0 && oe.type !== "dir" ? oe.mime_type ? Ee.some((Ie) => oe.mime_type?.startsWith(Ie)) : !1 : !0;
        }).map((oe) => oe.path);
        r.set(new Set(Q));
      } else {
        const Q = new Set(o.get().map((oe) => oe.path));
        r.set(Q);
      }
      J(r.get().size);
    }
  }, X = () => {
    r.set(/* @__PURE__ */ new Set()), v.set(0);
  }, G = (H) => {
    const K = new Set(H ?? []);
    r.set(K), v.set(K.size);
  }, J = (H) => {
    v.set(H);
  }, I = (H) => {
    f.set(!!H);
  }, T = () => f.get(), P = (H, K) => {
    const Q = o.get().filter((oe) => K.has(oe.path));
    d.set({
      type: H,
      path: S.get().path,
      items: new Set(Q)
    });
  }, z = (H) => Ne([d], (K) => K.type === "cut" && Array.from(K.items).some((Q) => Q.path === H)), B = (H) => Ne([d], (K) => K.type === "copy" && Array.from(K.items).some((Q) => Q.path === H)), Y = (H) => {
    const K = z(H);
    return W(K).value ?? !1;
  }, le = (H) => {
    const K = B(H);
    return W(K).value ?? !1;
  }, _e = () => {
    d.set({ type: "copy", path: "", items: /* @__PURE__ */ new Set() });
  }, $e = () => d.get(), ge = (H) => {
    c.set(H);
  }, Ye = () => c.get(), qe = () => {
    c.set(null);
  }, we = () => {
    const H = w.get(), K = p.get();
    if (K > 0) {
      const Q = K - 1, oe = H[Q];
      oe && (p.set(Q), m(oe, !1));
    }
  }, Z = () => {
    const H = w.get(), K = p.get();
    if (K < H.length - 1) {
      const Q = K + 1, oe = H[Q];
      oe && (p.set(Q), m(oe, !1));
    }
  }, de = Ne([p], (H) => H > 0), re = Ne(
    [w, p],
    (H, K) => K < H.length - 1
  );
  return {
    // Atoms (state)
    files: o,
    storages: e,
    currentPath: n,
    sort: i,
    filter: l,
    selectedKeys: r,
    selectedCount: v,
    loading: f,
    draggedItem: c,
    clipboardItems: d,
    // Computed values
    path: S,
    sortedFiles: F,
    selectedItems: C,
    // Actions
    setPath: m,
    setFiles: g,
    setStorages: $,
    setSort: _,
    toggleSort: k,
    clearSort: x,
    setFilter: b,
    clearFilter: D,
    select: E,
    selectMultiple: V,
    deselect: j,
    toggleSelect: q,
    selectAll: M,
    isSelected: O,
    clearSelection: X,
    setSelection: G,
    setSelectedCount: J,
    setLoading: I,
    isLoading: T,
    setClipboard: P,
    createIsCut: z,
    createIsCopied: B,
    isCut: Y,
    isCopied: le,
    clearClipboard: _e,
    getClipboard: $e,
    setDraggedItem: ge,
    getDraggedItem: Ye,
    clearDraggedItem: qe,
    setReadOnly: (H) => {
      t.set(H);
    },
    getReadOnly: () => t.get(),
    isReadOnly: (H) => t.get() ? !0 : H.read_only ?? !1,
    // Navigation
    goBack: we,
    goForward: Z,
    canGoBack: de,
    canGoForward: re,
    navigationHistory: w,
    historyIndex: p
  };
};
class Vt {
  /**
   * Validate that required parameters are provided
   */
  validateParam(e, t) {
    if (e == null)
      throw new Error(`${t} is required`);
  }
  /**
   * Validate that a file path is provided
   */
  validatePath(e) {
    if (!e)
      throw new Error("Path must be a non-empty string");
  }
  /**
   * Extract storage and path from a combined path string
   * Format: "storage://path" or just "path"
   */
  parsePath(e) {
    if (!e)
      return {};
    if (e.includes("://")) {
      const [t, ...o] = e.split("://");
      return { storage: t, path: o.join("://") };
    }
    return { path: e };
  }
  /**
   * Combine storage and path into a single path string
   */
  combinePath(e, t) {
    return e && t ? `${e}://${t}` : t || "";
  }
}
class ko extends Vt {
  filesSource;
  defaultStorage;
  storages;
  storagesSet;
  readOnly;
  contentStore;
  constructor(e) {
    super(), this.filesSource = e.files;
    const t = e.storages && e.storages.length > 0 ? e.storages : [e.storage || "memory"];
    this.storages = [...new Set(t)], this.defaultStorage = e.storage || this.storages[0] || "memory", this.storages.includes(this.defaultStorage) || this.storages.unshift(this.defaultStorage), this.storagesSet = new Set(this.storages), this.readOnly = !!e.readOnly, this.contentStore = e.contentStore || /* @__PURE__ */ new Map();
  }
  get files() {
    return Array.isArray(this.filesSource) ? this.filesSource : this.filesSource.value;
  }
  set files(e) {
    Array.isArray(this.filesSource) ? (this.filesSource.length = 0, this.filesSource.push(...e)) : this.filesSource.value = e;
  }
  ensureWritable() {
    if (this.readOnly)
      throw new Error("Driver is read-only");
  }
  ensureStorageSupported(e) {
    if (!this.storagesSet.has(e))
      throw new Error(`Unsupported storage: ${e}`);
  }
  combine(e, t = this.defaultStorage) {
    this.ensureStorageSupported(t);
    const o = e ?? "";
    return o === "" ? `${t}://` : `${t}://${o}`;
  }
  split(e) {
    return this.parsePath(e);
  }
  normalizePath(e, t = this.defaultStorage) {
    const { storage: o, path: i } = this.split(e || ""), l = o || t;
    return this.combine(i ?? "", l);
  }
  parent(e) {
    const { storage: t, path: o } = this.split(e), i = t || this.defaultStorage;
    if (!o) return this.combine("", i);
    const l = o.replace(/\/+$/g, "").replace(/^\/+/, ""), r = l.lastIndexOf("/");
    return r <= 0 ? this.combine("", i) : this.combine(l.slice(0, r), i);
  }
  join(e, t) {
    const { storage: o, path: i } = this.split(e), l = o || this.defaultStorage, r = (i ?? "").replace(/\/$/, ""), d = r ? `${r}/${t}` : t;
    return this.combine(d, l);
  }
  getExtension(e) {
    const t = e.lastIndexOf(".");
    return t > 0 ? e.slice(t + 1) : "";
  }
  cloneEntry(e, t = {}) {
    return { ...e, ...t };
  }
  findByPath(e) {
    return this.files.find((t) => t.path === e);
  }
  listChildren(e) {
    return this.files.filter((t) => t.dir === e);
  }
  replaceAll(e) {
    this.files = e;
  }
  upsert(e) {
    const t = this.files.slice(), o = t.findIndex((i) => i.path === e.path);
    o === -1 ? t.push(e) : t[o] = e, this.replaceAll(t);
  }
  removeExact(e) {
    const t = this.files.filter((o) => o.path !== e);
    this.replaceAll(t);
  }
  removeTree(e) {
    const t = [], o = [];
    for (const i of this.files)
      this.isInTree(i.path, e) ? t.push(i) : o.push(i);
    this.replaceAll(o);
    for (const i of t)
      this.contentStore.delete(i.path);
    return t;
  }
  isInTree(e, t) {
    return e === t || e.startsWith(`${t}/`);
  }
  getTree(e, t = this.files) {
    return t.filter((o) => this.isInTree(o.path, e)).sort((o, i) => o.path.length - i.path.length);
  }
  uniqueName(e, t, o) {
    if (!o.has(this.join(e, t))) return t;
    const i = t.lastIndexOf("."), l = i > 0 ? t.slice(0, i) : t, r = i > 0 ? t.slice(i) : "";
    let d = 1;
    for (; ; ) {
      const c = `${l} copy ${d}${r}`, v = this.join(e, c);
      if (!o.has(v)) return c;
      d++;
    }
  }
  topLevelSources(e, t = this.defaultStorage) {
    const o = [...new Set(e)].map((l) => this.normalizePath(l, t)).filter((l) => this.findByPath(l)).sort((l, r) => l.length - r.length), i = [];
    for (const l of o)
      i.some((r) => this.isInTree(l, r)) || i.push(l);
    return i;
  }
  makeDirEntry(e, t) {
    const o = this.join(e, t), { storage: i } = this.split(o);
    return {
      storage: i || this.defaultStorage,
      dir: e,
      basename: t,
      extension: "",
      path: o,
      type: "dir",
      file_size: null,
      last_modified: Date.now(),
      mime_type: null,
      visibility: "public"
    };
  }
  makeFileEntry(e, t, o = 0, i = null) {
    const l = this.join(e, t), { storage: r } = this.split(l);
    return {
      storage: r || this.defaultStorage,
      dir: e,
      basename: t,
      extension: this.getExtension(t),
      path: l,
      type: "file",
      file_size: o,
      last_modified: Date.now(),
      mime_type: i,
      visibility: "public"
    };
  }
  resultForDir(e) {
    return {
      files: this.listChildren(e),
      storages: this.storages,
      read_only: this.readOnly,
      dirname: e
    };
  }
  async list(e) {
    const t = this.normalizePath(e?.path);
    return {
      storages: this.storages,
      dirname: t,
      files: this.listChildren(t),
      read_only: this.readOnly
    };
  }
  async delete(e) {
    this.ensureWritable(), this.validateParam(e.items, "items"), this.validateParam(e.path, "path");
    const t = this.normalizePath(e.path), { storage: o } = this.split(t), i = [];
    for (const r of e.items) {
      const d = this.normalizePath(r.path, o || this.defaultStorage), c = this.findByPath(d);
      c && (c.type === "dir" ? i.push(...this.removeTree(c.path)) : (this.removeExact(c.path), this.contentStore.delete(c.path), i.push(c)));
    }
    return { ...this.resultForDir(t), deleted: i };
  }
  async rename(e) {
    this.ensureWritable(), this.validateParam(e.name, "name");
    const t = this.normalizePath(e.path), { storage: o } = this.split(t), i = this.normalizePath(e.item || e.path, o || this.defaultStorage), l = this.findByPath(i);
    if (!l) throw new Error("Item not found");
    const r = l.dir, d = this.join(r, e.name);
    if (d !== l.path && this.findByPath(d))
      throw new Error("Target already exists");
    if (l.type === "dir") {
      const v = l.path, f = d, w = this.files.map((p) => {
        if (p.storage !== l.storage || !this.isInTree(p.path, v)) return p;
        const S = f + p.path.slice(v.length);
        return this.cloneEntry(p, {
          path: S,
          dir: this.parent(S),
          basename: p.path === v ? e.name : p.basename,
          last_modified: Date.now()
        });
      });
      for (const [p, S] of Array.from(this.contentStore.entries()))
        this.isInTree(p, v) && (this.contentStore.delete(p), this.contentStore.set(f + p.slice(v.length), S));
      this.replaceAll(w);
    } else {
      const v = this.cloneEntry(l, {
        path: d,
        basename: e.name,
        extension: this.getExtension(e.name),
        last_modified: Date.now()
      });
      this.upsert(v), this.removeExact(l.path);
      const f = this.contentStore.get(l.path);
      f !== void 0 && (this.contentStore.delete(l.path), this.contentStore.set(v.path, f));
    }
    const c = e.path ? this.normalizePath(e.path, l.storage || this.defaultStorage) : r;
    return this.resultForDir(c || r);
  }
  async copy(e) {
    this.ensureWritable(), this.validateParam(e.sources, "sources"), this.validateParam(e.destination, "destination");
    const t = this.normalizePath(
      e.destination,
      e.path ? this.split(this.normalizePath(e.path)).storage || this.defaultStorage : this.defaultStorage
    ), { storage: o } = this.split(t), i = this.topLevelSources(e.sources, o || this.defaultStorage), l = new Set(this.files.map((d) => d.path)), r = [];
    for (const d of i) {
      const c = this.findByPath(d);
      if (!c) continue;
      if (c.type === "file") {
        const p = this.uniqueName(t, c.basename, l), S = this.makeFileEntry(t, p, c.file_size || 0, c.mime_type);
        r.push(S), l.add(S.path);
        const F = this.contentStore.get(c.path);
        F !== void 0 && this.contentStore.set(S.path, F);
        continue;
      }
      const v = this.getTree(c.path), f = this.uniqueName(t, c.basename, l), w = /* @__PURE__ */ new Map();
      w.set(c.path, this.join(t, f));
      for (const p of v) {
        const S = p.path === c.path ? w.get(c.path) : this.join(w.get(p.dir), p.basename);
        w.set(p.path, S);
        const F = p.path === c.path ? t : w.get(p.dir), C = p.path === c.path ? f : p.basename, m = this.cloneEntry(p, {
          path: S,
          dir: F,
          basename: C,
          extension: p.type === "file" ? this.getExtension(C) : "",
          last_modified: Date.now()
        });
        if (r.push(m), l.add(m.path), p.type === "file") {
          const g = this.contentStore.get(p.path);
          g !== void 0 && this.contentStore.set(m.path, g);
        }
      }
    }
    return this.replaceAll(this.files.concat(r)), this.resultForDir(t);
  }
  async move(e) {
    this.ensureWritable(), this.validateParam(e.sources, "sources"), this.validateParam(e.destination, "destination");
    const t = this.normalizePath(
      e.destination,
      e.path ? this.split(this.normalizePath(e.path)).storage || this.defaultStorage : this.defaultStorage
    ), { storage: o } = this.split(t), i = this.topLevelSources(e.sources, o || this.defaultStorage);
    let l = this.files.slice();
    for (const r of i) {
      const d = l.find((F) => F.path === r);
      if (!d) continue;
      if (d.type === "dir" && this.isInTree(t, d.path))
        throw new Error("Cannot move directory into itself");
      if (d.dir === t)
        continue;
      const c = this.getTree(d.path, l), v = new Set(c.map((F) => F.path)), f = new Set(l.filter((F) => !v.has(F.path)).map((F) => F.path)), w = this.uniqueName(t, d.basename, f), p = /* @__PURE__ */ new Map();
      p.set(d.path, this.join(t, w));
      const S = /* @__PURE__ */ new Map();
      for (const F of c) {
        const C = F.path === d.path ? p.get(d.path) : this.join(p.get(F.dir), F.basename);
        p.set(F.path, C);
        const m = F.path === d.path ? t : p.get(F.dir), g = F.path === d.path ? w : F.basename;
        S.set(
          F.path,
          this.cloneEntry(F, {
            path: C,
            dir: m,
            basename: g,
            extension: F.type === "file" ? this.getExtension(g) : "",
            last_modified: Date.now()
          })
        );
      }
      l = l.map((F) => S.get(F.path) || F);
      for (const [F, C] of p.entries()) {
        if (F === C) continue;
        const m = this.contentStore.get(F);
        m !== void 0 && (this.contentStore.delete(F), this.contentStore.set(C, m));
      }
    }
    return this.replaceAll(l), this.resultForDir(t);
  }
  async archive(e) {
    this.ensureWritable(), this.validateParam(e.path, "path"), this.validateParam(e.items, "items"), this.validateParam(e.name, "name");
    const t = this.normalizePath(e.path), o = e.name.endsWith(".zip") ? e.name : `${e.name}.zip`, i = this.makeFileEntry(t, o, 0, "application/zip");
    return this.upsert(i), this.resultForDir(t);
  }
  async unarchive(e) {
    this.ensureWritable(), this.validateParam(e.item, "item"), this.validateParam(e.path, "path");
    const t = this.normalizePath(e.item), o = this.normalizePath(e.path), i = this.findByPath(t);
    if (!i) throw new Error("Archive not found");
    const l = i.basename.replace(/\.zip$/i, ""), r = this.makeDirEntry(o, l);
    return this.upsert(r), this.resultForDir(o);
  }
  async createFile(e) {
    this.ensureWritable(), this.validateParam(e.path, "path"), this.validateParam(e.name, "name");
    const t = this.normalizePath(e.path), o = this.makeFileEntry(t, e.name, 0, null);
    return this.upsert(o), this.contentStore.set(o.path, ""), this.resultForDir(t);
  }
  async createFolder(e) {
    this.ensureWritable(), this.validateParam(e.path, "path"), this.validateParam(e.name, "name");
    const t = this.normalizePath(e.path), o = this.makeDirEntry(t, e.name);
    return this.upsert(o), this.resultForDir(t);
  }
  getPreviewUrl(e) {
    return "";
  }
  async getContent(e) {
    this.validatePath(e.path);
    const t = this.normalizePath(e.path), o = this.contentStore.get(t);
    if (typeof o == "string" || o === void 0)
      return {
        content: o ?? "",
        mimeType: this.findByPath(t)?.mime_type || void 0
      };
    const i = new Uint8Array(o);
    let l = "";
    for (let r = 0; r < i.length; r++) l += String.fromCharCode(i[r]);
    return {
      content: btoa(l),
      mimeType: this.findByPath(t)?.mime_type || void 0
    };
  }
  getDownloadUrl(e) {
    return "";
  }
  async search(e) {
    const t = (e.filter || "").toLowerCase(), o = e.path ? this.normalizePath(e.path) : void 0;
    return this.files.filter((i) => {
      if (o) {
        if (e.deep) {
          if (!this.isInTree(i.path, o)) return !1;
        } else if (i.dir !== o)
          return !1;
      }
      return i.basename.toLowerCase().includes(t) || i.path.toLowerCase().includes(t);
    });
  }
  async save(e) {
    this.ensureWritable(), this.validateParam(e.path, "path");
    const t = this.normalizePath(e.path), o = this.findByPath(t);
    if (!o) throw new Error("File not found");
    if (o.type !== "file") throw new Error("Can only save file content");
    return this.contentStore.set(t, e.content), this.upsert(this.cloneEntry(o, { file_size: e.content.length, last_modified: Date.now() })), t;
  }
  configureUploader(e, t) {
    e && e.on("upload-success", async (o) => {
      try {
        this.ensureWritable();
        const i = this.normalizePath(t.getTargetPath()), l = o?.name || "file", r = o?.type || null, d = o?.data, c = o?.size || 0, v = this.makeFileEntry(i, l, c, r);
        if (this.upsert(v), d)
          try {
            const f = await d.arrayBuffer();
            this.contentStore.set(v.path, f);
          } catch {
            this.contentStore.set(v.path, "");
          }
        else
          this.contentStore.set(v.path, "");
      } catch {
      }
    });
  }
}
function sn(n, e, t) {
  const o = `HTTP ${e}: ${t}`;
  if (!n)
    return o;
  try {
    const i = JSON.parse(n);
    if (i.message)
      return i.message;
    if (i.error) {
      if (typeof i.error == "string")
        return i.error;
      if (i.error.message)
        return i.error.message;
    }
    if (i.errors && Array.isArray(i.errors) && i.errors.length > 0) {
      const l = i.errors.map((r) => r.message).filter((r) => !!r);
      if (l.length > 0)
        return l.join(", ");
    }
    return i.detail ? i.detail : i.title ? i.title : n;
  } catch {
    return n || o;
  }
}
class xn extends Vt {
  config;
  /**
   * Default URL endpoints
   */
  static DEFAULT_URLS = {
    list: "",
    upload: "/upload",
    delete: "/delete",
    rename: "/rename",
    copy: "/copy",
    move: "/move",
    archive: "/archive",
    unarchive: "/unarchive",
    createFile: "/create-file",
    createFolder: "/create-folder",
    preview: "/preview",
    download: "/download",
    search: "/search",
    save: "/save"
  };
  constructor(e) {
    super();
    const t = {
      ...xn.DEFAULT_URLS,
      ...e.url || {}
    };
    this.config = {
      ...e,
      baseURL: e.baseURL || "",
      url: t
    };
  }
  /**
   * Set or update the base URL for API requests
   */
  setBaseURL(e) {
    this.config.baseURL = e || "";
  }
  /**
   * Set or update the authentication token
   * Pass undefined to remove the token
   */
  setToken(e) {
    this.config.token = e;
  }
  configureUploader(e, t) {
    const o = this.getHeaders();
    delete o["Content-Type"], e.use(ao, {
      endpoint: `${this.config.baseURL}${this.config.url.upload}`,
      fieldName: "file",
      bundle: !1,
      headers: o,
      formData: !0
    }), e.on("upload", () => {
      const i = t.getTargetPath();
      e.getFiles().forEach((r) => {
        e.setFileMeta(r.id, { path: i });
      });
    });
  }
  getHeaders() {
    const e = {
      "Content-Type": "application/json",
      ...this.config.headers
    };
    return this.config.token && (e.Authorization = `Bearer ${this.config.token}`), e;
  }
  async request(e, t = {}) {
    const o = `${this.config.baseURL}${e}`, i = await fetch(o, {
      ...t,
      headers: {
        ...this.getHeaders(),
        ...t.headers
      }
    });
    if (!i.ok) {
      const r = await i.text(), d = sn(r, i.status, i.statusText);
      throw new Error(d);
    }
    return (i.headers.get("content-type") || "").includes("application/json") ? await i.json() : await i.text();
  }
  async list(e) {
    const t = new URLSearchParams();
    e?.path && t.append("path", e.path);
    const o = t.toString() ? `${this.config.url.list}?${t.toString()}` : this.config.url.list;
    return await this.request(o, { method: "GET" });
  }
  async delete(e) {
    return this.validateParam(e.items, "items"), this.validateParam(e.path, "path"), await this.request(this.config.url.delete, {
      method: "POST",
      body: JSON.stringify({ path: e.path, items: e.items })
    });
  }
  async rename(e) {
    return this.validateParam(e.path, "path"), this.validateParam(e.item, "item"), this.validateParam(e.name, "name"), this.validatePath(e.path), await this.request(this.config.url.rename, {
      method: "POST",
      body: JSON.stringify({ path: e.path, item: e.item, name: e.name })
    });
  }
  async copy(e) {
    return this.validateParam(e.sources, "sources"), this.validateParam(e.destination, "destination"), e.path && this.validatePath(e.path), await this.request(this.config.url.copy, {
      method: "POST",
      body: JSON.stringify({
        sources: e.sources,
        destination: e.destination,
        path: e.path
      })
    });
  }
  async move(e) {
    return this.validateParam(e.sources, "sources"), this.validateParam(e.destination, "destination"), e.path && this.validatePath(e.path), await this.request(this.config.url.move, {
      method: "POST",
      body: JSON.stringify({
        sources: e.sources,
        destination: e.destination,
        path: e.path
      })
    });
  }
  async archive(e) {
    return this.validateParam(e.items, "items"), this.validateParam(e.name, "name"), this.validateParam(e.path, "path"), await this.request(this.config.url.archive, {
      method: "POST",
      body: JSON.stringify({ items: e.items, path: e.path, name: e.name })
    });
  }
  async unarchive(e) {
    return this.validateParam(e.item, "item"), this.validateParam(e.path, "path"), await this.request(this.config.url.unarchive, {
      method: "POST",
      body: JSON.stringify({ item: e.item, path: e.path })
    });
  }
  async createFile(e) {
    return this.validateParam(e.name, "name"), this.validateParam(e.path, "path"), await this.request(this.config.url.createFile, {
      method: "POST",
      body: JSON.stringify({ path: e.path, name: e.name })
    });
  }
  async createFolder(e) {
    return this.validateParam(e.name, "name"), this.validateParam(e.path, "path"), await this.request(this.config.url.createFolder, {
      method: "POST",
      body: JSON.stringify({ path: e.path, name: e.name })
    });
  }
  getPreviewUrl(e) {
    this.validatePath(e.path);
    const t = new URLSearchParams({ path: e.path });
    return `${this.config.baseURL}${this.config.url.preview}?${t.toString()}`;
  }
  async getContent(e) {
    this.validatePath(e.path);
    const t = new URLSearchParams({ path: e.path }), o = `${this.config.baseURL}${this.config.url.preview}?${t.toString()}`, i = await fetch(o, { headers: this.getHeaders() });
    if (!i.ok) {
      const r = await i.text(), d = sn(r, i.status, i.statusText);
      throw new Error(d);
    }
    return { content: await i.text(), mimeType: i.headers.get("Content-Type") || void 0 };
  }
  getDownloadUrl(e) {
    this.validatePath(e.path);
    const t = new URLSearchParams({ path: e.path });
    return `${this.config.baseURL}${this.config.url.download}?${t.toString()}`;
  }
  async search(e) {
    const t = this.config.url.search, o = new URLSearchParams();
    e.path && o.set("path", e.path), e.filter && o.set("filter", e.filter), e.deep && o.set("deep", "1"), e.size && e.size !== "all" && o.set("size", e.size);
    const i = o.toString() ? `${t}?${o.toString()}` : t;
    return (await this.request(i, {
      method: "GET"
    })).files || [];
  }
  async save(e) {
    return this.validateParam(e.path, "path"), await this.request(this.config.url.save, {
      method: "POST",
      body: JSON.stringify({ path: e.path, content: e.content }),
      headers: this.getHeaders()
    });
  }
}
class pf extends Vt {
  dbName;
  defaultStorage;
  storages;
  storagesSet;
  readOnly;
  version;
  db = null;
  dbPromise = null;
  entries = [];
  contentStore = /* @__PURE__ */ new Map();
  driver;
  readyPromise = null;
  constructor(e = {}) {
    super(), this.dbName = e.dbName || "vuefinder";
    const t = e.storages && e.storages.length > 0 ? e.storages : [e.storage || "indexeddb"];
    this.storages = [...new Set(t)], this.defaultStorage = e.storage || this.storages[0] || "indexeddb", this.storages.includes(this.defaultStorage) || this.storages.unshift(this.defaultStorage), this.storagesSet = new Set(this.storages), this.readOnly = !!e.readOnly, this.version = e.version || 1, this.driver = new ko({
      files: this.entries,
      storage: this.defaultStorage,
      storages: this.storages,
      readOnly: this.readOnly,
      contentStore: this.contentStore
    }), this.readyPromise = this.loadSnapshotFromDB();
  }
  isManagedStorage(e) {
    return !!(e && this.storagesSet.has(e));
  }
  isManagedPath(e) {
    if (!e) return !1;
    const { storage: t } = this.parsePath(e);
    return this.isManagedStorage(t);
  }
  async initDB() {
    return this.dbPromise ? this.dbPromise : (this.dbPromise = new Promise((e, t) => {
      const o = indexedDB.open(this.dbName, this.version);
      o.onerror = () => t(o.error), o.onsuccess = () => {
        this.db = o.result, e(this.db);
      }, o.onupgradeneeded = (i) => {
        const l = i.target.result;
        if (!l.objectStoreNames.contains("files")) {
          const r = l.createObjectStore("files", { keyPath: "path" });
          r.createIndex("storage", "storage", { unique: !1 }), r.createIndex("dir", "dir", { unique: !1 });
        }
        l.objectStoreNames.contains("content") || l.createObjectStore("content", { keyPath: "path" });
      };
    }), this.dbPromise);
  }
  async getDB() {
    return this.db ? this.db : this.initDB();
  }
  requestToPromise(e) {
    return new Promise((t, o) => {
      e.onsuccess = () => t(e.result), e.onerror = () => o(e.error);
    });
  }
  waitTransaction(e) {
    return new Promise((t, o) => {
      e.oncomplete = () => t(), e.onerror = () => o(e.error), e.onabort = () => o(e.error);
    });
  }
  async loadSnapshotFromDB() {
    const t = (await this.getDB()).transaction(["files", "content"], "readonly"), o = t.objectStore("files"), i = t.objectStore("content"), [l, r] = await Promise.all([
      this.requestToPromise(o.getAll()),
      this.requestToPromise(i.getAll())
    ]);
    await this.waitTransaction(t), this.entries.length = 0, this.entries.push(...l.filter((d) => this.isManagedStorage(d.storage))), this.contentStore.clear();
    for (const d of r)
      this.isManagedPath(d?.path) && this.contentStore.set(d.path, d.content);
  }
  async persistSnapshot() {
    if (this.readOnly) return;
    const t = (await this.getDB()).transaction(["files", "content"], "readwrite"), o = t.objectStore("files"), i = t.objectStore("content"), l = this.requestToPromise(o.getAll()), r = this.requestToPromise(
      i.getAll()
    ), [d, c] = await Promise.all([
      l,
      r
    ]);
    o.clear(), i.clear();
    for (const v of d)
      this.isManagedStorage(v.storage) || o.put(v);
    for (const v of c)
      this.isManagedPath(v.path) || i.put(v);
    for (const v of this.entries)
      this.isManagedStorage(v.storage) && o.put(v);
    for (const [v, f] of this.contentStore.entries())
      this.isManagedPath(v) && i.put({ path: v, content: f });
    await this.waitTransaction(t);
  }
  async ensureReady() {
    this.readyPromise || (this.readyPromise = this.loadSnapshotFromDB()), await this.readyPromise;
  }
  async list(e) {
    return await this.ensureReady(), this.driver.list(e);
  }
  async delete(e) {
    await this.ensureReady();
    const t = await this.driver.delete(e);
    return await this.persistSnapshot(), t;
  }
  async rename(e) {
    await this.ensureReady();
    const t = await this.driver.rename(e);
    return await this.persistSnapshot(), t;
  }
  async copy(e) {
    await this.ensureReady();
    const t = await this.driver.copy(e);
    return await this.persistSnapshot(), t;
  }
  async move(e) {
    await this.ensureReady();
    const t = await this.driver.move(e);
    return await this.persistSnapshot(), t;
  }
  async archive(e) {
    await this.ensureReady();
    const t = await this.driver.archive(e);
    return await this.persistSnapshot(), t;
  }
  async unarchive(e) {
    await this.ensureReady();
    const t = await this.driver.unarchive(e);
    return await this.persistSnapshot(), t;
  }
  async createFile(e) {
    await this.ensureReady();
    const t = await this.driver.createFile(e);
    return await this.persistSnapshot(), t;
  }
  async createFolder(e) {
    await this.ensureReady();
    const t = await this.driver.createFolder(e);
    return await this.persistSnapshot(), t;
  }
  getPreviewUrl(e) {
    return this.driver.getPreviewUrl(e);
  }
  async getContent(e) {
    return await this.ensureReady(), this.driver.getContent(e);
  }
  getDownloadUrl(e) {
    return this.driver.getDownloadUrl(e);
  }
  async search(e) {
    return await this.ensureReady(), this.driver.search(e);
  }
  async save(e) {
    await this.ensureReady();
    const t = await this.driver.save(e);
    return await this.persistSnapshot(), t;
  }
  configureUploader(e, t) {
    this.ensureReady(), this.driver.configureUploader?.(e, t), e && e.on("upload-success", async () => {
      try {
        await this.ensureReady(), await this.persistSnapshot();
      } catch {
      }
    });
  }
}
const an = {
  list: (n) => ["adapter", "list", n],
  search: (n, e, t, o) => ["adapter", "search", n, e, t, o],
  delete: (n) => ["adapter", "delete", n],
  rename: () => ["adapter", "rename"],
  copy: () => ["adapter", "copy"],
  move: () => ["adapter", "move"],
  archive: () => ["adapter", "archive"],
  unarchive: () => ["adapter", "unarchive"],
  createFile: () => ["adapter", "createFile"],
  createFolder: () => ["adapter", "createFolder"]
};
class $o {
  driver;
  queryClient;
  config;
  onBeforeOpen;
  onAfterOpen;
  constructor(e, t = {}) {
    this.driver = e, this.onBeforeOpen = t.onBeforeOpen, this.onAfterOpen = t.onAfterOpen, this.queryClient = t.queryClient || new to({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: t.refetchOnWindowFocus ?? !1,
          staleTime: t.staleTime ?? 300 * 1e3,
          retry: t.retry ?? 2
        },
        mutations: {
          retry: t.retry ?? 1
        }
      }
    }), this.config = {
      queryClient: this.queryClient,
      refetchOnWindowFocus: t.refetchOnWindowFocus ?? !1,
      staleTime: t.staleTime ?? 300 * 1e3,
      cacheTime: t.cacheTime ?? 600 * 1e3,
      retry: t.retry ?? 2,
      onBeforeOpen: this.onBeforeOpen ?? (() => {
      }),
      onAfterOpen: this.onAfterOpen ?? (() => {
      })
    };
  }
  /**
   * Get the underlying driver instance
   */
  getDriver() {
    return this.driver;
  }
  /**
   * Get the query client instance
   */
  getQueryClient() {
    return this.queryClient;
  }
  /**
   * List files with caching and automatic refetching
   */
  async list(e) {
    const t = an.list(e);
    return await this.queryClient.fetchQuery({
      queryKey: t,
      queryFn: () => this.driver.list({ path: e }),
      staleTime: this.config.staleTime
    });
  }
  /**
   * Open a path and optionally update state
   * @param path
   * @returns
   */
  async open(e) {
    this.onBeforeOpen && this.onBeforeOpen();
    const t = await this.list(e);
    return this.onAfterOpen && this.onAfterOpen(t), t;
  }
  /**
   * Delete files with optimistic updates
   */
  async delete(e) {
    const t = await this.driver.delete(e);
    return this.invalidateListQueries(), t;
  }
  /**
   * Rename a file or folder
   */
  async rename(e) {
    const t = await this.driver.rename(e);
    return this.invalidateListQueries(), t;
  }
  /**
   * Copy files to a destination
   */
  async copy(e) {
    const t = await this.driver.copy(e);
    return this.invalidateListQueries(), t;
  }
  /**
   * Move files to a destination
   */
  async move(e) {
    const t = await this.driver.move(e);
    return this.invalidateListQueries(), t;
  }
  /**
   * Create a zip archive
   */
  async archive(e) {
    const t = await this.driver.archive(e);
    return this.invalidateListQueries(), t;
  }
  /**
   * Extract files from a zip archive
   */
  async unarchive(e) {
    const t = await this.driver.unarchive(e);
    return this.invalidateListQueries(), t;
  }
  /**
   * Create a new file
   */
  async createFile(e) {
    const t = await this.driver.createFile(e);
    return this.invalidateListQueries(), t;
  }
  /**
   * Create a new folder
   */
  async createFolder(e) {
    const t = await this.driver.createFolder(e);
    return this.invalidateListQueries(), t;
  }
  /**
   * Get file content (cached)
   */
  async getContent(e) {
    const t = ["adapter", "content", e.path];
    return await this.queryClient.fetchQuery({
      queryKey: t,
      queryFn: () => this.driver.getContent(e),
      staleTime: this.config.staleTime
    });
  }
  /**
   * Get preview URL
   */
  getPreviewUrl(e) {
    return this.driver.getPreviewUrl(e);
  }
  /**
   * Get download URL
   */
  getDownloadUrl(e) {
    return this.driver.getDownloadUrl(e);
  }
  /**
   * Search files (cached per path+filter)
   */
  async search(e) {
    const t = an.search(e.path, e.filter, e.deep, e.size);
    return await this.queryClient.fetchQuery({
      queryKey: t,
      queryFn: () => this.driver.search(e),
      staleTime: this.config.staleTime
    });
  }
  /**
   * Save content to file (and invalidate list cache)
   */
  async save(e) {
    const t = await this.driver.save(e);
    return this.invalidateListQueries(), t;
  }
  /**
   * Invalidate all list queries
   */
  invalidateListQueries() {
    this.queryClient.invalidateQueries({
      queryKey: ["adapter"],
      exact: !1
    });
  }
  invalidateListQuery(e) {
    this.queryClient.invalidateQueries({
      queryKey: ["adapter", "list", e],
      exact: !0
    });
  }
  /**
   * Clear all cached queries
   */
  clearCache() {
    this.queryClient.clear();
  }
}
function xo(n) {
  const e = W(n.state);
  return {
    current: R(() => e.value.theme || "silver"),
    set: (i) => {
      n.set("theme", i);
    }
  };
}
const So = (n, e) => {
  const t = co(n.id ?? "vf"), o = Zn(), i = e.i18n, l = n.locale ?? e.locale, r = wo(n.id ?? "vf", n.config ?? {}), d = bo();
  if (!n.driver)
    throw new Error("Driver is required for VueFinder");
  const c = new $o(n.driver);
  return yt({
    // app version
    version: po,
    // config store
    config: r,
    // Theme
    theme: (() => {
      const v = xo(r);
      return {
        current: v.current,
        set: v.set
      };
    })(),
    // files store
    fs: d,
    // root element
    root: null,
    // app id
    debug: n.debug ?? !1,
    // Event Bus
    emitter: o,
    // storage
    storage: t,
    // localization object
    i18n: fo(
      t,
      l,
      o,
      i,
      r
    ),
    // modal state
    modal: ho(r),
    // adapter for file operations (always wrapped with AdapterManager)
    // Use markRaw to prevent TanStack Query from being made reactive
    adapter: qn(c),
    // active features
    features: yn(n.features),
    // selection mode
    selectionMode: n.selectionMode || "multiple",
    // selection filters - computed properties for better reactivity
    selectionFilterType: R(() => n.selectionFilterType || "both"),
    selectionFilterMimeIncludes: R(() => n.selectionFilterMimeIncludes || []),
    // treeViewData - temp. opened folders
    treeViewData: [],
    // human readable file sizes
    filesize: r.get("metricUnits") ? kn : Bt,
    // possible items of the context menu
    contextMenuItems: n.contextMenuItems,
    // expose custom uploader if provided
    customUploader: n.customUploader
  });
}, Co = ["data-theme"], Fo = { class: "vuefinder__modal-layout__container" }, Po = { class: "vuefinder__modal-layout__content" }, Do = {
  key: 0,
  class: "vuefinder__modal-layout__footer"
}, To = {
  key: 0,
  class: "vuefinder__modal-drag-overlay"
}, Eo = { class: "vuefinder__modal-drag-message" }, Te = /* @__PURE__ */ te({
  __name: "ModalLayout",
  props: {
    showDragOverlay: { type: Boolean },
    dragOverlayText: {}
  },
  setup(n) {
    const e = A(null), t = ee();
    t.config;
    const o = n;
    fe(() => {
      const l = document.querySelector(".v-f-modal input");
      l && l.focus(), Be(() => {
        if (document.querySelector(".v-f-modal input") && window.innerWidth < 768 && e.value) {
          const r = e.value.getBoundingClientRect().bottom + 16;
          window.scrollTo({
            top: r,
            left: 0,
            behavior: "smooth"
          });
        }
      });
    });
    const i = (l) => {
      l.target.classList.contains(
        "vuefinder__modal-layout__wrapper"
      ) && (l.preventDefault(), l.stopPropagation());
    };
    return (l, r) => (u(), h("div", {
      "data-theme": a(t).theme.current,
      class: "vuefinder__themer vuefinder__modal-layout",
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true",
      tabindex: "0",
      onKeyup: r[1] || (r[1] = vt((d) => a(t).modal.close(), ["esc"]))
    }, [
      r[2] || (r[2] = s("div", { class: "vuefinder__modal-layout__overlay" }, null, -1)),
      s("div", Fo, [
        s("div", {
          class: "vuefinder__modal-layout__wrapper",
          onContextmenu: i,
          onMousedown: r[0] || (r[0] = ae((d) => a(t).modal.close(), ["self"]))
        }, [
          s("div", {
            ref_key: "modalBody",
            ref: e,
            class: "vuefinder__modal-layout__body"
          }, [
            s("div", Po, [
              xe(l.$slots, "default")
            ]),
            l.$slots.buttons ? (u(), h("div", Do, [
              xe(l.$slots, "buttons")
            ])) : L("", !0)
          ], 512)
        ], 32)
      ]),
      o.showDragOverlay ? (u(), h("div", To, [
        s("div", Eo, y(o.dragOverlayText || "Drag and drop the files/folders to here."), 1)
      ])) : L("", !0)
    ], 40, Co));
  }
}), Mo = { class: "vuefinder__modal-header" }, Io = { class: "vuefinder__modal-header__icon-container" }, Ao = {
  id: "modal-title",
  class: "vuefinder__modal-header__title"
}, Me = /* @__PURE__ */ te({
  __name: "ModalHeader",
  props: {
    title: {},
    icon: {}
  },
  setup(n) {
    return (e, t) => (u(), h("div", Mo, [
      s("div", Io, [
        (u(), U(_n(n.icon), { class: "vuefinder__modal-header__icon" }))
      ]),
      s("div", Ao, y(n.title), 1)
    ]));
  }
}), Oo = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.8",
  viewBox: "0 0 24 24"
};
function zo(n, e) {
  return u(), h("svg", Oo, [...e[0] || (e[0] = [
    s("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }, null, -1),
    s("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M12 8.2h.01M10.75 11.25H12v4.5m0 0h1.25m-1.25 0h-2"
    }, null, -1)
  ])]);
}
const Sn = { render: zo }, Lo = { class: "vuefinder__about-modal__content" }, Bo = { class: "vuefinder__about-modal__main" }, Vo = { class: "vuefinder__about-modal__tab-content" }, Ro = { class: "vuefinder__about-modal__lead" }, Uo = { class: "vuefinder__about-modal__description" }, No = { class: "vuefinder__about-modal__links" }, Ho = {
  href: "https://vuefinder.ozdemir.be",
  class: "vuefinder__about-modal__link-btn",
  target: "_blank",
  rel: "noopener noreferrer"
}, Ko = { class: "vuefinder__about-modal__meta" }, jo = { class: "vuefinder__about-modal__meta-item" }, qo = { class: "vuefinder__about-modal__meta-label" }, Go = { class: "vuefinder__about-modal__meta-value" }, Wo = { class: "vuefinder__about-modal__meta-item" }, Yo = { class: "vuefinder__about-modal__meta-label" }, Cn = /* @__PURE__ */ te({
  __name: "ModalAbout",
  setup(n) {
    const e = ee(), { t } = e.i18n;
    return (o, i) => (u(), U(Te, null, {
      buttons: se(() => [
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: i[0] || (i[0] = (l) => a(e).modal.close())
        }, y(a(t)("Close")), 1)
      ]),
      default: se(() => [
        s("div", Lo, [
          N(Me, {
            icon: a(Sn),
            title: "Vuefinder " + a(e).version
          }, null, 8, ["icon", "title"]),
          s("div", Bo, [
            s("div", Vo, [
              s("div", Ro, y(a(t)("A modern, customizable file manager component built for Vue.")), 1),
              s("div", Uo, y(a(t)("If you like it, please follow and ⭐ star on GitHub.")), 1),
              s("div", No, [
                s("a", Ho, y(a(t)("Project Home")), 1),
                i[1] || (i[1] = s("a", {
                  href: "https://github.com/n1crack/vuefinder",
                  class: "vuefinder__about-modal__link-btn",
                  target: "_blank",
                  rel: "noopener noreferrer"
                }, " GitHub ", -1))
              ]),
              s("div", Ko, [
                s("div", jo, [
                  s("span", qo, y(a(t)("Version")), 1),
                  s("span", Go, y(a(e).version), 1)
                ]),
                s("div", Wo, [
                  s("span", Yo, y(a(t)("License")), 1),
                  i[2] || (i[2] = s("span", { class: "vuefinder__about-modal__meta-value" }, "MIT", -1))
                ])
              ])
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Qo = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  viewBox: "0 0 24 24"
};
function Xo(n, e) {
  return u(), h("svg", Qo, [...e[0] || (e[0] = [
    s("path", { d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.089 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0" }, null, -1)
  ])]);
}
const Fn = { render: Xo }, Jo = { class: "vuefinder__delete-modal__content" }, Zo = { class: "vuefinder__delete-modal__form" }, es = { class: "vuefinder__delete-modal__description" }, ts = { class: "vuefinder__delete-modal__files vf-scrollbar" }, ns = {
  key: 0,
  class: "vuefinder__delete-modal__icon vuefinder__delete-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, os = {
  key: 1,
  class: "vuefinder__delete-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, ss = { class: "vuefinder__delete-modal__file-name" }, is = { class: "vuefinder__delete-modal__confirmation" }, as = { class: "vuefinder__delete-modal__confirmation-label" }, rs = { class: "vuefinder__delete-modal__confirmation-text" }, ls = ["disabled"], kt = /* @__PURE__ */ te({
  __name: "ModalDelete",
  setup(n) {
    const e = ee(), t = De(e), { t: o } = e.i18n, i = e.fs, l = W(i.path), r = A(e.modal.data.items), d = A(!1), c = () => {
      r.value.length && d.value && e.adapter.delete({
        path: l.value.path,
        items: r.value.map(({ path: v, type: f }) => ({
          path: v,
          type: f
        }))
      }).then((v) => {
        t.success(o("Files deleted.")), e.fs.setFiles(v.files), e.modal.close();
      }).catch((v) => {
        t.error(Pe(v, o("Failed to delete files")));
      });
    };
    return (v, f) => (u(), U(Te, null, {
      buttons: se(() => [
        s("div", is, [
          s("label", as, [
            ue(s("input", {
              "onUpdate:modelValue": f[0] || (f[0] = (w) => d.value = w),
              type: "checkbox",
              class: "vuefinder__delete-modal__checkbox"
            }, null, 512), [
              [Ze, d.value]
            ]),
            s("span", rs, y(a(o)("I'm sure delete it, This action cannot be undone.")), 1)
          ])
        ]),
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-danger",
          disabled: !d.value,
          onClick: c
        }, y(a(o)("Yes, Delete!")), 9, ls),
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: f[1] || (f[1] = (w) => a(e).modal.close())
        }, y(a(o)("Cancel")), 1)
      ]),
      default: se(() => [
        s("div", null, [
          N(Me, {
            icon: a(Fn),
            title: a(o)("Delete files")
          }, null, 8, ["icon", "title"]),
          s("div", Jo, [
            s("div", Zo, [
              s("p", es, y(a(o)("Are you sure you want to delete these files?")), 1),
              s("div", ts, [
                (u(!0), h(ve, null, pe(r.value, (w) => (u(), h("p", {
                  key: w.path,
                  class: "vuefinder__delete-modal__file"
                }, [
                  w.type === "dir" ? (u(), h("svg", ns, [...f[2] || (f[2] = [
                    s("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ])])) : (u(), h("svg", os, [...f[3] || (f[3] = [
                    s("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ])])),
                  s("span", ss, y(w.basename), 1)
                ]))), 128))
              ])
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), ds = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  viewBox: "0 0 24 24"
};
function cs(n, e) {
  return u(), h("svg", ds, [...e[0] || (e[0] = [
    s("path", { d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" }, null, -1)
  ])]);
}
const Pn = { render: cs }, us = { class: "vuefinder__rename-modal__content" }, vs = { class: "vuefinder__rename-modal__item" }, fs = { class: "vuefinder__rename-modal__item-info" }, ps = {
  key: 0,
  class: "vuefinder__rename-modal__icon vuefinder__rename-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, _s = {
  key: 1,
  class: "vuefinder__rename-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, hs = { class: "vuefinder__rename-modal__item-name" }, $t = /* @__PURE__ */ te({
  __name: "ModalRename",
  setup(n) {
    const e = ee(), t = De(e), { t: o } = e.i18n, i = e.fs, l = W(i.path), r = A(e.modal.data.items[0]), d = A(r.value.basename), c = () => {
      d.value != r.value.basename && e.adapter.rename({
        path: l.value.path,
        item: r.value.path,
        name: d.value
      }).then((v) => {
        t.success(o("%s is renamed.", d.value)), e.fs.setFiles(v.files), e.modal.close();
      }).catch((v) => {
        t.error(Pe(v, o("Failed to rename")));
      });
    };
    return (v, f) => (u(), U(Te, null, {
      buttons: se(() => [
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-primary",
          onClick: c
        }, y(a(o)("Rename")), 1),
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: f[1] || (f[1] = (w) => a(e).modal.close())
        }, y(a(o)("Cancel")), 1)
      ]),
      default: se(() => [
        s("div", null, [
          N(Me, {
            icon: a(Pn),
            title: a(o)("Rename")
          }, null, 8, ["icon", "title"]),
          s("div", us, [
            s("div", vs, [
              s("p", fs, [
                r.value.type === "dir" ? (u(), h("svg", ps, [...f[2] || (f[2] = [
                  s("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  }, null, -1)
                ])])) : (u(), h("svg", _s, [...f[3] || (f[3] = [
                  s("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }, null, -1)
                ])])),
                s("span", hs, y(r.value.basename), 1)
              ]),
              ue(s("input", {
                "onUpdate:modelValue": f[0] || (f[0] = (w) => d.value = w),
                class: "vuefinder__rename-modal__input",
                placeholder: "Name",
                type: "text",
                onKeyup: vt(c, ["enter"])
              }, null, 544), [
                [We, d.value]
              ])
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
});
function ze() {
  const n = ee(), e = R(() => n.features);
  return {
    enabled: (o) => e.value[o] ?? !1
  };
}
const ms = { class: "vuefinder__text-preview" }, gs = { class: "vuefinder__text-preview__header" }, ws = ["title"], ys = { class: "vuefinder__text-preview__actions" }, bs = {
  key: 0,
  class: "vuefinder__text-preview__content"
}, ks = { key: 1 }, $s = /* @__PURE__ */ te({
  __name: "Text",
  emits: ["success"],
  setup(n, { emit: e }) {
    const t = e, o = A(""), i = A(""), l = A(null), r = A(!1), d = ee(), c = De(d), { enabled: v } = ze(), { t: f } = d.i18n;
    fe(async () => {
      try {
        const S = await d.adapter.getContent({ path: d.modal.data.item.path });
        o.value = S.content, t("success");
      } catch (S) {
        Pe(S, "Failed to load text content"), t("success");
      }
    });
    const w = () => {
      r.value = !r.value, i.value = o.value, d.modal.setEditMode(r.value);
    }, p = async () => {
      try {
        const S = d.modal.data.item.path;
        await d.adapter.save({
          path: S,
          content: i.value
        }), o.value = i.value, c.success(f("Updated.")), t("success"), r.value = !r.value;
      } catch (S) {
        c.error(Pe(S, f("Failed to save file")));
      }
    };
    return (S, F) => (u(), h("div", ms, [
      s("div", gs, [
        s("div", {
          id: "modal-title",
          class: "vuefinder__text-preview__title",
          title: a(d).modal.data.item.path
        }, y(a(d).modal.data.item.basename), 9, ws),
        s("div", ys, [
          r.value ? (u(), h("button", {
            key: 0,
            class: "vuefinder__text-preview__save-button",
            onClick: p
          }, y(a(f)("Save")), 1)) : L("", !0),
          a(v)("edit") ? (u(), h("button", {
            key: 1,
            class: "vuefinder__text-preview__edit-button",
            onClick: F[0] || (F[0] = (C) => w())
          }, y(r.value ? a(f)("Cancel") : a(f)("Edit")), 1)) : L("", !0)
        ])
      ]),
      s("div", null, [
        r.value ? (u(), h("div", ks, [
          ue(s("textarea", {
            ref_key: "editInput",
            ref: l,
            "onUpdate:modelValue": F[1] || (F[1] = (C) => i.value = C),
            class: "vuefinder__text-preview__textarea",
            name: "text",
            cols: "30",
            rows: "10"
          }, null, 512), [
            [We, i.value]
          ])
        ])) : (u(), h("pre", bs, y(o.value), 1))
      ])
    ]));
  }
}), Rt = async (n, e) => {
  if (e) {
    if (e.isFile) {
      const t = await new Promise((o) => {
        e.file(o);
      });
      n(e, t);
    }
    if (e.isDirectory) {
      const t = e.createReader(), o = await new Promise((i) => {
        t.readEntries(i);
      });
      for (const i of o)
        await Rt(n, i);
    }
  }
}, me = {
  PENDING: 0,
  CANCELED: 1,
  UPLOADING: 2,
  ERROR: 3,
  DONE: 10
};
function Dn(n) {
  const e = ee(), { t } = e.i18n, o = e.fs, i = W(o.path), l = e.config, r = A({ QUEUE_ENTRY_STATUS: me }), d = A(null), c = A(null), v = A(null), f = A(null), w = A(null), p = A([]), S = A(""), F = A(!1), C = A(!1), m = A(null);
  let g;
  const $ = (I) => {
    I.preventDefault(), I.stopPropagation(), C.value = !0;
  }, _ = (I) => {
    I.preventDefault(), I.stopPropagation(), C.value = !0;
  }, k = (I) => {
    I.preventDefault(), I.stopPropagation(), (!I.relatedTarget || I.relatedTarget === document.body) && (C.value = !1);
  }, x = (I) => {
    I.preventDefault(), I.stopPropagation(), C.value = !1;
    const T = /^[/\\](.+)/, P = I.dataTransfer;
    P && (P.items && P.items.length ? Array.from(P.items).forEach((z) => {
      if (z.kind === "file") {
        const B = z.webkitGetAsEntry?.();
        if (B)
          Rt((Y, le) => {
            const _e = T.exec(Y?.fullPath || "");
            D(le, _e ? _e[1] : le.name);
          }, B);
        else {
          const Y = z.getAsFile?.();
          Y && D(Y);
        }
      }
    }) : P.files && P.files.length && Array.from(P.files).forEach((z) => D(z)));
  }, b = (I) => p.value.findIndex((T) => T.id === I), D = (I, T) => g.addFile({ name: T || I.name, type: I.type, data: I, source: "Local" }), E = (I) => I.status === me.DONE ? "text-green-600" : I.status === me.ERROR || I.status === me.CANCELED ? "text-red-600" : "", V = (I) => I.status === me.DONE ? "✓" : I.status === me.ERROR || I.status === me.CANCELED ? "!" : "...", j = () => f.value?.click(), O = () => e.modal.close(), q = (I) => {
    if (F.value || !p.value.filter((T) => T.status !== me.DONE).length) {
      F.value || (S.value = t("Please select file to upload first."));
      return;
    }
    S.value = "", m.value = I || i.value, g.upload();
  }, M = () => {
    g.cancelAll(), p.value.forEach((I) => {
      I.status !== me.DONE && (I.status = me.CANCELED, I.statusName = t("Canceled"));
    }), F.value = !1;
  }, X = (I) => {
    F.value || (g.removeFile(I.id), p.value.splice(b(I.id), 1));
  }, G = (I) => {
    if (!F.value)
      if (g.cancelAll(), I) {
        const T = p.value.filter((P) => P.status !== me.DONE);
        p.value = [], T.forEach((P) => D(P.originalFile, P.name));
      } else
        p.value = [];
  }, J = (I) => {
    I.forEach((T) => {
      D(T);
    });
  };
  return fe(() => {
    g = new no({
      debug: e.debug,
      restrictions: { maxFileSize: _o(l.get("maxFileSize") ?? "10mb") },
      locale: e.i18n.t("uppy"),
      onBeforeFileAdded: (z, B) => {
        if (B[z.id] != null) {
          const le = b(z.id);
          p.value[le]?.status === me.PENDING && (S.value = g.i18n("noDuplicates", { fileName: z.name })), p.value = p.value.filter((_e) => _e.id !== z.id);
        }
        return p.value.push({
          id: z.id,
          name: z.name,
          size: e.filesize(z.size),
          status: me.PENDING,
          statusName: t("Pending upload"),
          percent: null,
          originalFile: z.data
        }), !0;
      }
    });
    const I = {
      getTargetPath: () => (m.value || i.value).path
    };
    if (n)
      n(g, I);
    else if (e.adapter.getDriver().configureUploader)
      e.adapter.getDriver().configureUploader(g, I);
    else
      throw new Error("No uploader configured");
    g.on("restriction-failed", (z, B) => {
      const Y = p.value[b(z.id)];
      Y && X(Y), S.value = B.message;
    }), g.on("upload-start", (z) => {
      z.forEach((B) => {
        const Y = p.value[b(B.id)];
        Y && (Y.status = me.UPLOADING, Y.statusName = t("Uploading"), Y.percent = "0%");
      });
    }), g.on("upload-progress", (z, B) => {
      const Y = B.bytesTotal ?? 1, le = Math.floor(B.bytesUploaded / Y * 100), _e = b(z.id);
      _e !== -1 && p.value[_e] && (p.value[_e].percent = `${le}%`);
    }), g.on("upload-success", (z) => {
      const B = p.value[b(z.id)];
      B && (B.status = me.DONE, B.statusName = t("Done"));
    }), g.on("upload-error", (z, B) => {
      const Y = p.value[b(z.id)];
      Y && (Y.percent = null, Y.status = me.ERROR, Y.statusName = B?.isNetworkError ? t("Network Error, Unable establish connection to the server or interrupted.") : B?.message || t("Unknown Error"));
    }), g.on("error", (z) => {
      S.value = z.message, F.value = !1;
    }), g.on("complete", (z) => {
      F.value = !1;
      const B = m.value || i.value;
      e.adapter.invalidateListQuery(B.path), e.adapter.open(B.path);
      const Y = p.value.filter(
        (le) => le.status === me.DONE && z.successful.includes(le.id)
      ).map((le) => le.name);
      e.emitter.emit("vf-upload-complete", Y);
    }), f.value?.addEventListener("click", () => c.value?.click()), w.value?.addEventListener("click", () => v.value?.click());
    const T = { capture: !0 };
    document.addEventListener("dragover", $, T), document.addEventListener("dragenter", _, T), document.addEventListener("dragleave", k, T), document.addEventListener("drop", x, T);
    const P = (z) => {
      const B = z.target, Y = B.files;
      if (Y) {
        for (const le of Y) D(le);
        B.value = "";
      }
    };
    c.value?.addEventListener("change", P), v.value?.addEventListener("change", P);
  }), ke(() => {
    const I = { capture: !0 };
    document.removeEventListener("dragover", $, I), document.removeEventListener("dragenter", _, I), document.removeEventListener("dragleave", k, I), document.removeEventListener("drop", x, I);
  }), {
    container: d,
    internalFileInput: c,
    internalFolderInput: v,
    pickFiles: f,
    pickFolders: w,
    queue: p,
    message: S,
    uploading: F,
    hasFilesInDropArea: C,
    definitions: r,
    openFileSelector: j,
    upload: q,
    cancel: M,
    remove: X,
    clear: G,
    close: O,
    getClassNameForEntry: E,
    getIconForEntry: V,
    addExternalFiles: J
  };
}
const xs = { class: "vuefinder__image-preview" }, Ss = { class: "vuefinder__image-preview__header" }, Cs = ["title"], Fs = { class: "vuefinder__image-preview__actions" }, Ps = { class: "vuefinder__image-preview__image-container" }, Ds = ["src"], Ts = /* @__PURE__ */ te({
  name: "ImagePreview",
  __name: "Image",
  emits: ["success"],
  setup(n, { emit: e }) {
    const t = e, o = ee(), i = De(o), { enabled: l } = ze(), { t: r } = o.i18n, d = A(!1), c = A(
      o.modal.data.item.previewUrl ?? o.adapter.getPreviewUrl({ path: o.modal.data.item.path })
    ), v = A(c.value), { addExternalFiles: f, upload: w, queue: p } = Dn(o.customUploader), S = o.fs, F = W(S.path), C = Je("cropperRef"), m = async () => {
      d.value = !d.value, o.modal.setEditMode(d.value);
    }, g = async () => {
      const _ = C.value?.getResult({
        size: { width: 795, height: 341 },
        fillColor: "#ffffff"
      })?.canvas;
      if (!_) return;
      let k = _;
      if (_.width > 1200 || _.height > 1200) {
        const V = Math.min(1200 / _.width, 1200 / _.height), j = document.createElement("canvas");
        j.width = Math.floor(_.width * V), j.height = Math.floor(_.height * V);
        const O = j.getContext("2d");
        O && (O.drawImage(_, 0, 0, j.width, j.height), k = j);
      }
      const x = o.modal.data.item.basename, b = x.split(".").pop()?.toLowerCase() || "jpg", D = b === "png" ? "image/png" : b === "gif" ? "image/gif" : "image/jpeg", E = await new Promise((V) => {
        k.toBlob((j) => V(j), D);
      });
      if (!E) {
        i.error(r("Failed to save image"));
        return;
      }
      try {
        const V = new File([E], x, { type: D }), O = o.modal.data.item.path.split("/");
        O.pop();
        const M = {
          path: O.join("/") || (F.value?.path ?? "")
        };
        f([V]), await new Promise((I) => setTimeout(I, 100));
        const X = p.value.find((I) => I.name === V.name);
        if (!X)
          throw new Error("File was not added to upload queue");
        w(M);
        let G = 0;
        for (; G < 150; ) {
          await new Promise((T) => setTimeout(T, 200));
          const I = p.value.find((T) => T.id === X.id);
          if (I?.status === me.DONE) break;
          if (I?.status === me.ERROR)
            throw new Error(I.statusName || "Upload failed");
          G++;
        }
        i.success(r("Updated.")), await fetch(c.value, { cache: "reload", mode: "no-cors" });
        const J = o.root?.querySelector?.('[data-src="' + c.value + '"]');
        J && J instanceof HTMLElement && bn.resetStatus(J), o.emitter.emit("vf-refresh-thumbnails"), await m(), t("success");
      } catch (V) {
        i.error(Pe(V, r("Failed to save image")));
      }
    };
    return fe(() => {
      t("success");
    }), ($, _) => (u(), h("div", xs, [
      s("div", Ss, [
        s("h3", {
          id: "modal-title",
          class: "vuefinder__image-preview__title",
          title: a(o).modal.data.item.path
        }, y(a(o).modal.data.item.basename), 9, Cs),
        s("div", Fs, [
          d.value ? (u(), h("button", {
            key: 0,
            class: "vuefinder__image-preview__crop-button",
            onClick: g
          }, y(a(r)("Crop")), 1)) : L("", !0),
          a(l)("edit") ? (u(), h("button", {
            key: 1,
            class: "vuefinder__image-preview__edit-button",
            onClick: _[0] || (_[0] = (k) => m())
          }, y(d.value ? a(r)("Cancel") : a(r)("Edit")), 1)) : L("", !0)
        ])
      ]),
      s("div", Ps, [
        d.value ? (u(), U(a(oo), {
          key: 1,
          ref_key: "cropperRef",
          ref: C,
          class: "h-full w-full",
          crossorigin: "anonymous",
          src: v.value,
          "auto-zoom": !0,
          priority: "image",
          transitions: !0
        }, null, 8, ["src"])) : (u(), h("img", {
          key: 0,
          style: {},
          src: a(o).modal.data.item.previewUrl ?? a(o).adapter.getPreviewUrl({ path: a(o).modal.data.item.path }),
          class: "vuefinder__image-preview__image h-full w-full"
        }, null, 8, Ds))
      ])
    ]));
  }
}), Es = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24"
};
function Ms(n, e) {
  return u(), h("svg", Es, [...e[0] || (e[0] = [
    s("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"
    }, null, -1)
  ])]);
}
const ct = { render: Ms }, Is = { class: "vuefinder__default-preview" }, As = { class: "vuefinder__default-preview__content" }, Os = { class: "vuefinder__default-preview__header" }, zs = ["title"], Ls = { class: "vuefinder__default-preview__icon-container" }, Bs = ["title"], Vs = /* @__PURE__ */ te({
  __name: "Default",
  emits: ["success"],
  setup(n, { emit: e }) {
    const t = ee(), o = e;
    return fe(() => {
      o("success");
    }), (i, l) => (u(), h("div", Is, [
      s("div", As, [
        s("div", Os, [
          s("h3", {
            id: "modal-title",
            class: "vuefinder__default-preview__title",
            title: a(t).modal.data.item.path
          }, y(a(t).modal.data.item.basename), 9, zs)
        ]),
        s("div", Ls, [
          N(a(ct), { class: "vuefinder__default-preview__file-icon" }),
          s("div", {
            id: "modal-title",
            class: "vuefinder__default-preview__file-name",
            title: a(t).modal.data.item.path
          }, y(a(t).modal.data.item.basename), 9, Bs)
        ])
      ])
    ]));
  }
}), Rs = { class: "vuefinder__video-preview" }, Us = ["title"], Ns = {
  class: "vuefinder__video-preview__video",
  preload: "metadata",
  controls: ""
}, Hs = ["src"], Ks = /* @__PURE__ */ te({
  __name: "Video",
  emits: ["success"],
  setup(n, { emit: e }) {
    const t = ee(), o = e, i = () => t.adapter.getPreviewUrl({ path: t.modal.data.item.path });
    return fe(() => {
      o("success");
    }), (l, r) => (u(), h("div", Rs, [
      s("h3", {
        id: "modal-title",
        class: "vuefinder__video-preview__title",
        title: a(t).modal.data.item.path
      }, y(a(t).modal.data.item.basename), 9, Us),
      s("div", null, [
        s("video", Ns, [
          s("source", {
            src: i(),
            type: "video/mp4"
          }, null, 8, Hs),
          r[0] || (r[0] = ce(" Your browser does not support the video tag. ", -1))
        ])
      ])
    ]));
  }
}), js = { class: "vuefinder__audio-preview" }, qs = ["title"], Gs = {
  class: "vuefinder__audio-preview__audio",
  controls: ""
}, Ws = ["src"], Ys = /* @__PURE__ */ te({
  __name: "Audio",
  emits: ["success"],
  setup(n, { emit: e }) {
    const t = e, o = ee(), i = () => {
      const l = ee();
      return l.adapter.getPreviewUrl({ path: l.modal.data.item.path });
    };
    return fe(() => {
      t("success");
    }), (l, r) => (u(), h("div", js, [
      s("h3", {
        id: "modal-title",
        class: "vuefinder__audio-preview__title",
        title: a(o).modal.data.item.path
      }, y(a(o).modal.data.item.basename), 9, qs),
      s("div", null, [
        s("audio", Gs, [
          s("source", {
            src: i(),
            type: "audio/mpeg"
          }, null, 8, Ws),
          r[0] || (r[0] = ce(" Your browser does not support the audio element. ", -1))
        ])
      ])
    ]));
  }
}), Qs = { class: "vuefinder__pdf-preview" }, Xs = ["title"], Js = ["data"], Zs = ["src"], ei = /* @__PURE__ */ te({
  __name: "Pdf",
  emits: ["success"],
  setup(n, { emit: e }) {
    const t = ee(), o = e, i = () => {
      const l = ee();
      return l.adapter.getPreviewUrl({ path: l.modal.data.item.path });
    };
    return fe(() => {
      o("success");
    }), (l, r) => (u(), h("div", Qs, [
      s("h3", {
        id: "modal-title",
        class: "vuefinder__pdf-preview__title",
        title: a(t).modal.data.item.path
      }, y(a(t).modal.data.item.basename), 9, Xs),
      s("div", null, [
        s("object", {
          class: "vuefinder__pdf-preview__object",
          data: i(),
          type: "application/pdf",
          width: "100%",
          height: "100%"
        }, [
          s("iframe", {
            class: "vuefinder__pdf-preview__iframe",
            src: i(),
            width: "100%",
            height: "100%"
          }, " Your browser does not support PDFs ", 8, Zs)
        ], 8, Js)
      ])
    ]));
  }
});
function ti(n, e = null) {
  return new Date(n * 1e3).toLocaleString(e ?? navigator.language ?? "en-US");
}
const ni = {
  key: 0,
  class: "vuefinder__preview-modal__nav-overlay"
}, oi = ["disabled", "title"], si = ["disabled", "title"], ii = { class: "vuefinder__preview-modal__content" }, ai = { key: 0 }, ri = { class: "vuefinder__preview-modal__loading" }, li = {
  key: 0,
  class: "vuefinder__preview-modal__loading-indicator"
}, di = { class: "vuefinder__preview-modal__details" }, ci = { class: "font-bold" }, ui = { class: "pl-2 font-bold" }, vi = {
  key: 0,
  class: "vuefinder__preview-modal__note"
}, fi = ["download", "href"], ft = /* @__PURE__ */ te({
  __name: "ModalPreview",
  setup(n) {
    const e = ee(), { enabled: t } = ze(), { t: o } = e.i18n, i = A(!1), l = ($) => {
      const _ = ($ || "").split("/").pop() || "", k = _.lastIndexOf(".");
      return k >= 0 ? _.slice(k + 1).toLowerCase() : "";
    }, r = ($, _) => {
      if (!_) return !1;
      const k = /* @__PURE__ */ new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico", "avif"]), x = /* @__PURE__ */ new Set(["mp4", "webm", "ogg", "ogv", "mov", "m4v"]), b = /* @__PURE__ */ new Set(["mp3", "wav", "ogg", "oga", "m4a", "flac", "aac"]), D = /* @__PURE__ */ new Set([
        "txt",
        "md",
        "json",
        "js",
        "ts",
        "css",
        "scss",
        "html",
        "xml",
        "csv",
        "log",
        "yml",
        "yaml"
      ]);
      return $ === "image" ? k.has(_) : $ === "video" ? x.has(_) : $ === "audio" ? b.has(_) : $ === "text" ? D.has(_) : $ === "application/pdf" ? _ === "pdf" : !1;
    }, d = ($) => {
      const _ = e.modal.data.item.mime_type;
      if (_ && typeof _ == "string") return _.startsWith($);
      const k = l(e.modal.data.item.path);
      return r($, k);
    }, c = t("preview");
    c || (i.value = !0);
    const v = R(() => e.modal.data.item), f = W(e.fs.sortedFiles), w = R(() => f.value.filter(($) => $.type === "file")), p = R(
      () => w.value.findIndex(($) => $.path === v.value.path)
    ), S = R(() => p.value > 0), F = R(() => p.value < w.value.length - 1), C = () => {
      if (e.modal.editMode || !S.value) return;
      const $ = w.value[p.value - 1];
      $ && (e.fs.clearSelection(), e.fs.select($.path), e.modal.data.item = $);
    }, m = () => {
      if (e.modal.editMode || !F.value) return;
      const $ = w.value[p.value + 1];
      $ && (e.fs.clearSelection(), e.fs.select($.path), e.modal.data.item = $);
    }, g = ($) => {
      if ($.key === "Escape") {
        $.preventDefault(), $.stopPropagation(), e.modal.close();
        return;
      }
      ($.key === "ArrowLeft" || $.key === "ArrowRight") && ($.preventDefault(), $.stopPropagation(), $.key === "ArrowLeft" ? C() : m());
    };
    return fe(() => {
      const $ = document.querySelector(".vuefinder__preview-modal");
      $ && $.focus();
    }), ($, _) => (u(), U(Te, null, {
      buttons: se(() => [
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: _[6] || (_[6] = (k) => a(e).modal.close())
        }, y(a(o)("Close")), 1),
        a(t)("download") ? (u(), h("a", {
          key: 0,
          target: "_blank",
          class: "vf-btn vf-btn-primary",
          download: a(e).adapter.getDownloadUrl(a(e).modal.data.item),
          href: a(e).adapter.getDownloadUrl(a(e).modal.data.item)
        }, y(a(o)("Download")), 9, fi)) : L("", !0)
      ]),
      default: se(() => [
        s("div", {
          class: "vuefinder__preview-modal",
          tabindex: "0",
          onKeydown: g
        }, [
          a(e).modal.editMode ? L("", !0) : (u(), h("div", ni, [
            s("button", {
              disabled: !S.value,
              class: "vuefinder__preview-modal__nav-side vuefinder__preview-modal__nav-side--left",
              title: a(o)("Previous file"),
              onClick: C
            }, [..._[7] || (_[7] = [
              s("svg", {
                class: "vuefinder__preview-modal__nav-icon",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                s("polyline", { points: "15,18 9,12 15,6" })
              ], -1)
            ])], 8, oi),
            s("button", {
              disabled: !F.value,
              class: "vuefinder__preview-modal__nav-side vuefinder__preview-modal__nav-side--right",
              title: a(o)("Next file"),
              onClick: m
            }, [..._[8] || (_[8] = [
              s("svg", {
                class: "vuefinder__preview-modal__nav-icon",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                s("polyline", { points: "9,18 15,12 9,6" })
              ], -1)
            ])], 8, si)
          ])),
          s("div", ii, [
            a(c) ? (u(), h("div", ai, [
              d("text") ? (u(), U($s, {
                key: `text-${v.value.path}`,
                onSuccess: _[0] || (_[0] = (k) => i.value = !0)
              })) : d("image") ? (u(), U(Ts, {
                key: `image-${v.value.path}`,
                onSuccess: _[1] || (_[1] = (k) => i.value = !0)
              })) : d("video") ? (u(), U(Ks, {
                key: `video-${v.value.path}`,
                onSuccess: _[2] || (_[2] = (k) => i.value = !0)
              })) : d("audio") ? (u(), U(Ys, {
                key: `audio-${v.value.path}`,
                onSuccess: _[3] || (_[3] = (k) => i.value = !0)
              })) : d("application/pdf") ? (u(), U(ei, {
                key: `pdf-${v.value.path}`,
                onSuccess: _[4] || (_[4] = (k) => i.value = !0)
              })) : (u(), U(Vs, {
                key: `default-${v.value.path}`,
                onSuccess: _[5] || (_[5] = (k) => i.value = !0)
              }))
            ])) : L("", !0),
            s("div", ri, [
              i.value === !1 ? (u(), h("div", li, [
                _[9] || (_[9] = s("svg", {
                  class: "vuefinder__preview-modal__spinner",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24"
                }, [
                  s("circle", {
                    class: "vuefinder__preview-modal__spinner-circle",
                    cx: "12",
                    cy: "12",
                    r: "10",
                    stroke: "currentColor",
                    "stroke-width": "4"
                  }),
                  s("path", {
                    class: "vuefinder__preview-modal__spinner-path",
                    fill: "currentColor",
                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  })
                ], -1)),
                s("span", null, y(a(o)("Loading")), 1)
              ])) : L("", !0)
            ])
          ])
        ], 32),
        s("div", di, [
          s("div", null, [
            s("span", ci, y(a(o)("File Size")) + ": ", 1),
            ce(y(a(e).filesize(a(e).modal.data.item.file_size)), 1)
          ]),
          s("div", null, [
            s("span", ui, y(a(o)("Last Modified")) + ": ", 1),
            ce(" " + y(a(ti)(a(e).modal.data.item.last_modified)), 1)
          ])
        ]),
        a(t)("download") ? (u(), h("div", vi, [
          s("span", null, y(a(o)(
            `Download doesn't work? You can try right-click "Download" button, select "Save link as...".`
          )), 1)
        ])) : L("", !0)
      ]),
      _: 1
    }));
  }
}), pi = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2"
};
function _i(n, e) {
  return u(), h("svg", pi, [...e[0] || (e[0] = [
    s("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    s("path", { d: "M13 19H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4l3 3h7a2 2 0 0 1 2 2v4M16 22l5-5M21 21.5V17h-4.5" }, null, -1)
  ])]);
}
const hi = { render: _i }, mi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24"
};
function gi(n, e) {
  return u(), h("svg", mi, [...e[0] || (e[0] = [
    s("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "1.5",
      d: "M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2"
    }, null, -1)
  ])]);
}
const Ut = { render: gi }, wi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24"
};
function yi(n, e) {
  return u(), h("svg", wi, [...e[0] || (e[0] = [
    s("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2"
    }, null, -1)
  ])]);
}
const Ve = { render: yi }, bi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
function ki(n, e) {
  return u(), h("svg", bi, [...e[0] || (e[0] = [
    s("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    s("path", { d: "M12 5v14M5 12h14" }, null, -1)
  ])]);
}
const xt = { render: ki }, $i = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
function xi(n, e) {
  return u(), h("svg", $i, [...e[0] || (e[0] = [
    s("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    s("path", { d: "M5 12h14" }, null, -1)
  ])]);
}
const St = { render: xi }, Si = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function Ci(n, e) {
  return u(), h("svg", Si, [...e[0] || (e[0] = [
    s("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    s("path", { d: "m15 4.5-4 4L7 10l-1.5 1.5 7 7L14 17l1.5-4 4-4M9 15l-4.5 4.5M14.5 4 20 9.5" }, null, -1)
  ])]);
}
const Nt = { render: Ci }, Fi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24"
};
function Pi(n, e) {
  return u(), h("svg", Fi, [...e[0] || (e[0] = [
    s("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
    }, null, -1)
  ])]);
}
const Ht = { render: Pi }, Di = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  viewBox: "0 0 24 24"
};
function Ti(n, e) {
  return u(), h("svg", Di, [...e[0] || (e[0] = [
    s("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3.75 9.776q.168-.026.344-.026h15.812q.176 0 .344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
    }, null, -1)
  ])]);
}
const Kt = { render: Ti }, Ei = { class: "vuefinder__modal-tree__folder-item" }, Mi = { class: "vuefinder__modal-tree__folder-content" }, Ii = {
  key: 1,
  class: "vuefinder__modal-tree__folder-spacer"
}, Ai = { class: "vuefinder__modal-tree__folder-text" }, Oi = {
  key: 0,
  class: "vuefinder__modal-tree__subfolders"
}, zi = {
  key: 0,
  class: "vuefinder__modal-tree__more-note"
}, Li = 300, Bi = /* @__PURE__ */ te({
  __name: "ModalTreeFolderItem",
  props: {
    folder: {},
    storage: {},
    modelValue: {},
    expandedFolders: {},
    modalTreeData: {},
    currentPath: {}
  },
  emits: ["update:modelValue", "selectAndClose", "toggleFolder"],
  setup(n, { emit: e }) {
    const t = ee(), { t: o } = t.i18n, i = t.fs, l = A({}), r = n, d = e;
    W(i.path);
    const c = R(() => {
      const D = `${r.storage}:${r.folder.path}`;
      return r.expandedFolders[D] || !1;
    }), v = R(() => r.modelValue?.path === r.folder.path), f = R(() => r.currentPath?.path === r.folder.path), w = R(() => r.modalTreeData[r.folder.path] || []), p = R(() => {
      const D = w.value, E = l.value[r.folder.path] || 50;
      return D.length > E ? D.slice(0, E) : D;
    }), S = R(() => w.value.length), F = R(() => l.value[r.folder.path] || 50), C = R(() => S.value > F.value), m = () => {
      l.value[r.folder.path] = (F.value || 50) + 50;
    }, g = R(() => w.value.length > 0 || r.folder.type === "dir"), $ = () => {
      d("toggleFolder", r.storage, r.folder.path);
    }, _ = () => {
      d("update:modelValue", r.folder);
    }, k = () => {
      d("update:modelValue", r.folder), d("selectAndClose", r.folder);
    };
    let x = 0;
    const b = () => {
      const D = Date.now();
      D - x < Li ? k() : _(), x = D;
    };
    return (D, E) => {
      const V = hn("ModalTreeFolderItem", !0);
      return u(), h("div", Ei, [
        s("div", Mi, [
          g.value ? (u(), h("div", {
            key: 0,
            class: "vuefinder__modal-tree__folder-toggle",
            onClick: $
          }, [
            c.value ? (u(), U(a(St), {
              key: 1,
              class: "vuefinder__modal-tree__folder-toggle-icon"
            })) : (u(), U(a(xt), {
              key: 0,
              class: "vuefinder__modal-tree__folder-toggle-icon"
            }))
          ])) : (u(), h("div", Ii)),
          s("div", {
            class: ne(["vuefinder__modal-tree__folder-link", {
              "vuefinder__modal-tree__folder-link--selected": v.value,
              "vuefinder__modal-tree__folder-link--current": f.value
            }]),
            onClick: _,
            onDblclick: k,
            onTouchend: b
          }, [
            c.value ? (u(), U(a(Kt), {
              key: 1,
              class: "vuefinder__item-icon__folder--open vuefinder__modal-tree__folder-icon"
            })) : (u(), U(a(Ve), {
              key: 0,
              class: "vuefinder__modal-tree__folder-icon vuefinder__item-icon__folder"
            })),
            s("span", Ai, y(n.folder.basename), 1)
          ], 34)
        ]),
        c.value && g.value ? (u(), h("div", Oi, [
          (u(!0), h(ve, null, pe(p.value, (j) => (u(), U(V, {
            key: j.path,
            folder: j,
            storage: n.storage,
            "model-value": n.modelValue,
            "expanded-folders": n.expandedFolders,
            "modal-tree-data": n.modalTreeData,
            "current-path": n.currentPath,
            "onUpdate:modelValue": E[0] || (E[0] = (O) => D.$emit("update:modelValue", O)),
            onSelectAndClose: E[1] || (E[1] = (O) => D.$emit("selectAndClose", O)),
            onToggleFolder: E[2] || (E[2] = (O, q) => D.$emit("toggleFolder", O, q))
          }, null, 8, ["folder", "storage", "model-value", "expanded-folders", "modal-tree-data", "current-path"]))), 128)),
          C.value ? (u(), h("div", zi, [
            s("div", {
              class: "vuefinder__modal-tree__load-more",
              onClick: m
            }, y(a(o)("load more")), 1)
          ])) : L("", !0)
        ])) : L("", !0)
      ]);
    };
  }
}), Vi = { class: "vuefinder__modal-tree" }, Ri = { class: "vuefinder__modal-tree__header" }, Ui = { class: "vuefinder__modal-tree__title" }, Ni = {
  key: 0,
  class: "vuefinder__modal-tree__section"
}, Hi = { class: "vuefinder__modal-tree__section-title" }, Ki = { class: "vuefinder__modal-tree__list" }, ji = ["onClick", "onDblclick", "onTouchend"], qi = { class: "vuefinder__modal-tree__text" }, Gi = { class: "vuefinder__modal-tree__text-storage" }, Wi = { class: "vuefinder__modal-tree__section-title" }, Yi = { class: "vuefinder__modal-tree__list" }, Qi = { class: "vuefinder__modal-tree__storage-item" }, Xi = { class: "vuefinder__modal-tree__storage-content" }, Ji = ["onClick"], Zi = ["onClick", "onDblclick", "onTouchend"], ea = { class: "vuefinder__modal-tree__storage-text" }, ta = {
  key: 0,
  class: "vuefinder__modal-tree__subfolders"
}, na = {
  key: 0,
  class: "vuefinder__modal-tree__more-note"
}, oa = ["onClick"], rn = 300, jt = /* @__PURE__ */ te({
  __name: "ModalTreeSelector",
  props: {
    modelValue: {},
    showPinnedFolders: { type: Boolean },
    currentPath: {}
  },
  emits: ["update:modelValue", "selectAndClose"],
  setup(n, { emit: e }) {
    const t = ee(), { t: o } = t.i18n, i = t.fs, l = t.config, r = e, d = W(i.sortedFiles), c = W(i.storages), v = R(() => c.value || []), f = W(i.path), w = A(null), p = A({}), S = A({}), F = A({});
    ie(d, (M) => {
      const X = M.filter((J) => J.type === "dir"), G = f.value?.path || "";
      G && (S.value[G] = X.map((J) => ({
        ...J,
        type: "dir"
      })));
    });
    const C = (M, X) => {
      const G = `${M}:${X}`;
      p.value = {
        ...p.value,
        [G]: !p.value[G]
      }, p.value[G] && !S.value[X] && t.adapter.list(X).then((J) => {
        const T = (J.files || []).filter((P) => P.type === "dir");
        S.value[X] = T.map((P) => ({
          ...P,
          type: "dir"
        }));
      });
    }, m = (M) => S.value[M] || [], g = (M) => F.value[M] || 50, $ = (M) => {
      const X = m(M), G = g(M);
      return X.length > G ? X.slice(0, G) : X;
    }, _ = (M) => m(M).length, k = (M) => _(M) > g(M), x = (M) => {
      F.value[M] = g(M) + 50;
    }, b = (M) => {
      M && r("update:modelValue", M);
    }, D = (M) => {
      M && (r("update:modelValue", M), r("selectAndClose", M));
    }, E = (M) => {
      const X = {
        storage: M,
        path: M + "://",
        basename: M,
        type: "dir",
        extension: "",
        file_size: null,
        last_modified: null,
        mime_type: null,
        visibility: "public",
        dir: M + "://"
      };
      r("update:modelValue", X);
    }, V = (M) => {
      const X = {
        storage: M,
        path: M + "://",
        basename: M,
        type: "dir",
        extension: "",
        file_size: null,
        last_modified: null,
        mime_type: null,
        visibility: "public",
        dir: M + "://"
      };
      r("update:modelValue", X), r("selectAndClose", X);
    };
    let j = 0;
    const O = (M) => {
      if (!M) return;
      const X = Date.now();
      X - j < rn ? D(M) : b(M), j = X;
    }, q = (M) => {
      const X = Date.now();
      X - j < rn ? V(M) : E(M), j = X;
    };
    return fe(() => {
      w.value && at(w.value, {
        overflow: {
          x: "hidden"
        },
        scrollbars: {
          theme: "vf-scrollbars-theme"
        }
      });
    }), (M, X) => (u(), h("div", Vi, [
      s("div", Ri, [
        s("div", Ui, y(a(o)("Select Target Folder")), 1)
      ]),
      s("div", {
        ref_key: "modalContentElement",
        ref: w,
        class: "vuefinder__modal-tree__content"
      }, [
        n.showPinnedFolders && a(t).features.pinned && a(l).get("pinnedFolders").length ? (u(), h("div", Ni, [
          s("div", Hi, y(a(o)("Pinned Folders")), 1),
          s("div", Ki, [
            (u(!0), h(ve, null, pe(a(l).get("pinnedFolders"), (G) => (u(), h("div", {
              key: G.path,
              class: ne(["vuefinder__modal-tree__item", { "vuefinder__modal-tree__item--selected": n.modelValue?.path === G.path }]),
              onClick: (J) => b(G),
              onDblclick: (J) => D(G),
              onTouchend: (J) => O(G)
            }, [
              N(a(Ve), { class: "vuefinder__modal-tree__icon vuefinder__item-icon__folder" }),
              s("div", qi, y(G.basename), 1),
              s("div", Gi, y(G.storage), 1),
              N(a(Nt), { class: "vuefinder__modal-tree__icon vuefinder__modal-tree__icon--pin" })
            ], 42, ji))), 128))
          ])
        ])) : L("", !0),
        s("div", Wi, y(a(o)("Storages")), 1),
        (u(!0), h(ve, null, pe(v.value, (G) => (u(), h("div", {
          key: G,
          class: "vuefinder__modal-tree__section"
        }, [
          s("div", Yi, [
            s("div", Qi, [
              s("div", Xi, [
                s("div", {
                  class: "vuefinder__modal-tree__storage-toggle",
                  onClick: ae((J) => C(G, G + "://"), ["stop"])
                }, [
                  p.value[`${G}:${G}://`] ? (u(), U(a(St), {
                    key: 1,
                    class: "vuefinder__modal-tree__toggle-icon"
                  })) : (u(), U(a(xt), {
                    key: 0,
                    class: "vuefinder__modal-tree__toggle-icon"
                  }))
                ], 8, Ji),
                s("div", {
                  class: ne(["vuefinder__modal-tree__storage-link", {
                    "vuefinder__modal-tree__storage-link--selected": n.modelValue?.path === G + "://"
                  }]),
                  onClick: (J) => E(G),
                  onDblclick: (J) => V(G),
                  onTouchend: (J) => q(G)
                }, [
                  N(a(Ht), { class: "vuefinder__modal-tree__storage-icon" }),
                  s("span", ea, y(G), 1)
                ], 42, Zi)
              ]),
              p.value[`${G}:${G}://`] ? (u(), h("div", ta, [
                (u(!0), h(ve, null, pe($(G + "://"), (J) => (u(), U(Bi, {
                  key: J.path,
                  folder: J,
                  storage: G,
                  "model-value": n.modelValue,
                  "expanded-folders": p.value,
                  "modal-tree-data": S.value,
                  "current-path": n.currentPath,
                  "onUpdate:modelValue": b,
                  onSelectAndClose: D,
                  onToggleFolder: C
                }, null, 8, ["folder", "storage", "model-value", "expanded-folders", "modal-tree-data", "current-path"]))), 128)),
                k(G + "://") ? (u(), h("div", na, [
                  s("div", {
                    class: "vuefinder__modal-tree__load-more",
                    onClick: (J) => x(G + "://")
                  }, y(a(o)("load more")), 9, oa)
                ])) : L("", !0)
              ])) : L("", !0)
            ])
          ])
        ]))), 128))
      ], 512)
    ]));
  }
}), sa = ["title"], At = /* @__PURE__ */ te({
  __name: "Message",
  props: {
    error: { type: Boolean }
  },
  emits: ["hidden"],
  setup(n, { emit: e }) {
    const t = e, o = ee(), { t: i } = o.i18n, l = A(!1), r = A(null), d = A(r.value?.innerHTML);
    ie(d, () => l.value = !1);
    const c = () => {
      t("hidden"), l.value = !0;
    };
    return (v, f) => (u(), h("div", null, [
      l.value ? L("", !0) : (u(), h("div", {
        key: 0,
        ref_key: "strMessage",
        ref: r,
        class: ne(["vuefinder__message", n.error ? "vuefinder__message--error" : "vuefinder__message--success"])
      }, [
        xe(v.$slots, "default"),
        s("div", {
          class: "vuefinder__message__close",
          title: a(i)("Close"),
          onClick: c
        }, [...f[0] || (f[0] = [
          s("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            "stroke-width": "1.5",
            stroke: "currentColor",
            class: "vuefinder__message__icon"
          }, [
            s("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: "M6 18L18 6M6 6l12 12"
            })
          ], -1)
        ])], 8, sa)
      ], 2))
    ]));
  }
}), ia = { class: "vuefinder__move-modal__content" }, aa = { class: "vuefinder__move-modal__description" }, ra = { class: "vuefinder__move-modal__files vf-scrollbar" }, la = { class: "vuefinder__move-modal__file-name" }, da = { class: "vuefinder__move-modal__target-title" }, ca = { class: "vuefinder__move-modal__target-container" }, ua = { class: "vuefinder__move-modal__target-path" }, va = { class: "vuefinder__move-modal__target-storage" }, fa = {
  key: 0,
  class: "vuefinder__move-modal__destination-folder"
}, pa = { class: "vuefinder__move-modal__target-badge" }, _a = {
  key: 0,
  class: "vuefinder__move-modal__options"
}, ha = { class: "vuefinder__move-modal__checkbox-label" }, ma = { class: "vuefinder__move-modal__checkbox-text" }, ga = ["disabled"], wa = { class: "vuefinder__move-modal__selected-items" }, Tn = /* @__PURE__ */ te({
  __name: "ModalTransfer",
  props: {
    copy: { type: Boolean }
  },
  setup(n) {
    const e = ee(), t = De(e), { enabled: o } = ze(), { t: i } = e.i18n, l = n, r = A(e.modal.data.items.from), d = A(e.modal.data.items.to), c = A(""), v = A(l.copy || !o("move")), f = R(() => v.value ? "copy" : "move"), w = A(!1), p = W(e.fs.path), S = R(() => v.value ? i("Copy files") : i("Move files")), F = R(
      () => v.value ? i("Are you sure you want to copy these files?") : i("Are you sure you want to move these files?")
    ), C = R(() => v.value ? i("Yes, Copy!") : i("Yes, Move!"));
    R(() => v.value ? i("Files copied.") : i("Files moved."));
    const m = (b) => {
      b && (d.value = b);
    }, g = (b) => {
      b && (d.value = b, w.value = !1);
    }, $ = R(() => {
      const b = d.value;
      return b ? r.value.some((D) => !!(b.path === D.path || D.path.startsWith(b.path + "/") || D.type === "dir" && b.path.startsWith(D.path + "/"))) : !0;
    }), _ = R(() => {
      if (!$.value)
        return "";
      const b = d.value;
      return b ? r.value.find((E) => b.path === E.path || E.path.startsWith(b.path + "/") || E.type === "dir" && b.path.startsWith(E.path + "/")) ? i("Cannot move/copy item to itself or its parent/child directory") : i("Invalid destination directory") : i("Please select a destination directory");
    }), k = () => {
      const b = d.value.path;
      if (!b) return { storage: "local", path: "" };
      if (b.endsWith("://"))
        return { storage: b.replace("://", ""), path: "" };
      const D = b.split("://");
      return {
        storage: D[0] || "local",
        path: D[1] || ""
      };
    }, x = async () => {
      if (r.value.length)
        try {
          const { files: b } = await e.adapter[f.value]({
            path: p.value.path,
            sources: r.value.map(({ path: D }) => D),
            destination: d.value.path
          });
          e.fs.setFiles(b), e.modal.close();
        } catch (b) {
          t.error(Pe(b, i("Failed to transfer files")));
        }
    };
    return (b, D) => (u(), U(Te, null, {
      buttons: se(() => [
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-primary",
          disabled: $.value,
          onClick: x
        }, y(C.value), 9, ga),
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: D[4] || (D[4] = (E) => a(e).modal.close())
        }, y(a(i)("Cancel")), 1),
        s("div", wa, y(a(i)("%s item(s) selected.", r.value.length)), 1)
      ]),
      default: se(() => [
        s("div", null, [
          N(Me, {
            icon: v.value ? a(Ut) : a(hi),
            title: S.value
          }, null, 8, ["icon", "title"]),
          s("div", ia, [
            s("p", aa, y(F.value), 1),
            s("div", ra, [
              (u(!0), h(ve, null, pe(r.value, (E) => (u(), h("div", {
                key: E.path,
                class: "vuefinder__move-modal__file"
              }, [
                s("div", null, [
                  E.type === "dir" ? (u(), U(a(Ve), {
                    key: 0,
                    class: "vuefinder__move-modal__icon vuefinder__move-modal__icon--dir"
                  })) : (u(), U(a(ct), {
                    key: 1,
                    class: "vuefinder__move-modal__icon"
                  }))
                ]),
                s("div", la, y(E.path), 1)
              ]))), 128))
            ]),
            s("h4", da, y(a(i)("Target Directory")), 1),
            s("div", ca, [
              s("div", {
                class: "vuefinder__move-modal__target-display",
                onClick: D[0] || (D[0] = (E) => w.value = !w.value)
              }, [
                s("div", ua, [
                  s("span", va, y(k().storage) + "://", 1),
                  k().path ? (u(), h("span", fa, y(k().path), 1)) : L("", !0)
                ]),
                s("span", pa, y(a(i)("Browse")), 1)
              ])
            ]),
            s("div", {
              class: ne([
                "vuefinder__move-modal__tree-selector",
                w.value ? "vuefinder__move-modal__tree-selector--expanded" : "vuefinder__move-modal__tree-selector--collapsed"
              ])
            }, [
              N(jt, {
                modelValue: d.value,
                "onUpdate:modelValue": [
                  D[1] || (D[1] = (E) => d.value = E),
                  m
                ],
                "show-pinned-folders": !0,
                onSelectAndClose: g
              }, null, 8, ["modelValue"])
            ], 2),
            a(o)("copy") && a(o)("move") ? (u(), h("div", _a, [
              s("label", ha, [
                ue(s("input", {
                  "onUpdate:modelValue": D[2] || (D[2] = (E) => v.value = E),
                  type: "checkbox",
                  class: "vuefinder__move-modal__checkbox"
                }, null, 512), [
                  [Ze, v.value]
                ]),
                s("span", ma, y(a(i)("Create a copy instead of moving")), 1)
              ])
            ])) : L("", !0),
            _.value ? (u(), U(At, {
              key: 1,
              error: ""
            }, {
              default: se(() => [
                ce(y(_.value), 1)
              ]),
              _: 1
            })) : L("", !0),
            c.value.length && !_.value ? (u(), U(At, {
              key: 2,
              error: "",
              onHidden: D[3] || (D[3] = (E) => c.value = "")
            }, {
              default: se(() => [
                ce(y(c.value), 1)
              ]),
              _: 1
            })) : L("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}), tt = /* @__PURE__ */ te({
  __name: "ModalMove",
  setup(n) {
    return (e, t) => (u(), U(Tn, { copy: !1 }));
  }
}), qt = /* @__PURE__ */ te({
  __name: "ModalCopy",
  setup(n) {
    return (e, t) => (u(), U(Tn, { copy: !0 }));
  }
}), ya = (n, e = 0, t = !1) => {
  let o;
  return (...i) => {
    t && !o && n(...i), clearTimeout(o), o = setTimeout(() => {
      n(...i);
    }, e);
  };
}, En = (n, e, t) => {
  const o = A(n);
  return Gn((i, l) => ({
    get() {
      return i(), o.value;
    },
    set: ya(
      (r) => {
        o.value = r, l();
      },
      e,
      !1
    )
  }));
}, ba = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  viewBox: "0 0 20 20"
};
function ka(n, e) {
  return u(), h("svg", ba, [...e[0] || (e[0] = [
    s("path", { d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607" }, null, -1)
  ])]);
}
const Gt = { render: ka }, $a = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  class: "animate-spin p-0.5 h-5 w-5 text-white ml-auto",
  viewBox: "0 0 24 24"
};
function xa(n, e) {
  return u(), h("svg", $a, [...e[0] || (e[0] = [
    s("circle", {
      cx: "12",
      cy: "12",
      r: "10",
      stroke: "currentColor",
      "stroke-width": "4",
      class: "opacity-25 stroke-blue-900"
    }, null, -1),
    s("path", {
      fill: "currentColor",
      d: "M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12zm2 5.291A7.96 7.96 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938z",
      class: "opacity-75"
    }, null, -1)
  ])]);
}
const Ct = { render: xa }, Sa = { class: "vuefinder__search-modal__search-input" }, Ca = ["value", "placeholder", "disabled"], Fa = {
  key: 0,
  class: "vuefinder__search-modal__loading"
}, Pa = /* @__PURE__ */ te({
  name: "SearchInput",
  __name: "SearchInput",
  props: {
    modelValue: {},
    isSearching: { type: Boolean },
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "keydown"],
  setup(n, { expose: e, emit: t }) {
    const o = t, i = ee(), { t: l } = i.i18n, r = A(null), d = (v) => {
      const f = v.target;
      o("update:modelValue", f.value);
    }, c = (v) => {
      o("keydown", v);
    };
    return e({
      focus: () => {
        r.value && r.value.focus();
      }
    }), (v, f) => (u(), h("div", Sa, [
      N(a(Gt), { class: "vuefinder__search-modal__search-icon" }),
      s("input", {
        ref_key: "searchInput",
        ref: r,
        value: n.modelValue,
        type: "text",
        placeholder: a(l)("Search files"),
        disabled: n.disabled,
        class: "vuefinder__search-modal__input",
        onKeydown: c,
        onKeyup: f[0] || (f[0] = ae(() => {
        }, ["stop"])),
        onInput: d
      }, null, 40, Ca),
      n.isSearching ? (u(), h("div", Fa, [
        N(a(Ct), { class: "vuefinder__search-modal__loading-icon" })
      ])) : L("", !0)
    ]));
  }
}), Da = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  viewBox: "0 0 24 24"
};
function Ta(n, e) {
  return u(), h("svg", Da, [...e[0] || (e[0] = [
    s("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87q.11.06.22.127c.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a8 8 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a7 7 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a7 7 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7 7 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124q.108-.066.22-.128c.332-.183.582-.495.644-.869z"
    }, null, -1),
    s("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
    }, null, -1)
  ])]);
}
const Mn = { render: Ta }, Ea = ["disabled", "title"], Ma = ["data-theme"], Ia = { class: "vuefinder__search-modal__dropdown-content" }, Aa = { class: "vuefinder__search-modal__dropdown-section" }, Oa = { class: "vuefinder__search-modal__dropdown-title" }, za = { class: "vuefinder__search-modal__dropdown-options" }, La = {
  key: 0,
  class: "vuefinder__search-modal__dropdown-option-check"
}, Ba = {
  key: 0,
  class: "vuefinder__search-modal__dropdown-option-check"
}, Va = {
  key: 0,
  class: "vuefinder__search-modal__dropdown-option-check"
}, Ra = {
  key: 0,
  class: "vuefinder__search-modal__dropdown-option-check"
}, Ua = /* @__PURE__ */ te({
  name: "SearchOptionsDropdown",
  __name: "SearchOptionsDropdown",
  props: {
    visible: { type: Boolean },
    disabled: { type: Boolean, default: !1 },
    sizeFilter: {},
    selectedOption: {}
  },
  emits: ["update:visible", "update:sizeFilter", "update:selectedOption", "keydown"],
  setup(n, { expose: e, emit: t }) {
    const o = n, i = t, l = ee(), { t: r } = l.i18n, d = A(null), c = A(null);
    let v = null;
    const f = (C) => {
      if (i("update:selectedOption", C), C.startsWith("size-")) {
        const m = C.split("-")[1];
        i("update:sizeFilter", m);
      }
    }, w = async () => {
      o.disabled || (o.visible ? (i("update:visible", !1), v && (v(), v = null)) : (i("update:visible", !0), await Be(), await p()));
    }, p = async () => {
      if (!(!d.value || !c.value) && (await Be(), !(!d.value || !c.value))) {
        Object.assign(c.value.style, {
          position: "fixed",
          zIndex: "10001",
          opacity: "0",
          transform: "translateY(-8px)",
          transition: "opacity 150ms ease-out, transform 150ms ease-out"
        });
        try {
          const { x: C, y: m } = await et(d.value, c.value, {
            placement: "bottom-start",
            strategy: "fixed",
            middleware: [rt(8), lt({ padding: 16 }), dt({ padding: 16 })]
          });
          Object.assign(c.value.style, {
            left: `${C}px`,
            top: `${m}px`
          }), requestAnimationFrame(() => {
            c.value && Object.assign(c.value.style, {
              opacity: "1",
              transform: "translateY(0)"
            });
          });
        } catch (C) {
          console.warn("Floating UI initial positioning error:", C);
          return;
        }
        try {
          v = zt(d.value, c.value, async () => {
            if (!(!d.value || !c.value))
              try {
                const { x: C, y: m } = await et(
                  d.value,
                  c.value,
                  {
                    placement: "bottom-start",
                    strategy: "fixed",
                    middleware: [rt(8), lt({ padding: 16 }), dt({ padding: 16 })]
                  }
                );
                Object.assign(c.value.style, {
                  left: `${C}px`,
                  top: `${m}px`
                });
              } catch (C) {
                console.warn("Floating UI positioning error:", C);
              }
          });
        } catch (C) {
          console.warn("Floating UI autoUpdate setup error:", C), v = null;
        }
      }
    }, S = (C) => {
      if (!o.visible) return;
      const m = ["size-all", "size-small", "size-medium", "size-large"], g = m.findIndex(($) => $ === o.selectedOption);
      if (C.key === "ArrowDown") {
        C.preventDefault();
        const $ = (g + 1) % m.length;
        i("update:selectedOption", m[$] || null);
      } else if (C.key === "ArrowUp") {
        C.preventDefault();
        const $ = g <= 0 ? m.length - 1 : g - 1;
        i("update:selectedOption", m[$] || null);
      } else C.key === "Enter" ? (C.preventDefault(), o.selectedOption?.startsWith("size-") && i(
        "update:sizeFilter",
        o.selectedOption.split("-")[1]
      )) : C.key === "Escape" && (C.preventDefault(), i("update:visible", !1), v && (v(), v = null));
    }, F = () => {
      v && (v(), v = null);
    };
    return ie(
      () => o.visible,
      (C) => {
        !C && v && (v(), v = null);
      }
    ), ke(() => {
      F();
    }), e({
      cleanup: F
    }), (C, m) => (u(), h(ve, null, [
      s("button", {
        ref_key: "dropdownBtn",
        ref: d,
        class: ne(["vuefinder__search-modal__dropdown-btn", { "vuefinder__search-modal__dropdown-btn--active": n.visible }]),
        disabled: n.disabled,
        title: a(r)("Search Options"),
        onClick: ae(w, ["stop"])
      }, [
        N(a(Mn), { class: "vuefinder__search-modal__dropdown-icon" })
      ], 10, Ea),
      (u(), U(bt, { to: "body" }, [
        n.visible ? (u(), h("div", {
          key: 0,
          ref_key: "dropdownContent",
          ref: c,
          class: "vuefinder__themer vuefinder__search-modal__dropdown vuefinder__search-modal__dropdown--visible",
          "data-theme": a(l).theme.current,
          tabindex: "-1",
          onClick: m[4] || (m[4] = ae(() => {
          }, ["stop"])),
          onKeydown: S
        }, [
          s("div", Ia, [
            s("div", Aa, [
              s("div", Oa, y(a(r)("File Size")), 1),
              s("div", za, [
                s("div", {
                  class: ne(["vuefinder__search-modal__dropdown-option", {
                    "vuefinder__search-modal__dropdown-option--selected": n.sizeFilter === "all"
                  }]),
                  onClick: m[0] || (m[0] = ae((g) => f("size-all"), ["stop"]))
                }, [
                  s("span", null, y(a(r)("All Files")), 1),
                  n.sizeFilter === "all" ? (u(), h("div", La, [...m[5] || (m[5] = [
                    s("svg", {
                      viewBox: "0 0 16 16",
                      fill: "currentColor"
                    }, [
                      s("path", { d: "M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" })
                    ], -1)
                  ])])) : L("", !0)
                ], 2),
                s("div", {
                  class: ne(["vuefinder__search-modal__dropdown-option", {
                    "vuefinder__search-modal__dropdown-option--selected": n.sizeFilter === "small"
                  }]),
                  onClick: m[1] || (m[1] = ae((g) => f("size-small"), ["stop"]))
                }, [
                  s("span", null, y(a(r)("Small (< 1MB)")), 1),
                  n.sizeFilter === "small" ? (u(), h("div", Ba, [...m[6] || (m[6] = [
                    s("svg", {
                      viewBox: "0 0 16 16",
                      fill: "currentColor"
                    }, [
                      s("path", { d: "M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" })
                    ], -1)
                  ])])) : L("", !0)
                ], 2),
                s("div", {
                  class: ne(["vuefinder__search-modal__dropdown-option", {
                    "vuefinder__search-modal__dropdown-option--selected": n.sizeFilter === "medium"
                  }]),
                  onClick: m[2] || (m[2] = ae((g) => f("size-medium"), ["stop"]))
                }, [
                  s("span", null, y(a(r)("Medium (1-10MB)")), 1),
                  n.sizeFilter === "medium" ? (u(), h("div", Va, [...m[7] || (m[7] = [
                    s("svg", {
                      viewBox: "0 0 16 16",
                      fill: "currentColor"
                    }, [
                      s("path", { d: "M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" })
                    ], -1)
                  ])])) : L("", !0)
                ], 2),
                s("div", {
                  class: ne(["vuefinder__search-modal__dropdown-option", {
                    "vuefinder__search-modal__dropdown-option--selected": n.sizeFilter === "large"
                  }]),
                  onClick: m[3] || (m[3] = ae((g) => f("size-large"), ["stop"]))
                }, [
                  s("span", null, y(a(r)("Large (> 10MB)")), 1),
                  n.sizeFilter === "large" ? (u(), h("div", Ra, [...m[8] || (m[8] = [
                    s("svg", {
                      viewBox: "0 0 16 16",
                      fill: "currentColor"
                    }, [
                      s("path", { d: "M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" })
                    ], -1)
                  ])])) : L("", !0)
                ], 2)
              ])
            ])
          ])
        ], 40, Ma)) : L("", !0)
      ]))
    ], 64));
  }
});
function In(n, e = 40) {
  const t = n.match(/^([^:]+:\/\/)(.*)$/);
  if (!t) return n;
  const o = t[1], i = t[2] ?? "", l = i.split("/").filter(Boolean), r = l.pop();
  if (!r) return o + i;
  let d = `${o}${l.join("/")}${l.length ? "/" : ""}${r}`;
  if (d.length <= e) return d;
  const c = r.split(/\.(?=[^\.]+$)/), v = c[0] ?? "", f = c[1] ?? "", w = v.length > 10 ? `${v.slice(0, 6)}...${v.slice(-5)}` : v, p = f ? `${w}.${f}` : w;
  return d = `${o}${l.join("/")}${l.length ? "/" : ""}${p}`, d.length > e && (d = `${o}.../${p}`), d;
}
async function An(n) {
  try {
    await navigator.clipboard.writeText(n);
  } catch {
    const e = document.createElement("textarea");
    e.value = n, document.body.appendChild(e), e.select(), document.execCommand("copy"), document.body.removeChild(e);
  }
}
async function ut(n) {
  await An(n);
}
async function Na(n) {
  await An(n);
}
const Ha = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  viewBox: "0 0 448 512"
};
function Ka(n, e) {
  return u(), h("svg", Ha, [...e[0] || (e[0] = [
    s("path", { d: "M8 256a56 56 0 1 1 112 0 56 56 0 1 1-112 0m160 0a56 56 0 1 1 112 0 56 56 0 1 1-112 0m216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112" }, null, -1)
  ])]);
}
const On = { render: Ka }, ja = ["title"], qa = { class: "vuefinder__search-modal__result-icon" }, Ga = { class: "vuefinder__search-modal__result-content" }, Wa = { class: "vuefinder__search-modal__result-name" }, Ya = {
  key: 0,
  class: "vuefinder__search-modal__result-size"
}, Qa = ["title"], Xa = ["title"], Ja = ["data-item-dropdown", "data-theme"], Za = { class: "vuefinder__search-modal__item-dropdown-content" }, er = /* @__PURE__ */ te({
  name: "SearchResultItem",
  __name: "SearchResultItem",
  props: {
    item: {},
    index: {},
    selectedIndex: {},
    expandedPaths: {},
    activeDropdown: {},
    selectedItemDropdownOption: {}
  },
  emits: ["select", "selectWithDropdown", "togglePathExpansion", "toggleItemDropdown", "update:selectedItemDropdownOption", "copyPath", "openContainingFolder", "preview"],
  setup(n, { emit: e }) {
    const t = n, o = e, i = ee(), { t: l } = i.i18n, r = A(null);
    let d = null, c = null, v = [], f = null;
    ie(
      () => t.activeDropdown,
      (D) => {
        d && (d(), d = null), c && (v.forEach((E) => {
          E === window ? window.removeEventListener("scroll", c, !0) : E.removeEventListener("scroll", c, !0);
        }), c = null, v = []), f && (document.removeEventListener("mousedown", f, !0), document.removeEventListener("touchstart", f, !0), f = null), D === t.item.path && r.value && Be(() => {
          g(t.item.path, r.value), p(), S();
        });
      }
    );
    const w = (D) => {
      const E = [];
      let V = D;
      for (; V && V !== document.body && V !== document.documentElement; ) {
        const j = window.getComputedStyle(V), O = j.overflow + j.overflowX + j.overflowY;
        (O.includes("scroll") || O.includes("auto")) && E.push(V), V = V.parentElement;
      }
      return E;
    }, p = () => {
      if (t.activeDropdown !== t.item.path) return;
      const D = w(r.value);
      v = [window, ...D], c = () => {
        t.activeDropdown === t.item.path && o("toggleItemDropdown", t.item.path, new MouseEvent("click"));
      };
      const E = c;
      E && v.forEach((V) => {
        V === window ? window.addEventListener("scroll", E, !0) : V.addEventListener("scroll", E, !0);
      });
    }, S = () => {
      t.activeDropdown === t.item.path && (f = (D) => {
        if (t.activeDropdown !== t.item.path) return;
        const E = D.target;
        if (!E) return;
        const V = document.querySelector(
          `[data-item-dropdown="${t.item.path}"]`
        );
        if (V && V.contains(E) || r.value && r.value.contains(E))
          return;
        const j = i.root;
        if (j && j.contains(E)) {
          o("toggleItemDropdown", t.item.path, new MouseEvent("click"));
          return;
        }
        const O = document.querySelector(".vuefinder__modal-layout");
        if (O && O.contains(E)) {
          o("toggleItemDropdown", t.item.path, new MouseEvent("click"));
          return;
        }
        o("toggleItemDropdown", t.item.path, new MouseEvent("click"));
      }, setTimeout(() => {
        f && (document.addEventListener("mousedown", f, !0), document.addEventListener("touchstart", f, !0));
      }, 100));
    };
    ke(() => {
      d && (d(), d = null), c && (v.forEach((D) => {
        D === window ? window.removeEventListener("scroll", c, !0) : D.removeEventListener("scroll", c, !0);
      }), c = null, v = []), f && (document.removeEventListener("mousedown", f, !0), document.removeEventListener("touchstart", f, !0), f = null);
    });
    const F = (D) => t.expandedPaths.has(D), C = (D) => D.type === "dir" || !D.file_size ? "" : Bt(D.file_size), m = (D, E) => {
      E.stopPropagation(), o("toggleItemDropdown", D, E);
    }, g = async (D, E) => {
      const V = document.querySelector(
        `[data-item-dropdown="${D}"]`
      );
      if (!(!V || !E) && (await Be(), !(!V || !E))) {
        Object.assign(V.style, {
          position: "fixed",
          zIndex: "10001",
          opacity: "0",
          transform: "translateY(-8px)",
          transition: "opacity 150ms ease-out, transform 150ms ease-out"
        });
        try {
          const { x: j, y: O } = await et(E, V, {
            placement: "left-start",
            strategy: "fixed",
            middleware: [rt(8), lt({ padding: 16 }), dt({ padding: 16 })]
          });
          Object.assign(V.style, {
            left: `${j}px`,
            top: `${O}px`
          }), requestAnimationFrame(() => {
            V && Object.assign(V.style, {
              opacity: "1",
              transform: "translateY(0)"
            });
          });
        } catch (j) {
          console.warn("Floating UI initial positioning error:", j);
          return;
        }
        try {
          d = zt(E, V, async () => {
            if (!(!E || !V))
              try {
                const { x: j, y: O } = await et(E, V, {
                  placement: "left-start",
                  strategy: "fixed",
                  middleware: [rt(8), lt({ padding: 16 }), dt({ padding: 16 })]
                });
                Object.assign(V.style, {
                  left: `${j}px`,
                  top: `${O}px`
                });
              } catch (j) {
                console.warn("Floating UI positioning error:", j);
              }
          });
        } catch (j) {
          console.warn("Floating UI autoUpdate setup error:", j), d = null;
        }
      }
    }, $ = (D) => {
      o("update:selectedItemDropdownOption", D);
    }, _ = async (D) => {
      await ut(D.path), o("copyPath", D);
    }, k = (D) => {
      o("openContainingFolder", D);
    }, x = (D) => {
      o("preview", D);
    }, b = (D) => {
      if (!t.activeDropdown) return;
      const E = ["copy-path", "open-folder", "preview"], V = t.selectedItemDropdownOption, j = E.findIndex((O) => V?.includes(O));
      if (D.key === "ArrowDown") {
        D.preventDefault();
        const O = (j + 1) % E.length;
        o(
          "update:selectedItemDropdownOption",
          `${E[O] || ""}-${t.activeDropdown}`
        );
      } else if (D.key === "ArrowUp") {
        D.preventDefault();
        const O = j <= 0 ? E.length - 1 : j - 1;
        o(
          "update:selectedItemDropdownOption",
          `${E[O] || ""}-${t.activeDropdown}`
        );
      } else D.key === "Enter" ? (D.preventDefault(), V && (V.includes("copy-path") ? _(t.item) : V.includes("open-folder") ? k(t.item) : V.includes("preview") && x(t.item))) : D.key === "Escape" && (D.preventDefault(), o("update:selectedItemDropdownOption", null));
    };
    return (D, E) => (u(), h("div", {
      class: ne(["vuefinder__search-modal__result-item", { "vuefinder__search-modal__result-item--selected": n.index === n.selectedIndex }]),
      title: n.item.basename,
      onClick: E[9] || (E[9] = (V) => o("select", n.index))
    }, [
      s("div", qa, [
        n.item.type === "dir" ? (u(), U(a(Ve), { key: 0 })) : (u(), U(a(ct), { key: 1 }))
      ]),
      s("div", Ga, [
        s("div", Wa, [
          ce(y(n.item.basename) + " ", 1),
          C(n.item) ? (u(), h("span", Ya, y(C(n.item)), 1)) : L("", !0)
        ]),
        s("div", {
          class: "vuefinder__search-modal__result-path",
          title: n.item.path,
          onClick: E[0] || (E[0] = ae((V) => {
            o("select", n.index), o("togglePathExpansion", n.item.path);
          }, ["stop"]))
        }, y(F(n.item.path) ? n.item.path : a(In)(n.item.path)), 9, Qa)
      ]),
      s("button", {
        ref_key: "buttonElementRef",
        ref: r,
        class: "vuefinder__search-modal__result-actions",
        title: a(l)("More actions"),
        onClick: E[1] || (E[1] = (V) => {
          o("selectWithDropdown", n.index), m(n.item.path, V);
        })
      }, [
        N(a(On), { class: "vuefinder__search-modal__result-actions-icon" })
      ], 8, Xa),
      (u(), U(bt, { to: "body" }, [
        n.activeDropdown === n.item.path ? (u(), h("div", {
          key: 0,
          "data-item-dropdown": n.item.path,
          class: "vuefinder__themer vuefinder__search-modal__item-dropdown vuefinder__search-modal__item-dropdown--visible",
          "data-theme": a(i).theme.current,
          tabindex: "-1",
          onClick: E[8] || (E[8] = ae(() => {
          }, ["stop"])),
          onKeydown: b
        }, [
          s("div", Za, [
            s("div", {
              class: ne(["vuefinder__search-modal__item-dropdown-option", {
                "vuefinder__search-modal__item-dropdown-option--selected": n.selectedItemDropdownOption === `copy-path-${n.item.path}`
              }]),
              onClick: E[2] || (E[2] = (V) => {
                $(`copy-path-${n.item.path}`), _(n.item);
              }),
              onFocus: E[3] || (E[3] = (V) => $(`copy-path-${n.item.path}`))
            }, [
              N(a(Ut), { class: "vuefinder__search-modal__item-dropdown-icon" }),
              s("span", null, y(a(l)("Copy Path")), 1)
            ], 34),
            s("div", {
              class: ne(["vuefinder__search-modal__item-dropdown-option", {
                "vuefinder__search-modal__item-dropdown-option--selected": n.selectedItemDropdownOption === `open-folder-${n.item.path}`
              }]),
              onClick: E[4] || (E[4] = (V) => {
                $(`open-folder-${n.item.path}`), k(n.item);
              }),
              onFocus: E[5] || (E[5] = (V) => $(`open-folder-${n.item.path}`))
            }, [
              N(a(Ve), { class: "vuefinder__search-modal__item-dropdown-icon" }),
              s("span", null, y(a(l)("Open Containing Folder")), 1)
            ], 34),
            s("div", {
              class: ne(["vuefinder__search-modal__item-dropdown-option", {
                "vuefinder__search-modal__item-dropdown-option--selected": n.selectedItemDropdownOption === `preview-${n.item.path}`
              }]),
              onClick: E[6] || (E[6] = (V) => {
                $(`preview-${n.item.path}`), x(n.item);
              }),
              onFocus: E[7] || (E[7] = (V) => $(`preview-${n.item.path}`))
            }, [
              N(a(ct), { class: "vuefinder__search-modal__item-dropdown-icon" }),
              s("span", null, y(a(l)("Preview")), 1)
            ], 34)
          ])
        ], 40, Ja)) : L("", !0)
      ]))
    ], 10, ja));
  }
}), tr = {
  key: 0,
  class: "vuefinder__search-modal__searching"
}, nr = { class: "vuefinder__search-modal__loading-icon" }, or = {
  key: 1,
  class: "vuefinder__search-modal__no-results"
}, sr = {
  key: 2,
  class: "vuefinder__search-modal__results-list"
}, ir = { class: "vuefinder__search-modal__results-header" }, Ge = 60, ln = 5, ar = /* @__PURE__ */ te({
  name: "SearchResultsList",
  __name: "SearchResultsList",
  props: {
    searchResults: {},
    isSearching: { type: Boolean },
    selectedIndex: {},
    expandedPaths: {},
    activeDropdown: {},
    selectedItemDropdownOption: {},
    resultsEnter: { type: Boolean }
  },
  emits: ["selectResultItem", "selectResultItemWithDropdown", "togglePathExpansion", "toggleItemDropdown", "update:selectedItemDropdownOption", "copyPath", "openContainingFolder", "preview"],
  setup(n, { expose: e, emit: t }) {
    const o = n, i = t, l = ee(), { t: r } = l.i18n, d = Je("scrollableContainer"), c = R(() => o.searchResults.length > 0), v = R(() => o.searchResults.length), f = A(0), w = A(600), p = R(() => o.searchResults.length * Ge), S = R(() => {
      const _ = Math.max(0, Math.floor(f.value / Ge) - ln), k = Math.min(
        o.searchResults.length,
        Math.ceil((f.value + w.value) / Ge) + ln
      );
      return { start: _, end: k };
    }), F = R(() => {
      const { start: _, end: k } = S.value;
      return o.searchResults.slice(_, k).map((x, b) => ({
        item: x,
        index: _ + b,
        top: (_ + b) * Ge
      }));
    }), C = (_) => {
      const k = _.target;
      f.value = k.scrollTop;
    }, m = () => {
      d.value && (w.value = d.value.clientHeight);
    }, g = () => {
      if (o.selectedIndex >= 0 && d.value) {
        const _ = o.selectedIndex * Ge, k = _ + Ge, x = d.value.scrollTop, b = d.value.clientHeight, D = x + b;
        let E = x;
        _ < x ? E = _ : k > D && (E = k - b), E !== x && d.value.scrollTo({
          top: E,
          behavior: "smooth"
        });
      }
    }, $ = () => {
      d.value && (d.value.scrollTop = 0, f.value = 0);
    };
    return fe(() => {
      m(), window.addEventListener("resize", m);
    }), ke(() => {
      window.removeEventListener("resize", m);
    }), ie(
      () => d.value,
      () => {
        m();
      }
    ), e({
      scrollSelectedIntoView: g,
      resetScroll: $,
      getContainerHeight: () => w.value,
      scrollTop: () => f.value
    }), (_, k) => (u(), h("div", {
      class: ne(["vuefinder__search-modal__results", { "vuefinder__search-modal__results--enter": n.resultsEnter }])
    }, [
      n.isSearching ? (u(), h("div", tr, [
        s("div", nr, [
          N(a(Ct), { class: "vuefinder__search-modal__loading-icon" })
        ]),
        s("span", null, y(a(r)("Searching...")), 1)
      ])) : c.value ? (u(), h("div", sr, [
        s("div", ir, [
          s("span", null, y(a(r)("Found %s results", v.value)), 1)
        ]),
        s("div", {
          ref_key: "scrollableContainer",
          ref: d,
          class: "vuefinder__search-modal__results-scrollable",
          onScroll: C
        }, [
          s("div", {
            class: "vuefinder__search-modal__results-items",
            style: Oe({ height: `${p.value}px`, position: "relative" })
          }, [
            (u(!0), h(ve, null, pe(F.value, (x) => (u(), h("div", {
              key: x.item.path,
              style: Oe({
                position: "absolute",
                top: `${x.top}px`,
                left: "0",
                width: "100%",
                height: `${Ge}px`
              })
            }, [
              N(er, {
                item: x.item,
                index: x.index,
                "selected-index": n.selectedIndex,
                "expanded-paths": n.expandedPaths,
                "active-dropdown": n.activeDropdown,
                "selected-item-dropdown-option": n.selectedItemDropdownOption,
                onSelect: k[0] || (k[0] = (b) => i("selectResultItem", b)),
                onSelectWithDropdown: k[1] || (k[1] = (b) => i("selectResultItemWithDropdown", b)),
                onTogglePathExpansion: k[2] || (k[2] = (b) => i("togglePathExpansion", b)),
                onToggleItemDropdown: k[3] || (k[3] = (b, D) => i("toggleItemDropdown", b, D)),
                "onUpdate:selectedItemDropdownOption": k[4] || (k[4] = (b) => i("update:selectedItemDropdownOption", b)),
                onCopyPath: k[5] || (k[5] = (b) => i("copyPath", b)),
                onOpenContainingFolder: k[6] || (k[6] = (b) => i("openContainingFolder", b)),
                onPreview: k[7] || (k[7] = (b) => i("preview", b))
              }, null, 8, ["item", "index", "selected-index", "expanded-paths", "active-dropdown", "selected-item-dropdown-option"])
            ], 4))), 128))
          ], 4)
        ], 544)
      ])) : (u(), h("div", or, [
        s("span", null, y(a(r)("No results found")), 1)
      ]))
    ], 2));
  }
}), rr = { class: "vuefinder__search-modal" }, lr = { class: "vuefinder__search-modal__content" }, dr = { class: "vuefinder__search-modal__search-bar" }, cr = { class: "vuefinder__search-modal__search-location" }, ur = ["title"], vr = ["disabled"], fr = {
  key: 0,
  class: "vuefinder__search-modal__folder-selector"
}, pr = { class: "vuefinder__search-modal__folder-selector-content" }, _r = {
  key: 1,
  class: "vuefinder__search-modal__instructions"
}, hr = { class: "vuefinder__search-modal__instructions-text" }, Wt = /* @__PURE__ */ te({
  name: "ModalSearch",
  __name: "ModalSearch",
  setup(n) {
    const e = ee(), t = De(e), { t: o } = e.i18n, i = e.fs, l = A(null), r = A(null), d = A(null), c = En("", 300), v = A([]), f = A(!1), w = A(-1), p = A(!1), S = A(!1), F = A(null), C = A("all"), m = A(!1), g = A(`size-${C.value}`), $ = A(null), _ = A(/* @__PURE__ */ new Set()), k = A(null), x = W(i.path), b = (P) => {
      _.value.has(P) ? _.value.delete(P) : _.value.add(P);
    }, D = (P, z) => {
      z && typeof z.stopPropagation == "function" && z.stopPropagation(), k.value === P ? k.value = null : k.value = P;
    }, E = () => {
      k.value = null;
    }, V = (P) => {
      try {
        const z = P.dir || `${P.storage}://`;
        e.adapter.open(z), e.modal.close(), E();
      } catch {
        t.error(o("Failed to open containing folder"));
      }
    }, j = (P) => {
      e.modal.open(ft, {
        storage: x?.value?.storage ?? "local",
        item: P
      }), E();
    }, O = (P) => {
      w.value = P, E();
    }, q = (P) => {
      w.value = P;
    }, M = async (P) => {
      await ut(P.path), E();
    };
    ie(c, async (P) => {
      P.trim() ? (await X(P.trim()), w.value = 0) : (v.value = [], f.value = !1, w.value = -1);
    }), ie(C, async (P) => {
      g.value = `size-${P}`, c.value.trim() && !S.value && (await X(c.value.trim()), w.value = 0);
    }), ie(m, async () => {
      c.value.trim() && !S.value && (await X(c.value.trim()), w.value = 0);
    });
    const X = async (P) => {
      if (P) {
        f.value = !0;
        try {
          const z = F.value?.path || x?.value?.path, B = await e.adapter.search({
            path: z,
            filter: P,
            deep: m.value,
            size: C.value
          });
          v.value = B || [], f.value = !1;
        } catch (z) {
          t.error(Pe(z, o("Search failed"))), v.value = [], f.value = !1;
        }
      }
    };
    fe(() => {
      document.addEventListener("click", T), g.value = `size-${C.value}`;
    });
    const G = () => {
      S.value ? (S.value = !1, c.value.trim() && (X(c.value.trim()), w.value = 0)) : (p.value = !1, S.value = !0);
    }, J = (P) => {
      P && (F.value = P);
    }, I = (P) => {
      P && (J(P), S.value = !1, c.value.trim() && (X(c.value.trim()), w.value = 0));
    };
    ke(() => {
      document.removeEventListener("click", T), r.value && r.value.cleanup();
    });
    const T = (P) => {
      const z = P.target;
      if (p.value && (z.closest(".vuefinder__search-modal__dropdown") || (p.value = !1, Be(() => {
        l.value && l.value.focus();
      }))), k.value) {
        const B = z.closest(".vuefinder__search-modal__item-dropdown"), Y = z.closest(".vuefinder__search-modal__result-item");
        !B && !Y && E();
      }
    };
    return (P, z) => (u(), U(Te, { class: "vuefinder__search-modal-layout" }, {
      default: se(() => [
        s("div", rr, [
          N(Me, {
            icon: a(Gt),
            title: a(o)("Search files")
          }, null, 8, ["icon", "title"]),
          s("div", lr, [
            s("div", dr, [
              N(Pa, {
                ref_key: "searchInputRef",
                ref: l,
                modelValue: a(c),
                "onUpdate:modelValue": z[0] || (z[0] = (B) => Wn(c) ? c.value = B : null),
                "is-searching": f.value,
                disabled: S.value
              }, null, 8, ["modelValue", "is-searching", "disabled"]),
              N(Ua, {
                ref_key: "searchOptionsDropdownRef",
                ref: r,
                visible: p.value,
                "onUpdate:visible": z[1] || (z[1] = (B) => p.value = B),
                "size-filter": C.value,
                "onUpdate:sizeFilter": z[2] || (z[2] = (B) => C.value = B),
                "selected-option": g.value,
                "onUpdate:selectedOption": z[3] || (z[3] = (B) => g.value = B),
                disabled: S.value
              }, null, 8, ["visible", "size-filter", "selected-option", "disabled"])
            ]),
            s("div", {
              class: "vuefinder__search-modal__options",
              onClick: z[7] || (z[7] = ae(() => {
              }, ["stop"]))
            }, [
              s("div", cr, [
                s("button", {
                  class: ne(["vuefinder__search-modal__location-btn", { "vuefinder__search-modal__location-btn--open": S.value }]),
                  onClick: ae(G, ["stop"])
                }, [
                  N(a(Ve), { class: "vuefinder__search-modal__location-icon" }),
                  s("span", {
                    class: "vuefinder__search-modal__location-text",
                    title: F.value?.path || a(x).path
                  }, y(a(In)(F.value?.path || a(x).path)), 9, ur),
                  z[10] || (z[10] = s("svg", {
                    class: "vuefinder__search-modal__location-arrow",
                    viewBox: "0 0 16 16",
                    fill: "currentColor"
                  }, [
                    s("path", { d: "M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z" })
                  ], -1))
                ], 2)
              ]),
              s("label", {
                class: "vuefinder__search-modal__deep-search",
                onClick: z[6] || (z[6] = ae(() => {
                }, ["stop"]))
              }, [
                ue(s("input", {
                  "onUpdate:modelValue": z[4] || (z[4] = (B) => m.value = B),
                  type: "checkbox",
                  disabled: S.value,
                  class: "vuefinder__search-modal__checkbox",
                  onClick: z[5] || (z[5] = ae(() => {
                  }, ["stop"]))
                }, null, 8, vr), [
                  [Ze, m.value]
                ]),
                s("span", null, y(a(o)("Include subfolders")), 1)
              ])
            ]),
            S.value ? (u(), h("div", fr, [
              s("div", pr, [
                N(jt, {
                  modelValue: F.value,
                  "onUpdate:modelValue": [
                    z[8] || (z[8] = (B) => F.value = B),
                    J
                  ],
                  "show-pinned-folders": !0,
                  "current-path": a(x),
                  onSelectAndClose: I
                }, null, 8, ["modelValue", "current-path"])
              ])
            ])) : L("", !0),
            !a(c).trim() && !S.value ? (u(), h("div", _r, [
              s("p", hr, y(a(o)("Start typing to search files. Use options to filter or include subfolders.")), 1)
            ])) : L("", !0),
            a(c).trim() && !S.value ? (u(), U(ar, {
              key: 2,
              ref_key: "searchResultsListRef",
              ref: d,
              "search-results": v.value,
              "is-searching": f.value,
              "selected-index": w.value,
              "expanded-paths": _.value,
              "active-dropdown": k.value,
              "selected-item-dropdown-option": $.value,
              "results-enter": !0,
              onSelectResultItem: O,
              onSelectResultItemWithDropdown: q,
              onTogglePathExpansion: b,
              onToggleItemDropdown: D,
              "onUpdate:selectedItemDropdownOption": z[9] || (z[9] = (B) => $.value = B),
              onCopyPath: M,
              onOpenContainingFolder: V,
              onPreview: j
            }, null, 8, ["search-results", "is-searching", "selected-index", "expanded-paths", "active-dropdown", "selected-item-dropdown-option"])) : L("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}), mr = {
  props: {
    on: { type: String, required: !0 }
  },
  setup(n, { emit: e, slots: t }) {
    const o = ee(), i = A(!1), { t: l } = o.i18n;
    let r = null;
    const d = () => {
      r && clearTimeout(r), i.value = !0, r = setTimeout(() => {
        i.value = !1;
      }, 2e3);
    };
    return fe(() => {
      o.emitter.on(n.on, d);
    }), ke(() => {
      r && clearTimeout(r);
    }), {
      shown: i,
      t: l
    };
  }
}, gr = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [o, i] of e)
    t[o] = i;
  return t;
}, wr = { key: 1 };
function yr(n, e, t, o, i, l) {
  return u(), h("div", {
    class: ne(["vuefinder__action-message", { "vuefinder__action-message--hidden": !o.shown }])
  }, [
    n.$slots.default ? xe(n.$slots, "default", { key: 0 }) : (u(), h("span", wr, y(o.t("Saved.")), 1))
  ], 2);
}
const dn = /* @__PURE__ */ gr(mr, [["render", yr]]), br = [
  { name: "silver", displayName: "Silver" },
  { name: "valorite", displayName: "Valorite" },
  { name: "midnight", displayName: "Midnight" },
  { name: "latte", displayName: "Latte" },
  { name: "rose", displayName: "Rose" },
  { name: "mythril", displayName: "Mythril" },
  { name: "lime", displayName: "lime" },
  { name: "sky", displayName: "Sky" },
  { name: "ocean", displayName: "Oceanic" },
  { name: "palenight", displayName: "Palenight" },
  { name: "arctic", displayName: "Arctic" },
  { name: "code", displayName: "Code" }
], kr = { class: "vuefinder__settings-modal__content" }, $r = { class: "vuefinder__settings-modal__main" }, xr = { class: "vuefinder__settings-modal__sections" }, Sr = {
  key: 0,
  class: "vuefinder__settings-modal__section"
}, Cr = {
  for: "theme",
  class: "vuefinder__settings-modal__label"
}, Fr = { class: "vuefinder__settings-modal__input-group" }, Pr = ["value"], Dr = ["value"], Tr = {
  key: 1,
  class: "vuefinder__settings-modal__section"
}, Er = {
  for: "language",
  class: "vuefinder__settings-modal__label"
}, Mr = { class: "vuefinder__settings-modal__input-group" }, Ir = ["value"], Ar = { class: "vuefinder__settings-modal__section" }, Or = {
  for: "notifications-enabled",
  class: "vuefinder__settings-modal__label"
}, zr = { class: "vuefinder__settings-modal__input-group" }, Lr = {
  class: "vuefinder__settings-modal__input-group",
  style: { "margin-top": "8px" }
}, Br = {
  for: "notification-position",
  class: "vuefinder__settings-modal__label"
}, Vr = ["disabled"], Rr = {
  class: "vuefinder__settings-modal__input-group",
  style: { "margin-top": "8px" }
}, Ur = {
  for: "notification-duration",
  class: "vuefinder__settings-modal__label"
}, Nr = ["disabled"], Hr = { class: "vuefinder__settings-modal__section" }, Kr = {
  for: "expand-tree-default",
  class: "vuefinder__settings-modal__label"
}, jr = { class: "vuefinder__settings-modal__input-group" }, qr = {
  class: "vuefinder__settings-modal__input-group",
  style: { "margin-top": "8px" }
}, Gr = {
  for: "expand-tree-paths",
  class: "vuefinder__settings-modal__label"
}, Wr = { class: "vuefinder__settings-modal__reset-section" }, Yr = { class: "vuefinder__settings-modal__reset-content" }, Qr = { class: "vuefinder__settings-modal__reset-title" }, Xr = { class: "vuefinder__settings-modal__reset-description" }, zn = /* @__PURE__ */ te({
  __name: "ModalSettings",
  setup(n) {
    const e = ee(), { enabled: t } = ze(), o = e.config, { clearStore: i } = e.storage, { t: l, localeAtom: r } = e.i18n, d = R({
      get: () => r.get(),
      set: (k) => {
        r.set(k);
      }
    }), c = W(o.state), v = R(() => c.value.theme || "silver"), f = R({
      get: () => c.value.notificationsEnabled,
      set: (k) => o.set("notificationsEnabled", k)
    }), w = R({
      get: () => c.value.notificationPosition,
      set: (k) => o.init({ notificationPosition: k })
    }), p = R({
      get: () => c.value.notificationDuration,
      set: (k) => o.init({ notificationDuration: Number(k) || 3e3 })
    }), S = R({
      get: () => c.value.expandTreeByDefault,
      set: (k) => o.set("expandTreeByDefault", k)
    }), F = R({
      get: () => (c.value.expandedTreePaths || []).join(`
`),
      set: (k) => {
        const x = k.split(`
`).map((b) => b.trim()).filter(Boolean);
        o.set("expandedTreePaths", x);
      }
    }), C = async () => {
      o.reset(), i(), localStorage.removeItem("vuefinder_locale"), localStorage.removeItem("vuefinder_translations"), location.reload();
    }, m = (k) => {
      o.set("theme", k), e.emitter.emit("vf-theme-saved");
    }, { i18n: g } = ht("VueFinderOptions"), _ = Object.fromEntries(
      Object.entries({
        ar: "Arabic (العربيّة)",
        zhCN: "Chinese-Simplified (简体中文)",
        zhTW: "Chinese-Traditional (繁體中文)",
        nl: "Dutch (Nederlands)",
        en: "English",
        fr: "French (Français)",
        de: "German (Deutsch)",
        he: "Hebrew (עִברִית)",
        hi: "Hindi (हिंदी)",
        it: "Italian (Italiano)",
        ja: "Japanese (日本語)",
        fa: "Persian (فارسی)",
        pl: "Polish (Polski)",
        pt: "Portuguese (Português)",
        ru: "Russian (Pусский)",
        es: "Spanish (Español)",
        sv: "Swedish (Svenska)",
        tr: "Turkish (Türkçe)"
      }).filter(([k]) => Object.keys(g).includes(k))
    );
    return (k, x) => (u(), U(Te, null, {
      buttons: se(() => [
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: x[7] || (x[7] = (b) => a(e).modal.close())
        }, y(a(l)("Close")), 1)
      ]),
      default: se(() => [
        s("div", kr, [
          N(Me, {
            icon: a(Mn),
            title: a(l)("Settings")
          }, null, 8, ["icon", "title"]),
          s("div", $r, [
            s("div", xr, [
              a(t)("theme") ? (u(), h("div", Sr, [
                s("label", Cr, [
                  ce(y(a(l)("Theme")) + " ", 1),
                  N(dn, {
                    class: "vuefinder__settings-modal__message",
                    on: "vf-theme-saved"
                  }, {
                    default: se(() => [
                      ce(y(a(l)("Saved.")), 1)
                    ]),
                    _: 1
                  })
                ]),
                s("div", Fr, [
                  s("select", {
                    id: "theme",
                    value: v.value,
                    class: "vuefinder__settings-modal__select",
                    onChange: x[0] || (x[0] = (b) => m(b.target?.value))
                  }, [
                    (u(!0), h(ve, null, pe(a(br), (b) => (u(), h("option", {
                      key: b.name,
                      value: b.name
                    }, y(b.displayName), 9, Dr))), 128))
                  ], 40, Pr)
                ])
              ])) : L("", !0),
              Object.keys(a(_)).length > 1 ? (u(), h("div", Tr, [
                s("label", Er, [
                  ce(y(a(l)("Language")) + " ", 1),
                  N(dn, {
                    class: "vuefinder__settings-modal__message",
                    on: "vf-language-saved"
                  }, {
                    default: se(() => [
                      ce(y(a(l)("Saved.")), 1)
                    ]),
                    _: 1
                  })
                ]),
                s("div", Mr, [
                  ue(s("select", {
                    id: "language",
                    "onUpdate:modelValue": x[1] || (x[1] = (b) => d.value = b),
                    class: "vuefinder__settings-modal__select"
                  }, [
                    (u(!0), h(ve, null, pe(a(_), (b, D) => (u(), h("option", {
                      key: D,
                      value: D
                    }, y(b), 9, Ir))), 128))
                  ], 512), [
                    [mt, d.value]
                  ])
                ])
              ])) : L("", !0),
              s("div", Ar, [
                s("label", Or, y(a(l)("Notifications")), 1),
                s("div", zr, [
                  s("label", null, [
                    ue(s("input", {
                      id: "notifications-enabled",
                      "onUpdate:modelValue": x[2] || (x[2] = (b) => f.value = b),
                      type: "checkbox"
                    }, null, 512), [
                      [Ze, f.value]
                    ]),
                    ce(" " + y(a(l)("Enable notifications")), 1)
                  ])
                ]),
                s("div", Lr, [
                  s("label", Br, y(a(l)("Notification Position")), 1),
                  ue(s("select", {
                    id: "notification-position",
                    "onUpdate:modelValue": x[3] || (x[3] = (b) => w.value = b),
                    class: "vuefinder__settings-modal__select",
                    disabled: !f.value
                  }, [...x[8] || (x[8] = [
                    s("option", { value: "top-left" }, "Top Left", -1),
                    s("option", { value: "top-center" }, "Top Center", -1),
                    s("option", { value: "top-right" }, "Top Right", -1),
                    s("option", { value: "bottom-left" }, "Bottom Left", -1),
                    s("option", { value: "bottom-center" }, "Bottom Center", -1),
                    s("option", { value: "bottom-right" }, "Bottom Right", -1)
                  ])], 8, Vr), [
                    [mt, w.value]
                  ])
                ]),
                s("div", Rr, [
                  s("label", Ur, y(a(l)("Notification Duration (ms)")), 1),
                  ue(s("input", {
                    id: "notification-duration",
                    "onUpdate:modelValue": x[4] || (x[4] = (b) => p.value = b),
                    class: "vuefinder__settings-modal__select",
                    type: "number",
                    min: "1000",
                    max: "15000",
                    step: "500",
                    disabled: !f.value
                  }, null, 8, Nr), [
                    [
                      We,
                      p.value,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              s("div", Hr, [
                s("label", Kr, y(a(l)("Navigation Tree")), 1),
                s("div", jr, [
                  s("label", null, [
                    ue(s("input", {
                      id: "expand-tree-default",
                      "onUpdate:modelValue": x[5] || (x[5] = (b) => S.value = b),
                      type: "checkbox"
                    }, null, 512), [
                      [Ze, S.value]
                    ]),
                    ce(" " + y(a(l)("Expand tree by default")), 1)
                  ])
                ]),
                s("div", qr, [
                  s("label", Gr, y(a(l)("Expanded Tree Paths")), 1),
                  ue(s("textarea", {
                    id: "expand-tree-paths",
                    "onUpdate:modelValue": x[6] || (x[6] = (b) => F.value = b),
                    class: "vuefinder__settings-modal__select",
                    rows: "3",
                    placeholder: `local://documents
local://documents/work`
                  }, null, 512), [
                    [We, F.value]
                  ])
                ])
              ])
            ]),
            s("div", Wr, [
              s("div", Yr, [
                s("div", Qr, y(a(l)("Reset")), 1),
                s("div", Xr, y(a(l)("Reset all settings to default")), 1)
              ]),
              s("button", {
                type: "button",
                class: "vuefinder__settings-modal__reset-button",
                onClick: C
              }, y(a(l)("Reset Settings")), 1)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Ce = {
  ESCAPE: "Escape",
  DELETE: "Delete",
  ENTER: "Enter",
  BACKSLASH: "Backslash",
  KEY_A: "KeyA",
  KEY_E: "KeyE",
  KEY_F: "KeyF",
  SPACE: "Space",
  KEY_C: "KeyC",
  KEY_X: "KeyX",
  KEY_V: "KeyV",
  KEY_S: "KeyS",
  KEY_R: "KeyR"
};
function Jr() {
  const n = ee(), e = De(n), t = n.fs, o = n.config, { enabled: i } = ze(), l = W(t.path), r = W(t.selectedItems), d = (c) => {
    if (c.code === Ce.ESCAPE && (n.modal.close(), n.root.focus()), !n.modal.visible) {
      if (c.metaKey && c.code === Ce.KEY_R && !c.shiftKey && (n.adapter.invalidateListQuery(l.value.path), n.adapter.open(l.value.path), c.preventDefault()), c.metaKey && c.shiftKey && c.code === Ce.KEY_R && i("rename") && r.value.length === 1 && (n.modal.open($t, { items: r.value }), c.preventDefault()), c.code === Ce.DELETE && r.value.length !== 0 && n.modal.open(kt, { items: r.value }), c.metaKey && c.code === Ce.BACKSLASH && n.modal.open(Cn), c.metaKey && c.code === Ce.KEY_F && i("search") && (n.modal.open(Wt), c.preventDefault()), c.metaKey && c.code === Ce.KEY_E && (o.toggle("showTreeView"), c.preventDefault()), c.metaKey && c.code === Ce.KEY_S && (n.modal.open(zn), c.preventDefault()), c.metaKey && c.code === Ce.ENTER && (o.toggle("fullScreen"), n.root.focus()), c.metaKey && c.code === Ce.KEY_A && (t.selectAll(n.selectionMode || "multiple", n), c.preventDefault()), c.code === Ce.SPACE && r.value.length === 1 && r.value[0]?.type !== "dir" && n.modal.open(ft, {
        storage: t.path.get().storage,
        item: r.value[0]
      }), c.metaKey && c.code === Ce.KEY_C && i("copy")) {
        if (r.value.length === 0) {
          e.error(n.i18n.t("No items selected"));
          return;
        }
        t.setClipboard("copy", new Set(r.value.map((v) => v.path))), e.success(
          r.value.length === 1 ? n.i18n.t("Item copied to clipboard") : n.i18n.t("%s items copied to clipboard", r.value.length)
        ), c.preventDefault();
      }
      if (c.metaKey && c.code === Ce.KEY_X && i("copy")) {
        if (r.value.length === 0) {
          e.error(n.i18n.t("No items selected"));
          return;
        }
        t.setClipboard("cut", new Set(r.value.map((v) => v.path))), e.success(
          r.value.length === 1 ? n.i18n.t("Item cut to clipboard") : n.i18n.t("%s items cut to clipboard", r.value.length)
        ), c.preventDefault();
      }
      if (c.metaKey && c.code === Ce.KEY_V && i("copy")) {
        if (t.getClipboard().items.size === 0) {
          e.error(n.i18n.t("No items in clipboard"));
          return;
        }
        if (t.getClipboard().path === t.path.get().path) {
          e.error(n.i18n.t("Cannot paste items to the same directory"));
          return;
        }
        if (t.getClipboard().type === "cut") {
          n.modal.open(tt, {
            items: { from: Array.from(t.getClipboard().items), to: t.path.get() }
          }), t.clearClipboard();
          return;
        }
        if (t.getClipboard().type === "copy") {
          n.modal.open(qt, {
            items: { from: Array.from(t.getClipboard().items), to: t.path.get() }
          });
          return;
        }
        c.preventDefault();
      }
    }
  };
  fe(async () => {
    if (await Be(), !n.root) {
      console.warn("app.root is not available. Event listeners will not be attached.");
      return;
    }
    n.root.addEventListener("keydown", d);
  }), mn(() => {
    n.root && n.root.removeEventListener("keydown", d);
  });
}
function Zr() {
  const n = A(!1), e = A([]);
  return {
    isDraggingExternal: n,
    externalFiles: e,
    handleDragEnter: (d) => {
      d.preventDefault(), d.stopPropagation();
      const c = d.dataTransfer?.items;
      c && Array.from(c).some((f) => f.kind === "file") && (n.value = !0, d.isExternalDrag = !0);
    },
    handleDragOver: (d) => {
      n.value && d.dataTransfer && (d.dataTransfer.dropEffect = "copy", d.preventDefault(), d.stopPropagation());
    },
    handleDragLeave: (d) => {
      d.preventDefault();
      const c = d.currentTarget.getBoundingClientRect(), v = d.clientX, f = d.clientY;
      (v < c.left || v > c.right || f < c.top || f > c.bottom) && (n.value = !1);
    },
    handleDrop: async (d) => {
      d.preventDefault(), d.stopPropagation(), n.value = !1;
      const c = d.dataTransfer?.items;
      if (c) {
        const v = Array.from(c).filter((f) => f.kind === "file");
        if (v.length > 0) {
          e.value = [];
          for (const f of v) {
            const w = f.webkitGetAsEntry?.();
            if (w)
              await Rt((p, S) => {
                e.value.push({
                  name: S.name,
                  size: S.size,
                  type: S.type,
                  lastModified: new Date(S.lastModified),
                  file: S
                });
              }, w);
            else {
              const p = f.getAsFile();
              p && e.value.push({
                name: p.name,
                size: p.size,
                type: p.type,
                lastModified: new Date(p.lastModified),
                file: p
              });
            }
          }
          return e.value;
        }
      }
      return [];
    },
    clearExternalFiles: () => {
      e.value = [];
    }
  };
}
const el = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function tl(n, e) {
  return u(), h("svg", el, [...e[0] || (e[0] = [
    s("path", { d: "M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44z" }, null, -1)
  ])]);
}
const Ln = { render: tl }, nl = { class: "vuefinder__new-folder-modal__content" }, ol = { class: "vuefinder__new-folder-modal__form" }, sl = { class: "vuefinder__new-folder-modal__description" }, il = ["placeholder"], Yt = /* @__PURE__ */ te({
  __name: "ModalNewFolder",
  setup(n) {
    const e = ee(), t = De(e), { t: o } = e.i18n, i = e.fs, l = W(i.path), r = A(""), d = () => {
      r.value !== "" && e.adapter.createFolder({
        path: l.value.path,
        name: r.value
      }).then((c) => {
        t.success(o("%s is created.", r.value)), e.fs.setFiles(c.files), e.modal.close();
      }).catch((c) => {
        t.error(Pe(c, o("Failed to create folder")));
      });
    };
    return (c, v) => (u(), U(Te, null, {
      buttons: se(() => [
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-primary",
          onClick: d
        }, y(a(o)("Create")), 1),
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: v[1] || (v[1] = (f) => a(e).modal.close())
        }, y(a(o)("Cancel")), 1)
      ]),
      default: se(() => [
        s("div", null, [
          N(Me, {
            icon: a(Ln),
            title: a(o)("New Folder")
          }, null, 8, ["icon", "title"]),
          s("div", nl, [
            s("div", ol, [
              s("p", sl, y(a(o)("Create a new folder")), 1),
              ue(s("input", {
                "onUpdate:modelValue": v[0] || (v[0] = (f) => r.value = f),
                class: "vuefinder__new-folder-modal__input",
                placeholder: a(o)("Folder Name"),
                type: "text",
                autofocus: "",
                onKeyup: vt(d, ["enter"])
              }, null, 40, il), [
                [We, r.value]
              ])
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), al = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function rl(n, e) {
  return u(), h("svg", al, [...e[0] || (e[0] = [
    s("path", { d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9" }, null, -1)
  ])]);
}
const Bn = { render: rl }, ll = { class: "vuefinder__new-file-modal__content" }, dl = { class: "vuefinder__new-file-modal__form" }, cl = { class: "vuefinder__new-file-modal__description" }, ul = ["placeholder"], Vn = /* @__PURE__ */ te({
  __name: "ModalNewFile",
  setup(n) {
    const e = ee(), t = De(e), { t: o } = e.i18n, i = e.fs, l = W(i.path), r = A(""), d = () => {
      r.value !== "" && e.adapter.createFile({
        path: l.value.path,
        name: r.value
      }).then((c) => {
        t.success(o("%s is created.", r.value)), e.fs.setFiles(c.files), e.modal.close();
      }).catch((c) => {
        t.error(Pe(c, o("Failed to create file")));
      });
    };
    return (c, v) => (u(), U(Te, null, {
      buttons: se(() => [
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-primary",
          onClick: d
        }, y(a(o)("Create")), 1),
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: v[1] || (v[1] = (f) => a(e).modal.close())
        }, y(a(o)("Cancel")), 1)
      ]),
      default: se(() => [
        s("div", null, [
          N(Me, {
            icon: a(Bn),
            title: a(o)("New File")
          }, null, 8, ["icon", "title"]),
          s("div", ll, [
            s("div", dl, [
              s("p", cl, y(a(o)("Create a new file")), 1),
              ue(s("input", {
                "onUpdate:modelValue": v[0] || (v[0] = (f) => r.value = f),
                class: "vuefinder__new-file-modal__input",
                placeholder: a(o)("File Name"),
                type: "text",
                onKeyup: vt(d, ["enter"])
              }, null, 40, ul), [
                [We, r.value]
              ])
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), vl = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function fl(n, e) {
  return u(), h("svg", vl, [...e[0] || (e[0] = [
    s("path", { d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" }, null, -1)
  ])]);
}
const Rn = { render: fl };
function Ot(n, e = 14) {
  const t = `((?=([\\w\\W]{0,${e}}))([\\w\\W]{${e + 1},})([\\w\\W]{8,}))`;
  return n.replace(new RegExp(t), "$2..$4");
}
const pl = { class: "vuefinder__upload-modal__content relative" }, _l = { class: "vuefinder__upload-modal__target-section" }, hl = { class: "vuefinder__upload-modal__target-label" }, ml = { class: "vuefinder__upload-modal__target-container" }, gl = { class: "vuefinder__upload-modal__target-path" }, wl = { class: "vuefinder__upload-modal__target-storage" }, yl = {
  key: 0,
  class: "vuefinder__upload-modal__target-folder"
}, bl = { class: "vuefinder__upload-modal__target-badge" }, kl = { class: "vuefinder__upload-modal__drag-hint" }, $l = { class: "vuefinder__upload-modal__file-list vf-scrollbar" }, xl = ["textContent"], Sl = { class: "vuefinder__upload-modal__file-info" }, Cl = { class: "vuefinder__upload-modal__file-name hidden md:block" }, Fl = { class: "vuefinder__upload-modal__file-name md:hidden" }, Pl = {
  key: 0,
  class: "ml-auto"
}, Dl = ["title", "disabled", "onClick"], Tl = {
  key: 0,
  class: "py-2"
}, El = ["aria-expanded"], Ml = {
  key: 0,
  class: "vuefinder__upload-actions__menu absolute right-0 bottom-full left-0 mb-2"
}, Il = ["disabled"], Al = ["aria-expanded"], Ol = {
  key: 0,
  class: "vuefinder__upload-actions__menu"
}, Qt = /* @__PURE__ */ te({
  __name: "ModalUpload",
  setup(n) {
    const e = ee(), { t } = e.i18n, o = e.fs, i = W(o.path), l = A(i.value), r = A(!1), d = () => {
      const I = l.value.path;
      if (!I) return { storage: "local", path: "" };
      if (I.endsWith("://"))
        return { storage: I.replace("://", ""), path: "" };
      const T = I.split("://");
      return {
        storage: T[0] || "local",
        path: T[1] || ""
      };
    }, c = (I) => {
      I && (l.value = I);
    }, v = (I) => {
      I && (l.value = I, r.value = !1);
    }, {
      container: f,
      internalFileInput: w,
      internalFolderInput: p,
      pickFiles: S,
      queue: F,
      message: C,
      uploading: m,
      hasFilesInDropArea: g,
      definitions: $,
      openFileSelector: _,
      upload: k,
      cancel: x,
      remove: b,
      clear: D,
      close: E,
      getClassNameForEntry: V,
      getIconForEntry: j,
      addExternalFiles: O
    } = Dn(e.customUploader), q = () => {
      k(l.value);
    };
    fe(() => {
      e.emitter.on("vf-external-files-dropped", (I) => {
        O(I);
      });
    }), ke(() => {
      e.emitter.off("vf-external-files-dropped");
    });
    const M = A(!1), X = A(null), G = A(null), J = (I) => {
      if (!M.value) return;
      const T = I.target, P = X.value?.contains(T) ?? !1, z = G.value?.contains(T) ?? !1;
      !P && !z && (M.value = !1);
    };
    return fe(() => document.addEventListener("click", J)), ke(() => document.removeEventListener("click", J)), (I, T) => (u(), U(Te, {
      "show-drag-overlay": a(g),
      "drag-overlay-text": a(t)("Drag and drop the files/folders to here.")
    }, {
      buttons: se(() => [
        s("div", {
          ref_key: "actionsMenuMobileRef",
          ref: X,
          class: "relative mb-2 w-full sm:hidden"
        }, [
          s("div", {
            class: ne([
              "vuefinder__upload-actions",
              "vuefinder__upload-actions--block",
              M.value ? "vuefinder__upload-actions--ring" : ""
            ])
          }, [
            s("button", {
              type: "button",
              class: "vuefinder__upload-actions__main",
              onClick: T[3] || (T[3] = (P) => a(_)())
            }, y(a(t)("Select Files")), 1),
            s("button", {
              type: "button",
              class: "vuefinder__upload-actions__trigger",
              "aria-haspopup": "menu",
              "aria-expanded": M.value ? "true" : "false",
              onClick: T[4] || (T[4] = ae((P) => M.value = !M.value, ["stop"]))
            }, [...T[17] || (T[17] = [
              s("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                class: "h-4 w-4",
                viewBox: "0 0 20 20",
                fill: "currentColor"
              }, [
                s("path", {
                  "fill-rule": "evenodd",
                  d: "M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z",
                  "clip-rule": "evenodd"
                })
              ], -1)
            ])], 8, El)
          ], 2),
          M.value ? (u(), h("div", Ml, [
            s("div", {
              class: "vuefinder__upload-actions__item",
              onClick: T[5] || (T[5] = (P) => {
                a(_)(), M.value = !1;
              })
            }, y(a(t)("Select Files")), 1),
            s("div", {
              class: "vuefinder__upload-actions__item",
              onClick: T[6] || (T[6] = (P) => {
                a(p)?.click(), M.value = !1;
              })
            }, y(a(t)("Select Folders")), 1),
            T[18] || (T[18] = s("div", { class: "vuefinder__upload-actions__separator" }, null, -1)),
            s("div", {
              class: ne(["vuefinder__upload-actions__item", a(m) ? "disabled" : ""]),
              onClick: T[7] || (T[7] = (P) => a(m) ? null : (a(D)(!1), M.value = !1))
            }, y(a(t)("Clear all")), 3),
            s("div", {
              class: ne(["vuefinder__upload-actions__item", a(m) ? "disabled" : ""]),
              onClick: T[8] || (T[8] = (P) => a(m) ? null : (a(D)(!0), M.value = !1))
            }, y(a(t)("Clear only successful")), 3)
          ])) : L("", !0)
        ], 512),
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-primary",
          disabled: a(m) || !a(F).length,
          onClick: ae(q, ["prevent"])
        }, y(a(t)("Upload")), 9, Il),
        a(m) ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: T[9] || (T[9] = ae(
            //@ts-ignore
            (...P) => a(x) && a(x)(...P),
            ["prevent"]
          ))
        }, y(a(t)("Cancel")), 1)) : (u(), h("button", {
          key: 1,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: T[10] || (T[10] = ae(
            //@ts-ignore
            (...P) => a(E) && a(E)(...P),
            ["prevent"]
          ))
        }, y(a(t)("Close")), 1)),
        s("div", {
          ref_key: "actionsMenuDesktopRef",
          ref: G,
          class: "relative mr-auto hidden sm:block"
        }, [
          s("div", {
            class: ne(["vuefinder__upload-actions", M.value ? "vuefinder__upload-actions--ring" : ""])
          }, [
            s("button", {
              ref_key: "pickFiles",
              ref: S,
              type: "button",
              class: "vuefinder__upload-actions__main"
            }, y(a(t)("Select Files")), 513),
            s("button", {
              type: "button",
              class: "vuefinder__upload-actions__trigger",
              "aria-haspopup": "menu",
              "aria-expanded": M.value ? "true" : "false",
              onClick: T[11] || (T[11] = ae((P) => M.value = !M.value, ["stop"]))
            }, [...T[19] || (T[19] = [
              s("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                class: "h-4 w-4",
                viewBox: "0 0 20 20",
                fill: "currentColor"
              }, [
                s("path", {
                  "fill-rule": "evenodd",
                  d: "M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z",
                  "clip-rule": "evenodd"
                })
              ], -1)
            ])], 8, Al)
          ], 2),
          M.value ? (u(), h("div", Ol, [
            s("div", {
              class: "vuefinder__upload-actions__item",
              onClick: T[12] || (T[12] = (P) => {
                a(_)(), M.value = !1;
              })
            }, y(a(t)("Select Files")), 1),
            s("div", {
              class: "vuefinder__upload-actions__item",
              onClick: T[13] || (T[13] = (P) => {
                a(p)?.click(), M.value = !1;
              })
            }, y(a(t)("Select Folders")), 1),
            T[20] || (T[20] = s("div", { class: "vuefinder__upload-actions__separator" }, null, -1)),
            s("div", {
              class: ne(["vuefinder__upload-actions__item", a(m) ? "disabled" : ""]),
              onClick: T[14] || (T[14] = (P) => a(m) ? null : (a(D)(!1), M.value = !1))
            }, y(a(t)("Clear all")), 3),
            s("div", {
              class: ne(["vuefinder__upload-actions__item", a(m) ? "disabled" : ""]),
              onClick: T[15] || (T[15] = (P) => a(m) ? null : (a(D)(!0), M.value = !1))
            }, y(a(t)("Clear only successful")), 3)
          ])) : L("", !0)
        ], 512)
      ]),
      default: se(() => [
        s("div", null, [
          N(Me, {
            icon: a(Rn),
            title: a(t)("Upload Files")
          }, null, 8, ["icon", "title"]),
          s("div", pl, [
            s("div", _l, [
              s("div", hl, y(a(t)("Target Directory")), 1),
              s("div", ml, [
                s("div", {
                  class: "vuefinder__upload-modal__target-display",
                  onClick: T[0] || (T[0] = (P) => r.value = !r.value)
                }, [
                  s("div", gl, [
                    s("span", wl, y(d().storage) + "://", 1),
                    d().path ? (u(), h("span", yl, y(d().path), 1)) : L("", !0)
                  ]),
                  s("span", bl, y(a(t)("Browse")), 1)
                ])
              ]),
              s("div", {
                class: ne([
                  "vuefinder__upload-modal__tree-selector",
                  r.value ? "vuefinder__upload-modal__tree-selector--expanded" : "vuefinder__upload-modal__tree-selector--collapsed"
                ])
              }, [
                N(jt, {
                  modelValue: l.value,
                  "onUpdate:modelValue": [
                    T[1] || (T[1] = (P) => l.value = P),
                    c
                  ],
                  "show-pinned-folders": !0,
                  onSelectAndClose: v
                }, null, 8, ["modelValue"])
              ], 2)
            ]),
            s("div", kl, y(a(t)("You can drag & drop files anywhere while this modal is open.")), 1),
            s("div", {
              ref_key: "container",
              ref: f,
              class: "hidden"
            }, null, 512),
            s("div", $l, [
              (u(!0), h(ve, null, pe(a(F), (P) => (u(), h("div", {
                key: P.id,
                class: "vuefinder__upload-modal__file-entry"
              }, [
                s("span", {
                  class: ne(["vuefinder__upload-modal__file-icon", a(V)(P)])
                }, [
                  s("span", {
                    class: "vuefinder__upload-modal__file-icon-text",
                    textContent: y(a(j)(P))
                  }, null, 8, xl)
                ], 2),
                s("div", Sl, [
                  s("div", Cl, y(a(Ot)(P.name, 40)) + " (" + y(P.size) + ") ", 1),
                  s("div", Fl, y(a(Ot)(P.name, 16)) + " (" + y(P.size) + ") ", 1),
                  s("div", {
                    class: ne(["vuefinder__upload-modal__file-status", a(V)(P)])
                  }, [
                    ce(y(P.statusName) + " ", 1),
                    P.status === a($).QUEUE_ENTRY_STATUS.UPLOADING ? (u(), h("b", Pl, y(P.percent), 1)) : L("", !0)
                  ], 2)
                ]),
                s("button", {
                  type: "button",
                  class: ne(["vuefinder__upload-modal__file-remove", a(m) ? "disabled" : ""]),
                  title: a(t)("Delete"),
                  disabled: a(m),
                  onClick: (z) => a(b)(P)
                }, [...T[16] || (T[16] = [
                  s("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    "stroke-width": "1.5",
                    stroke: "currentColor",
                    class: "vuefinder__upload-modal__file-remove-icon"
                  }, [
                    s("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M6 18L18 6M6 6l12 12"
                    })
                  ], -1)
                ])], 10, Dl)
              ]))), 128)),
              a(F).length ? L("", !0) : (u(), h("div", Tl, y(a(t)("No files selected!")), 1))
            ]),
            a(C).length ? (u(), U(At, {
              key: 0,
              error: "",
              onHidden: T[2] || (T[2] = (P) => C.value = "")
            }, {
              default: se(() => [
                ce(y(a(C)), 1)
              ]),
              _: 1
            })) : L("", !0)
          ])
        ]),
        s("input", {
          ref_key: "internalFileInput",
          ref: w,
          type: "file",
          multiple: "",
          class: "hidden"
        }, null, 512),
        s("input", {
          ref_key: "internalFolderInput",
          ref: p,
          type: "file",
          multiple: "",
          webkitdirectory: "",
          class: "hidden"
        }, null, 512)
      ]),
      _: 1
    }, 8, ["show-drag-overlay", "drag-overlay-text"]));
  }
}), zl = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function Ll(n, e) {
  return u(), h("svg", zl, [...e[0] || (e[0] = [
    s("path", { d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" }, null, -1)
  ])]);
}
const Un = { render: Ll }, Bl = { class: "vuefinder__unarchive-modal__content" }, Vl = { class: "vuefinder__unarchive-modal__items" }, Rl = {
  key: 0,
  class: "vuefinder__unarchive-modal__icon vuefinder__unarchive-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Ul = {
  key: 1,
  class: "vuefinder__unarchive-modal__icon vuefinder__unarchive-modal__icon--file",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Nl = { class: "vuefinder__unarchive-modal__item-name" }, Hl = { class: "vuefinder__unarchive-modal__info" }, Xt = /* @__PURE__ */ te({
  __name: "ModalUnarchive",
  setup(n) {
    const e = ee(), t = De(e), o = e.fs, i = W(o.path), { t: l } = e.i18n, r = A(e.modal.data.items[0]), d = A([]), c = () => {
      e.adapter.unarchive({
        item: r.value.path,
        path: i.value.path
      }).then((v) => {
        t.success(l("The file unarchived.")), e.fs.setFiles(v.files), e.modal.close();
      }).catch((v) => {
        t.error(Pe(v, l("Failed to unarchive")));
      });
    };
    return (v, f) => (u(), U(Te, null, {
      buttons: se(() => [
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-primary",
          onClick: c
        }, y(a(l)("Unarchive")), 1),
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: f[0] || (f[0] = (w) => a(e).modal.close())
        }, y(a(l)("Cancel")), 1)
      ]),
      default: se(() => [
        s("div", null, [
          N(Me, {
            icon: a(Un),
            title: a(l)("Unarchive")
          }, null, 8, ["icon", "title"]),
          s("div", Bl, [
            s("div", Vl, [
              (u(!0), h(ve, null, pe(d.value, (w) => (u(), h("p", {
                key: w.path,
                class: "vuefinder__unarchive-modal__item"
              }, [
                w.type === "dir" ? (u(), h("svg", Rl, [...f[1] || (f[1] = [
                  s("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  }, null, -1)
                ])])) : (u(), h("svg", Ul, [...f[2] || (f[2] = [
                  s("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }, null, -1)
                ])])),
                s("span", Nl, y(w.basename), 1)
              ]))), 128)),
              s("p", Hl, y(a(l)("The archive will be unarchived at")) + " (" + y(a(i).path) + ") ", 1)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Kl = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  viewBox: "0 0 24 24"
};
function jl(n, e) {
  return u(), h("svg", Kl, [...e[0] || (e[0] = [
    s("path", { d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" }, null, -1)
  ])]);
}
const Nn = { render: jl }, ql = { class: "vuefinder__archive-modal__content" }, Gl = { class: "vuefinder__archive-modal__form" }, Wl = { class: "vuefinder__archive-modal__files vf-scrollbar" }, Yl = {
  key: 0,
  class: "vuefinder__archive-modal__icon vuefinder__archive-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Ql = {
  key: 1,
  class: "vuefinder__archive-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Xl = { class: "vuefinder__archive-modal__file-name" }, Jl = ["placeholder"], Jt = /* @__PURE__ */ te({
  __name: "ModalArchive",
  setup(n) {
    const e = ee(), t = De(e), { t: o } = e.i18n, i = e.fs, l = W(i.path), r = A(""), d = A(e.modal.data.items), c = () => {
      d.value.length && e.adapter.archive({
        path: l.value.path,
        items: d.value.map(({ path: v, type: f }) => ({
          path: v,
          type: f
        })),
        name: r.value
      }).then((v) => {
        t.success(o("The file(s) archived.")), e.fs.setFiles(v.files), e.modal.close();
      }).catch((v) => {
        t.error(Pe(v, o("Failed to archive files")));
      });
    };
    return (v, f) => (u(), U(Te, null, {
      buttons: se(() => [
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-primary",
          onClick: c
        }, y(a(o)("Archive")), 1),
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: f[1] || (f[1] = (w) => a(e).modal.close())
        }, y(a(o)("Cancel")), 1)
      ]),
      default: se(() => [
        s("div", null, [
          N(Me, {
            icon: a(Nn),
            title: a(o)("Archive the files")
          }, null, 8, ["icon", "title"]),
          s("div", ql, [
            s("div", Gl, [
              s("div", Wl, [
                (u(!0), h(ve, null, pe(d.value, (w) => (u(), h("p", {
                  key: w.path,
                  class: "vuefinder__archive-modal__file"
                }, [
                  w.type === "dir" ? (u(), h("svg", Yl, [...f[2] || (f[2] = [
                    s("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ])])) : (u(), h("svg", Ql, [...f[3] || (f[3] = [
                    s("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ])])),
                  s("span", Xl, y(w.basename), 1)
                ]))), 128))
              ]),
              ue(s("input", {
                "onUpdate:modelValue": f[0] || (f[0] = (w) => r.value = w),
                class: "vuefinder__archive-modal__input",
                placeholder: a(o)("Archive name. (.zip file will be created)"),
                type: "text",
                onKeyup: vt(c, ["enter"])
              }, null, 40, Jl), [
                [We, r.value]
              ])
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Zl = { class: "vuefinder__about-modal__content" }, ed = { class: "vuefinder__about-modal__main" }, td = { class: "vuefinder__about-modal__shortcuts" }, nd = { class: "vuefinder__about-modal__shortcut" }, od = {
  key: 0,
  class: "vuefinder__about-modal__shortcut"
}, sd = {
  key: 1,
  class: "vuefinder__about-modal__shortcut"
}, id = { class: "vuefinder__about-modal__shortcut" }, ad = { class: "vuefinder__about-modal__shortcut" }, rd = {
  key: 2,
  class: "vuefinder__about-modal__shortcut"
}, ld = {
  key: 3,
  class: "vuefinder__about-modal__shortcut"
}, dd = {
  key: 4,
  class: "vuefinder__about-modal__shortcut"
}, cd = {
  key: 5,
  class: "vuefinder__about-modal__shortcut"
}, ud = { class: "vuefinder__about-modal__shortcut" }, vd = { class: "vuefinder__about-modal__shortcut" }, fd = {
  key: 6,
  class: "vuefinder__about-modal__shortcut"
}, pd = {
  key: 7,
  class: "vuefinder__about-modal__shortcut"
}, _d = /* @__PURE__ */ te({
  __name: "ModalShortcuts",
  setup(n) {
    const e = ee(), { enabled: t } = ze(), { t: o } = e.i18n;
    return (i, l) => (u(), U(Te, null, {
      buttons: se(() => [
        s("button", {
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: l[0] || (l[0] = (r) => a(e).modal.close())
        }, y(a(o)("Close")), 1)
      ]),
      default: se(() => [
        s("div", Zl, [
          N(Me, {
            icon: a(Sn),
            title: a(o)("Shortcuts")
          }, null, 8, ["icon", "title"]),
          s("div", ed, [
            s("div", td, [
              s("div", nd, [
                s("div", null, y(a(o)("Refresh")), 1),
                l[1] || (l[1] = s("div", null, [
                  s("kbd", null, "⌘"),
                  ce(" + "),
                  s("kbd", null, "R")
                ], -1))
              ]),
              a(t)("rename") ? (u(), h("div", od, [
                s("div", null, y(a(o)("Rename")), 1),
                l[2] || (l[2] = s("div", null, [
                  s("kbd", null, "⌘"),
                  ce(" + "),
                  s("kbd", null, "Shift"),
                  ce(" + "),
                  s("kbd", null, "R")
                ], -1))
              ])) : L("", !0),
              a(t)("delete") ? (u(), h("div", sd, [
                s("div", null, y(a(o)("Delete")), 1),
                l[3] || (l[3] = s("kbd", null, "Del", -1))
              ])) : L("", !0),
              s("div", id, [
                s("div", null, y(a(o)("Escape")), 1),
                l[4] || (l[4] = s("kbd", null, "Esc", -1))
              ]),
              s("div", ad, [
                s("div", null, y(a(o)("Select All")), 1),
                l[5] || (l[5] = s("div", null, [
                  s("kbd", null, "⌘"),
                  ce(" + "),
                  s("kbd", null, "A")
                ], -1))
              ]),
              a(t)("copy") ? (u(), h("div", rd, [
                s("div", null, y(a(o)("Cut")), 1),
                l[6] || (l[6] = s("div", null, [
                  s("kbd", null, "⌘"),
                  ce(" + "),
                  s("kbd", null, "X")
                ], -1))
              ])) : L("", !0),
              a(t)("copy") ? (u(), h("div", ld, [
                s("div", null, y(a(o)("Copy")), 1),
                l[7] || (l[7] = s("div", null, [
                  s("kbd", null, "⌘"),
                  ce(" + "),
                  s("kbd", null, "C")
                ], -1))
              ])) : L("", !0),
              a(t)("copy") ? (u(), h("div", dd, [
                s("div", null, y(a(o)("Paste")), 1),
                l[8] || (l[8] = s("div", null, [
                  s("kbd", null, "⌘"),
                  ce(" + "),
                  s("kbd", null, "V")
                ], -1))
              ])) : L("", !0),
              a(t)("search") ? (u(), h("div", cd, [
                s("div", null, y(a(o)("Search")), 1),
                l[9] || (l[9] = s("div", null, [
                  s("kbd", null, "⌘"),
                  ce(" + "),
                  s("kbd", null, "F")
                ], -1))
              ])) : L("", !0),
              s("div", ud, [
                s("div", null, y(a(o)("Toggle Sidebar")), 1),
                l[10] || (l[10] = s("div", null, [
                  s("kbd", null, "⌘"),
                  ce(" + "),
                  s("kbd", null, "E")
                ], -1))
              ]),
              s("div", vd, [
                s("div", null, y(a(o)("Open Settings")), 1),
                l[11] || (l[11] = s("div", null, [
                  s("kbd", null, "⌘"),
                  ce(" + "),
                  s("kbd", null, "S")
                ], -1))
              ]),
              a(t)("fullscreen") ? (u(), h("div", fd, [
                s("div", null, y(a(o)("Toggle Full Screen")), 1),
                l[12] || (l[12] = s("div", null, [
                  s("kbd", null, "⌘"),
                  ce(" + "),
                  s("kbd", null, "Enter")
                ], -1))
              ])) : L("", !0),
              a(t)("preview") ? (u(), h("div", pd, [
                s("div", null, y(a(o)("Preview")), 1),
                l[13] || (l[13] = s("kbd", null, "Space", -1))
              ])) : L("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), hd = { class: "vuefinder__menubar__container" }, md = ["onClick", "onMouseenter"], gd = { class: "vuefinder__menubar__label" }, wd = ["onMouseenter"], yd = ["onClick"], bd = {
  key: 0,
  class: "vuefinder__menubar__dropdown__label"
}, kd = {
  key: 1,
  class: "vuefinder__menubar__dropdown__checkmark"
}, $d = /* @__PURE__ */ te({
  __name: "MenuBar",
  setup(n) {
    const e = ee(), t = De(e), { enabled: o } = ze(), { t: i } = e?.i18n || { t: (_) => _ }, l = e?.fs, r = e?.config, d = W(r.state), c = W(l.selectedItems), v = W(l?.storages || []), f = A(null), w = A(!1), p = R(() => window.opener !== null || window.name !== "" || window.history.length <= 1), S = R(() => [
      {
        id: "file",
        label: i("File"),
        items: [
          {
            id: "new-folder",
            label: i("New Folder"),
            action: () => e?.modal?.open(Yt, { items: c.value }),
            enabled: () => o("newfolder")
          },
          {
            id: "new-file",
            label: i("New File"),
            action: () => e?.modal?.open(Vn, { items: c.value }),
            enabled: () => o("newfile")
          },
          { type: "separator" },
          {
            id: "upload",
            label: i("Upload"),
            action: () => e?.modal?.open(Qt, { items: c.value }),
            enabled: () => o("upload")
          },
          { type: "separator" },
          {
            id: "search",
            label: i("Search"),
            action: () => e.modal.open(Wt),
            enabled: () => o("search")
          },
          { type: "separator" },
          {
            id: "archive",
            label: i("Archive"),
            action: () => {
              c.value.length > 0 && e?.modal?.open(Jt, { items: c.value });
            },
            enabled: () => c.value.length > 0 && o("archive")
          },
          {
            id: "unarchive",
            label: i("Unarchive"),
            action: () => {
              c.value.length === 1 && c.value[0]?.mime_type === "application/zip" && e?.modal?.open(Xt, { items: c.value });
            },
            enabled: () => c.value.length === 1 && c.value[0]?.mime_type === "application/zip" && o("unarchive")
          },
          { type: "separator" },
          {
            id: "preview",
            label: i("Preview"),
            action: () => {
              c.value.length === 1 && c.value[0]?.type !== "dir" && e?.modal?.open(ft, {
                storage: l?.path?.get()?.storage,
                item: c.value[0]
              });
            },
            enabled: () => c.value.length === 1 && c.value[0]?.type !== "dir" && o("preview")
          },
          // Only show exit option if we can actually close the window
          ...p.value ? [
            { type: "separator" },
            {
              id: "exit",
              label: i("Exit"),
              action: () => {
                try {
                  window.close();
                } catch {
                }
              },
              enabled: () => !0
            }
          ] : []
        ]
      },
      {
        id: "edit",
        label: i("Edit"),
        items: [
          // Only show Select All and Deselect All in multiple selection mode
          ...e?.selectionMode === "multiple" ? [
            {
              id: "select-all",
              label: i("Select All"),
              action: () => l?.selectAll(e?.selectionMode || "multiple", e),
              enabled: () => !0
            },
            {
              id: "deselect",
              label: i("Deselect All"),
              action: () => l?.clearSelection(),
              enabled: () => c.value.length > 0
            },
            { type: "separator" }
          ] : [],
          ...o("copy") ? [
            {
              id: "cut",
              label: i("Cut"),
              action: () => {
                c.value.length > 0 && l?.setClipboard(
                  "cut",
                  new Set(c.value.map((_) => _.path))
                );
              },
              enabled: () => c.value.length > 0
            },
            {
              id: "copy",
              label: i("Copy"),
              action: () => {
                c.value.length > 0 && l?.setClipboard(
                  "copy",
                  new Set(c.value.map((_) => _.path))
                );
              },
              enabled: () => c.value.length > 0
            },
            {
              id: "paste",
              label: i("Paste"),
              action: () => {
                const _ = l?.getClipboard();
                _?.items?.size > 0 && e?.modal?.open(_.type === "cut" ? tt : qt, {
                  items: { from: Array.from(_.items), to: l?.path?.get() }
                });
              },
              enabled: () => l?.getClipboard()?.items?.size > 0
            }
          ] : [],
          ...o("move") ? [
            {
              id: "move",
              label: i("Move files"),
              action: () => {
                if (c.value.length > 0) {
                  const _ = e?.fs, k = {
                    storage: _?.path?.get()?.storage || "",
                    path: _?.path?.get()?.path || "",
                    type: "dir"
                  };
                  e?.modal?.open(tt, { items: { from: c.value, to: k } });
                }
              },
              enabled: () => c.value.length > 0
            },
            { type: "separator" }
          ] : [],
          {
            id: "copy-path",
            label: i("Copy Path"),
            action: async () => {
              if (c.value.length === 1) {
                const _ = c.value[0];
                await ut(_.path);
              } else {
                const _ = l?.path?.get();
                _?.path && await ut(_.path);
              }
            },
            enabled: () => !0
            // Her zaman aktif
          },
          {
            id: "copy-download-url",
            label: i("Copy Download URL"),
            action: async () => {
              if (c.value.length === 1) {
                const _ = c.value[0];
                l?.path?.get()?.storage;
                const k = e?.adapter?.getDownloadUrl({ path: _.path });
                k && await Na(k);
              }
            },
            enabled: () => c.value.length === 1 && c.value[0]?.type !== "dir"
          },
          { type: "separator" },
          {
            id: "rename",
            label: i("Rename"),
            action: () => {
              c.value.length === 1 && e?.modal?.open($t, { items: c.value });
            },
            enabled: () => c.value.length === 1 && o("rename")
          },
          {
            id: "delete",
            label: i("Delete"),
            action: () => {
              c.value.length > 0 && e?.modal?.open(kt, { items: c.value });
            },
            enabled: () => c.value.length > 0 && o("delete")
          }
        ]
      },
      {
        id: "view",
        label: i("View"),
        items: [
          {
            id: "refresh",
            label: i("Refresh"),
            action: () => {
              e.adapter.invalidateListQuery(l.path.get().path), e.adapter.open(l.path.get().path);
            },
            enabled: () => !0
          },
          { type: "separator" },
          {
            id: "grid-view",
            label: i("Grid View"),
            action: () => r?.set("view", "grid"),
            enabled: () => !0,
            checked: () => d.value?.view === "grid"
          },
          {
            id: "list-view",
            label: i("List View"),
            action: () => r?.set("view", "list"),
            enabled: () => !0,
            checked: () => d.value?.view === "list"
          },
          { type: "separator" },
          {
            id: "tree-view",
            label: i("Tree View"),
            action: () => r?.toggle("showTreeView"),
            enabled: () => !0,
            checked: () => d.value?.showTreeView
          },
          {
            id: "thumbnails",
            label: i("Show Thumbnails"),
            action: () => r?.toggle("showThumbnails"),
            enabled: () => !0,
            checked: () => d.value?.showThumbnails
          },
          {
            id: "show-hidden-files",
            label: i("Show Hidden Files"),
            action: () => r?.toggle("showHiddenFiles"),
            enabled: () => !0,
            checked: () => d.value?.showHiddenFiles
          },
          { type: "separator" },
          {
            id: "fullscreen",
            label: i("Full Screen"),
            action: () => r?.toggle("fullScreen"),
            enabled: () => o("fullscreen"),
            checked: () => d.value?.fullScreen
          },
          { type: "separator" },
          {
            id: "persist-path",
            label: i("Persist Path"),
            action: () => {
              r?.toggle("persist"), e.emitter.emit("vf-persist-path-saved");
            },
            enabled: () => !0,
            checked: () => d.value?.persist
          },
          {
            id: "metric-units",
            label: i("Metric Units"),
            action: () => {
              r?.toggle("metricUnits"), e.filesize = r?.get("metricUnits") ? kn : Bt, e.emitter.emit("vf-metric-units-saved");
            },
            enabled: () => !0,
            checked: () => d.value?.metricUnits
          }
        ]
      },
      {
        id: "go",
        label: i("Go"),
        items: [
          ...o("history") ? [
            {
              id: "forward",
              label: i("Forward"),
              action: () => {
                l?.goForward();
                const _ = l?.path?.get();
                _?.path && e?.adapter.open(_.path);
              },
              enabled: () => l?.canGoForward?.get() ?? !1
            },
            {
              id: "back",
              label: i("Back"),
              action: () => {
                l?.goBack();
                const _ = l?.path?.get();
                _?.path && e?.adapter.open(_.path);
              },
              enabled: () => l?.canGoBack?.get() ?? !1
            }
          ] : [],
          {
            id: "open-containing-folder",
            label: i("Open containing folder"),
            action: () => {
              const _ = l?.path?.get();
              if (_?.breadcrumb && _.breadcrumb.length > 1) {
                const x = _.breadcrumb[_.breadcrumb.length - 2]?.path ?? `${_.storage}://`;
                e?.adapter.open(x);
              }
            },
            enabled: () => {
              const _ = l?.path?.get();
              return _?.breadcrumb && _.breadcrumb.length > 1;
            }
          },
          { type: "separator" },
          // Dynamic storage list items will be added here
          ...(v.value || []).map((_) => ({
            id: `storage-${_}`,
            label: _,
            action: () => {
              const k = `${_}://`;
              e?.adapter.open(k);
            },
            enabled: () => !0
          })),
          { type: "separator" },
          {
            id: "go-to-folder",
            label: i("Go to Folder"),
            action: async () => {
              const _ = prompt(i("Enter folder path:"));
              if (_) {
                if (!_.includes("://")) {
                  alert(i("Invalid path format. Path must be in format: storage://path/to/folder"));
                  return;
                }
                const k = _.indexOf("://"), x = _.slice(0, k);
                if (!v.value || !v.value.includes(x)) {
                  alert(i('Invalid storage. Storage "%s" is not available.', x));
                  return;
                }
                try {
                  await e?.adapter.open(_);
                } catch (b) {
                  const D = Pe(b, i("Failed to navigate to folder"));
                  t.error(D), e.fs.setLoading(!1);
                }
              }
            },
            enabled: () => !0
          }
        ]
      },
      {
        id: "help",
        label: i("Help"),
        items: [
          {
            id: "settings",
            label: i("Settings"),
            action: () => e?.modal?.open(zn),
            enabled: () => !0
          },
          {
            id: "shortcuts",
            label: i("Shortcuts"),
            action: () => e?.modal?.open(_d),
            enabled: () => !0
          },
          {
            id: "about",
            label: i("About"),
            action: () => e?.modal?.open(Cn),
            enabled: () => !0
          }
        ]
      }
    ]), F = (_) => {
      f.value === _ ? m() : (f.value = _, w.value = !0);
    }, C = (_) => {
      w.value && (f.value = _);
    }, m = () => {
      f.value = null, w.value = !1;
    }, g = (_) => {
      m(), _();
    }, $ = (_) => {
      _.target.closest(".vuefinder__menubar") || m();
    };
    return fe(() => {
      document.addEventListener("click", $);
    }), ke(() => {
      document.removeEventListener("click", $);
    }), (_, k) => (u(), h("div", {
      class: "vuefinder__menubar",
      onClick: k[0] || (k[0] = ae(() => {
      }, ["stop"]))
    }, [
      s("div", hd, [
        (u(!0), h(ve, null, pe(S.value, (x) => (u(), h("div", {
          key: x.id,
          class: ne(["vuefinder__menubar__item", { "vuefinder__menubar__item--active": f.value === x.id }]),
          onClick: (b) => F(x.id),
          onMouseenter: (b) => C(x.id)
        }, [
          s("span", gd, y(x.label), 1),
          f.value === x.id ? (u(), h("div", {
            key: 0,
            class: "vuefinder__menubar__dropdown",
            onMouseenter: (b) => C(x.id)
          }, [
            (u(!0), h(ve, null, pe(x.items, (b) => (u(), h("div", {
              key: b.id || b.type,
              class: ne(["vuefinder__menubar__dropdown__item", {
                "vuefinder__menubar__dropdown__item--separator": b.type === "separator",
                "vuefinder__menubar__dropdown__item--disabled": b.enabled && !b.enabled(),
                "vuefinder__menubar__dropdown__item--checked": b.checked && b.checked()
              }]),
              onClick: ae((D) => b.type !== "separator" && b.enabled && b.enabled() ? g(b.action) : null, ["stop"])
            }, [
              b.type !== "separator" ? (u(), h("span", bd, y(b.label), 1)) : L("", !0),
              b.checked && b.checked() ? (u(), h("span", kd, " ✓ ")) : L("", !0)
            ], 10, yd))), 128))
          ], 40, wd)) : L("", !0)
        ], 42, md))), 128))
      ])
    ]));
  }
}), xd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  viewBox: "0 0 24 24"
};
function Sd(n, e) {
  return u(), h("svg", xd, [...e[0] || (e[0] = [
    s("path", { d: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" }, null, -1)
  ])]);
}
const Cd = { render: Sd }, Fd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function Pd(n, e) {
  return u(), h("svg", Fd, [...e[0] || (e[0] = [
    s("path", { d: "M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" }, null, -1)
  ])]);
}
const Dd = { render: Pd }, Td = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function Ed(n, e) {
  return u(), h("svg", Td, [...e[0] || (e[0] = [
    s("path", { d: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25zm0 9.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18zM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18z" }, null, -1)
  ])]);
}
const Md = { render: Ed }, Id = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function Ad(n, e) {
  return u(), h("svg", Id, [...e[0] || (e[0] = [
    s("path", { d: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75" }, null, -1)
  ])]);
}
const Od = { render: Ad }, zd = {
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24"
};
function Ld(n, e) {
  return u(), h("svg", zd, [...e[0] || (e[0] = [
    s("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "1.5",
      d: "M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707V17l-4 4v-6.586a1 1 0 0 0-.293-.707L3.293 7.293A1 1 0 0 1 3 6.586z"
    }, null, -1)
  ])]);
}
const Bd = { render: Ld }, Vd = { class: "vuefinder__toolbar" }, Rd = { class: "vuefinder__toolbar__actions" }, Ud = ["title"], Nd = ["title"], Hd = ["title"], Kd = ["title"], jd = ["title"], qd = ["title"], Gd = ["title"], Wd = { class: "vuefinder__toolbar__controls" }, Yd = ["title"], Qd = { class: "vuefinder__toolbar__control vuefinder__toolbar__dropdown-container" }, Xd = ["title"], Jd = { class: "relative" }, Zd = {
  key: 0,
  class: "vuefinder__toolbar__filter-indicator"
}, ec = {
  key: 0,
  class: "vuefinder__toolbar__dropdown"
}, tc = { class: "vuefinder__toolbar__dropdown-content" }, nc = { class: "vuefinder__toolbar__dropdown-section" }, oc = { class: "vuefinder__toolbar__dropdown-label" }, sc = { class: "vuefinder__toolbar__dropdown-row" }, ic = { value: "name" }, ac = { value: "size" }, rc = { value: "modified" }, lc = { value: "" }, dc = { value: "asc" }, cc = { value: "desc" }, uc = { class: "vuefinder__toolbar__dropdown-section" }, vc = { class: "vuefinder__toolbar__dropdown-label" }, fc = { class: "vuefinder__toolbar__dropdown-options" }, pc = { class: "vuefinder__toolbar__dropdown-option" }, _c = { class: "vuefinder__toolbar__option-text" }, hc = { class: "vuefinder__toolbar__dropdown-option" }, mc = { class: "vuefinder__toolbar__option-text" }, gc = { class: "vuefinder__toolbar__dropdown-option" }, wc = { class: "vuefinder__toolbar__option-text" }, yc = { class: "vuefinder__toolbar__dropdown-toggle" }, bc = {
  for: "showHidden",
  class: "vuefinder__toolbar__toggle-label"
}, kc = { class: "vuefinder__toolbar__dropdown-reset" }, $c = ["title"], xc = ["title"], Sc = /* @__PURE__ */ te({
  name: "VfToolbar",
  __name: "Toolbar",
  setup(n) {
    const e = ee(), { enabled: t } = ze(), { t: o } = e.i18n, i = e.fs, l = e.config, r = W(l.state), d = W(i.selectedItems), c = W(i.sort), v = W(i.filter);
    ie(
      () => r.value.fullScreen,
      () => {
        const m = document.querySelector("body");
        m && (m.style.overflow = r.value.fullScreen ? "hidden" : "");
      },
      { immediate: !0 }
    );
    const f = A(!1), w = (m) => {
      m.target.closest(".vuefinder__toolbar__dropdown-container") || (f.value = !1);
    };
    fe(() => {
      const m = document.querySelector("body");
      m && r.value.fullScreen && setTimeout(() => m.style.overflow = "hidden"), document.addEventListener("click", w);
    }), ke(() => {
      document.removeEventListener("click", w);
    });
    const p = A({
      sortBy: "name",
      // name | size | type | modified
      sortOrder: "",
      // '' | asc | desc (empty means no sorting)
      filterKind: "all",
      // all | files | folders
      showHidden: r.value.showHiddenFiles
      // Initialize with config store default
    });
    ie(
      () => p.value.sortBy,
      (m) => {
        if (!p.value.sortOrder) {
          i.clearSort();
          return;
        }
        m === "name" ? i.setSort("basename", p.value.sortOrder) : m === "size" ? i.setSort("file_size", p.value.sortOrder) : m === "modified" && i.setSort("last_modified", p.value.sortOrder);
      }
    ), ie(
      () => p.value.sortOrder,
      (m) => {
        if (!m) {
          i.clearSort();
          return;
        }
        p.value.sortBy === "name" ? i.setSort("basename", m) : p.value.sortBy === "size" ? i.setSort("file_size", m) : p.value.sortBy === "modified" && i.setSort("last_modified", m);
      }
    ), ie(
      c,
      (m) => {
        m.active ? (m.column === "basename" ? p.value.sortBy = "name" : m.column === "file_size" ? p.value.sortBy = "size" : m.column === "last_modified" && (p.value.sortBy = "modified"), p.value.sortOrder = m.order) : p.value.sortOrder = "";
      },
      { immediate: !0 }
    ), ie(
      () => p.value.filterKind,
      (m) => {
        i.setFilter(m, r.value.showHiddenFiles);
      }
    ), ie(
      () => p.value.showHidden,
      (m) => {
        l.set("showHiddenFiles", m), i.setFilter(p.value.filterKind, m);
      }
    ), ie(
      v,
      (m) => {
        p.value.filterKind = m.kind;
      },
      { immediate: !0 }
    ), ie(
      () => r.value.showHiddenFiles,
      (m) => {
        p.value.showHidden = m, i.setFilter(p.value.filterKind, m);
      },
      { immediate: !0 }
    );
    const S = () => l.set("view", r.value.view === "grid" ? "list" : "grid"), F = R(() => v.value.kind !== "all" || !r.value.showHiddenFiles || c.value.active), C = () => {
      p.value = {
        sortBy: "name",
        sortOrder: "",
        // No sorting by default
        filterKind: "all",
        showHidden: !0
        // Reset to default value
      }, l.set("showHiddenFiles", !0), i.clearSort(), i.clearFilter();
    };
    return (m, g) => (u(), h("div", Vd, [
      s("div", Rd, [
        a(t)("newfolder") ? (u(), h("div", {
          key: 0,
          class: "mx-1.5",
          title: a(o)("New Folder"),
          onClick: g[0] || (g[0] = ($) => a(e).modal.open(Yt, { items: a(d) }))
        }, [
          N(a(Ln))
        ], 8, Ud)) : L("", !0),
        a(t)("newfile") ? (u(), h("div", {
          key: 1,
          class: "mx-1.5",
          title: a(o)("New File"),
          onClick: g[1] || (g[1] = ($) => a(e).modal.open(Vn, { items: a(d) }))
        }, [
          N(a(Bn))
        ], 8, Nd)) : L("", !0),
        a(t)("rename") ? (u(), h("div", {
          key: 2,
          class: "mx-1.5",
          title: a(o)("Rename"),
          onClick: g[2] || (g[2] = ($) => a(d).length !== 1 || a(e).modal.open($t, { items: a(d) }))
        }, [
          N(a(Pn), {
            class: ne(a(d).length === 1 ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, Hd)) : L("", !0),
        a(t)("delete") ? (u(), h("div", {
          key: 3,
          class: "mx-1.5",
          title: a(o)("Delete"),
          onClick: g[3] || (g[3] = ($) => !a(d).length || a(e).modal.open(kt, { items: a(d) }))
        }, [
          N(a(Fn), {
            class: ne(a(d).length ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, Kd)) : L("", !0),
        a(t)("upload") ? (u(), h("div", {
          key: 4,
          class: "mx-1.5",
          title: a(o)("Upload"),
          onClick: g[4] || (g[4] = ($) => a(e).modal.open(Qt, { items: a(d) }))
        }, [
          N(a(Rn))
        ], 8, jd)) : L("", !0),
        a(t)("unarchive") && a(d).length === 1 && a(d)[0].mime_type === "application/zip" ? (u(), h("div", {
          key: 5,
          class: "mx-1.5",
          title: a(o)("Unarchive"),
          onClick: g[5] || (g[5] = ($) => !a(d).length || a(e).modal.open(Xt, { items: a(d) }))
        }, [
          N(a(Un), {
            class: ne(a(d).length ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, qd)) : L("", !0),
        a(t)("archive") ? (u(), h("div", {
          key: 6,
          class: "mx-1.5",
          title: a(o)("Archive"),
          onClick: g[6] || (g[6] = ($) => !a(d).length || a(e).modal.open(Jt, { items: a(d) }))
        }, [
          N(a(Nn), {
            class: ne(a(d).length ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, Gd)) : L("", !0)
      ]),
      s("div", Wd, [
        a(t)("search") ? (u(), h("div", {
          key: 0,
          class: "mx-1.5",
          title: a(o)("Search Files"),
          onClick: g[7] || (g[7] = ($) => a(e).modal.open(Wt))
        }, [
          N(a(Gt), { class: "vf-toolbar-icon text-(--vf-bg-primary)" })
        ], 8, Yd)) : L("", !0),
        s("div", Qd, [
          s("div", {
            title: a(o)("Filter"),
            class: "vuefinder__toolbar__dropdown-trigger",
            onClick: g[8] || (g[8] = ($) => f.value = !f.value)
          }, [
            s("div", Jd, [
              N(a(Bd), { class: "vf-toolbar-icon vuefinder__toolbar__icon h-6 w-6" }),
              F.value ? (u(), h("div", Zd)) : L("", !0)
            ])
          ], 8, Xd),
          f.value ? (u(), h("div", ec, [
            s("div", tc, [
              s("div", nc, [
                s("div", oc, y(a(o)("Sorting")), 1),
                s("div", sc, [
                  ue(s("select", {
                    "onUpdate:modelValue": g[9] || (g[9] = ($) => p.value.sortBy = $),
                    class: "vuefinder__toolbar__dropdown-select"
                  }, [
                    s("option", ic, y(a(o)("Name")), 1),
                    s("option", ac, y(a(o)("Size")), 1),
                    s("option", rc, y(a(o)("Date")), 1)
                  ], 512), [
                    [mt, p.value.sortBy]
                  ]),
                  ue(s("select", {
                    "onUpdate:modelValue": g[10] || (g[10] = ($) => p.value.sortOrder = $),
                    class: "vuefinder__toolbar__dropdown-select"
                  }, [
                    s("option", lc, y(a(o)("None")), 1),
                    s("option", dc, y(a(o)("Asc")), 1),
                    s("option", cc, y(a(o)("Desc")), 1)
                  ], 512), [
                    [mt, p.value.sortOrder]
                  ])
                ])
              ]),
              s("div", uc, [
                s("div", vc, y(a(o)("Show")), 1),
                s("div", fc, [
                  s("label", pc, [
                    ue(s("input", {
                      "onUpdate:modelValue": g[11] || (g[11] = ($) => p.value.filterKind = $),
                      type: "radio",
                      name: "filterKind",
                      value: "all",
                      class: "vuefinder__toolbar__radio"
                    }, null, 512), [
                      [Dt, p.value.filterKind]
                    ]),
                    s("span", _c, y(a(o)("All items")), 1)
                  ]),
                  s("label", hc, [
                    ue(s("input", {
                      "onUpdate:modelValue": g[12] || (g[12] = ($) => p.value.filterKind = $),
                      type: "radio",
                      name: "filterKind",
                      value: "files",
                      class: "vuefinder__toolbar__radio"
                    }, null, 512), [
                      [Dt, p.value.filterKind]
                    ]),
                    s("span", mc, y(a(o)("Files only")), 1)
                  ]),
                  s("label", gc, [
                    ue(s("input", {
                      "onUpdate:modelValue": g[13] || (g[13] = ($) => p.value.filterKind = $),
                      type: "radio",
                      name: "filterKind",
                      value: "folders",
                      class: "vuefinder__toolbar__radio"
                    }, null, 512), [
                      [Dt, p.value.filterKind]
                    ]),
                    s("span", wc, y(a(o)("Folders only")), 1)
                  ])
                ])
              ]),
              s("div", yc, [
                s("label", bc, y(a(o)("Show hidden files")), 1),
                ue(s("input", {
                  id: "showHidden",
                  "onUpdate:modelValue": g[14] || (g[14] = ($) => p.value.showHidden = $),
                  type: "checkbox",
                  class: "vuefinder__toolbar__checkbox"
                }, null, 512), [
                  [Ze, p.value.showHidden]
                ])
              ]),
              s("div", kc, [
                s("button", {
                  class: "vuefinder__toolbar__reset-button",
                  onClick: C
                }, y(a(o)("Reset")), 1)
              ])
            ])
          ])) : L("", !0)
        ]),
        a(t)("fullscreen") ? (u(), h("div", {
          key: 1,
          class: "mx-1.5",
          title: a(o)("Toggle Full Screen"),
          onClick: g[15] || (g[15] = ($) => a(l).toggle("fullScreen"))
        }, [
          a(r).fullScreen ? (u(), U(a(Dd), {
            key: 0,
            class: "vf-toolbar-icon"
          })) : (u(), U(a(Cd), {
            key: 1,
            class: "vf-toolbar-icon"
          }))
        ], 8, $c)) : L("", !0),
        s("div", {
          class: "mx-1.5",
          title: a(o)("Change View"),
          onClick: g[16] || (g[16] = ($) => S())
        }, [
          a(r).view === "grid" ? (u(), U(a(Md), {
            key: 0,
            class: "vf-toolbar-icon"
          })) : L("", !0),
          a(r).view === "list" ? (u(), U(a(Od), {
            key: 1,
            class: "vf-toolbar-icon"
          })) : L("", !0)
        ], 8, xc)
      ])
    ]));
  }
}), Cc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "vuefinder__breadcrumb__refresh-icon",
  viewBox: "-40 -40 580 580"
};
function Fc(n, e) {
  return u(), h("svg", Cc, [...e[0] || (e[0] = [
    s("path", { d: "M463.5 224h8.5c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2S461.9 48.1 455 55l-41.6 41.6c-87.6-86.5-228.7-86.2-315.8 1-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2S334.3 224 344 224z" }, null, -1)
  ])]);
}
const Pc = { render: Fc }, Dc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-0.5 rounded",
  viewBox: "0 0 20 20"
};
function Tc(n, e) {
  return u(), h("svg", Dc, [...e[0] || (e[0] = [
    s("path", {
      "fill-rule": "evenodd",
      d: "M5.293 9.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L11 7.414V15a1 1 0 1 1-2 0V7.414L6.707 9.707a1 1 0 0 1-1.414 0",
      class: "pointer-events-none",
      "clip-rule": "evenodd"
    }, null, -1)
  ])]);
}
const Ec = { render: Tc }, Mc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "vuefinder__breadcrumb__close-icon",
  viewBox: "0 0 24 24"
};
function Ic(n, e) {
  return u(), h("svg", Mc, [...e[0] || (e[0] = [
    s("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M6 18 18 6M6 6l12 12"
    }, null, -1)
  ])]);
}
const Ac = { render: Ic }, Oc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  viewBox: "0 0 20 20"
};
function zc(n, e) {
  return u(), h("svg", Oc, [...e[0] || (e[0] = [
    s("path", {
      d: "M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414z",
      class: "pointer-events-none"
    }, null, -1)
  ])]);
}
const Lc = { render: zc }, Bc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "w-6 h-6 cursor-pointer",
  viewBox: "0 0 24 24"
};
function Vc(n, e) {
  return u(), h("svg", Bc, [...e[0] || (e[0] = [
    s("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M6 18 18 6M6 6l12 12"
    }, null, -1)
  ])]);
}
const Rc = { render: Vc }, Uc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
function Nc(n, e) {
  return u(), h("svg", Uc, [...e[0] || (e[0] = [
    s("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    s("path", { d: "M9 6h11M12 12h8M15 18h5M5 6v.01M8 12v.01M11 18v.01" }, null, -1)
  ])]);
}
const Hc = { render: Nc }, Kc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24"
};
function jc(n, e) {
  return u(), h("svg", Kc, [...e[0] || (e[0] = [
    s("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M8 7h12m0 0-4-4m4 4-4 4m0 6H4m0 0 4 4m-4-4 4-4"
    }, null, -1)
  ])]);
}
const qc = { render: jc };
function pt(n, e = []) {
  const t = "vfDragEnterCounter", o = n.fs, i = W(o.selectedItems);
  function l(w, p) {
    return !!(!w || w.type !== "dir" || w.path.startsWith(p) || i.value.some((F) => F.path === p ? !1 : !!w.path.startsWith(F.path)));
  }
  function r(w, p) {
    if (w.isExternalDrag)
      return;
    if (!(n.features?.move ?? !1)) {
      w.dataTransfer && (w.dataTransfer.dropEffect = "none", w.dataTransfer.effectAllowed = "none");
      return;
    }
    w.preventDefault();
    const F = o.getDraggedItem();
    l(p, F) ? w.dataTransfer && (w.dataTransfer.dropEffect = "none", w.dataTransfer.effectAllowed = "none") : (w.dataTransfer && (w.dataTransfer.dropEffect = "copy", w.dataTransfer.effectAllowed = "all"), w.currentTarget.classList.add(...e));
  }
  function d(w) {
    if (w.isExternalDrag || !(n.features?.move ?? !1))
      return;
    w.preventDefault();
    const S = w.currentTarget, F = Number(S.dataset[t] || 0);
    S.dataset[t] = String(F + 1);
  }
  function c(w) {
    if (w.isExternalDrag || !(n.features?.move ?? !1))
      return;
    w.preventDefault();
    const S = w.currentTarget, C = Number(S.dataset[t] || 0) - 1;
    C <= 0 ? (delete S.dataset[t], S.classList.remove(...e)) : S.dataset[t] = String(C);
  }
  function v(w, p) {
    if (w.isExternalDrag || !(n.features?.move ?? !1) || !p) return;
    w.preventDefault();
    const F = w.currentTarget;
    delete F.dataset[t], F.classList.remove(...e);
    const C = w.dataTransfer?.getData("items") || "[]", g = JSON.parse(C).map(
      ($) => o.sortedFiles.get().find((_) => _.path === $)
    );
    o.clearDraggedItem(), n.modal.open(tt, { items: { from: g, to: p } });
  }
  function f(w) {
    return {
      dragover: (p) => r(p, w),
      dragenter: d,
      dragleave: c,
      drop: (p) => v(p, w)
    };
  }
  return { events: f };
}
const Gc = { class: "vuefinder__breadcrumb__container" }, Wc = ["title"], Yc = ["title"], Qc = ["title"], Xc = ["title"], Jc = { class: "vuefinder__breadcrumb__path-container" }, Zc = { class: "vuefinder__breadcrumb__list" }, eu = {
  key: 0,
  class: "vuefinder__breadcrumb__hidden-list"
}, tu = { class: "relative" }, nu = ["title", "onClick"], ou = ["title"], su = { class: "vuefinder__breadcrumb__path-mode" }, iu = { class: "vuefinder__breadcrumb__path-mode-content" }, au = ["title"], ru = { class: "vuefinder__breadcrumb__path-text" }, lu = ["title"], du = ["data-theme"], cu = ["onClick"], uu = { class: "vuefinder__breadcrumb__hidden-item-content" }, vu = { class: "vuefinder__breadcrumb__hidden-item-text" }, fu = /* @__PURE__ */ te({
  __name: "Breadcrumb",
  setup(n) {
    const e = ee(), t = De(e), { t: o } = e.i18n, i = e.fs, l = e.config, r = W(l.state), d = W(i.path), c = W(i.loading), v = A(null), f = En(0, 100), w = A(5), p = A(!1), S = A(!1), F = R(() => d.value?.breadcrumb ?? []);
    function C(I, T) {
      return I.length > T ? [I.slice(-T), I.slice(0, -T)] : [I, []];
    }
    const m = R(
      () => C(F.value, w.value)[0]
    ), g = R(
      () => C(F.value, w.value)[1]
    );
    ie(f, () => {
      if (!v.value) return;
      const I = v.value.children;
      let T = 0, P = 0;
      const z = 5, B = 1;
      w.value = z, Be(() => {
        for (let Y = I.length - 1; Y >= 0; Y--) {
          const le = I[Y];
          if (T + le.offsetWidth > f.value - 40)
            break;
          T += parseInt(le.offsetWidth.toString(), 10), P++;
        }
        P < B && (P = B), P > z && (P = z), w.value = P;
      });
    });
    const $ = () => {
      v.value && (f.value = v.value.offsetWidth);
    }, _ = A(null);
    fe(() => {
      _.value = new ResizeObserver($), v.value && _.value.observe(v.value);
    }), ke(() => {
      _.value && _.value.disconnect();
    });
    const k = pt(e, ["vuefinder__drag-over"]);
    function x(I = null) {
      I ??= F.value.length - 2;
      const T = {
        basename: d.value?.storage ?? "local",
        extension: "",
        path: (d.value?.storage ?? "local") + "://",
        storage: d.value?.storage ?? "local",
        type: "dir",
        file_size: null,
        last_modified: null,
        mime_type: null,
        visibility: ""
      };
      return F.value[I] ?? T;
    }
    const b = () => {
      e.adapter.invalidateListQuery(d.value.path), e.adapter.open(d.value.path);
    }, D = () => {
      m.value.length > 0 && e.adapter.open(
        F.value[F.value.length - 2]?.path ?? (d.value?.storage ?? "local") + "://"
      );
    }, E = (I) => {
      e.adapter.open(I.path), p.value = !1;
    }, V = () => {
      p.value && (p.value = !1);
    }, j = {
      mounted(I, T) {
        I.clickOutsideEvent = function(P) {
          I === P.target || I.contains(P.target) || T.value();
        }, document.body.addEventListener("click", I.clickOutsideEvent);
      },
      beforeUnmount(I) {
        document.body.removeEventListener("click", I.clickOutsideEvent);
      }
    }, O = () => {
      l.toggle("showTreeView");
    }, q = A({
      x: 0,
      y: 0
    }), M = (I, T = null) => {
      if (I.currentTarget instanceof HTMLElement) {
        const { x: P, y: z, height: B } = I.currentTarget.getBoundingClientRect();
        q.value = { x: P, y: z + B };
      }
      p.value = T ?? !p.value;
    }, X = () => {
      S.value = !S.value;
    }, G = async () => {
      await ut(d.value?.path || ""), t.success(o("Path copied to clipboard"));
    }, J = () => {
      S.value = !1;
    };
    return (I, T) => (u(), h("div", Gc, [
      s("span", {
        title: a(o)("Toggle Tree View")
      }, [
        N(a(Hc), {
          class: ne(["vuefinder__breadcrumb__toggle-tree", a(r).showTreeView ? "vuefinder__breadcrumb__toggle-tree--active" : ""]),
          onClick: O
        }, null, 8, ["class"])
      ], 8, Wc),
      s("span", {
        title: a(o)("Go up a directory")
      }, [
        N(a(Ec), Ae({
          class: F.value.length ? "vuefinder__breadcrumb__go-up--active" : "vuefinder__breadcrumb__go-up--inactive"
        }, He(F.value.length ? a(k).events(x()) : {}), { onClick: D }), null, 16, ["class"])
      ], 8, Yc),
      a(i).isLoading() ? (u(), h("span", {
        key: 1,
        title: a(o)("Cancel")
      }, [
        N(a(Ac), {
          onClick: T[0] || (T[0] = (P) => a(e).emitter.emit("vf-fetch-abort"))
        })
      ], 8, Xc)) : (u(), h("span", {
        key: 0,
        title: a(o)("Refresh")
      }, [
        N(a(Pc), { onClick: b })
      ], 8, Qc)),
      ue(s("div", Jc, [
        s("div", null, [
          N(a(Lc), Ae({ class: "vuefinder__breadcrumb__home-icon" }, He(a(k).events(x(-1))), {
            onClick: T[1] || (T[1] = ae((P) => a(e).adapter.open(a(d).storage + "://"), ["stop"]))
          }), null, 16)
        ]),
        s("div", Zc, [
          g.value.length ? ue((u(), h("div", eu, [
            T[3] || (T[3] = s("div", { class: "vuefinder__breadcrumb__separator" }, "/", -1)),
            s("div", tu, [
              s("span", {
                class: "vuefinder__breadcrumb__hidden-toggle",
                onDragenter: T[2] || (T[2] = (P) => M(P, !0)),
                onClick: ae(M, ["stop"])
              }, [
                N(a(On), { class: "vuefinder__breadcrumb__hidden-toggle-icon" })
              ], 32)
            ])
          ])), [
            [j, V]
          ]) : L("", !0)
        ]),
        s("div", {
          ref_key: "breadcrumbContainer",
          ref: v,
          class: "vuefinder__breadcrumb__visible-list pointer-events-none"
        }, [
          (u(!0), h(ve, null, pe(m.value, (P, z) => (u(), h("div", { key: z }, [
            T[4] || (T[4] = s("span", { class: "vuefinder__breadcrumb__separator" }, "/", -1)),
            s("span", Ae({
              class: "vuefinder__breadcrumb__item pointer-events-auto",
              title: P.basename
            }, He(a(k).events(P), !0), {
              onClick: ae((B) => a(e).adapter.open(P.path), ["stop"])
            }), y(P.name), 17, nu)
          ]))), 128))
        ], 512),
        a(l).get("loadingIndicator") === "circular" && a(c) ? (u(), U(a(Ct), { key: 0 })) : L("", !0),
        s("span", {
          title: a(o)("Toggle Path Copy Mode"),
          onClick: X
        }, [
          N(a(qc), { class: "vuefinder__breadcrumb__toggle-icon" })
        ], 8, ou)
      ], 512), [
        [Ue, !S.value]
      ]),
      ue(s("div", su, [
        s("div", iu, [
          s("div", {
            title: a(o)("Copy Path")
          }, [
            N(a(Ut), {
              class: "vuefinder__breadcrumb__copy-icon",
              onClick: G
            })
          ], 8, au),
          s("div", ru, y(a(d).path), 1),
          s("div", {
            title: a(o)("Exit")
          }, [
            N(a(Rc), {
              class: "vuefinder__breadcrumb__exit-icon",
              onClick: J
            })
          ], 8, lu)
        ])
      ], 512), [
        [Ue, S.value]
      ]),
      (u(), U(bt, { to: "body" }, [
        s("div", null, [
          ue(s("div", {
            style: Oe({
              position: "absolute",
              top: q.value.y + "px",
              left: q.value.x + "px"
            }),
            class: "vuefinder__themer vuefinder__breadcrumb__hidden-dropdown",
            "data-theme": a(e).theme.current
          }, [
            (u(!0), h(ve, null, pe(g.value, (P, z) => (u(), h("div", Ae({
              key: z,
              class: "vuefinder__breadcrumb__hidden-item"
            }, He(a(k).events(P), !0), {
              onClick: (B) => E(P)
            }), [
              s("div", uu, [
                s("span", null, [
                  N(a(Ve), { class: "vuefinder__breadcrumb__hidden-item-icon" })
                ]),
                s("span", vu, y(P.name), 1)
              ])
            ], 16, cu))), 128))
          ], 12, du), [
            [Ue, p.value]
          ])
        ])
      ]))
    ]));
  }
}), pu = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24"
};
function _u(n, e) {
  return u(), h("svg", pu, [...e[0] || (e[0] = [
    s("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"
    }, null, -1)
  ])]);
}
const cn = { render: _u }, hu = { class: "vuefinder__drag-item__container" }, mu = { class: "vuefinder__drag-item__count" }, gu = /* @__PURE__ */ te({
  __name: "DragItem",
  props: {
    count: {}
  },
  setup(n) {
    const e = n;
    return (t, o) => (u(), h("div", hu, [
      e.count > 1 ? (u(), U(a(cn), {
        key: 0,
        class: "vuefinder__drag-item__icon translate-x-1 translate-y-1"
      })) : L("", !0),
      N(a(cn), { class: "vuefinder__drag-item__icon" }),
      s("div", mu, y(e.count), 1)
    ]));
  }
}), wu = {
  key: 2,
  class: "vuefinder__item-icon__extension"
}, un = /* @__PURE__ */ te({
  __name: "ItemIcon",
  props: {
    item: {},
    ext: { type: Boolean },
    small: { type: Boolean },
    view: {}
  },
  setup(n) {
    const e = n, t = ee(), o = W(t.config.state), i = R(() => e.small !== void 0 ? e.small ? "small" : "large" : e.view === "list" ? "small" : "large"), l = R(() => {
      const d = i.value, c = o.value?.listIconSize, v = o.value?.gridIconSize;
      return o.value?.gridItemWidth, o.value?.gridItemHeight, e.view === "list" || d === "small" ? {
        "--vf-icon-size": `${c ?? 16}px`
      } : {
        "--vf-icon-size": `${v ?? 48}px`
      };
    }), r = {
      app: t,
      config: o.value,
      item: e.item,
      view: e.view
    };
    return (d, c) => (u(), h("div", {
      class: ne(["vuefinder__item-icon", {
        "vuefinder__item-icon--small": i.value === "small",
        "vuefinder__item-icon--large": i.value === "large",
        "vuefinder__item-icon--grid": n.view === "grid",
        "vuefinder__item-icon--list": n.view === "list"
      }]),
      style: Oe(l.value)
    }, [
      xe(d.$slots, "icon", Ke(je(r)), () => [
        n.item.type === "dir" ? (u(), U(a(Ve), {
          key: 0,
          class: "vuefinder__item-icon__folder"
        })) : (u(), U(a(ct), {
          key: 1,
          class: "vuefinder__item-icon__file"
        })),
        n.ext && n.item.type !== "dir" && n.item.extension ? (u(), h("div", wu, y(n.item.extension.substring(0, 3)), 1)) : L("", !0)
      ])
    ], 6));
  }
}), yu = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  viewBox: "0 0 24 24"
};
function bu(n, e) {
  return u(), h("svg", yu, [...e[0] || (e[0] = [
    s("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    s("path", { d: "M12 2a5 5 0 0 1 5 5v3a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3V7a5 5 0 0 1 5-5m0 12a2 2 0 0 0-1.995 1.85L10 16a2 2 0 1 0 2-2m0-10a3 3 0 0 0-3 3v3h6V7a3 3 0 0 0-3-3" }, null, -1)
  ])]);
}
const vn = { render: bu }, ku = ["data-key", "data-row", "data-col", "draggable"], $u = { key: 0 }, xu = { class: "vuefinder__explorer__item-grid-content" }, Su = ["data-src", "alt"], Cu = { class: "vuefinder__explorer__item-title" }, Fu = {
  key: 1,
  class: "vuefinder__explorer__item-list-content"
}, Pu = { class: "vuefinder__explorer__item-list-name" }, Du = { class: "vuefinder__explorer__item-list-icon" }, Tu = { class: "vuefinder__explorer__item-name" }, Eu = {
  key: 0,
  class: "vuefinder__explorer__item-path"
}, Mu = {
  key: 1,
  class: "vuefinder__explorer__item-size"
}, Iu = { key: 0 }, Au = {
  key: 2,
  class: "vuefinder__explorer__item-date"
}, Ou = /* @__PURE__ */ te({
  __name: "FileItem",
  props: {
    item: {},
    view: {},
    showThumbnails: { type: Boolean },
    isSelected: { type: Boolean },
    isDragging: { type: Boolean },
    rowIndex: {},
    colIndex: {},
    showPath: { type: Boolean },
    explorerId: {}
  },
  emits: ["click", "dblclick", "contextmenu", "dragstart", "dragend"],
  setup(n, { emit: e }) {
    const t = n, o = e, i = ee(), l = i.fs, r = i.config, d = R(() => {
      const O = i.selectionFilterType;
      return !O || O === "both" ? !0 : O === "files" && t.item.type === "file" || O === "dirs" && t.item.type === "dir";
    }), c = R(() => {
      const O = i.selectionFilterMimeIncludes;
      return !O || !O.length || t.item.type === "dir" ? !0 : t.item.mime_type ? O.some((q) => t.item.mime_type?.startsWith(q)) : !1;
    }), v = R(() => d.value && c.value), f = R(() => [
      "file-item-" + t.explorerId,
      t.view === "grid" ? "vf-explorer-item-grid" : "vf-explorer-item-list",
      t.isSelected ? "vf-explorer-selected" : "",
      v.value ? "" : "vf-explorer-item--unselectable"
    ]), w = R(() => ({
      opacity: t.isDragging || l.isCut(t.item.path) || !v.value ? 0.5 : ""
    })), p = A(null);
    let S = !1, F = null, C = null, m = !1;
    const { enabled: g } = ze(), $ = typeof window < "u" && ("ontouchstart" in window || navigator.maxTouchPoints > 0), _ = R(() => $ ? !1 : g("move")), k = () => {
      F && (clearTimeout(F), F = null), C = null;
    }, x = (O) => {
      k(), C = O, m = !1, O.stopPropagation(), F = setTimeout(() => {
        !C || F === null || (m = !0, C.cancelable && C.preventDefault(), C.stopPropagation(), o("contextmenu", C), k());
      }, 500);
    }, b = (O) => {
      if (m) {
        O.preventDefault(), O.stopPropagation(), k();
        return;
      }
      setTimeout(() => {
        m || (k(), j(O));
      }, 100);
    }, D = (O) => {
      if (!C) return;
      const q = C.touches[0] || C.changedTouches[0], M = O.touches[0] || O.changedTouches[0];
      if (q && M) {
        const X = Math.abs(M.clientX - q.clientX), G = Math.abs(M.clientY - q.clientY);
        (X > 15 || G > 15) && k();
      }
    }, E = (O) => {
      $ && O.type !== "click" || o("click", O);
    }, V = (O) => {
      if (m)
        return O.preventDefault(), O.stopPropagation(), !1;
      o("dragstart", O);
    }, j = (O) => {
      if (!S)
        S = !0, o("click", O), p.value = setTimeout(() => {
          S = !1;
        }, 300);
      else
        return S = !1, o("dblclick", O), !1;
    };
    return (O, q) => (u(), h("div", {
      class: ne(f.value),
      style: Oe(w.value),
      "data-key": n.item.path,
      "data-row": n.rowIndex,
      "data-col": n.colIndex,
      draggable: _.value,
      onTouchstartCapture: q[1] || (q[1] = (M) => x(M)),
      onTouchendCapture: q[2] || (q[2] = (M) => b(M)),
      onTouchmoveCapture: D,
      onTouchcancelCapture: q[3] || (q[3] = () => k()),
      onClick: E,
      onDblclick: q[4] || (q[4] = (M) => o("dblclick", M)),
      onContextmenu: q[5] || (q[5] = ae((M) => o("contextmenu", M), ["prevent", "stop"])),
      onDragstart: V,
      onDragend: q[6] || (q[6] = (M) => o("dragend", M))
    }, [
      n.view === "grid" ? (u(), h("div", $u, [
        a(l).isReadOnly(n.item) ? (u(), U(a(vn), {
          key: 0,
          class: "vuefinder__item--readonly vuefinder__item--readonly--left",
          title: "Read Only"
        })) : L("", !0),
        s("div", xu, [
          (n.item.mime_type ?? "").startsWith("image") && n.showThumbnails ? (u(), h("img", {
            key: 0,
            src: "data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
            class: "vuefinder__explorer__item-thumbnail lazy",
            "data-src": n.item.previewUrl ?? a(i).adapter.getPreviewUrl({ path: n.item.path }),
            alt: n.item.basename,
            onTouchstart: q[0] || (q[0] = (M) => M.preventDefault())
          }, null, 40, Su)) : (u(), U(un, {
            key: 1,
            item: n.item,
            ext: !0,
            view: n.view
          }, {
            icon: se((M) => [
              xe(O.$slots, "icon", Ke(je(M)))
            ]),
            _: 3
          }, 8, ["item", "view"]))
        ]),
        s("span", Cu, y(a(Ot)(n.item.basename)), 1)
      ])) : (u(), h("div", Fu, [
        s("div", Pu, [
          s("div", Du, [
            N(un, {
              item: n.item,
              view: n.view
            }, {
              icon: se((M) => [
                xe(O.$slots, "icon", Ke(je(M)))
              ]),
              _: 3
            }, 8, ["item", "view"])
          ]),
          s("span", Tu, y(n.item.basename), 1),
          s("div", null, [
            a(l).isReadOnly(n.item) ? (u(), U(a(vn), {
              key: 0,
              class: "vuefinder__item--readonly vuefinder__item--readonly--list",
              title: "Read Only"
            })) : L("", !0)
          ])
        ]),
        n.showPath ? (u(), h("div", Eu, y(n.item.path), 1)) : L("", !0),
        n.showPath ? L("", !0) : (u(), h("div", Mu, [
          n.item.file_size ? (u(), h("div", Iu, y(a(i).filesize(n.item.file_size)), 1)) : L("", !0)
        ])),
        !n.showPath && n.item.last_modified ? (u(), h("div", Au, y(new Date(n.item.last_modified * 1e3).toLocaleString()), 1)) : L("", !0)
      ])),
      a(g)("pinned") && a(r).get("pinnedFolders").find((M) => M.path === n.item.path) ? (u(), U(a(Nt), {
        key: 2,
        class: "vuefinder__item--pinned"
      })) : L("", !0)
    ], 46, ku));
  }
}), zu = ["data-row"], fn = /* @__PURE__ */ te({
  __name: "FileRow",
  props: {
    rowIndex: {},
    rowHeight: {},
    view: {},
    itemsPerRow: {},
    items: {},
    showThumbnails: { type: Boolean },
    showPath: { type: Boolean },
    isDraggingItem: { type: Function },
    isSelected: { type: Function },
    dragNDropEvents: { type: Function },
    explorerId: {}
  },
  emits: ["click", "dblclick", "contextmenu", "dragstart", "dragend"],
  setup(n, { emit: e }) {
    const t = n, o = e, i = R(() => [
      t.view === "grid" ? "vf-explorer-item-grid-row" : "vf-explorer-item-list-row",
      "pointer-events-none"
    ]), l = R(() => ({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: `${t.rowHeight}px`,
      transform: `translateY(${t.rowIndex * t.rowHeight}px)`
    })), r = R(() => t.view === "grid" ? {
      gridTemplateColumns: `repeat(${t.itemsPerRow || 1}, 1fr)`
    } : {
      gridTemplateColumns: "1fr"
    });
    return (d, c) => (u(), h("div", {
      class: ne(i.value),
      "data-row": n.rowIndex,
      style: Oe(l.value)
    }, [
      s("div", {
        class: ne(["grid justify-self-start", { "w-full": n.view === "list" }]),
        style: Oe(r.value)
      }, [
        (u(!0), h(ve, null, pe(n.items, (v, f) => (u(), U(Ou, Ae({
          key: v.path,
          item: v,
          view: n.view,
          "show-thumbnails": n.showThumbnails,
          "show-path": n.showPath,
          "is-selected": n.isSelected(v.path),
          "is-dragging": n.isDraggingItem(v.path),
          "row-index": n.rowIndex,
          "col-index": f,
          "explorer-id": n.explorerId
        }, He(n.dragNDropEvents(v)), {
          onClick: c[0] || (c[0] = (w) => o("click", w)),
          onDblclick: c[1] || (c[1] = (w) => o("dblclick", w)),
          onContextmenu: c[2] || (c[2] = (w) => o("contextmenu", w)),
          onDragstart: c[3] || (c[3] = (w) => o("dragstart", w)),
          onDragend: c[4] || (c[4] = (w) => o("dragend", w))
        }), {
          icon: se((w) => [
            xe(d.$slots, "icon", Ae({ ref_for: !0 }, w))
          ]),
          _: 3
        }, 16, ["item", "view", "show-thumbnails", "show-path", "is-selected", "is-dragging", "row-index", "col-index", "explorer-id"]))), 128))
      ], 6)
    ], 14, zu));
  }
}), Lu = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  viewBox: "0 0 20 20"
};
function Bu(n, e) {
  return u(), h("svg", Lu, [...e[0] || (e[0] = [
    s("path", {
      "fill-rule": "evenodd",
      d: "M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414",
      "clip-rule": "evenodd"
    }, null, -1)
  ])]);
}
const Vu = { render: Bu }, Ru = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  viewBox: "0 0 20 20"
};
function Uu(n, e) {
  return u(), h("svg", Ru, [...e[0] || (e[0] = [
    s("path", {
      "fill-rule": "evenodd",
      d: "M14.707 12.707a1 1 0 0 1-1.414 0L10 9.414l-3.293 3.293a1 1 0 0 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414",
      "clip-rule": "evenodd"
    }, null, -1)
  ])]);
}
const Nu = { render: Uu }, Mt = /* @__PURE__ */ te({
  __name: "SortIcon",
  props: {
    direction: {}
  },
  setup(n) {
    return (e, t) => (u(), h("div", null, [
      n.direction === "asc" ? (u(), U(a(Vu), {
        key: 0,
        class: "vuefinder__explorer__sort-icon"
      })) : L("", !0),
      n.direction === "desc" ? (u(), U(a(Nu), {
        key: 1,
        class: "vuefinder__explorer__sort-icon"
      })) : L("", !0)
    ]));
  }
}), Hu = { class: "vuefinder__explorer__header" }, Ku = /* @__PURE__ */ te({
  __name: "ExplorerHeader",
  setup(n) {
    const e = ee(), t = e.fs, { t: o } = e.i18n, i = W(t.sort);
    return (l, r) => (u(), h("div", Hu, [
      s("div", {
        class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--name vf-sort-button",
        onClick: r[0] || (r[0] = (d) => a(t).toggleSort("basename"))
      }, [
        ce(y(a(o)("Name")) + " ", 1),
        ue(N(Mt, {
          direction: a(i).order
        }, null, 8, ["direction"]), [
          [Ue, a(i).active && a(i).column === "basename"]
        ])
      ]),
      s("div", {
        class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--size vf-sort-button",
        onClick: r[1] || (r[1] = (d) => a(t).toggleSort("file_size"))
      }, [
        ce(y(a(o)("Size")) + " ", 1),
        ue(N(Mt, {
          direction: a(i).order
        }, null, 8, ["direction"]), [
          [Ue, a(i).active && a(i).column === "file_size"]
        ])
      ]),
      s("div", {
        class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--date vf-sort-button",
        onClick: r[2] || (r[2] = (d) => a(t).toggleSort("last_modified"))
      }, [
        ce(y(a(o)("Date")) + " ", 1),
        ue(N(Mt, {
          direction: a(i).order
        }, null, 8, ["direction"]), [
          [Ue, a(i).active && a(i).column === "last_modified"]
        ])
      ])
    ]));
  }
});
function ju(n, e) {
  const {
    scrollContainer: t,
    itemWidth: o = 100,
    rowHeight: i,
    overscan: l = 2,
    containerPadding: r = 48,
    lockItemsPerRow: d
  } = e, c = n, v = () => typeof i == "number" ? i : i.value, f = () => o ? typeof o == "number" ? o : o.value : 100, w = () => r ? typeof r == "number" ? r : r.value : 0, p = A(0), S = A(6), F = A(600);
  let C = null;
  const m = R(() => Math.ceil(c.value.length / S.value)), g = R(() => m.value * v()), $ = R(() => {
    const O = v(), q = Math.max(0, Math.floor(p.value / O) - l), M = Math.min(
      m.value,
      Math.ceil((p.value + F.value) / O) + l
    );
    return { start: q, end: M };
  }), _ = R(() => {
    const { start: O, end: q } = $.value;
    return Array.from({ length: q - O }, (M, X) => O + X);
  }), k = () => F.value, x = () => typeof d == "object" ? d.value : !1, b = () => {
    if (x()) {
      S.value = 1;
      return;
    }
    if (t.value) {
      const O = w(), q = t.value.clientWidth - O, M = f();
      M > 0 && (S.value = Math.max(Math.floor(q / M), 2));
    }
  }, D = (O) => {
    const q = O.target;
    p.value = q.scrollTop;
  };
  ie(
    () => c.value.length,
    () => {
      b();
    }
  ), o && typeof o != "number" && ie(o, () => {
    b();
  }), r && typeof r != "number" && ie(r, () => {
    b();
  }), i && typeof i != "number" && ie(i, () => {
  });
  const E = (O, q) => {
    if (!O || !Array.isArray(O))
      return [];
    const M = q * S.value;
    return O.slice(M, M + S.value);
  }, V = (O, q, M, X, G) => {
    if (!O || !Array.isArray(O))
      return [];
    const J = [];
    for (let I = q; I <= M; I++)
      for (let T = X; T <= G; T++) {
        const P = I * S.value + T;
        P < O.length && O[P] && J.push(O[P]);
      }
    return J;
  }, j = (O) => ({
    row: Math.floor(O / S.value),
    col: O % S.value
  });
  return fe(async () => {
    await Be(), t.value && (F.value = t.value.clientHeight || 600), b(), window.addEventListener("resize", () => {
      t.value && (F.value = t.value.clientHeight || 600), b();
    }), t.value && "ResizeObserver" in window && (C = new ResizeObserver((O) => {
      const q = O[0];
      q && (F.value = Math.round(q.contentRect.height)), b();
    }), C.observe(t.value));
  }), ke(() => {
    window.removeEventListener("resize", b), C && (C.disconnect(), C = null);
  }), {
    scrollTop: p,
    itemsPerRow: S,
    totalRows: m,
    totalHeight: g,
    visibleRange: $,
    visibleRows: _,
    updateItemsPerRow: b,
    handleScroll: D,
    getRowItems: E,
    getItemsInRange: V,
    getItemPosition: j,
    getContainerHeight: k
  };
}
function qu(n) {
  const {
    itemsPerRow: e,
    totalHeight: t,
    getItemsInRange: o,
    getKey: i,
    selectionObject: l,
    rowHeight: r,
    itemWidth: d,
    osInstance: c
  } = n, v = () => typeof d == "number" ? d : d.value, f = Math.floor(Math.random() * 2 ** 32).toString(), w = ee(), p = w.fs, S = W(p.selectedKeys), F = W(p.sortedFiles), C = R(() => {
    const T = /* @__PURE__ */ new Map();
    return F.value && F.value.forEach((P) => {
      T.set(i(P), P);
    }), T;
  }), m = A(/* @__PURE__ */ new Set()), g = A(!1), $ = A(!1), _ = (T) => T.map((P) => P.getAttribute("data-key")).filter((P) => !!P), k = (T) => {
    T.selection.clearSelection(!0, !0);
  }, x = (T) => {
    if (S.value && S.value.size > 0) {
      const P = document.querySelectorAll(`.file-item-${f}[data-key]`), z = /* @__PURE__ */ new Map();
      P.forEach((Y) => {
        const le = Y.getAttribute("data-key");
        le && z.set(le, Y);
      });
      const B = [];
      S.value.forEach((Y) => {
        const le = z.get(Y);
        le && b(Y) && B.push(le);
      }), B.forEach((Y) => {
        T.selection.select(Y, !0);
      });
    }
  }, b = (T) => {
    const P = C.value.get(T);
    if (!P) return !1;
    const z = w.selectionFilterType, B = w.selectionFilterMimeIncludes;
    return z === "files" && P.type === "dir" || z === "dirs" && P.type === "file" ? !1 : B && Array.isArray(B) && B.length > 0 ? P.type === "dir" ? !0 : P.mime_type ? B.some((Y) => P.mime_type?.startsWith(Y)) : !1 : !0;
  }, D = (T) => {
    if (w.selectionMode === "single")
      return !1;
    g.value = !1, !T.event?.metaKey && !T.event?.ctrlKey && ($.value = !0), T.selection.resolveSelectables(), k(T), x(T);
  }, E = A(0), V = ({ event: T, selection: P }) => {
    E.value = (l.value?.getAreaLocation().y1 ?? 0) - (w.root.getBoundingClientRect().top ?? 0);
    const z = document.querySelector(
      ".selection-area-container"
    );
    if (z && (z.dataset.theme = w.theme.current), w.selectionMode === "single")
      return;
    const B = T;
    B && "type" in B && B.type === "touchend" && B.preventDefault();
    const Y = T;
    !Y?.ctrlKey && !Y?.metaKey && (p.clearSelection(), P.clearSelection(!0, !0)), m.value.clear();
  }, j = (T) => {
    if (w.selectionMode === "single")
      return;
    const P = _(T.store.changed.added), z = _(T.store.changed.removed);
    $.value = !1, g.value = !0, P.forEach((B) => {
      S.value && !S.value.has(B) && b(B) && (m.value.add(B), p.select(B, w.selectionMode || "multiple"));
    }), z.forEach((B) => {
      document.querySelector(`[data-key="${B}"]`) && C.value.has(B) && m.value.delete(B), p.deselect(B);
    }), T.selection.resolveSelectables(), x(T);
  }, O = () => {
    m.value.clear();
  }, q = (T) => {
    if (!T.event)
      return;
    const P = document.querySelector(".scroller-" + f);
    if (!P)
      return;
    const z = P.getBoundingClientRect(), B = z.left, Y = z.top;
    let le = P.scrollTop;
    if (c?.value) {
      const { viewport: Re } = c.value.elements();
      Re && (le = Re.scrollTop);
    }
    const _e = l.value?.getAreaLocation();
    if (!_e)
      return;
    const $e = Math.min(_e.x1, _e.x2), ge = le + Math.min(_e.y1, _e.y2), Ye = Math.max(_e.x1, _e.x2), qe = le + Math.max(_e.y1, _e.y2), we = 4, Z = v();
    let de = Math.floor(($e - B - we) / Z), re = Math.floor((Ye - B - we) / Z);
    const ye = $e - B - we - de * Z, Qe = Ye - B - we - re * Z;
    ye > Z - we && (de = de + 1), Qe < we && (re = re - 1);
    const Zt = Math.max(0, de), H = Math.min(e.value - 1, re);
    let K = Math.floor((ge - Y - we) / r.value), Q = Math.floor((qe - Y - we) / r.value);
    const oe = ge - Y - we - K * r.value, Le = qe - Y - we - Q * r.value, Ee = Math.floor((t.value - we) / r.value);
    oe > r.value - we && (K = K + 1), Le < we && (Q = Q - 1);
    const Ie = Math.max(0, K), nt = Math.min(Q, Ee), Se = o(
      F.value,
      Ie,
      nt,
      Zt,
      H
    ), Ft = document.querySelectorAll(`.file-item-${f}[data-key]`), en = /* @__PURE__ */ new Map();
    Ft.forEach((Re) => {
      const ot = Re.getAttribute("data-key");
      ot && en.set(ot, Re);
    });
    const Pt = [];
    if (Se.forEach((Re) => {
      const ot = i(Re);
      en.get(ot) || Pt.push(ot);
    }), Pt.length > 0) {
      const Re = w.selectionMode || "multiple";
      p.selectMultiple(Pt, Re);
    }
  }, M = (T) => {
    q(T), k(T), x(T), p.setSelectedCount(S.value?.size || 0), g.value = !1;
  }, X = () => {
    let T = [".scroller-" + f];
    if (c?.value) {
      const { viewport: P } = c.value.elements();
      P && (T = P);
    }
    l.value = new io({
      selectables: [".file-item-" + f + ":not(.vf-explorer-item--unselectable)"],
      boundaries: T,
      selectionContainerClass: "selection-area-container",
      behaviour: {
        overlap: "invert",
        intersect: "touch",
        startThreshold: 0,
        triggers: [0],
        scrolling: {
          speedDivider: 10,
          manualSpeed: 750,
          startScrollMargins: { x: 0, y: 10 }
        }
      },
      features: {
        touch: !0,
        range: !0,
        deselectOnBlur: !0,
        singleTap: {
          allow: !1,
          intersect: "native"
        }
      }
    }), l.value.on("beforestart", D), l.value.on("start", V), l.value.on("move", j), l.value.on("stop", M);
  }, G = () => {
    l.value && (l.value.destroy(), l.value = null);
  }, J = () => {
    l.value && (Array.from(
      S.value ?? /* @__PURE__ */ new Set()
    ).forEach((P) => {
      b(P) || p.deselect(P);
    }), G(), X());
  }, I = (T) => {
    $.value && (l.value?.clearSelection(), O(), $.value = !1);
    const P = T;
    !m.value.size && !$.value && !P?.ctrlKey && !P?.metaKey && (p.clearSelection(), l.value?.clearSelection());
  };
  return fe(() => {
    const T = (P) => {
      !P.buttons && g.value && (g.value = !1);
    };
    document.addEventListener("dragleave", T), ke(() => {
      document.removeEventListener("dragleave", T);
    });
  }), {
    explorerId: f,
    isDragging: g,
    initializeSelectionArea: X,
    updateSelectionArea: J,
    handleContentClick: I
  };
}
function Gu(n) {
  const e = (o) => {
    if (!o)
      return { typeAllowed: !1, mimeAllowed: !1 };
    const i = n.selectionFilterType, l = n.selectionFilterMimeIncludes, r = !i || i === "both" || i === "files" && o.type === "file" || i === "dirs" && o.type === "dir";
    let d = !0;
    return l && Array.isArray(l) && l.length > 0 && (o.type === "dir" ? d = !0 : o.mime_type ? d = l.some((c) => o.mime_type.startsWith(c)) : d = !1), { typeAllowed: r, mimeAllowed: d };
  };
  return {
    isItemSelectable: e,
    canSelectItem: (o) => {
      const { typeAllowed: i, mimeAllowed: l } = e(o);
      return i && l;
    }
  };
}
function Wu(n) {
  const e = (o) => ({
    item: o,
    defaultPrevented: !1,
    preventDefault() {
      this.defaultPrevented = !0;
    }
  });
  return {
    createCancelableEvent: e,
    openItem: (o, i, l) => {
      const r = e(o);
      if (o.type === "file" && i) {
        if (n.emitter.emit("vf-file-dclick", r), r.defaultPrevented) return;
      } else if (o.type === "dir" && l && (n.emitter.emit("vf-folder-dclick", r), r.defaultPrevented))
        return;
      const d = n.contextMenuItems?.find((c) => c.show(n, {
        items: [o],
        target: o,
        searchQuery: ""
      }));
      d && d.action(n, [o]);
    }
  };
}
function Yu(n, e, t, o, i, l, r) {
  const d = n.fs, { canSelectItem: c } = Gu(n), { openItem: v } = Wu(n), f = (m) => {
    const g = m.target?.closest(".file-item-" + e);
    if (!g) return null;
    const $ = String(g.getAttribute("data-key")), _ = t.value?.find((k) => k.path === $);
    return { key: $, item: _ };
  }, w = () => {
    const m = o.value;
    return t.value?.filter((g) => m?.has(g.path)) || [];
  };
  return {
    handleItemClick: (m) => {
      const g = f(m);
      if (!g) return;
      const { key: $, item: _ } = g, k = m;
      if (!c(_))
        return;
      const x = n.selectionMode || "multiple";
      !k?.ctrlKey && !k?.metaKey && (m.type !== "touchstart" || !d.isSelected($)) && (d.clearSelection(), i.value?.clearSelection(!0, !0)), i.value?.resolveSelectables(), m.type === "touchstart" && d.isSelected($) ? d.select($, x) : d.toggleSelect($, x), d.setSelectedCount(o.value?.size || 0);
    },
    handleItemDblClick: (m) => {
      const g = f(m);
      if (!g) return;
      const { item: $ } = g;
      c($) && $ && v($, l, r);
    },
    handleItemContextMenu: (m) => {
      m.preventDefault(), m.stopPropagation();
      const g = f(m);
      if (!g) return;
      const { key: $, item: _ } = g;
      c(_) && (o.value?.has($) || (d.clearSelection(), d.select($)), n.emitter.emit("vf-contextmenu-show", {
        event: m,
        items: w(),
        target: _
      }));
    },
    handleContentContextMenu: (m) => {
      m.preventDefault(), n.emitter.emit("vf-contextmenu-show", { event: m, items: w() });
    },
    getSelectedItems: w
  };
}
function Qu(n, e) {
  const t = A(null);
  return fe(() => {
    if (at.plugin([so]), n.value) {
      const o = at(
        n.value,
        {
          scrollbars: { theme: "vf-scrollbars-theme" }
        },
        {
          initialized: (i) => {
            t.value = i;
            const { viewport: l } = i.elements();
            l && l.addEventListener("scroll", e);
          },
          updated: (i) => {
            const { viewport: l } = i.elements();
          }
        }
      );
      t.value = o;
    }
  }), ke(() => {
    if (t.value) {
      const { viewport: o } = t.value.elements();
      o && o.removeEventListener("scroll", e), t.value.destroy(), t.value = null;
    }
  }), {
    osInstance: t
  };
}
function Xu(n, e) {
  const t = A(null);
  return fe(() => {
    n.value && (t.value = new bn({
      elements_selector: ".lazy",
      container: n.value
    })), e?.emitter && e.emitter.on("vf-refresh-thumbnails", () => {
      t.value && t.value.update();
    });
  }), Yn(() => {
    t.value && t.value.update();
  }), ke(() => {
    t.value && (t.value.destroy(), t.value = null);
  }), {
    vfLazyLoad: t
  };
}
const Ju = { class: "vuefinder__explorer__container" }, Zu = {
  key: 0,
  class: "vuefinder__linear-loader"
}, ev = /* @__PURE__ */ te({
  __name: "Explorer",
  props: {
    onFileDclick: { type: Function },
    onFolderDclick: { type: Function }
  },
  setup(n) {
    const e = n, t = ee(), o = pt(t, ["vuefinder__drag-over"]), i = Je("dragImage"), l = pn(null), r = Je("scrollContainer"), d = Je("scrollContent"), c = t.fs, v = t.config, f = W(v.state), w = W(c.sortedFiles), p = W(c.selectedKeys), S = W(c.loading), F = (Z) => p.value?.has(Z) ?? !1, C = R(() => {
      if (f.value?.view === "grid") {
        const ye = f.value?.gridItemHeight ?? 80, Qe = f.value?.gridItemGap ?? 8;
        return ye + Qe * 2;
      }
      const de = f.value?.listItemHeight ?? 32, re = f.value?.listItemGap ?? 2;
      return de + re * 2;
    }), m = R(() => {
      if (f.value?.view === "grid") {
        const de = f.value?.gridItemWidth ?? 96, re = f.value?.gridItemGap ?? 8;
        return de + re * 2;
      }
      return 104;
    }), g = R(() => f.value?.view === "grid" ? (f.value?.gridItemGap ?? 8) * 2 : 0), { t: $ } = t.i18n, {
      itemsPerRow: _,
      totalHeight: k,
      visibleRows: x,
      handleScroll: b,
      getRowItems: D,
      getItemsInRange: E,
      updateItemsPerRow: V
    } = ju(
      R(() => w.value ?? []),
      {
        scrollContainer: r,
        itemWidth: m,
        rowHeight: C,
        overscan: 2,
        containerPadding: g,
        lockItemsPerRow: R(() => f.value.view === "list")
      }
    ), { osInstance: j } = Qu(r, b), { explorerId: O, isDragging: q, initializeSelectionArea: M, updateSelectionArea: X, handleContentClick: G } = qu({
      itemsPerRow: _,
      totalHeight: k,
      getItemsInRange: E,
      getKey: (Z) => Z.path,
      selectionObject: l,
      rowHeight: C,
      itemWidth: m,
      osInstance: j
    }), J = A(null), I = (Z) => {
      if (!Z || !J.value) return !1;
      const de = p.value?.has(J.value) ?? !1;
      return q.value && (de ? p.value?.has(Z) ?? !1 : Z === J.value);
    };
    ie(
      () => v.get("view"),
      (Z) => {
        Z === "list" ? _.value = 1 : V();
      },
      { immediate: !0 }
    ), ie(_, (Z) => {
      v.get("view") === "list" && Z !== 1 && (_.value = 1);
    });
    const T = (Z) => w.value?.[Z];
    Xu(r, t);
    const { handleItemClick: P, handleItemDblClick: z, handleItemContextMenu: B, handleContentContextMenu: Y } = Yu(
      t,
      O,
      w,
      p,
      l,
      e.onFileDclick,
      e.onFolderDclick
    );
    fe(() => {
      const Z = () => {
        l.value || M(), l.value && l.value.on("beforestart", ({ event: de }) => {
          const re = de?.target === d.value;
          if (!de?.metaKey && !de?.ctrlKey && !de?.altKey && !re)
            return !1;
        });
      };
      if (j.value)
        Z();
      else {
        const de = setInterval(() => {
          j.value && (clearInterval(de), Z());
        }, 50);
        setTimeout(() => {
          clearInterval(de), l.value || Z();
        }, 500);
      }
      ie(() => [t.selectionFilterType, t.selectionFilterMimeIncludes], X, {
        deep: !0
      });
    });
    const le = (Z) => {
      if (!(t.features?.move ?? !1) || Z.altKey || Z.ctrlKey || Z.metaKey)
        return Z.preventDefault(), !1;
      q.value = !0;
      const re = Z.target?.closest(
        ".file-item-" + O
      );
      if (J.value = re ? String(re.dataset.key) : null, Z.dataTransfer && J.value) {
        Z.dataTransfer.setDragImage(i.value, 0, 15), Z.dataTransfer.effectAllowed = "all", Z.dataTransfer.dropEffect = "copy";
        const ye = p.value?.has(J.value) ? Array.from(p.value) : [J.value];
        Z.dataTransfer.setData("items", JSON.stringify(ye)), c.setDraggedItem(J.value);
      }
    }, _e = () => {
      J.value = null;
    };
    let $e = null, ge = null;
    const Ye = (Z) => {
      Z.target?.closest(".file-item-" + O) || (ge = Z, $e && clearTimeout($e), $e = setTimeout(() => {
        ge && (ge.cancelable && ge.preventDefault(), ge.stopPropagation(), Y(ge)), ge = null, $e = null;
      }, 500));
    }, qe = (Z) => {
      $e && (clearTimeout($e), $e = null), ge = null;
    }, we = (Z) => {
      if (!ge) return;
      const de = ge.touches[0] || ge.changedTouches[0], re = Z.touches[0] || Z.changedTouches[0];
      if (de && re) {
        const ye = Math.abs(re.clientX - de.clientX), Qe = Math.abs(re.clientY - de.clientY);
        (ye > 15 || Qe > 15) && ($e && (clearTimeout($e), $e = null), ge = null);
      }
    };
    return (Z, de) => (u(), h("div", Ju, [
      a(f).view === "list" ? (u(), U(Ku, { key: 0 })) : L("", !0),
      s("div", {
        ref_key: "scrollContainer",
        ref: r,
        class: ne(["vuefinder__explorer__selector-area", "scroller-" + a(O)])
      }, [
        a(v).get("loadingIndicator") === "linear" && a(S) ? (u(), h("div", Zu)) : L("", !0),
        s("div", {
          ref_key: "scrollContent",
          ref: d,
          class: "scrollContent vuefinder__explorer__scroll-content",
          style: Oe({ height: `${a(k)}px`, position: "relative", width: "100%" }),
          onContextmenu: de[0] || (de[0] = ae(
            //@ts-ignore
            (...re) => a(Y) && a(Y)(...re),
            ["self", "prevent"]
          )),
          onClick: de[1] || (de[1] = ae(
            //@ts-ignore
            (...re) => a(G) && a(G)(...re),
            ["self"]
          )),
          onTouchstartCapture: ae(Ye, ["self"]),
          onTouchendCapture: ae(qe, ["self"]),
          onTouchmoveCapture: ae(we, ["self"]),
          onTouchcancelCapture: ae(qe, ["self"])
        }, [
          s("div", {
            ref_key: "dragImage",
            ref: i,
            class: "vuefinder__explorer__drag-item"
          }, [
            N(gu, {
              count: J.value && a(p).has(J.value) ? a(p).size : 1
            }, null, 8, ["count"])
          ], 512),
          a(f).view === "grid" ? (u(!0), h(ve, { key: 0 }, pe(a(x), (re) => (u(), U(fn, {
            key: re,
            "row-index": re,
            "row-height": C.value,
            view: "grid",
            "items-per-row": a(_),
            items: a(D)(a(w), re),
            "show-thumbnails": a(f).showThumbnails,
            "is-dragging-item": I,
            "is-selected": F,
            "drag-n-drop-events": (ye) => a(o).events(ye),
            "explorer-id": a(O),
            onClick: a(P),
            onDblclick: a(z),
            onContextmenu: a(B),
            onDragstart: le,
            onDragend: _e
          }, {
            icon: se((ye) => [
              xe(Z.$slots, "icon", Ae({ ref_for: !0 }, ye))
            ]),
            _: 3
          }, 8, ["row-index", "row-height", "items-per-row", "items", "show-thumbnails", "drag-n-drop-events", "explorer-id", "onClick", "onDblclick", "onContextmenu"]))), 128)) : (u(!0), h(ve, { key: 1 }, pe(a(x), (re) => (u(), U(fn, {
            key: re,
            "row-index": re,
            "row-height": C.value,
            view: "list",
            items: T(re) ? [T(re)] : [],
            "is-dragging-item": I,
            "is-selected": F,
            "drag-n-drop-events": (ye) => a(o).events(ye),
            "explorer-id": a(O),
            onClick: a(P),
            onDblclick: a(z),
            onContextmenu: a(B),
            onDragstart: le,
            onDragend: _e
          }, {
            icon: se((ye) => [
              xe(Z.$slots, "icon", Ae({ ref_for: !0 }, ye))
            ]),
            _: 3
          }, 8, ["row-index", "row-height", "items", "drag-n-drop-events", "explorer-id", "onClick", "onDblclick", "onContextmenu"]))), 128))
        ], 36)
      ], 2)
    ]));
  }
}), tv = ["href", "download"], nv = ["onClick"], ov = /* @__PURE__ */ te({
  __name: "ContextMenu",
  setup(n) {
    const e = ee(), t = A(null), o = A([]);
    let i = null, l = null, r = null, d = [], c = null;
    const v = yt({
      active: !1,
      items: [],
      positions: {}
    });
    e.emitter.on("vf-context-selected", (S) => {
      o.value = S;
    });
    const f = (S) => S.link(e, o.value), w = (S) => {
      e.emitter.emit("vf-contextmenu-hide"), S.action(e, o.value);
    };
    e.emitter.on("vf-contextmenu-show", (S) => {
      const { event: F, items: C, target: m = null } = S || {};
      v.items = (e.contextMenuItems || []).filter((g) => g.show(e, {
        items: C,
        target: m
      })).sort((g, $) => {
        const _ = g.order ?? 1 / 0, k = $.order ?? 1 / 0;
        return _ - k;
      }), m ? C.length > 1 && C.some((g) => g.path === m.path) ? e.emitter.emit("vf-context-selected", C) : e.emitter.emit("vf-context-selected", [m]) : e.emitter.emit("vf-context-selected", []), p(F);
    }), e.emitter.on("vf-contextmenu-hide", () => {
      v.active = !1, i && (i(), i = null), r && (d.forEach((S) => {
        S === window ? window.removeEventListener("scroll", r, !0) : S.removeEventListener("scroll", r, !0);
      }), r = null, d = []), c && (document.removeEventListener("mousedown", c, !0), document.removeEventListener("touchstart", c, !0), c = null), l = null, v.positions = {};
    });
    const p = async (S) => {
      i && (i(), i = null);
      const C = ((b) => {
        if ("clientX" in b && "clientY" in b)
          return { x: b.clientX, y: b.clientY };
        const D = "touches" in b && b.touches[0] || "changedTouches" in b && b.changedTouches[0];
        return D ? { x: D.clientX, y: D.clientY } : { x: 0, y: 0 };
      })(S);
      if (l = {
        getBoundingClientRect: () => ({
          width: 0,
          height: 0,
          x: C.x,
          y: C.y,
          top: C.y,
          left: C.x,
          right: C.x,
          bottom: C.y
        })
      }, v.positions = {
        position: "fixed",
        zIndex: "10001",
        opacity: "0",
        visibility: "hidden",
        left: "-9999px",
        top: "-9999px"
      }, v.active = !0, await Be(), !t.value || !l) return;
      await new Promise((b) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(b);
        });
      });
      const m = [
        rt(8),
        lt({
          padding: 16,
          fallbackPlacements: ["left-start", "right-end", "left-end", "top-start", "bottom-start"]
        }),
        dt({ padding: 16 })
      ];
      let g = 0, $ = 0;
      try {
        const b = await et(l, t.value, {
          placement: "right-start",
          strategy: "fixed",
          middleware: m
        });
        g = b.x, $ = b.y;
      } catch (b) {
        console.warn("[ContextMenu] Floating UI initial positioning error:", b);
        return;
      }
      v.positions = {
        position: "fixed",
        zIndex: "10001",
        left: `${g}px`,
        top: `${$}px`,
        opacity: "0",
        visibility: "visible",
        transform: "translateY(-8px)",
        transition: "opacity 150ms ease-out, transform 150ms ease-out"
      }, requestAnimationFrame(() => {
        t.value && (v.positions = {
          ...v.positions,
          opacity: "1",
          transform: "translateY(0)"
        });
      });
      const k = ((b) => {
        const D = [];
        let E = b;
        for (; E && E !== document.body && E !== document.documentElement; ) {
          const V = window.getComputedStyle(E), j = V.overflow + V.overflowX + V.overflowY;
          (j.includes("scroll") || j.includes("auto")) && D.push(E), E = E.parentElement;
        }
        return D;
      })(t.value);
      d = [window, ...k], r = () => {
        v.active && e.emitter.emit("vf-contextmenu-hide");
      };
      const x = r;
      x && d.forEach((b) => {
        b === window ? window.addEventListener("scroll", x, !0) : b.addEventListener("scroll", x, !0);
      }), c = (b) => {
        if (!v.active) return;
        const D = b.target;
        if (!D || t.value && t.value.contains(D))
          return;
        const E = e.root;
        E && E.contains(D) || e.emitter.emit("vf-contextmenu-hide");
      }, setTimeout(() => {
        c && (document.addEventListener("mousedown", c, !0), document.addEventListener("touchstart", c, !0));
      }, 100), setTimeout(() => {
        if (!(!t.value || !l))
          try {
            i = zt(l, t.value, async () => {
              if (!(!l || !t.value))
                try {
                  const { x: b, y: D } = await et(l, t.value, {
                    placement: "right-start",
                    strategy: "fixed",
                    middleware: m
                  });
                  v.positions = {
                    ...v.positions,
                    left: `${b}px`,
                    top: `${D}px`
                  };
                } catch (b) {
                  console.warn("Floating UI positioning error:", b);
                }
            });
          } catch (b) {
            console.warn("Floating UI autoUpdate setup error:", b), i = null;
          }
      }, 200);
    };
    return ke(() => {
      i && (i(), i = null), r && (d.forEach((S) => {
        S === window ? window.removeEventListener("scroll", r, !0) : S.removeEventListener("scroll", r, !0);
      }), r = null, d = []), c && (document.removeEventListener("mousedown", c, !0), document.removeEventListener("touchstart", c, !0), c = null), l = null;
    }), (S, F) => ue((u(), h("ul", {
      ref_key: "contextmenu",
      ref: t,
      class: ne([{
        "vuefinder__context-menu--active": v.active,
        "vuefinder__context-menu--inactive": !v.active
      }, "vuefinder__context-menu"]),
      style: Oe(v.positions)
    }, [
      (u(!0), h(ve, null, pe(v.items, (C) => (u(), h("li", {
        key: C.title,
        class: "vuefinder__context-menu__item"
      }, [
        C.link ? (u(), h("a", {
          key: 0,
          class: "vuefinder__context-menu__link",
          target: "_blank",
          href: f(C),
          download: f(C),
          onClick: F[0] || (F[0] = (m) => a(e).emitter.emit("vf-contextmenu-hide"))
        }, [
          s("span", null, y(C.title(a(e).i18n)), 1)
        ], 8, tv)) : (u(), h("div", {
          key: 1,
          class: "vuefinder__context-menu__action",
          onClick: (m) => w(C)
        }, [
          s("span", null, y(C.title(a(e).i18n)), 1)
        ], 8, nv))
      ]))), 128))
    ], 6)), [
      [Ue, v.active]
    ]);
  }
}), sv = { class: "vuefinder__status-bar__wrapper" }, iv = { class: "vuefinder__status-bar__storage" }, av = ["title"], rv = { class: "vuefinder__status-bar__storage-icon" }, lv = ["value"], dv = ["value"], cv = { class: "vuefinder__status-bar__info space-x-2" }, uv = { key: 0 }, vv = { key: 1 }, fv = {
  key: 0,
  class: "vuefinder__status-bar__size"
}, pv = { class: "vuefinder__status-bar__actions" }, _v = /* @__PURE__ */ te({
  __name: "Statusbar",
  setup(n) {
    const e = ee(), { t } = e.i18n, o = e.fs, i = W(o.sortedFiles), l = W(o.path), r = W(o.selectedCount), d = W(o.storages), c = W(o.selectedItems), v = W(o.path), f = (m) => {
      const g = m.target.value;
      e.adapter.open(g + "://");
    }, w = R(() => !c.value || c.value.length === 0 ? 0 : c.value.reduce((m, g) => m + (g.file_size || 0), 0)), p = R(() => d.value), S = R(() => i.value), F = R(() => r.value || 0), C = R(() => c.value || []);
    return (m, g) => (u(), h("div", sv, [
      s("div", iv, [
        s("div", {
          class: "vuefinder__status-bar__storage-container",
          title: a(t)("Storage")
        }, [
          s("div", rv, [
            N(a(Ht))
          ]),
          s("select", {
            name: "vuefinder-media-selector",
            value: a(l).storage,
            class: "vuefinder__status-bar__storage-select",
            tabindex: "-1",
            onChange: f
          }, [
            (u(!0), h(ve, null, pe(p.value, ($) => (u(), h("option", {
              key: $,
              value: $
            }, y($), 9, dv))), 128))
          ], 40, lv),
          g[0] || (g[0] = s("span", {
            class: "vuefinder__status-bar__storage-caret",
            "aria-hidden": "true"
          }, null, -1))
        ], 8, av),
        s("div", cv, [
          F.value === 0 ? (u(), h("span", uv, y(S.value.length) + " " + y(a(t)("items")), 1)) : (u(), h("span", vv, [
            ce(y(F.value) + " " + y(a(t)("selected")) + " ", 1),
            w.value ? (u(), h("span", fv, y(a(e).filesize(w.value)), 1)) : L("", !0)
          ]))
        ])
      ]),
      s("div", pv, [
        xe(m.$slots, "actions", {
          path: a(v).path,
          count: F.value || 0,
          selected: C.value
        })
      ])
    ]));
  }
}), hv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function mv(n, e) {
  return u(), h("svg", hv, [...e[0] || (e[0] = [
    s("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    s("path", { d: "M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m3.6 5.2a1 1 0 0 0-1.4.2L12 10.333 9.8 7.4a1 1 0 1 0-1.6 1.2l2.55 3.4-2.55 3.4a1 1 0 1 0 1.6 1.2l2.2-2.933 2.2 2.933a1 1 0 0 0 1.6-1.2L13.25 12l2.55-3.4a1 1 0 0 0-.2-1.4" }, null, -1)
  ])]);
}
const gv = { render: mv };
function Hn(n, e) {
  const t = n.findIndex((o) => o.path === e.path);
  t > -1 ? n[t] = e : n.push(e);
}
const wv = { class: "vuefinder__folder-loader-indicator" }, yv = {
  key: 1,
  class: "vuefinder__folder-loader-indicator--icon"
}, Kn = /* @__PURE__ */ te({
  __name: "FolderLoaderIndicator",
  props: /* @__PURE__ */ Qn({
    storage: {},
    path: {}
  }, {
    modelValue: { type: Boolean },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(n) {
    const e = n, t = ee(), o = gn(n, "modelValue"), i = A(!1);
    ie(
      () => o.value,
      () => l()
    );
    const l = async () => {
      i.value = !0;
      try {
        const d = (await t.adapter.list(e.path)).files.filter((c) => c.type === "dir");
        Hn(t.treeViewData, { path: e.path, type: "dir", folders: d });
      } catch (r) {
        Pe(r, "Failed to fetch subfolders");
      } finally {
        i.value = !1;
      }
    };
    return (r, d) => (u(), h("div", wv, [
      i.value ? (u(), U(a(Ct), {
        key: 0,
        class: "vuefinder__folder-loader-indicator--loading"
      })) : (u(), h("div", yv, [
        o.value ? (u(), U(a(St), {
          key: 0,
          class: "vuefinder__folder-loader-indicator--minus"
        })) : L("", !0),
        o.value ? L("", !0) : (u(), U(a(xt), {
          key: 1,
          class: "vuefinder__folder-loader-indicator--plus"
        }))
      ]))
    ]));
  }
}), bv = { key: 0 }, kv = { class: "vuefinder__treesubfolderlist__no-folders" }, $v = { class: "vuefinder__treesubfolderlist__item-content" }, xv = ["onClick"], Sv = ["title", "onDblclick", "onClick"], Cv = { class: "vuefinder__treesubfolderlist__item-icon" }, Fv = { class: "vuefinder__treesubfolderlist__subfolder" }, Pv = {
  key: 1,
  class: "vuefinder__treesubfolderlist__more-note"
}, Dv = /* @__PURE__ */ te({
  __name: "TreeSubfolderList",
  props: {
    storage: {},
    path: {}
  },
  setup(n) {
    const e = ee(), t = e.fs, o = pt(e, ["vuefinder__drag-over"]), i = A({}), l = e.config, r = W(l.state), { t: d } = e.i18n, c = W(t.path), v = n, f = A(null), w = A(50);
    fe(() => {
      v.path === v.storage + "://" && f.value && at(f.value, {
        scrollbars: {
          theme: "vf-scrollbars-theme"
        }
      });
    });
    const p = R(() => {
      const _ = e.treeViewData.find((k) => k.path === v.path)?.folders || [];
      return _.length > w.value ? _.slice(0, w.value) : _;
    }), S = R(() => e.treeViewData.find((_) => _.path === v.path)?.folders?.length || 0), F = R(() => S.value > w.value), C = R(() => `${v.storage}://`), m = ($, _) => $ === _ || $.startsWith(`${_}/`);
    ie(
      p,
      ($) => {
        const _ = r.value.expandTreeByDefault && v.path === C.value, k = r.value.expandedTreePaths || [];
        $.forEach((x) => {
          const b = k.some(
            (D) => m(D, x.path)
          );
          (_ || b) && i.value[x.path] === void 0 && (i.value[x.path] = !0);
        });
      },
      { immediate: !0 }
    );
    const g = () => {
      w.value += 50;
    };
    return ($, _) => {
      const k = hn("TreeSubfolderList", !0);
      return u(), h("ul", {
        ref_key: "parentSubfolderList",
        ref: f,
        class: "vuefinder__treesubfolderlist__container"
      }, [
        p.value.length ? L("", !0) : (u(), h("li", bv, [
          s("div", kv, y(a(d)("No folders")), 1)
        ])),
        (u(!0), h(ve, null, pe(p.value, (x) => (u(), h("li", {
          key: x.path,
          class: "vuefinder__treesubfolderlist__item"
        }, [
          s("div", $v, [
            s("div", {
              class: "vuefinder__treesubfolderlist__item-toggle",
              onClick: (b) => i.value[x.path] = !i.value[x.path]
            }, [
              N(Kn, {
                modelValue: i.value[x.path],
                "onUpdate:modelValue": (b) => i.value[x.path] = b,
                storage: n.storage,
                path: x.path
              }, null, 8, ["modelValue", "onUpdate:modelValue", "storage", "path"])
            ], 8, xv),
            s("div", Ae({
              class: "vuefinder__treesubfolderlist__item-link",
              title: x.path
            }, He(
              a(o).events({
                ...x,
                dir: x.path,
                extension: "",
                file_size: null,
                last_modified: null,
                mime_type: null,
                visibility: "public"
              }),
              !0
            ), {
              onDblclick: (b) => i.value[x.path] = !i.value[x.path],
              onClick: (b) => a(e).adapter.open(x.path)
            }), [
              s("div", Cv, [
                a(c)?.path === x.path ? (u(), U(a(Kt), {
                  key: 0,
                  class: "vuefinder__item-icon__folder--open"
                })) : (u(), U(a(Ve), {
                  key: 1,
                  class: "vuefinder__item-icon__folder"
                }))
              ]),
              s("div", {
                class: ne(["vuefinder__treesubfolderlist__item-text", {
                  "vuefinder__treesubfolderlist__item-text--active": a(c).path === x.path
                }])
              }, y(x.basename), 3)
            ], 16, Sv)
          ]),
          s("div", Fv, [
            ue(N(k, {
              storage: v.storage,
              path: x.path
            }, null, 8, ["storage", "path"]), [
              [Ue, i.value[x.path]]
            ])
          ])
        ]))), 128)),
        F.value ? (u(), h("li", Pv, [
          s("div", {
            class: "vuefinder__treesubfolderlist__load-more",
            onClick: g
          }, y(a(d)("load more")), 1)
        ])) : L("", !0)
      ], 512);
    };
  }
}), Tv = /* @__PURE__ */ te({
  __name: "TreeStorageItem",
  props: {
    storage: {}
  },
  setup(n) {
    const e = ee(), t = e.fs, o = e.config, i = n, l = W(o.state), r = R(() => {
      const S = l.value.expandedTreePaths || [], F = `${i.storage}://`;
      return S.some(
        (C) => C === F || C.startsWith(`${F}`)
      );
    }), d = A(
      l.value.expandTreeByDefault || r.value
    ), c = pt(e, ["vuefinder__drag-over"]), v = W(t.path), f = R(() => i.storage === v.value?.storage);
    ie(
      () => ({
        expandTreeByDefault: l.value.expandTreeByDefault,
        hasExpandedPathInStorage: r.value
      }),
      (S) => {
        (S.expandTreeByDefault || S.hasExpandedPathInStorage) && (d.value = !0);
      }
    );
    const w = {
      storage: i.storage,
      path: i.storage + "://",
      dir: i.storage + "://",
      type: "dir",
      basename: i.storage,
      extension: "",
      file_size: null,
      last_modified: null,
      mime_type: null,
      visibility: "public"
    };
    function p(S) {
      S === v.value?.storage ? d.value = !d.value : e.adapter.open(S + "://");
    }
    return (S, F) => (u(), h(ve, null, [
      s("div", {
        class: "vuefinder__treestorageitem__header",
        onClick: F[2] || (F[2] = (C) => p(n.storage))
      }, [
        s("div", Ae({
          class: ["vuefinder__treestorageitem__info", f.value ? "vuefinder__treestorageitem__info--active" : ""]
        }, He(a(c).events(w), !0)), [
          s("div", {
            class: ne(["vuefinder__treestorageitem__icon", f.value ? "vuefinder__treestorageitem__icon--active" : ""])
          }, [
            N(a(Ht))
          ], 2),
          s("div", null, y(n.storage), 1)
        ], 16),
        s("div", {
          class: "vuefinder__treestorageitem__loader",
          onClick: F[1] || (F[1] = ae((C) => d.value = !d.value, ["stop"]))
        }, [
          N(Kn, {
            modelValue: d.value,
            "onUpdate:modelValue": F[0] || (F[0] = (C) => d.value = C),
            storage: n.storage,
            path: n.storage + "://"
          }, null, 8, ["modelValue", "storage", "path"])
        ])
      ]),
      ue(N(Dv, {
        storage: n.storage,
        path: n.storage + "://",
        class: "vuefinder__treestorageitem__subfolder"
      }, null, 8, ["storage", "path"]), [
        [Ue, d.value]
      ])
    ], 64));
  }
}), Ev = { class: "vuefinder__folder-indicator" }, Mv = { class: "vuefinder__folder-indicator--icon" }, Iv = /* @__PURE__ */ te({
  __name: "FolderIndicator",
  props: {
    modelValue: { type: Boolean },
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(n) {
    const e = gn(n, "modelValue");
    return (t, o) => (u(), h("div", Ev, [
      s("div", Mv, [
        e.value ? (u(), U(a(St), {
          key: 0,
          class: "vuefinder__folder-indicator--minus"
        })) : L("", !0),
        e.value ? L("", !0) : (u(), U(a(xt), {
          key: 1,
          class: "vuefinder__folder-indicator--plus"
        }))
      ])
    ]));
  }
}), Av = {
  key: 0,
  class: "vuefinder__treeview__header"
}, Ov = { class: "vuefinder__treeview__pinned-label" }, zv = { class: "vuefinder__treeview__pin-text text-nowrap" }, Lv = {
  key: 0,
  class: "vuefinder__treeview__pinned-list"
}, Bv = ["onClick"], Vv = ["title"], Rv = ["onClick"], Uv = { key: 0 }, Nv = { class: "vuefinder__treeview__no-pinned" }, Hv = /* @__PURE__ */ te({
  __name: "TreeView",
  setup(n) {
    const e = ee(), { enabled: t } = ze(), { t: o } = e.i18n, { getStore: i, setStore: l } = e.storage, r = e.fs, d = e.config, c = W(d.state), v = W(r.sortedFiles), f = W(r.storages), w = R(() => f.value || []), p = W(r.path), S = pt(e, ["vuefinder__drag-over"]), F = A(190), C = A(i("pinned-folders-opened", !0));
    ie(C, (_) => l("pinned-folders-opened", _));
    const m = (_) => {
      const k = d.get("pinnedFolders");
      d.set("pinnedFolders", k.filter((x) => x.path !== _.path));
    }, g = (_) => {
      const k = _.clientX, x = _.target.parentElement;
      if (!x) return;
      const b = x.getBoundingClientRect().width;
      x.classList.remove("transition-[width]"), x.classList.add("transition-none");
      const D = (V) => {
        F.value = b + V.clientX - k, F.value < 50 && (F.value = 0, d.set("showTreeView", !1)), F.value > 50 && d.set("showTreeView", !0);
      }, E = () => {
        const V = x.getBoundingClientRect();
        F.value = V.width, x.classList.add("transition-[width]"), x.classList.remove("transition-none"), window.removeEventListener("mousemove", D), window.removeEventListener("mouseup", E);
      };
      window.addEventListener("mousemove", D), window.addEventListener("mouseup", E);
    }, $ = A(null);
    return fe(() => {
      $.value && at($.value, {
        overflow: {
          x: "hidden"
        },
        scrollbars: {
          theme: "vf-scrollbars-theme"
        }
      });
    }), ie(v, (_) => {
      const k = _.filter((x) => x.type === "dir");
      Hn(e.treeViewData, {
        path: p.value.path || "",
        folders: k.map((x) => ({
          storage: x.storage,
          path: x.path,
          basename: x.basename,
          type: "dir"
        }))
      });
    }), (_, k) => (u(), h(ve, null, [
      s("div", {
        class: ne(["vuefinder__treeview__overlay", a(c).showTreeView ? "vuefinder__treeview__backdrop" : "hidden"]),
        onClick: k[0] || (k[0] = (x) => a(d).toggle("showTreeView"))
      }, null, 2),
      s("div", {
        style: Oe(
          a(c).showTreeView ? "min-width:100px;max-width:75%; width: " + F.value + "px" : "width: 0"
        ),
        class: "vuefinder__treeview__container"
      }, [
        s("div", {
          ref_key: "treeViewScrollElement",
          ref: $,
          class: "vuefinder__treeview__scroll"
        }, [
          a(t)("pinned") ? (u(), h("div", Av, [
            s("div", {
              class: "vuefinder__treeview__pinned-toggle",
              onClick: k[2] || (k[2] = (x) => C.value = !C.value)
            }, [
              s("div", Ov, [
                N(a(Nt), { class: "vuefinder__treeview__pin-icon" }),
                s("div", zv, y(a(o)("Pinned Folders")), 1)
              ]),
              N(Iv, {
                modelValue: C.value,
                "onUpdate:modelValue": k[1] || (k[1] = (x) => C.value = x)
              }, null, 8, ["modelValue"])
            ]),
            C.value ? (u(), h("ul", Lv, [
              (u(!0), h(ve, null, pe(a(c).pinnedFolders, (x) => (u(), h("li", {
                key: x.path,
                class: "vuefinder__treeview__pinned-item"
              }, [
                s("div", Ae({ class: "vuefinder__treeview__pinned-folder" }, He(a(S).events(x), !0), {
                  onClick: (b) => a(e).adapter.open(x.path)
                }), [
                  a(p).path !== x.path ? (u(), U(a(Ve), {
                    key: 0,
                    class: "vuefinder__treeview__folder-icon vuefinder__item-icon__folder"
                  })) : L("", !0),
                  a(p).path === x.path ? (u(), U(a(Kt), {
                    key: 1,
                    class: "vuefinder__item-icon__folder--open vuefinder__treeview__open-folder-icon"
                  })) : L("", !0),
                  s("div", {
                    title: x.path,
                    class: ne(["vuefinder__treeview__folder-name", {
                      "vuefinder__treeview__folder-name--active": a(p).path === x.path
                    }])
                  }, y(x.basename), 11, Vv)
                ], 16, Bv),
                s("div", {
                  class: "vuefinder__treeview__remove-folder",
                  onClick: (b) => m(x)
                }, [
                  N(a(gv), { class: "vuefinder__treeview__remove-icon" })
                ], 8, Rv)
              ]))), 128)),
              a(c).pinnedFolders.length ? L("", !0) : (u(), h("li", Uv, [
                s("div", Nv, y(a(o)("No folders pinned")), 1)
              ]))
            ])) : L("", !0)
          ])) : L("", !0),
          (u(!0), h(ve, null, pe(w.value, (x) => (u(), h("div", {
            key: x,
            class: "vuefinder__treeview__storage"
          }, [
            N(Tv, { storage: x }, null, 8, ["storage"])
          ]))), 128))
        ], 512),
        s("div", {
          class: "vuefinder__treeview__resize-handle",
          onMousedown: g
        }, null, 32)
      ], 4)
    ], 64));
  }
}), be = {
  new_folder: "new_folder",
  selectAll: "selectAll",
  pinFolder: "pinFolder",
  unpinFolder: "unpinFolder",
  delete: "delete",
  refresh: "refresh",
  preview: "preview",
  open: "open",
  openDir: "openDir",
  download: "download",
  download_archive: "download_archive",
  archive: "archive",
  unarchive: "unarchive",
  rename: "rename",
  move: "move",
  copy: "copy",
  paste: "paste"
};
function Kv(n) {
  return n.items.length > 1 && n.items.some((e) => e.path === n.target?.path) ? "many" : n.target ? "one" : "none";
}
function he(n) {
  const e = Object.assign(
    {
      needsSearchQuery: !1
    },
    n
  );
  return (t, o) => !(e.needsSearchQuery !== !!o.searchQuery || e.target !== void 0 && e.target !== Kv(o) || e.targetType !== void 0 && e.targetType !== o.target?.type || e.mimeType !== void 0 && e.mimeType !== o.target?.mime_type || e.feature !== void 0 && !(t.features[e.feature] ?? !1));
}
function st(...n) {
  return (e, t) => n.some((o) => o(e, t));
}
function it(...n) {
  return (e, t) => n.every((o) => o(e, t));
}
const jn = [
  {
    id: be.openDir,
    title: ({ t: n }) => n("Open containing folder"),
    action: (n, e) => {
      const t = e[0];
      t && n.adapter.open(t.dir);
    },
    show: he({ target: "one", needsSearchQuery: !0 }),
    order: 10
  },
  {
    id: be.refresh,
    title: ({ t: n }) => n("Refresh"),
    action: (n) => {
      const e = n.fs;
      n.adapter.invalidateListQuery(e.path.get().path), n.adapter.open(e.path.get().path);
    },
    show: st(he({ target: "none" }), he({ target: "many" })),
    order: 20
  },
  {
    id: be.selectAll,
    title: ({ t: n }) => n("Select All"),
    action: (n) => {
      n.fs.selectAll(n.selectionMode || "multiple");
    },
    show: (n, e) => n.selectionMode === "multiple" && he({ target: "none" })(n, e),
    order: 30
  },
  {
    id: be.new_folder,
    title: ({ t: n }) => n("New Folder"),
    action: (n) => n.modal.open(Yt),
    show: he({ target: "none", feature: "newfolder" }),
    order: 40
  },
  {
    id: be.open,
    title: ({ t: n }) => n("Open"),
    action: (n, e) => {
      e[0] && n.adapter.open(e[0].path);
    },
    show: he({ target: "one", targetType: "dir" }),
    order: 50
  },
  {
    id: be.pinFolder,
    title: ({ t: n }) => n("Pin Folder"),
    action: (n, e) => {
      const t = n.config, o = t.get("pinnedFolders"), i = o.concat(
        e.filter(
          (l) => o.findIndex((r) => r.path === l.path) === -1
        )
      );
      t.set("pinnedFolders", i);
    },
    show: it(he({ target: "one", targetType: "dir", feature: "pinned" }), (n, e) => n.config.get("pinnedFolders").findIndex((i) => i.path === e.target?.path) === -1),
    order: 60
  },
  {
    id: be.unpinFolder,
    title: ({ t: n }) => n("Unpin Folder"),
    action: (n, e) => {
      const t = n.config, o = t.get("pinnedFolders");
      t.set(
        "pinnedFolders",
        o.filter(
          (i) => !e.find((l) => l.path === i.path)
        )
      );
    },
    show: it(he({ target: "one", targetType: "dir", feature: "pinned" }), (n, e) => n.config.get("pinnedFolders").findIndex((i) => i.path === e.target?.path) !== -1),
    order: 70
  },
  {
    id: be.preview,
    title: ({ t: n }) => n("Preview"),
    action: (n, e) => n.modal.open(ft, { storage: e[0]?.storage, item: e[0] }),
    show: it(
      he({ target: "one", feature: "preview" }),
      (n, e) => e.target?.type !== "dir"
    ),
    order: 80
  },
  {
    id: be.download,
    link: (n, e) => {
      if (e[0])
        return n.adapter.getDownloadUrl(e[0]);
    },
    title: ({ t: n }) => n("Download"),
    action: () => {
    },
    show: it(
      he({ target: "one", feature: "download" }),
      (n, e) => e.target?.type !== "dir"
    ),
    order: 90
  },
  {
    id: be.rename,
    title: ({ t: n }) => n("Rename"),
    action: (n, e) => n.modal.open($t, { items: e }),
    show: he({ target: "one", feature: "rename" }),
    order: 100
  },
  {
    id: be.move,
    title: ({ t: n }) => n("Move files"),
    action: (n, e) => {
      const t = n.fs, o = {
        storage: t.path.get().storage || "",
        path: t.path.get().path || "",
        type: "dir"
      };
      n.modal.open(tt, { items: { from: e, to: o } });
    },
    show: st(
      he({ target: "one", feature: "move" }),
      he({ target: "many", feature: "move" })
    ),
    order: 110
  },
  {
    id: be.copy,
    title: ({ t: n }) => n("Copy"),
    action: (n, e) => {
      e.length > 0 && n.fs.setClipboard("copy", new Set(e.map((t) => t.path)));
    },
    show: st(
      he({ target: "one", feature: "copy" }),
      he({ target: "many", feature: "copy" })
    ),
    order: 120
  },
  {
    id: be.paste,
    title: ({ t: n }) => n("Paste"),
    action: (n, e) => {
      const t = n.fs.getClipboard();
      if (t?.items?.size > 0) {
        const i = n.fs.path.get();
        let l = i.path, r = i.storage;
        e.length === 1 && e[0]?.type === "dir" && (l = e[0].path, r = e[0].storage);
        const d = {
          storage: r || "",
          path: l || "",
          type: "dir"
        };
        n.modal.open(t.type === "cut" ? tt : qt, {
          items: { from: Array.from(t.items), to: d }
        });
      }
    },
    show: (n, e) => n.features?.copy ?? !1 ? n.fs.getClipboard()?.items?.size > 0 : !1,
    order: 130
  },
  {
    id: be.archive,
    title: ({ t: n }) => n("Archive"),
    action: (n, e) => n.modal.open(Jt, { items: e }),
    show: st(
      he({ target: "many", feature: "archive" }),
      it(
        he({ target: "one", feature: "archive" }),
        (n, e) => e.target?.mime_type !== "application/zip"
      )
    ),
    order: 140
  },
  {
    id: be.unarchive,
    title: ({ t: n }) => n("Unarchive"),
    action: (n, e) => n.modal.open(Xt, { items: e }),
    show: he({ target: "one", feature: "unarchive", mimeType: "application/zip" }),
    order: 150
  },
  {
    id: be.delete,
    title: ({ t: n }) => n("Delete"),
    action: (n, e) => {
      n.modal.open(kt, { items: e });
    },
    show: st(
      he({ feature: "delete", target: "one" }),
      he({ feature: "delete", target: "many" })
    ),
    order: 160
  }
], jv = ["data-theme"], qv = {
  key: 0,
  class: "vuefinder__external-drop-overlay vuefinder__external-drop-overlay--relative"
}, Gv = { class: "vuefinder__external-drop-message" }, Wv = { class: "vuefinder__main__content" }, Yv = /* @__PURE__ */ te({
  __name: "VueFinderView",
  props: {
    id: {},
    driver: {},
    config: {},
    features: {},
    debug: { type: Boolean },
    locale: {},
    contextMenuItems: {},
    selectionMode: {},
    selectionFilterType: {},
    selectionFilterMimeIncludes: {},
    onError: { type: Function },
    onSelect: { type: Function },
    onPathChange: { type: Function },
    onUploadComplete: { type: Function },
    onDeleteComplete: { type: Function },
    onNotify: { type: Function },
    onReady: { type: Function },
    onFileDclick: { type: Function },
    onFolderDclick: { type: Function },
    customUploader: { type: Function }
  },
  emits: [
    "select",
    "path-change",
    "upload-complete",
    "delete-complete",
    "notify",
    "error",
    "ready",
    "file-dclick",
    "folder-dclick"
  ],
  setup(n, { emit: e }) {
    const t = e, o = n, i = ee(), l = Je("root"), r = i.config;
    ie(
      () => o.features,
      (g) => {
        const $ = yn(g);
        Object.keys(i.features).forEach((_) => {
          delete i.features[_];
        }), Object.assign(i.features, $);
      },
      { deep: !0 }
    );
    const d = i.fs, c = W(r.state), v = R(() => {
      const g = c.value;
      return {
        "--vf-grid-item-width": `${g.gridItemWidth}px`,
        "--vf-grid-item-height": `${g.gridItemHeight}px`,
        "--vf-grid-item-gap": `${g.gridItemGap}px`,
        "--vf-grid-icon-size": `${g.gridIconSize}px`,
        "--vf-list-item-height": `${g.listItemHeight}px`,
        "--vf-list-item-gap": `${g.listItemGap}px`,
        "--vf-list-icon-size": `${g.listIconSize}px`
      };
    });
    Jr();
    const { isDraggingExternal: f, handleDragEnter: w, handleDragOver: p, handleDragLeave: S, handleDrop: F } = Zr();
    function C(g) {
      d.setPath(g.dirname), r.get("persist") && r.set("path", g.dirname), d.setReadOnly(g.read_only ?? !1), i.modal.close(), d.setFiles(g.files), d.clearSelection(), d.setSelectedCount(0), d.setStorages(g.storages);
    }
    i.adapter.onBeforeOpen = () => {
      d.setLoading(!0);
    }, i.adapter.onAfterOpen = (g) => {
      C(g), d.setLoading(!1);
    }, i.emitter.on("vf-upload-complete", (g) => {
      t("upload-complete", g);
    }), i.emitter.on("vf-delete-complete", (g) => {
      t("delete-complete", g);
    }), i.emitter.on("vf-notify", (g) => {
      t("notify", g);
    }), i.emitter.on("vf-file-dclick", (g) => {
      t("file-dclick", g);
    }), i.emitter.on("vf-folder-dclick", (g) => {
      t("folder-dclick", g);
    }), ie(
      () => o.config?.theme,
      (g) => {
        g && r.set("theme", a(g));
      },
      { immediate: !0 }
    ), fe(() => {
      i.root = l.value, ie(
        () => r.get("path"),
        ($) => {
          i.adapter.open($);
        }
      );
      const g = r.get("persist") ? r.get("path") : r.get("initialPath") ?? "";
      d.setPath(g), i.adapter.open(g), d.path.listen(($) => {
        t("path-change", $.path);
      }), d.selectedItems.listen(($) => {
        t("select", $);
      }), t("ready");
    });
    const m = async (g) => {
      const $ = await F(g);
      $.length > 0 && (i.modal.open(Qt), setTimeout(() => {
        i.emitter.emit(
          "vf-external-files-dropped",
          $.map((_) => _.file)
        );
      }, 100));
    };
    return (g, $) => (u(), h("div", {
      ref_key: "root",
      ref: l,
      tabindex: "0",
      class: ne(["vuefinder vuefinder__main vuefinder__themer", { "vuefinder--dragging-external": a(f) }]),
      "data-theme": a(i).theme.current,
      style: Oe(v.value),
      onDragenter: $[2] || ($[2] = //@ts-ignore
      (..._) => a(w) && a(w)(..._)),
      onDragover: $[3] || ($[3] = //@ts-ignore
      (..._) => a(p) && a(p)(..._)),
      onDragleave: $[4] || ($[4] = //@ts-ignore
      (..._) => a(S) && a(S)(..._)),
      onDrop: m
    }, [
      s("div", {
        class: ne(a(i).theme.current),
        style: { height: "100%", width: "100%" }
      }, [
        s("div", {
          class: ne([
            a(c)?.fullScreen ? "vuefinder__main__fixed" : "vuefinder__main__relative",
            "vuefinder__main__container"
          ]),
          onMousedown: $[0] || ($[0] = (_) => a(i).emitter.emit("vf-contextmenu-hide")),
          onTouchstart: $[1] || ($[1] = (_) => a(i).emitter.emit("vf-contextmenu-hide"))
        }, [
          a(f) ? (u(), h("div", qv, [
            s("div", Gv, y(a(i).i18n.t("Drag and drop the files/folders to here.")), 1)
          ])) : L("", !0),
          a(c).showMenuBar ? (u(), U($d, { key: 1 })) : L("", !0),
          a(c).showToolbar ? (u(), U(Sc, { key: 2 })) : L("", !0),
          N(fu),
          s("div", Wv, [
            N(Hv),
            N(ev, {
              "on-file-dclick": o.onFileDclick,
              "on-folder-dclick": o.onFolderDclick
            }, {
              icon: se((_) => [
                xe(g.$slots, "icon", Ke(je(_)))
              ]),
              _: 3
            }, 8, ["on-file-dclick", "on-folder-dclick"])
          ]),
          N(_v, null, {
            actions: se((_) => [
              xe(g.$slots, "status-bar", Ke(je(_)))
            ]),
            _: 3
          })
        ], 34),
        (u(), U(bt, { to: "body" }, [
          N(Xn, { name: "fade" }, {
            default: se(() => [
              a(i).modal.visible ? (u(), U(_n(a(i).modal.type), { key: 0 })) : L("", !0)
            ]),
            _: 1
          })
        ])),
        N(ov, { items: a(jn) }, null, 8, ["items"]),
        a(c).notificationsEnabled ? (u(), U(a(eo), {
          key: 0,
          position: a(c).notificationPosition,
          duration: a(c).notificationDuration,
          "visible-toasts": a(c).notificationVisibleToasts,
          "rich-colors": a(c).notificationRichColors
        }, null, 8, ["position", "duration", "visible-toasts", "rich-colors"])) : L("", !0)
      ], 2)
    ], 46, jv));
  }
}), Qv = /* @__PURE__ */ te({
  __name: "VueFinderProvider",
  props: {
    id: {},
    driver: {},
    config: {},
    features: {},
    debug: { type: Boolean, default: !1 },
    locale: {},
    contextMenuItems: { default: () => jn },
    selectionMode: { default: "multiple" },
    selectionFilterType: { default: "both" },
    selectionFilterMimeIncludes: { default: () => [] },
    onError: {},
    onSelect: {},
    onPathChange: {},
    onUploadComplete: {},
    onDeleteComplete: {},
    onNotify: {},
    onReady: {},
    onFileDclick: {},
    onFolderDclick: {},
    customUploader: {}
  },
  setup(n) {
    const e = n, t = e.id ?? ht(It);
    if (!t)
      throw new Error('VueFinderProvider requires an "id" prop.');
    const o = So(e, ht("VueFinderOptions") || {});
    return ie(
      () => e.config,
      (i) => {
        if (i) {
          const l = {};
          for (const r in i) {
            const d = a(i[r]);
            d !== void 0 && (l[r] = d);
          }
          o.config.init(l);
        }
      },
      { deep: !0, immediate: !0 }
    ), ie(
      () => e.locale,
      (i) => {
        i && o.i18n.localeAtom && o.i18n.localeAtom.get() !== i && o.i18n.localeAtom.set(i);
      },
      { immediate: !0 }
    ), ro(t, o), Jn(It, t), mn(() => {
      lo(t);
    }), (i, l) => (u(), U(Yv, Ke(je(e)), {
      icon: se((r) => [
        xe(i.$slots, "icon", Ke(je(r)))
      ]),
      "status-bar": se((r) => [
        xe(i.$slots, "status-bar", Ke(je(r)))
      ]),
      _: 3
    }, 16));
  }
});
function _f(n) {
  const e = ee(n), t = (i) => i || e.fs.path.get().path || "", o = (i) => {
    Array.isArray(i.files) && e.fs.setFiles(i.files);
  };
  return {
    async refresh() {
      const i = e.fs.path.get().path || "";
      e.adapter.invalidateListQuery(i), await e.adapter.open(i);
    },
    async open(i) {
      await e.adapter.open(i);
    },
    preview(i) {
      const l = (e.fs.files.get() || []).find((r) => r.path === i);
      !l || l.type !== "file" || e.modal.open(ft, { storage: l.storage, item: l });
    },
    notify(i, l) {
      Xe(e, i, l);
    },
    getPath() {
      return e.fs.path.get().path || "";
    },
    select(i) {
      const l = new Set((e.fs.files.get() || []).map((d) => d.path)), r = (i || []).filter((d) => l.has(d));
      e.fs.setSelection(r);
    },
    selectOne(i) {
      new Set((e.fs.files.get() || []).map((r) => r.path)).has(i) && e.fs.setSelection([i]);
    },
    clearSelection() {
      e.fs.clearSelection();
    },
    getSelectedPaths() {
      return (e.fs.selectedItems.get() || []).map((i) => i.path);
    },
    async createFolder(i, l) {
      const r = await e.adapter.createFolder({ path: t(l), name: i });
      o(r);
    },
    async createFile(i, l) {
      const r = await e.adapter.createFile({ path: t(l), name: i });
      o(r);
    },
    async delete(i, l) {
      const r = t(l), d = new Map(
        (e.fs.files.get() || []).map((f) => [f.path, f])
      ), c = (i || []).map((f) => d.get(f)).filter((f) => !!f).map((f) => ({ path: f.path, type: f.type })), v = await e.adapter.delete({ path: r, items: c });
      o(v);
    },
    async rename(i, l, r) {
      const d = await e.adapter.rename({
        path: t(r),
        item: i,
        name: l
      });
      o(d);
    },
    async copy(i, l, r) {
      const d = await e.adapter.copy({
        path: t(r),
        sources: i,
        destination: l
      });
      o(d);
    },
    async move(i, l, r) {
      const d = await e.adapter.move({
        path: t(r),
        sources: i,
        destination: l
      });
      o(d);
    },
    getFiles() {
      return e.fs.files.get() || [];
    },
    getStorages() {
      return e.fs.storages.get() || [];
    },
    isLoading() {
      return e.fs.isLoading();
    },
    isReadOnly() {
      return e.fs.getReadOnly();
    }
  };
}
const hf = {
  install(n, e = {}) {
    e.i18n = e.i18n ?? {};
    const [t] = Object.keys(e.i18n);
    e.locale = e.locale ?? t ?? "en", n.provide("VueFinderOptions", e), n.component("VueFinder", Qv);
  }
};
export {
  ko as ArrayDriver,
  Vt as BaseAdapter,
  be as ContextMenuIds,
  pf as IndexedDBDriver,
  xn as RemoteDriver,
  Qv as VueFinder,
  hf as VueFinderPlugin,
  Qv as VueFinderProvider,
  jn as contextMenuItems,
  uo as createLocaleAtom,
  hf as default,
  sn as parseBackendError,
  _f as useVueFinder
};
