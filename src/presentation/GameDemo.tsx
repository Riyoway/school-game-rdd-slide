import { Img } from 'remotion'
import { Cross, Heart } from 'lucide-react'
import type { CSSProperties, ReactElement } from 'react'
import { clamp, firstAttack, lerp, sampleBoss } from './demo-model'

export type DemoMode = 'combat' | 'enemies' | 'progression' | 'recovery' | 'boss'
const asset = (name: string) => `/assets/sprites/${name}.png`
const smooth = (t: number) => { const x = clamp(t); return x * x * (3 - 2 * x) }

function Sprite({ name, x, y, size = 88, opacity = 1, style }: { name: string; x: number; y: number; size?: number; opacity?: number; style?: CSSProperties }) {
  return <Img className="game-sprite" src={asset(name)} style={{ width: size, height: size, left: x - size / 2, top: y - size / 2, opacity, transform: name === 'enemy-fast' ? 'rotate(180deg)' : undefined, ...style }} />
}
function Shot({ x, y, color = 'enemy', angle = 0, scale = 1 }: { x: number; y: number; color?: string; angle?: number; scale?: number }) {
  return <i className={`game-bullet bullet-${color}`} style={{ left: x, top: y, transform: `translate(-50%,-50%) rotate(${angle}deg) scale(${scale})` }} />
}
function Health({ value }: { value: number }) {
  return <div className="demo-health"><span>HP</span>{[1, 2, 3].map(i => <Heart key={i} size={15} strokeWidth={1.8} fill={i <= value ? 'currentColor' : 'none'} opacity={i <= value ? 1 : .22} />)}</div>
}
function Field({ frame, speed = 1 }: { frame: number; speed?: number }) {
  const offset = (frame * speed) % 48
  const markers = [52, 164, 278, 392, 516]
  return <>
    <div className="world-lines" style={{ transform: `translateY(${offset}px)` }} />
    {markers.map((x, i) => {
      const y = ((i * 97 + frame * speed * 1.6) % 520) - 24
      return <i key={x} className="world-marker" style={{ left: x, top: y, opacity: .18 + (i % 3) * .07 }} />
    })}
  </>
}
function Hud({ hp = 3, progress, tag }: { hp?: number; progress?: number; tag?: string }) {
  return <div className="game-hud"><Health value={hp} />{tag && <span className="hud-tag">{tag}</span>}{progress !== undefined && <div className="hud-progress"><i style={{ width: `${progress * 100}%` }} /></div>}</div>
}

function Combat({ frame }: { frame: number }) {
  const f = frame % 360
  const playerX = 320 + Math.sin(f / 30) * 70
  const enemyY = 92 + ((f * 1.05) % 90)
  return <>
    <Field frame={f} speed={1.2} />
    <Sprite name="player" x={playerX} y={386} size={86} />
    <Sprite name="enemy-straight" x={220 + Math.sin(f / 34) * 18} y={enemyY} size={82} />
    <Sprite name="enemy-spread" x={454 + Math.cos(f / 38) * 25} y={112 + ((f * .74) % 58)} size={86} />
    {[0, 1].map(i => <Shot key={i} color="player" x={playerX + (i ? 10 : -10)} y={350 - ((f + i * 18) % 70) * 4.4} scale={.88} />)}
    {[-1, 0, 1].map((spread, i) => { const age = (f + i * 7) % 90; return <Shot key={spread} x={454 + spread * age * .55} y={160 + age * 2.45} angle={spread * -18} scale={.9} /> })}
    <Hud hp={3} progress={(f % 360) / 360} />
  </>
}

const enemyExamples = [
  { name: 'enemy-straight', x: 130, phase: 0 },
  { name: 'enemy-spread', x: 265, phase: 22 },
  { name: 'enemy-fast', x: 400, phase: 44 },
  { name: 'enemy-move', x: 515, phase: 66 },
] as const
function Enemies({ frame }: { frame: number }) {
  const f = frame % 360
  return <>
    <Field frame={f} speed={.9} />
    {enemyExamples.map((enemy, index) => {
      const cycle = (f + enemy.phase) % 180
      const y = 55 + cycle * 1.55
      const x = enemy.x + (index === 3 ? Math.sin(f / 18) * 38 : 0)
      const alpha = Math.min(1, cycle / 18, (180 - cycle) / 20)
      return <div key={enemy.name} style={{ opacity: alpha }}>
        <Sprite name={enemy.name} x={x} y={y} size={78} />
        {index === 1 ? [-1, 0, 1].map(s => <Shot key={s} x={x + s * 24} y={y + 45} angle={s * -22} scale={.82} />) : <Shot x={x} y={y + 48} scale={index === 2 ? .72 : .88} />}
      </div>
    })}
    <Sprite name="player" x={320 + Math.sin(f / 26) * 42} y={392} size={82} />
    <Hud hp={3} tag="4 ENEMY TYPES" />
  </>
}

function Progression({ frame }: { frame: number }) {
  const f = frame % 360
  const progress = f / 360
  const playerX = 320 + Math.sin(f / 27) * 54
  const waveA = 1 - smooth((f - 96) / 28)
  const waveB = smooth((f - 88) / 28) * (1 - smooth((f - 214) / 28))
  const waveC = smooth((f - 206) / 28)
  return <>
    <Field frame={f} speed={1.55} />
    <Sprite name="player" x={playerX} y={392} size={84} />
    <div style={{ opacity: waveA }}><Sprite name="enemy-straight" x={225} y={128 + Math.sin(f / 20) * 12} size={78} /><Sprite name="enemy-straight" x={415} y={88 + Math.cos(f / 23) * 10} size={78} /></div>
    <div style={{ opacity: waveB }}><Sprite name="enemy-fast" x={205 + Math.sin(f / 17) * 30} y={118} size={76} /><Sprite name="enemy-move" x={430 + Math.sin(f / 19) * 55} y={160} size={80} /></div>
    <div style={{ opacity: waveC }}><Sprite name="enemy-spread" x={190} y={112} size={82} /><Sprite name="enemy-fast" x={330} y={145} size={74} /><Sprite name="enemy-move" x={470 + Math.sin(f / 16) * 35} y={92} size={78} /></div>
    {[0, 1].map(i => <Shot key={i} color="player" x={playerX + (i ? 10 : -10)} y={350 - ((f + i * 17) % 66) * 4.4} scale={.86} />)}
    <Hud hp={3} progress={progress} tag={f < 112 ? 'EARLY' : f < 232 ? 'MID' : 'LATE'} />
    {f > 320 && <div className="boss-approach" style={{ opacity: smooth((f - 320) / 24) }}>BOSS APPROACHING</div>}
  </>
}

function Recovery({ frame }: { frame: number }) {
  const f = frame % 360
  const killed = f >= 92
  const collected = f >= 176
  const defeatP = smooth((f - 230) / 18) * (1 - smooth((f - 274) / 16))
  const retry = f >= 274
  const playerY = retry ? 392 : lerp(392, 332, smooth((f - 132) / 46))
  const hp = retry ? 3 : defeatP > .55 ? 0 : f >= 216 ? 1 : collected ? 2 : 1
  return <>
    <Field frame={f} speed={1.1} />
    {!killed && <><div className="enemy-glow" style={{ left: 320, top: 132, opacity: .45 + Math.sin(f / 9) * .18 }} /><Sprite name="enemy-move" x={320 + Math.sin(f / 18) * 24} y={132} size={82} /></>}
    <Sprite name="player" x={320} y={playerY} size={84} opacity={defeatP > .7 ? 0 : 1} style={{ filter: f >= 212 && f < 230 && Math.floor(f / 3) % 2 ? 'brightness(2)' : undefined }} />
    {!killed && <Shot color="player" x={320} y={354 - (f % 64) * 4.2} scale={.88} />}
    {killed && !collected && <div className="pickup pickup-health" style={{ left: 320, top: lerp(140, 326, smooth((f - 92) / 84)) }}><Cross size={17} /></div>}
    {collected && f < 205 && <div className="heal-pulse" style={{ left: 320, top: playerY, opacity: 1 - smooth((f - 176) / 29), transform: `translate(-50%,-50%) scale(${.6 + smooth((f - 176) / 29) * 1.7})` }} />}
    {f >= 210 && f < 230 && <Shot x={320} y={lerp(145, playerY, smooth((f - 210) / 20))} />}
    <div className="defeat-screen" style={{ opacity: defeatP }}><strong>DEFEAT</strong><span>RESTART FROM START</span></div>
    {retry && <div className="restart-flash" style={{ opacity: 1 - smooth((f - 274) / 24) }} />}
    <Hud hp={hp} tag={retry ? 'RESTART' : collected ? 'RECOVERED' : 'RUN'} />
  </>
}

export function BossDemo({ frame }: { frame: number }) {
  const state = sampleBoss(frame)
  const f = frame % 360
  const rewinding = state.phase === 1
  const adapt = state.phase === 2
  const phaseTag = ['SNAPSHOT', 'ROLLBACK', 'RE-SIMULATION'][state.phase]
  return <>
    <Field frame={rewinding ? 360 - f : f} speed={rewinding ? .8 : .55} />
    <Sprite name="boss-sprite" x={320} y={132} size={152} />
    <div className="boss-health"><span>BOSS</span><i /></div>
    {rewinding && [0, 1, 2, 3, 4].map(i => <Sprite key={i} name="player" x={firstAttack(clamp(119 - i * 18, 0, 119)).playerX} y={392} size={82} opacity={.05 + i * .035} />)}
    {adapt && <><svg className="game-svg" viewBox="0 0 640 480"><path d="M320 205 L490 392" stroke="#ff8d83" strokeWidth="1.5" strokeDasharray="4 7" opacity=".32" /></svg><div className="target-mark" style={{ left: 490, top: 392 }} /></>}
    <Shot x={state.bulletX} y={state.bulletY} color={rewinding ? 'rewind' : 'enemy'} angle={adapt ? -34 : 0} scale={.92} />
    <Sprite name="player" x={state.playerX} y={392} size={86} opacity={state.hit && Math.floor(f / 4) % 2 ? .28 : 1} />
    <Hud hp={state.hit ? 2 : 3} tag={phaseTag} />
    <div className={`time-strip ${rewinding ? 'is-rewinding' : ''}`}><i style={{ width: `${clamp(state.time / 4) * 100}%` }} /></div>
  </>
}

const components: Record<DemoMode, (props: { frame: number }) => ReactElement> = { combat: Combat, enemies: Enemies, progression: Progression, recovery: Recovery, boss: BossDemo }
const labels: Record<DemoMode, string> = { combat: '基本プレイ', enemies: '敵の違い', progression: '進行に応じた敵の変化', recovery: '回復と再挑戦', boss: '時間巻き戻しボス' }
export function GameDemo({ mode, frame, reducedMotion = false }: { mode: DemoMode; frame: number; reducedMotion?: boolean }) {
  const f = reducedMotion ? 72 : frame % 360
  const Component = components[mode]
  return <div className={`game-demo demo-${mode}`} role="img" aria-label={`${labels[mode]}の動作例`}><div className="demo-action"><Component frame={f} /></div></div>
}

export function DemoFigure({ mode, frame, reducedMotion }: { mode: DemoMode; frame: number; reducedMotion: boolean }) {
  return <figure className="demo-figure"><div className="demo-viewport"><GameDemo mode={mode} frame={frame} reducedMotion={reducedMotion} /></div><figcaption>{labels[mode]}の動作イメージ。外観・数値は確定仕様ではありません。</figcaption></figure>
}
