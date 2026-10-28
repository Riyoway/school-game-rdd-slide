import { AbsoluteFill, Easing } from 'remotion'
import { TransitionSeries, linearTiming, type TransitionPresentation, type TransitionPresentationComponentProps } from '@remotion/transitions'
import { SlideContent } from './SlideContent'
import { HOLD_FRAMES, TRANSITION_FRAMES } from './content'

type PanelProps = { direction: number; reducedMotion: boolean }
function PanelReveal({ children, presentationDirection, presentationProgress, passedProps }: TransitionPresentationComponentProps<PanelProps>) {
  const entering = presentationDirection === 'entering'
  const p = presentationProgress
  const direction = passedProps.direction
  if (passedProps.reducedMotion) return <AbsoluteFill style={{ opacity: entering ? p : 1 - p }}>{children}</AbsoluteFill>
  return <AbsoluteFill style={{
    overflow: 'hidden',
    opacity: entering ? 1 : 1 - p * .75,
    clipPath: entering ? `inset(0 ${direction > 0 ? (1 - p) * 100 : 0}% 0 ${direction < 0 ? (1 - p) * 100 : 0}% round ${(1 - p) * 20}px)` : undefined,
    transform: entering ? `perspective(1800px) translateX(${direction * (1 - p) * 70}px) rotateY(${direction * (1 - p) * -3}deg)` : `perspective(1800px) translateX(${-direction * p * 95}px) rotateY(${direction * p * 2}deg)`,
    filter: entering ? undefined : `blur(${p * 4}px)`,
    transformOrigin: direction > 0 ? 'left center' : 'right center',
  }}>{children}</AbsoluteFill>
}

export type SlideTransitionProps = { from: number; to: number; fromFrame: number; reducedMotion: boolean }
export function SlideTransition({ from, to, fromFrame, reducedMotion }: SlideTransitionProps) {
  if (from === to) return <SlideContent index={to} reducedMotion={reducedMotion} />
  const presentation: TransitionPresentation<PanelProps> = { component: PanelReveal, props: { direction: to > from ? 1 : -1, reducedMotion } }
  const frames = reducedMotion ? 8 : TRANSITION_FRAMES
  return <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={frames}>
      <SlideContent index={from} reducedMotion={reducedMotion} fixedFrame={fromFrame} frameOffset={fromFrame} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={presentation} timing={linearTiming({ durationInFrames: frames, easing: Easing.bezier(.77, 0, .175, 1) })} />
    <TransitionSeries.Sequence durationInFrames={HOLD_FRAMES}>
      <SlideContent index={to} reducedMotion={reducedMotion} />
    </TransitionSeries.Sequence>
  </TransitionSeries>
}
