import { Img } from 'remotion'
import { ArrowUp, Check, Coins, Cross, Heart, History, MoveRight, RotateCcw, Shield, Sparkles, Swords, Timer } from 'lucide-react'
import type { CSSProperties } from 'react'
import { clamp, firstAttack, lerp, sampleBoss } from './demo-model'

export type DemoMode = 'combat' | 'enemies' | 'progression' | 'recovery' | 'boss'
const asset = (name: string) => `/assets/sprites/${name}.png`

function Sprite({ name, x, y, size = 100, style }: { name: string; x: number; y: number; size?: number; style?: CSSProperties }) {
  return <Img className="game-sprite" src={asset(name)} style={{ width: size, height: size, left: x - size / 2, top: y - size / 2, transform: name === 'enemy-fast' ? 'rotate(180deg)' : undefined, ...style }} />
}
function Shot({ x, y, color = 'enemy', angle = 0 }: { x: number; y: number; color?: string; angle?: number }) {
  return <i className={`game-bullet bullet-${color}`} style={{ left: x, top: y, transform: `translate(-50%,-50%) rotate(${angle}deg)` }} />
}
function Health({ value }: { value: number }) {
  return <div className="demo-health"><span>HP</span>{[1, 2, 3].map((i) => <Heart key={i} size={19} fill={i <= value ? 'currentColor' : 'none'} opacity={i <= value ? 1 : .25} />)}</div>
}
function Pickup({ x, y, health = false }: { x: number; y: number; health?: boolean }) {
  return <div className={`pickup ${health ? 'pickup-health' : ''}`} style={{ left: x, top: y }}>{health ? <Cross size={18} /> : <Coins size={19} />}</div>
}
function Blast({ x, y, progress }: { x: number; y: number; progress: number }) {
  return <div className="game-blast" style={{ left: x, top: y, opacity: 1 - progress, transform: `translate(-50%,-50%) scale(${.7 + progress * 1.8})` }} />
}

function Combat({ frame, progression = false }: { frame: number; progression?: boolean }) {
  const f = frame % 360
  const destroyed = f >= 96
  const collected = f >= 184
  const upgrade = progression && f >= 215 && f < 300
  const nextStage = progression && f >= 300
  const playerX = lerp(320, 280, (f - 130) / 50)
  return <>
    <Sprite name="player" x={playerX} y={lerp(385, 340, (f - 140) / 40)} />
    {!destroyed && <Sprite name="enemy-straight" x={280} y={130} />}
    <Sprite name="enemy-spread" x={490} y={115 + Math.sin(f / 25) * 8} size={105} />
    {!destroyed && [0, 1, 2].map((i) => <Shot key={i} color="player" x={lerp(320, 280, clamp(f / 80))} y={350 - ((f + i * 17) % 65) * 3.3} />)}
    {[0, 1, 2].map((i) => <Shot key={i} x={490 + (i - 1) * ((f % 80) * .7)} y={160 + (f % 80) * 2.4} />)}
    {f >= 96 && f < 118 && <Blast x={280} y={130} progress={(f - 96) / 22} />}
    {destroyed && !collected && <Pickup x={280} y={lerp(145, 340, (f - 96) / 88)} />}
    {progression && destroyed && !collected && <div className="pickup pickup-buff" style={{ left: 334, top: lerp(145, 340, (f - 96) / 88) }}><Shield size={18} /></div>}
    {collected && f < 215 && <div className="floating-message" style={{ left: 280, top: 275 }}>ポイント +20</div>}
    {upgrade && <div className="game-overlay"><div className="upgrade-popup"><Check size={30} /><h4>ステージクリア</h4><p>ポイントで武器を強化</p><div className="upgrade-choice"><Swords size={24} /><span>武器を強化</span><span>20 pt</span></div><small>所持ポイント　120 → 100</small></div></div>}
    {progression && f < 45 && <div className="game-overlay"><div className="upgrade-popup"><Timer size={30} /><h4>ステージ開始</h4><p>ステージバフを選択</p><div className="upgrade-choice"><ArrowUp size={24} /><span>攻撃力上昇（例）</span><Check size={20} /></div><small>このステージ内のみ有効</small></div></div>}
    {progression && f >= 45 && f < 215 && <div className="buff-indicator"><ArrowUp size={15} />ステージバフ{collected && <><Shield size={15} />永続バフ</>}</div>}
    {nextStage && <><div className="stage-toast"><Shield size={20} />次のステージへ / 永続バフを維持</div>{[0, 1].map((i) => <Shot key={i} color="player" x={playerX + (i ? 13 : -13)} y={350 - ((f - 300) % 50) * 4} />)}</>}
    <div className="demo-hud-bottom"><Health value={3} /><span><Coins size={17} /> {nextStage ? 100 : collected ? 120 : 100} pt</span></div>
    <div className="demo-caption">{upgrade ? 'クリア後に強化フェーズへ移行' : nextStage ? '武器を強化して次のステージへ' : progression && f < 45 ? '開始時にステージバフを選ぶ' : collected ? '回収した時点でポイントを獲得' : destroyed ? '倒した敵からポイントが落ちる' : '移動しながら敵を攻撃'}</div>
  </>
}

const enemyExamples = [
  { name: 'enemy-straight', label: '直進弾', sub: '一定方向に発射' },
  { name: 'enemy-spread', label: '拡散弾', sub: '複数の弾を同時発射' },
  { name: 'enemy-fast', label: '高速弾', sub: '弾速に違いをつける' },
  { name: 'enemy-move', label: '移動型', sub: '横移動しながら発射' },
]
function Enemies({ frame }: { frame: number }) {
  return <>{enemyExamples.map((enemy, index) => {
    const column = index % 2
    const row = Math.floor(index / 2)
    const origin = column * 320
    const top = 45 + row * 188
    const x = origin + 155 + (index === 3 ? Math.sin(frame / 22) * 57 : 0)
    const age = (frame * (index === 2 ? 2 : 1)) % 64
    return <div key={enemy.name}>
      <div className="enemy-demo-label" style={{ left: origin + 26, top: top + 8 }}>{enemy.label}<small>{enemy.sub}</small></div>
      <Sprite name={enemy.name} x={x} y={top + 91} size={94} />
      {(index === 1 ? [-1, 0, 1] : [0]).map((spread) => <Shot key={spread} x={x + spread * age * .75} y={top + 117 + age * 1.1} angle={spread * -25} />)}
    </div>
  })}<div className="enemy-demo-divider vertical" /><div className="enemy-demo-divider horizontal" /><div className="demo-caption">攻撃方法・動きの組み合わせ例</div></>
}

function Recovery({ frame }: { frame: number }) {
  const f = frame % 360
  const killed = f >= 80
  const collected = f >= 163
  const defeat = f >= 222 && f < 270
  const retry = f >= 270
  const playerY = retry ? 375 : lerp(385, 324, (f - 125) / 38)
  const hp = retry ? 3 : defeat ? 0 : f >= 205 ? 1 : collected ? 2 : 1
  return <>
    {!killed && <><div className="enemy-glow" style={{ left: 320, top: 125, opacity: .7 + Math.sin(f / 7) * .3 }} /><Sprite name="enemy-move" x={320} y={125} /></>}
    {!defeat && <Sprite name="player" x={320} y={playerY} style={{ opacity: f >= 202 && f < 222 ? (Math.floor(f / 3) % 2 ? .2 : 1) : 1 }} />}
    {!killed && <Shot color="player" x={320} y={340 - (f % 55) * 4} />}
    {f >= 80 && f < 102 && <Blast x={320} y={125} progress={(f - 80) / 22} />}
    {killed && !collected && <><Pickup health x={320} y={lerp(140, 324, (f - 80) / 83)} /><Pickup x={425} y={lerp(140, 280, (f - 80) / 83)} /></>}
    {collected && f < 194 && <div className="floating-message health-message" style={{ left: 320, top: 260 }}>HP 回復</div>}
    {f >= 195 && f < 205 && <Shot x={320} y={lerp(150, playerY, (f - 195) / 10)} />}
    {f >= 213 && f < 222 && <Shot x={320} y={lerp(150, playerY, (f - 213) / 9)} />}
    {defeat && <div className="game-overlay"><div className="retry-popup"><RotateCcw size={32} /><h4>HP が 0 → 敗北</h4><p>同じステージから再挑戦</p></div></div>}
    {retry && <div className="stage-toast"><RotateCcw size={20} />HP を全回復して再挑戦</div>}
    <div className="demo-hud-bottom"><Health value={hp} /><span><Coins size={17} />120 pt <Shield size={17} /> 永続</span></div>
    <div className="demo-caption">{retry ? '所持ポイント・永続バフは維持' : defeat ? '敗北したステージの最初に戻る' : collected ? '回復アイテムを回収すると HP 回復' : killed ? '回復アイテムを通常ポイントと別にドロップ' : '特定ステージ以降、一部の敵がランダムに発光'}</div>
  </>
}

export function BossDemo({ frame }: { frame: number }) {
  const state = sampleBoss(frame)
  const f = frame % 360
  const rewinding = state.phase === 1
  const adapt = state.phase === 2
  return <>
    <Sprite name="boss-sprite" x={320} y={136} size={172} />
    <div className="boss-health"><span>最終ボス</span><i /></div>
    {state.phase === 0 && <svg className="game-svg" viewBox="0 0 640 480"><path d="M320 390 H490" stroke="#7093b4" strokeWidth="2" strokeDasharray="5 6" opacity=".5" /></svg>}
    {rewinding && [0, 1, 2, 3].map(i => <Sprite key={i} name="player" x={firstAttack(clamp(119 - i * 24, 0, 119)).playerX} y={390} size={90} style={{ opacity: .07 + i * .04 }} />)}
    {adapt && <><svg className="game-svg" viewBox="0 0 640 480"><path d="M320 217 L490 390" stroke="#f1a194" strokeWidth="2" strokeDasharray="5 7" opacity=".45" /></svg><div className="target-mark" style={{ left: 490, top: 390 }} /></>}
    <Shot x={state.bulletX} y={state.bulletY} color={rewinding ? 'rewind' : 'enemy'} angle={adapt ? -34 : 0} />
    <Sprite name="player" x={state.playerX} y={390} size={95} style={{ opacity: state.hit && Math.floor(f / 4) % 2 ? .25 : 1 }} />
    {state.phase === 0 && f > 65 && <div className="dodge-label"><MoveRight size={20} />右に回避</div>}
    {rewinding && <div className="rewind-label"><History size={23} />巻き戻し中</div>}
    {adapt && <div className="attack-label">前回の回避先を狙う</div>}
    <div className="demo-hud-bottom"><Health value={state.hit ? 2 : 3} /><span className={rewinding ? 'rewind-clock' : ''}>{rewinding && <History size={17} />}{state.time.toFixed(1)} s</span></div>
    <div className="demo-caption"><span className="phase-number">{state.phase + 1}</span>{['攻撃を記録 → プレイヤーが右へ回避', '位置・攻撃状態を数秒前まで戻す', '右方向を狙う攻撃に変えて再実行'][state.phase]}</div>
  </>
}

const labels: Record<DemoMode, string> = { combat: '基本プレイ', enemies: '敵の攻撃パターン', progression: 'ポイントと強化', recovery: '回復と再挑戦', boss: '巻き戻しボス' }
export function GameDemo({ mode, frame, reducedMotion = false }: { mode: DemoMode; frame: number; reducedMotion?: boolean }) {
  const f = reducedMotion ? 72 : frame % 360
  return <div className={`game-demo demo-${mode}`} role="img" aria-label={`${labels[mode]}のループ動作例`}>
    <div className="demo-grid" style={{ transform: `translateY(${reducedMotion ? 0 : f % 32}px)` }} />
    <div className="demo-topline"><span><Sparkles size={16} />{labels[mode]}</span><span>{reducedMotion ? '静止表示' : 'ループ再生'}<RotateCcw size={14} /></span></div>
    <div className="demo-action" style={{ opacity: Math.min(1, f / 8, (360 - f) / 8) }}>{mode === 'boss' ? <BossDemo frame={f} /> : mode === 'enemies' ? <Enemies frame={f} /> : mode === 'recovery' ? <Recovery frame={f} /> : <Combat frame={f} progression={mode === 'progression'} />}</div>
  </div>
}

export function DemoFigure({ mode, frame, reducedMotion }: { mode: DemoMode; frame: number; reducedMotion: boolean }) {
  return <figure className="demo-figure"><div className="demo-viewport"><GameDemo mode={mode} frame={frame} reducedMotion={reducedMotion} /></div><figcaption>動作例。外観・数値・攻撃パターンは実装班が決定。</figcaption></figure>
}

