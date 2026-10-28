import { useCallback, useEffect, useRef, useState } from 'react'
import { Player, type PlayerRef } from '@remotion/player'
import { ArrowLeft, ArrowRight, Expand, FileText, Minimize, Pause, Play, Presentation as PresentationIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import AnimatedContent from '@/components/AnimatedContent'
import { SlideTransition } from './SlideTransition'
import { FRAME_RATE, HOLD_FRAMES, slides, TOTAL_SECONDS } from './content'
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
    const next = Math.max(0, Math.min(slides.length - 1, index))
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
    } catch { setFullscreenError('全画面表示を開始できませんでした。ブラウザの全画面機能をご利用ください。') }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('input,textarea,select,[contenteditable="true"]')) return
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        if (!event.repeat) goTo(currentRef.current + (event.key === 'ArrowRight' ? 1 : -1))
      }
      if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); goTo(event.key === 'Home' ? 0 : slides.length - 1) }
      if (event.code === 'Space' && !(event.target instanceof HTMLElement && event.target.closest('button'))) { event.preventDefault(); if (!event.repeat) togglePlayback() }
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

  return <TooltipProvider><main className="presentation-app" ref={rootRef}>
    <div className="presentation-topbar"><span><PresentationIcon size={19} />2Dシューティングゲーム</span><Badge variant="secondary">要求定義</Badge><span className="presentation-duration">発表目安 {Math.floor(TOTAL_SECONDS / 60)}分{TOTAL_SECONDS % 60}秒</span></div>
    <div className="presentation-workspace"><div className="presentation-stage" aria-label={`${navigation.to + 1}枚目：${slides[navigation.to].title}`}><Player
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
    /></div></div>
    <nav className="presentation-toolbar" aria-label="プレゼンテーション操作"><div className="toolbar-page"><span className="page-number" aria-live="polite">{String(navigation.to + 1).padStart(2, '0')} <span>/ {String(slides.length).padStart(2, '0')}</span></span><Separator orientation="vertical" className="h-5" /><span className="toolbar-slide-title">{slides[navigation.to].title}</span></div><div className="toolbar-navigation"><Button variant="outline" size="icon" onClick={() => goTo(navigation.to - 1)} disabled={navigation.to === 0} aria-label="前のスライド"><ArrowLeft /></Button><span className="keyboard-hint">矢印キーで移動</span><Button variant="outline" size="icon" onClick={() => goTo(navigation.to + 1)} disabled={navigation.to === slides.length - 1} aria-label="次のスライド"><ArrowRight /></Button></div><div className="toolbar-tools"><Tooltip><TooltipTrigger render={<Button variant="ghost" size="icon" onClick={togglePlayback} aria-label={paused ? 'デモを再生' : 'デモを一時停止'} />}>{paused ? <Play /> : <Pause />}</TooltipTrigger><TooltipContent>{paused ? 'デモを再生' : 'デモを一時停止'}（Space）</TooltipContent></Tooltip><Tooltip><TooltipTrigger render={<Button variant="ghost" size="icon" onClick={() => setNotes(value => !value)} aria-label="発表メモ" aria-expanded={notes} aria-controls="speaker-notes" />}><FileText /></TooltipTrigger><TooltipContent>発表メモ</TooltipContent></Tooltip><Tooltip><TooltipTrigger render={<Button variant="ghost" size="icon" onClick={toggleFullscreen} aria-label={fullscreen ? '全画面表示を終了' : '全画面表示'} />}>{fullscreen ? <Minimize /> : <Expand />}</TooltipTrigger><TooltipContent>全画面表示</TooltipContent></Tooltip></div></nav>
    {notes && <AnimatedContent key={navigation.to} trigger="mount" distance={12} duration={.3} blur={3} className="speaker-notes" id="speaker-notes"><div><FileText size={18} /><strong>発表メモ</strong><Badge variant="outline">目安 {slides[navigation.to].seconds}秒</Badge></div><p>{slides[navigation.to].notes}</p><small>このメモは発表画面にも表示されます。</small></AnimatedContent>}
    {fullscreenError && <p className="fullscreen-error" role="status">{fullscreenError}</p>}
  </main></TooltipProvider>
}
