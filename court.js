/**
 * Rally.io — Court Renderer
 * Top-down 2D court with net, lines, and player tokens.
 * Written as a standalone ES-style module (IIFE for compatibility).
 */

const CourtRenderer = (() => {
  // ── Constants ────────────────────────────────────────────────
  const W = 320, H = 520;

  // Court dimensions as fractions of canvas size
  const CX = W / 2;

  // Court rectangle in pixels
  const COURT = {
    left:   W * 0.08,
    right:  W * 0.92,
    top:    H * 0.04,
    bottom: H * 0.96,
  };
  COURT.width  = COURT.right - COURT.left;
  COURT.height = COURT.bottom - COURT.top;

  // Service boxes (as fraction of court height from top/bottom)
  const SERVICE_DEPTH = 0.335; // service line is 33.5% from each baseline

  // Net is at vertical center
  const NET_Y = COURT.top + COURT.height * 0.5;

  // Center service line x
  const CENTER_X = CX;

  // Alley lines (doubles sidelines already = COURT edges; singles sidelines inset)
  const SINGLES_LEFT  = COURT.left  + COURT.width * 0.09;
  const SINGLES_RIGHT = COURT.right - COURT.width * 0.09;

  // ── Surface palettes ─────────────────────────────────────────
  function getPalette(surfaceId, dark) {
    const p = {
      clay:  { court: dark ? '#6b2000' : '#c04a1a', out: dark ? '#3d1200' : '#8b3010',
                line: 'rgba(255,255,255,0.88)', net: '#d4a060', post: '#bbb' },
      grass: { court: dark ? '#0f4520' : '#1e7a35', out: dark ? '#082010' : '#0f4020',
                line: 'rgba(255,255,255,0.9)',  net: '#ddd480', post: '#ccc' },
      hard:  { court: dark ? '#0a3060' : '#1460b0', out: dark ? '#061830' : '#0c3070',
                line: 'rgba(255,255,255,0.9)',  net: '#ddeeff', post: '#ccc' },
    };
    return p[surfaceId] || p.hard;
  }

  // ── Draw ─────────────────────────────────────────────────────
  function draw(canvas, surfaceId, dark) {
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const pal = getPalette(surfaceId, dark);

    // Background (out-of-bounds area)
    ctx.fillStyle = pal.out;
    ctx.fillRect(0, 0, W, H);

    // Court surface
    ctx.fillStyle = pal.court;
    ctx.fillRect(COURT.left, COURT.top, COURT.width, COURT.height);

    // Subtle court texture lines (horizontal streaks on hard)
    if (surfaceId === 'hard') {
      ctx.save();
      ctx.globalAlpha = 0.04;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      for (let y = COURT.top; y < COURT.bottom; y += 6) {
        ctx.beginPath();
        ctx.moveTo(COURT.left, y);
        ctx.lineTo(COURT.right, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Subtle clay drag marks
    if (surfaceId === 'clay') {
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      for (let y = COURT.top + 10; y < COURT.bottom; y += 14) {
        ctx.beginPath();
        ctx.moveTo(COURT.left + 4, y);
        ctx.lineTo(COURT.right - 4, y + 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // ── Court lines ──────────────────────────────────────────
    ctx.strokeStyle = pal.line;

    // Outer boundary (full doubles)
    ctx.lineWidth = 2.5;
    ctx.strokeRect(COURT.left, COURT.top, COURT.width, COURT.height);

    // Singles sidelines
    ctx.lineWidth = 1.5;
    line(ctx, SINGLES_LEFT,  COURT.top,    SINGLES_LEFT,  COURT.bottom);
    line(ctx, SINGLES_RIGHT, COURT.top,    SINGLES_RIGHT, COURT.bottom);

    // Service lines — top half
    const topSvcY = COURT.top + COURT.height * SERVICE_DEPTH;
    line(ctx, SINGLES_LEFT, topSvcY, SINGLES_RIGHT, topSvcY);

    // Service lines — bottom half
    const botSvcY = COURT.bottom - COURT.height * SERVICE_DEPTH;
    line(ctx, SINGLES_LEFT, botSvcY, SINGLES_RIGHT, botSvcY);

    // Center service line (top box)
    line(ctx, CENTER_X, COURT.top, CENTER_X, topSvcY);

    // Center service line (bottom box)
    line(ctx, CENTER_X, botSvcY, CENTER_X, COURT.bottom);

    // Center mark at each baseline (tiny tick)
    ctx.lineWidth = 1.5;
    line(ctx, CENTER_X, COURT.top,    CENTER_X, COURT.top    + 8);
    line(ctx, CENTER_X, COURT.bottom, CENTER_X, COURT.bottom - 8);

    // ── Net ──────────────────────────────────────────────────
    // Net shadow
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 10;
    line(ctx, COURT.left - 4, NET_Y + 3, COURT.right + 4, NET_Y + 3);
    ctx.restore();

    // Net posts
    ctx.fillStyle = pal.post;
    ctx.beginPath();
    ctx.arc(COURT.left - 3, NET_Y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(COURT.right + 3, NET_Y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Net body — mesh look
    ctx.save();
    ctx.strokeStyle = pal.net;
    ctx.lineWidth = 4;
    line(ctx, COURT.left - 3, NET_Y, COURT.right + 3, NET_Y);

    // Net mesh verticals
    ctx.lineWidth = 0.7;
    ctx.globalAlpha = 0.45;
    const meshStep = COURT.width / 18;
    for (let x = COURT.left; x <= COURT.right; x += meshStep) {
      line(ctx, x, NET_Y - 7, x, NET_Y + 7);
    }
    // Net top white band
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    line(ctx, COURT.left - 3, NET_Y - 7, COURT.right + 3, NET_Y - 7);
    ctx.restore();

    // ── Side labels ───────────────────────────────────────────
    ctx.save();
    ctx.font = 'bold 10px "Bebas Neue", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.textAlign = 'center';
    ctx.fillText('OPONENTE', CENTER_X, COURT.top + 20);
    ctx.fillText('VOCÊ',     CENTER_X, COURT.bottom - 10);
    ctx.restore();

    // ── Vignette ─────────────────────────────────────────────
    const vig = ctx.createRadialGradient(CX, H * 0.5, H * 0.1, CX, H * 0.5, H * 0.6);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, dark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.18)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
  }

  function line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // ── Token positioning helpers ─────────────────────────────
  /**
   * Convert normalized court position (0..1 x, 0..1 z where 0=opp side, 1=player side)
   * to pixel coordinates on the canvas.
   */
  function courtToPixel(normX, normZ) {
    const x = COURT.left + normX * COURT.width;
    const y = COURT.top  + (1 - normZ) * COURT.height;
    return { x, y };
  }

  /**
   * Convert canvas pixel to CSS offset for overlaid DOM token.
   */
  function pixelToTokenCSS(px, py, wrapEl, tokenRadius) {
    const scaleX = wrapEl.offsetWidth  / W;
    const scaleY = wrapEl.offsetHeight / H;
    return {
      left: px * scaleX - tokenRadius,
      top:  py * scaleY - tokenRadius,
    };
  }

  return { draw, courtToPixel, pixelToTokenCSS, CANVAS_W: W, CANVAS_H: H };
})();