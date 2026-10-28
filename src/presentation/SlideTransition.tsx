import { AbsoluteFill } from 'remotion'
import { TransitionSeries, springTiming, type TransitionPresentation, type TransitionPresentationComponentProps } from '@remotion/transitions'
import { SlideContent } from './SlideContent'
import { HOLD_FRAMES, PRESENTATION_ORDER, TRANSITION_FRAMES } from './content'

type PanelProps = { direction: number; reducedMotion: boolean }
function PanelReveal({ children, presentationDirection, presentationProgress, passedProps }: TransitionPresentationComponentProps<PanelProps>) {
  const entering = presentationDirection === 'entering'
  const p = presentationProgress
  const direction = passedProps.direction
  if (passedProps.reducedMotion) return <AbsoluteFill style={{ opacity: entering ? p : 1 - p }}>{children}</AbsoluteFill>
  return <AbsoluteFill style={{
    overflow: 'hidden',
    opacity: entering ? p : 1 - p,
    transform: entering
      ? `translate3d(${direction * (1 - p) * 26}px, 0, 0) scale(${0.992 + p * 0.008})`
      : `translate3d(${-direction * p * 18}px, 0, 0) scale(${1 - p * 0.004})`,
    willChange: 'transform, opacity',
  }}>{children}</AbsoluteFill>
}

export type SlideTransitionProps = { from: number; to: number; fromFrame: number; reducedMotion: boolean }
export function SlideTransition({ from, to, fromFrame, reducedMotion }: SlideTransitionProps) {
  const fromIndex = PRESENTATION_ORDER[from] ?? PRESENTATION_ORDER[0]
  const toIndex = PRESENTATION_ORDER[to] ?? PRESENTATION_ORDER[0]
  const displayCount = PRESENTATION_ORDER.length
  if (from === to) return <SlideContent index={toIndex} displayIndex={to} displayCount={displayCount} reducedMotion={reducedMotion} />
  const presentation: TransitionPresentation<PanelProps> = { component: PanelReveal, props: { direction: to > from ? 1 : -1, reducedMotion } }
  const frames = reducedMotion ? 8 : TRANSITION_FRAMES
  return <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={frames}>
      <SlideContent index={fromIndex} displayIndex={from} displayCount={displayCount} reducedMotion={reducedMotion} fixedFrame={fromFrame} frameOffset={fromFrame} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={presentation} timing={springTiming({ durationInFrames: frames, config: { damping: 200, stiffness: 180, mass: 0.8 } })} />
    <TransitionSeries.Sequence durationInFrames={HOLD_FRAMES}>
      <SlideContent index={toIndex} displayIndex={to} displayCount={displayCount} reducedMotion={reducedMotion} />
    </TransitionSeries.Sequence>
  </TransitionSeries>
}
