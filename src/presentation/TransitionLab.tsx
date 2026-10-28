import { AbsoluteFill, Easing, useVideoConfig } from 'remotion'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { flip } from '@remotion/transitions/flip'
import { clockWipe } from '@remotion/transitions/clock-wipe'

export const TRANSITION_FRAMES = 30
export const SCENE_FRAMES = 60

export type TransitionDirection = 'forward' | 'backward'

type TransitionLabProps = {
  from: number
  to: number
  direction: TransitionDirection
  reducedMotion: boolean
}

function BlankScene({ index }: { index: number }) {
  return (
    <AbsoluteFill
      style={{
        background: '#000',
        color: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <div style={{ fontSize: 56, fontWeight: 600 }}>{String(index + 1).padStart(2, '0')}</div>
    </AbsoluteFill>
  )
}

export function TransitionLab({ from, to, direction, reducedMotion }: TransitionLabProps) {
  const { width, height } = useVideoConfig()
  const timing = linearTiming({
    durationInFrames: reducedMotion ? 8 : TRANSITION_FRAMES,
    easing: Easing.inOut(Easing.cubic),
  })

  const transition = reducedMotion ? (
    <TransitionSeries.Transition timing={timing} />
  ) : direction === 'backward' ? (
    <TransitionSeries.Transition
      timing={timing}
      presentation={flip({ direction: 'from-left' })}
    />
  ) : to % 2 === 0 ? (
    <TransitionSeries.Transition
      timing={timing}
      presentation={clockWipe({ width, height })}
    />
  ) : (
    <TransitionSeries.Transition
      timing={timing}
      presentation={flip({ direction: 'from-right' })}
    />
  )

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
        <BlankScene index={from} />
      </TransitionSeries.Sequence>
      {transition}
      <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
        <BlankScene index={to} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  )
}
