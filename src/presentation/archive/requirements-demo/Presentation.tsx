import { useCallback, useEffect, useState } from 'react'
import { Player } from '@remotion/player'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import './presentation.css'

type SlideProps = { slide: number; reducedMotion: boolean }

const slides = [
  'ゲームの提案', 'ゲーム全体像', '強化とバフ', '回復と再挑戦',
  '時間を巻き戻すボス', '開発・公開条件', '要求と自由度',
]

function Header({ number, label }: { number: string; label: string }) {
  return <div className="slide-header"><span>REQUIREMENTS / 2D SHOOTER</span><span>{number} / 07　{label}</span></div>
}

function Footer({ children }: { children: React.ReactNode }) {
  return <div className="slide-footer"><span>SOFTWARE ENGINEERING</span><span>{children}</span></div>
}

function GameVisual({ boss = false, frame, reducedMotion }: { boss?: boolean; frame: number; reducedMotion: boolean }) {
  const t = reducedMotion ? 40 : frame % (boss ? 240 : 180)
  const phase = boss ? Math.floor(t / 80) : 0
  const bulletY = boss ? interpolate(t % 80, [0, 79], [22, 79]) : interpolate(t % 60, [0, 59], [78, 18])
  const playerX = boss ? (phase === 0 ? interpolate(t % 80, [0, 79], [51, 74]) : phase === 1 ? interpolate(t % 80, [0, 79], [74, 51]) : 74) : interpolate(t % 180, [0, 45, 90, 135, 180], [47, 62, 48, 36, 47])
  return <div className={`game-visual ${boss ? 'boss-visual' : ''}`}>
    <img src={boss ? '/assets/boss.png' : '/assets/gameplay.png'} alt="" />
    <div className="visual-shade" />
    <div className="visual-top"><span>{boss ? 'STAGE 10 / BOSS' : 'STAGE 04 / CONCEPT'}</span><span>{boss && phase === 1 ? '◀◀  ROLLBACK' : 'LIVE SIMULATION'}</span></div>
    <div className="visual-crosshair" style={{ left: `${playerX}%`, top: boss ? '76%' : '72%' }}><i /></div>
    <div className={`visual-shot ${boss && phase === 1 ? 'rewind-shot' : ''}`} style={{ left: `${boss ? (phase === 2 ? 70 : 52) : playerX}%`, top: `${bulletY}%` }} />
    {boss && <div className="visual-phase"><span>0{phase + 1}</span>{['攻撃を回避', '数秒前へ巻き戻す', '回避先を狙い直す'][phase]}</div>}
    {!boss && <div className="visual-bottom"><span>HP <b>● ● ●</b></span><span>POINT <b>+120</b></span></div>}
    <div className="concept-label">GAMEPLAY CONCEPT / 実装イメージ</div>
  </div>
}

function Deck({ slide, reducedMotion }: SlideProps) {
  const frame = useCurrentFrame()
  return <AbsoluteFill className="deck">
    <div className="grain" />
    <div key={slide} className={`slide slide-${slide + 1} ${reducedMotion ? 'reduce' : ''}`}>
      {slide === 0 && <>
        <Header number="01" label="OVERVIEW" />
        <div className="cover-copy"><div className="eyebrow"><span className="dot" /> GAME REQUIREMENTS</div><h1>倒して、強くなる。<br /><em>時間を越えて、</em><br />最後の敵へ。</h1><p>全10ステージの 2D シューティングゲーム</p></div>
        <div className="cover-art"><GameVisual frame={frame} reducedMotion={reducedMotion} /></div>
        <div className="cover-index"><span>01—07</span><span>要求定義プレゼンテーション</span></div>
        <Footer>約5分 / REQUIREMENTS PRESENTATION</Footer>
      </>}
      {slide === 1 && <>
        <Header number="02" label="THE GAME LOOP" />
        <div className="title-row"><div><div className="eyebrow">THE GAME LOOP</div><h2>戦う。集める。<br />そして、強くなる。</h2></div><p>敵を倒して得たポイントで自機を強化。<br />ステージを進み、最終ボスに挑む。</p></div>
        <div className="loop-layout"><div className="loop-visual"><GameVisual frame={frame} reducedMotion={reducedMotion} /></div><div className="loop-side"><div className="metric"><strong>10</strong><span>ステージ<br /><small>最後にボス戦</small></span></div><div className="metric"><strong>4<span>+</span></strong><span>通常敵の種類<br /><small>動きや攻撃が異なる</small></span></div><div className="metric"><strong>3</strong><span>初期 HP<br /><small>0 になると敗北</small></span></div></div></div>
        <div className="loop-steps"><span><b>01</b> 敵を倒す</span><i /><span><b>02</b> ポイントを回収</span><i /><span><b>03</b> クリア後に強化</span><i /><span><b>04</b> 次のステージへ</span></div>
        <Footer>移動しながら攻撃 / 被弾直後は短時間無敵</Footer>
      </>}
      {slide === 2 && <>
        <Header number="03" label="PROGRESSION" />
        <div className="title-row"><div><div className="eyebrow">PROGRESSION</div><h2>強くなる方法は、<br />ひとつじゃない。</h2></div><p>ステージが進むほど敵の数や強さも増加。<br />獲得した資源を使い、攻略を続ける。</p></div>
        <div className="systems-grid"><div className="system lead"><span className="sys-no">01 / POINT</span><div className="system-symbol point-symbol"><span /><span /><span /></div><h3>ポイントと強化</h3><p>敵が落とすポイントを回収。<br />クリア後に自機や武器を強化・変更。</p></div><div className="system"><span className="sys-no">02 / STAGE BUFF</span><div className="system-symbol ring-symbol"><span /></div><h3>ステージバフ</h3><p>開始時に選択。攻撃力や弾速などを<br />そのステージ内だけ強化。</p><div className="tag">そのステージのみ</div></div><div className="system"><span className="sys-no">03 / PERMANENT BUFF</span><div className="system-symbol orbit-symbol"><span /></div><h3>永続バフ</h3><p>特定の敵から獲得する場合がある。<br />効果は弱めだが、ステージを跨いで継続。</p><div className="tag">ステージを跨いで継続</div></div></div>
        <Footer>具体的な武器・強化内容・数値は実装班が決定</Footer>
      </>}
      {slide === 3 && <>
        <Header number="04" label="RECOVERY & RETRY" />
        <div className="title-row"><div><div className="eyebrow">RECOVERY & RETRY</div><h2>倒れても、<br />積み重ねは残る。</h2></div><p>回復の機会を設け、敗北しても<br />同じステージから再挑戦できる。</p></div>
        <div className="retry-layout"><div className="recovery-panel"><div className="panel-index">01 / RECOVERY</div><div className="health-orb"><span>+</span></div><h3>光る敵が回復のチャンス</h3><p>特定ステージ以降、一部の敵がランダムに発光。<br />倒すと回復アイテムを落とし、回収で HP 回復。</p></div><div className="retry-panel"><div className="panel-index">02 / DEFEAT</div><div className="retry-intro"><span>HP</span><strong>0</strong><span>敗北</span></div><div className="retry-arrow">同じステージの最初から再挑戦</div><div className="retry-list"><div><span>HP</span><strong>全回復</strong></div><div><span>所持ポイント</span><strong>維持</strong></div><div><span>永続バフ</span><strong>維持</strong></div></div></div></div>
        <Footer>回復アイテムは通常ポイントとは別にドロップ</Footer>
      </>}
      {slide === 4 && <>
        <Header number="05" label="FINAL BOSS" />
        <div className="boss-title"><div><div className="eyebrow"><span className="dot" /> FINAL BOSS / STAGE 10</div><h2>一度避けた攻撃が、<br /><em>次はあなたを狙う。</em></h2></div><p>時間を巻き戻し、プレイヤーの<br />回避行動に合わせて攻撃を変える。</p></div>
        <div className="boss-layout"><GameVisual boss frame={frame} reducedMotion={reducedMotion} /><div className="boss-flow"><div><span>01</span><section><small>SNAPSHOT</small><h3>状態を記録</h3><p>位置や攻撃状態など、巻き戻しに必要な情報を記録。</p></section></div><div><span>02</span><section><small>STATE ROLLBACK</small><h3>数秒前に戻す</h3><p>巻き戻し中だと視覚的に伝える。</p></section></div><div><span>03</span><section><small>RE-SIMULATION</small><h3>攻撃を変えて再実行</h3><p>右に避けたなら、次は右を狙う。</p></section></div></div></div>
        <Footer>発射方向・位置・タイミング・弾速・弾数を変更可能 / 通常攻撃も2種類以上</Footer>
      </>}
      {slide === 5 && <>
        <Header number="06" label="DELIVERY" />
        <div className="title-row"><div><div className="eyebrow">DELIVERY</div><h2>誰でも開ける。<br />誰でも確かめられる。</h2></div><p>プレイ環境と開発成果物を<br />第三者に公開できる状態にする。</p></div>
        <div className="delivery-grid"><div><span className="delivery-num">01</span><h3>Web で遊べる</h3><p>PC を主対象に Chrome / Edge 等のモダンブラウザで動作。ログイン不要、基本的にクライアント側で実行。</p><small>CLOUDFLARE WORKERS & PAGES で公開</small></div><div><span className="delivery-num">02</span><h3>GitHub で共有</h3><p>Public Repository・MIT License。全員を Contributor として確認できること。</p><small>README に概要・操作・実行方法・ライセンス・公開 URL</small></div><div><span className="delivery-num">03</span><h3>AI は安全に活用</h3><p>AI や Coding Agent の使用は可。機密情報を入力せず、外部 OSS・コード・素材の利用条件を確認。</p><small>API キー / パスワード / 個人情報に注意</small></div></div>
        <Footer>公開 URL から第三者がプレイできること</Footer>
      </>}
      {slide === 6 && <>
        <Header number="07" label="HANDOFF" />
        <div className="end-heading"><div className="eyebrow">HANDOFF</div><h2>守ることを明確に。<br /><em>つくり方は、自由に。</em></h2><p>この要求を満たす範囲で、実装班の発想を活かす。</p></div>
        <div className="handoff-grid"><div><span className="handoff-label">REQUIRED / 必須</span><ul><li>10ステージ、通常敵4種類以上、初期 HP 3</li><li>ポイント・強化・バフ・回復・再挑戦</li><li>回避を学習する時間巻き戻しボス</li><li>Web 公開、GitHub、MIT License</li></ul></div><div><span className="handoff-label muted">FLEXIBLE / 実装班が決定</span><ul><li>言語・フレームワーク・操作キー</li><li>世界観、キャラクター、ステージ構成</li><li>武器やバフの種類・数値、敵の配置</li><li>ボスの通常攻撃や巻き戻し演出</li></ul></div></div>
        <div className="end-note">THANK YOU <span> / </span> QUESTIONS?</div>
        <Footer>要求定義 / 2D SHOOTING GAME</Footer>
      </>}
    </div>
  </AbsoluteFill>
}

export default function Presentation() {
  const [slide, setSlide] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const move = useCallback((delta: number) => setSlide((current) => Math.max(0, Math.min(slides.length - 1, current + delta))), [])
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        move(event.key === 'ArrowRight' ? 1 : -1)
      }
    }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReducedMotion(media.matches)
    window.addEventListener('keydown', onKeyDown)
    media.addEventListener('change', onChange)
    return () => { window.removeEventListener('keydown', onKeyDown); media.removeEventListener('change', onChange) }
  }, [move])
  return <main className="presentation-shell"><div className="presentation-stage"><Player component={Deck} inputProps={{ slide, reducedMotion }} durationInFrames={720} compositionWidth={1920} compositionHeight={1080} fps={30} autoPlay loop controls={false} style={{ width: '100%', height: '100%' }} /></div><nav className="presentation-controls" aria-label="スライド操作"><span className="control-caption">{slides[slide]}</span><div className="control-actions"><button type="button" onClick={() => move(-1)} disabled={slide === 0} aria-label="前のスライド">←</button><span aria-live="polite">{String(slide + 1).padStart(2, '0')} <i>/</i> {String(slides.length).padStart(2, '0')}</span><button type="button" onClick={() => move(1)} disabled={slide === slides.length - 1} aria-label="次のスライド">→</button></div><span className="control-hint">← → キーで移動</span></nav></main>
}
