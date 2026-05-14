<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Your Name | HCI & Generative Art Portfolio</title>

  <!-- p5.js：用于实时生成式视觉 -->
  <script src="https://cdn.jsdelivr.net/npm/p5@1.9.4/lib/p5.min.js"></script>

  <style>
    * {
      box-sizing: border-box;
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      font-family: Arial, "Microsoft YaHei", sans-serif;
      background: #050505;
      color: #f4f4f4;
      overflow-x: hidden;
    }

    /* p5.js 生成画布容器 */
    #canvas-container {
      position: fixed;
      inset: 0;
      z-index: -2;
      background: #050505;
    }

    /* 深色遮罩，让文字更清晰 */
    .noise-overlay {
      position: fixed;
      inset: 0;
      z-index: -1;
      background:
        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08), transparent 35%),
        linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.85));
      pointer-events: none;
    }

    nav {
      position: fixed;
      top: 0;
      width: 100%;
      padding: 22px 7vw;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
      backdrop-filter: blur(18px);
      background: rgba(5, 5, 5, 0.35);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .logo {
      font-size: 14px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #d8faff;
    }

    nav a {
      margin-left: 24px;
      color: #f4f4f4;
      text-decoration: none;
      font-size: 14px;
      opacity: 0.78;
    }

    nav a:hover {
      opacity: 1;
    }

    header {
      min-height: 100vh;
      padding: 20vh 7vw 12vh;
      display: flex;
      align-items: center;
    }

    .hero {
      max-width: 980px;
    }

    .eyebrow {
      color: #8ff6ff;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-size: 13px;
      margin-bottom: 24px;
    }

    h1 {
      margin: 0;
      font-size: clamp(48px, 9vw, 124px);
      line-height: 0.95;
      letter-spacing: -0.06em;
    }

    .hero p {
      max-width: 680px;
      margin-top: 32px;
      font-size: clamp(18px, 2.2vw, 28px);
      line-height: 1.55;
      color: rgba(255, 255, 255, 0.78);
    }

    .interaction-hint {
      display: inline-block;
      margin-top: 36px;
      padding: 12px 18px;
      border: 1px solid rgba(143, 246, 255, 0.45);
      border-radius: 999px;
      color: #8ff6ff;
      font-size: 14px;
      background: rgba(143, 246, 255, 0.08);
    }

    section {
      padding: 110px 7vw;
      position: relative;
    }

    .section-title {
      max-width: 760px;
      margin-bottom: 42px;
    }

    h2 {
      margin: 0;
      font-size: clamp(36px, 6vw, 72px);
      letter-spacing: -0.04em;
    }

    .section-title p {
      color: rgba(255, 255, 255, 0.68);
      font-size: 18px;
      line-height: 1.7;
    }

    .about-panel {
      max-width: 900px;
      padding: 32px;
      border-radius: 28px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(24px);
      color: rgba(255, 255, 255, 0.82);
      font-size: 19px;
      line-height: 1.8;
    }

    .project-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 26px;
    }

    .project-card {
      min-height: 420px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      border-radius: 30px;
      overflow: hidden;
      position: relative;
      background:
        linear-gradient(145deg, rgba(143, 246, 255, 0.18), rgba(255, 255, 255, 0.05)),
        rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.13);
      backdrop-filter: blur(22px);
      transition: transform 0.35s ease, border-color 0.35s ease;
    }

    .project-card:hover {
      transform: translateY(-10px);
      border-color: rgba(143, 246, 255, 0.65);
    }

    .project-number {
      position: absolute;
      top: 24px;
      right: 28px;
      font-size: 14px;
      color: #8ff6ff;
      opacity: 0.9;
    }

    .project-card h3 {
      margin: 0 0 14px;
      font-size: 28px;
    }

    .project-card p {
      color: rgba(255, 255, 255, 0.68);
      line-height: 1.7;
    }

    .tags {
      margin-top: 18px;
    }

    .tag {
      display: inline-block;
      margin-right: 8px;
      margin-bottom: 8px;
      padding: 7px 11px;
      border-radius: 999px;
      font-size: 12px;
      color: #d8faff;
      background: rgba(143, 246, 255, 0.1);
      border: 1px solid rgba(143, 246, 255, 0.22);
    }

    .contact {
      padding-bottom: 140px;
    }

    .contact a {
      color: #8ff6ff;
      text-decoration: none;
    }

    footer {
      padding: 32px 7vw;
      color: rgba(255, 255, 255, 0.45);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    @media (max-width: 760px) {
      nav {
        padding: 16px 5vw;
      }

      nav a {
        margin-left: 12px;
        font-size: 13px;
      }

      header,
      section {
        padding-left: 5vw;
        padding-right: 5vw;
      }

      .about-panel {
        padding: 24px;
      }
    }
  </style>
</head>

<body>
  <div id="canvas-container"></div>
  <div class="noise-overlay"></div>

  <nav>
    <div class="logo">Your Name</div>
    <div>
      <a href="#about">About</a>
      <a href="#works">Works</a>
      <a href="#contact">Contact</a>
    </div>
  </nav>

  <header>
    <div class="hero">
      <div class="eyebrow">Human-Computer Interaction · Generative Art</div>
      <h1>Designing living systems between human and machine.</h1>
      <p>
        我关注人机交互、生成式艺术与实时视觉系统，尝试通过代码、传感器、视觉算法和沉浸式媒介，
        探索人与机器共同生成感知经验的方式。
      </p>
      <div class="interaction-hint">移动鼠标 / 触摸屏幕，观察系统如何回应你</div>
    </div>
  </header>

  <section id="about">
    <div class="section-title">
      <h2>About</h2>
      <p>我的研究方向不是单纯展示作品，而是让网页本身成为一个可交互的生成系统。</p>
    </div>

    <div class="about-panel">
      我是一名数字媒体设计研究者，关注 Human-Computer Interaction、Generative Art、
      Creative Coding、TouchDesigner / vvvv 实时视觉系统与交互装置。
      我的作品通常从人的行为输入出发，例如触摸、移动、声音、身体动作或环境数据，
      再通过算法生成视觉反馈，使观众成为作品系统的一部分。
    </div>
  </section>

  <section id="works">
    <div class="section-title">
      <h2>Selected Works</h2>
      <p>这里可以放你的 TouchDesigner、vvvv、p5.js、装置、影像和交互设计作品。</p>
    </div>

    <div class="project-grid">
      <article class="project-card">
        <div class="project-number">01</div>
        <h3>Interactive Particle Field</h3>
        <p>
          基于观众触摸与鼠标移动的实时粒子系统，探索人类输入如何扰动机器生成的视觉秩序。
        </p>
        <div class="tags">
          <span class="tag">p5.js</span>
          <span class="tag">Generative Art</span>
          <span class="tag">Interaction</span>
        </div>
      </article>

      <article class="project-card">
        <div class="project-number">02</div>
        <h3>TouchDesigner Visual System</h3>
        <p>
          使用 TouchDesigner 构建的实时影像系统，可响应声音、身体动作或传感器数据。
        </p>
        <div class="tags">
          <span class="tag">TouchDesigner</span>
          <span class="tag">Realtime Visual</span>
          <span class="tag">Audio Reactive</span>
        </div>
      </article>

      <article class="project-card">
        <div class="project-number">03</div>
        <h3>vvvv Data Interface</h3>
        <p>
          使用 vvvv / VL 进行视觉化编程实验，将数据流、界面和生成图形连接成可体验系统。
        </p>
        <div class="tags">
          <span class="tag">vvvv</span>
          <span class="tag">Dataflow</span>
          <span class="tag">Interface</span>
        </div>
      </article>
    </div>
  </section>

  <section id="contact" class="contact">
    <div class="section-title">
      <h2>Contact</h2>
      <p>
        Email：yourname@email.com<br />
        Instagram / Behance / GitHub：填写你的链接
      </p>
    </div>
  </section>

  <footer>
    © 2026 Your Name. Generative portfolio system.
  </footer>

  <script src="sketch.js"></script>
</body>
</html>
