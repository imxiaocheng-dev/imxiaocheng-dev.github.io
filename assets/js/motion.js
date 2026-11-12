/* ==========================================================================
   动效层（motion.js）—— 无依赖，约 3KB
   1) 首屏入场错峰    2) 滚动渐显    3) 阅读进度条
   4) 折叠面板平滑展开 5) 主题切换圆形揭示（View Transitions）
   全部在 prefers-reduced-motion: reduce 时自动停用。
   ========================================================================== */
(() => {
    "use strict";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    /* ---------------------------------------------------------------- 1. 首屏入场 */
    if (!reduce) {
        const selectors = [
            ".home-info-avatar",
            ".home-info-text-content h1",
            ".home-info-text-content .entry-content",
            ".social-icons",
            ".first-entry",
            ".post-entry:not(.first-entry)",
            ".post-header .post-title",
            ".post-header .post-meta",
            ".post-header .post-description",
        ];
        const seen = new Set();
        const items = [];
        selectors.forEach((sel) => {
            $$(sel).forEach((el) => {
                if (!seen.has(el)) {
                    seen.add(el);
                    items.push(el);
                }
            });
        });
        items.forEach((el, i) => {
            el.style.setProperty("--stagger", `${Math.min(i * 55, 440)}ms`);
            el.classList.add("motion-intro");
            // 入场结束后摘掉动画类，否则 animation-fill-mode: both 的终态会压住 hover transform
            const cleanup = () => {
                el.classList.remove("motion-intro");
                el.style.removeProperty("--stagger");
            };
            el.addEventListener("animationend", cleanup, { once: true });
            window.setTimeout(cleanup, 1600);
        });
    }

    /* ---------------------------------------------------------------- 2. 滚动渐显 */
    const content = $(".post-content");
    if (!reduce && content && "IntersectionObserver" in window) {
        const targets = $$(
            ".post-content > h2, .post-content > h3, .post-content > figure, .post-content > blockquote, .post-content > .highlight, .post-content > table, .post-content > ul, .post-content > ol",
            document
        ).filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.88);

        if (targets.length) {
            targets.forEach((el) => el.classList.add("reveal"));
            const io = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;
                        entry.target.classList.add("in-view");
                        io.unobserve(entry.target);
                    });
                },
                { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
            );
            targets.forEach((el) => io.observe(el));
        }
    }

    /* ---------------------------------------------------------------- 3. 阅读进度条 */
    if (content) {
        const bar = document.createElement("div");
        bar.id = "reading-progress";
        bar.setAttribute("aria-hidden", "true");
        document.body.appendChild(bar);

        let ticking = false;
        const update = () => {
            ticking = false;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
            bar.style.transform = `scaleX(${p.toFixed(4)})`;
        };
        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(update);
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        update();
    }

    /* ---------------------------------------------------------------- 4. 折叠面板平滑展开 */
    if (!reduce) {
        $$("details").forEach((details) => {
            const summary = details.querySelector(":scope > summary");
            const body = summary && Array.from(details.children).find((c) => c !== summary);
            if (!summary || !body) return;

            summary.addEventListener("click", (event) => {
                event.preventDefault();
                const start = details.open ? body.offsetHeight : 0;
                const end = details.open ? 0 : body.scrollHeight;

                body.style.overflow = "hidden";
                const anim = body.animate(
                    [{ height: `${start}px` }, { height: `${end}px` }],
                    { duration: 240, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)" }
                );
                if (details.open) {
                    anim.onfinish = () => {
                        body.style.overflow = "";
                        body.style.height = "";
                        details.open = false;
                    };
                } else {
                    details.open = true;
                    body.style.height = `${end}px`;
                    anim.onfinish = () => {
                        body.style.overflow = "";
                        body.style.height = "";
                    };
                }
            });
        });
    }

    /* ---------------------------------------------------------------- 5. 主题切换圆形揭示 */
    const toggle = document.getElementById("theme-toggle");
    if (toggle && document.startViewTransition && !reduce) {
        toggle.addEventListener(
            "click",
            (event) => {
                event.preventDefault();
                event.stopImmediatePropagation();

                const html = document.documentElement;
                const next = html.dataset.theme === "dark" ? "light" : "dark";
                const rect = toggle.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                const radius = Math.hypot(
                    Math.max(x, window.innerWidth - x),
                    Math.max(y, window.innerHeight - y)
                );

                const transition = document.startViewTransition(() => {
                    html.dataset.theme = next;
                    try {
                        localStorage.setItem("pref-theme", next);
                    } catch (e) {}
                });

                transition.ready
                    .then(() => {
                        document.documentElement.animate(
                            {
                                clipPath: [
                                    `circle(0px at ${x}px ${y}px)`,
                                    `circle(${radius}px at ${x}px ${y}px)`,
                                ],
                            },
                            {
                                duration: 520,
                                easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
                                pseudoElement: "::view-transition-new(root)",
                            }
                        );
                    })
                    .catch(() => {});
            },
            true
        );
    }
})();
