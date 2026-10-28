import { useCallback, useEffect, useRef, useState } from 'react'
import { Player, type PlayerRef } from '@remotion/player'
import { ArrowLeft, ArrowRight, Expand, FileText, Minimize, Pause, Play, Presentation as PresentationIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Dock, { type DockItemData } from '@/components/Dock'
import AnimatedContent from '@/components/AnimatedContent'
import { SlideTransition } from './SlideTransition'
import { FRAME_RATE, HOLD_FRAMES, presentationSlides, TOTAL_SECONDS } from './content'
import './presentation.css'

export default function Presentation() {
  const playerRef = useRef<PlayerRef>(null)
  const rootRef = useRef<HTMLElement>(null)
  const currentRef = useRef(0)
  const [navigation, setNavigation] = useState({ from: 0, to: 0, fromFrame: 0, revision: 0 })
  const [paused, setPaused] = useState(false)
  const [notes, setNotes] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [fullscreenError, setFullscreenError] = useState('')
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  const goTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(presentationSlides.length - 1, index))
    const from = currentRef.current
    if (next === from) return
    const fromFrame = playerRef.current?.getCurrentFrame() ?? 0
    currentRef.current = next
    setNavigation(previous => ({ from, to: next, fromFrame, revision: previous.revision + 1 }))
    setPaused(false)
  }, [])

  const togglePlayback = useCallback(() => {
    const player = playerRef.current
    if (!player) return
    if (player.isPlaying()) { player.pause(); setPaused(true) }
    else { player.play(); setPaused(false) }
  }, [])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await rootRef.current?.requestFullscreen()
      setFullscreenError('')
    } catch {
      setFullscreenError('全画面表示を開始できませんでした。ブラウザの全画面機能をご利用ください。')
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('input,textarea,select,[contenteditable="true"]')) return
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        if (!event.repeat) goTo(currentRef.current + (event.key === 'ArrowRight' ? 1 : -1))
      }
      if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); goTo(event.key === 'Home' ? 0 : presentationSlides.length - 1) }
      if (event.code === 'Space') { event.preventDefault(); if (!event.repeat) togglePlayback() }
    }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotionChange = () => setReducedMotion(media.matches)
    const onFullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement))
    window.addEventListener('keydown', onKey)
    media.addEventListener('change', onMotionChange)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => {
      window.removeEventListener('keydown', onKey)
      media.removeEventListener('change', onMotionChange)
      document.removeEventListener('fullscreenchange', onFullscreenChange)
    }
  }, [goTo, togglePlayback])

  const dockItems: DockItemData[] = [
    { icon: <ArrowLeft />, label: '前のスライド', onClick: () => goTo(navigation.to - 1), className: navigation.to === 0 ? 'dock-disabled' : '' },
    { separator: true },
    { icon: paused ? <Play /> : <Pause />, label: paused ? 'デモを再生' : 'デモを一時停止', onClick: togglePlayback, active: !paused },
    { icon: <FileText />, label: '発表メモ', onClick: () => setNotes(value => !value), active: notes },
    { icon: fullscreen ? <Minimize /> : <Expand />, label: fullscreen ? '全画面を終了' : '全画面表示', onClick: toggleFullscreen, active: fullscreen },
    { separator: true },
    { icon: <ArrowRight />, label: '次のスライド', onClick: () => goTo(navigation.to + 1), className: navigation.to === presentationSlides.length - 1 ? 'dock-disabled' : '' },
  ]

  return <main className="presentation-app presentation-lux" ref={rootRef}>
    <div className="ambient ambient-a" /><div className="ambient ambient-b" />
    {!fullscreen && <header className="presentation-topbar glass-bar">
      <span><PresentationIcon size={18} />2Dシューティングゲーム</span>
      <Badge variant="secondary">要求定義</Badge>
      <span className="presentation-duration">発表目安 {Math.floor(TOTAL_SECONDS / 60)}分{TOTAL_SECONDS % 60}秒</span>
    </header>}

    <div className="presentation-workspace">
      <div className="presentation-stage-shell">
        <div className="stage-edge" aria-hidden="true" />
        <div className="presentation-stage" aria-label={`${navigation.to + 1}枚目：${presentationSlides[navigation.to].title}`}>
          <Player
            key={navigation.revision}
            ref={playerRef}
            component={SlideTransition}
            inputProps={{ from: navigation.from, to: navigation.to, fromFrame: navigation.fromFrame, reducedMotion }}
            durationInFrames={HOLD_FRAMES}
            compositionWidth={1600}
            compositionHeight={900}
            fps={FRAME_RATE}
            autoPlay
            initiallyMuted
            numberOfSharedAudioTags={0}
            controls={false}
            clickToPlay={false}
            doubleClickToFullscreen={false}
            spaceKeyToPlayOrPause={false}
            moveToBeginningWhenEnded={false}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>

    <div className="presentation-meta glass-pill">
      <strong>{String(navigation.to + 1).padStart(2, '0')}</strong><span>/ {String(presentationSlides.length).padStart(2, '0')}</span><i />
      <span className="meta-title">{presentationSlides[navigation.to].title}</span>
    </div>

    <div className="presentation-dock-shell">
      <Dock
        items={dockItems}
        position="bottom"
        theme="light"
        baseItemSize={42}
        magnification={56}
        panelHeight={56}
        gap={8}
        distance={150}
        roundness={0.62}
        bounce={!reducedMotion}
        tiles
        showLabels
        showIndicators={false}
        showBadges={false}
        accentColor="#8cb8ff"
        badgeColor="#7aa8ff"
      />
    </div>

    {notes && <AnimatedContent key={navigation.to} trigger="mount" distance={12} duration={.3} blur={3} className="speaker-notes glass-notes" id="speaker-notes">
      <div><FileText size={18} /><strong>発表メモ</strong><Badge variant="outline">目安 {presentationSlides[navigation.to].seconds}秒</Badge></div>
      <p>{presentationSlides[navigation.to].notes}</p>
    </AnimatedContent>}
    {fullscreenError && <p className="fullscreen-error" role="status">{fullscreenError}</p>}
  </main>
}
