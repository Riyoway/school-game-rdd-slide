import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Clock3, ExternalLink, FileText } from 'lucide-react'
import { presentationSlides, TOTAL_SECONDS } from './content'
import './notes.css'

const clampIndex = (value: number) => Math.max(0, Math.min(presentationSlides.length - 1, value))

const indexFromHash = () => {
  const parsed = Number.parseInt(window.location.hash.replace('#', ''), 10)
  return Number.isFinite(parsed) ? clampIndex(parsed - 1) : 0
}

export default function NotesView() {
  const [index, setIndex] = useState(indexFromHash)
  const slide = presentationSlides[index]
  const sentences = useMemo(
    () => slide.notes.split('。').map(sentence => sentence.trim()).filter(Boolean),
    [slide.notes],
  )

  const goTo = (nextIndex: number) => {
    const next = clampIndex(nextIndex)
    setIndex(next)
    window.history.replaceState(null, '', `#${next + 1}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const onHashChange = () => setIndex(indexFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return <main className="notes-view">
    <header className="notes-header">
      <div className="notes-header-row">
        <div className="notes-brand"><FileText size={18} /><span>発表メモ</span></div>
        <a className="notes-open-slide" href="/" target="_blank" rel="noreferrer">スライド<ExternalLink size={14} /></a>
      </div>
      <div className="notes-progress" aria-hidden="true"><i style={{ width: `${((index + 1) / presentationSlides.length) * 100}%` }} /></div>
      <div className="notes-meta">
        <span>{String(index + 1).padStart(2, '0')} / {String(presentationSlides.length).padStart(2, '0')}</span>
        <span><Clock3 size={15} />このページ 約{slide.seconds}秒</span>
        <span>全体 {Math.floor(TOTAL_SECONDS / 60)}分{TOTAL_SECONDS % 60}秒</span>
      </div>
    </header>

    <article className="notes-card">
      <p className="notes-kicker">SLIDE {String(index + 1).padStart(2, '0')}</p>
      <h1>{slide.title}</h1>
      <div className="notes-script">
        {sentences.map((sentence, sentenceIndex) => <div className="notes-line" key={`${index}-${sentenceIndex}`}>
          <span aria-hidden="true">{String(sentenceIndex + 1).padStart(2, '0')}</span>
          <p>{sentence}。</p>
        </div>)}
      </div>
    </article>

    <nav className="notes-jump" aria-label="スライド一覧">
      {presentationSlides.map((item, itemIndex) => <button
        key={item.title}
        type="button"
        className={itemIndex === index ? 'active' : ''}
        aria-label={`${itemIndex + 1}枚目 ${item.title}`}
        onClick={() => goTo(itemIndex)}
      >{itemIndex + 1}</button>)}
    </nav>

    <div className="notes-bottom-space" />
    <nav className="notes-controls" aria-label="発表メモ操作">
      <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0}><ArrowLeft size={20} /><span>前へ</span></button>
      <strong>{index + 1} / {presentationSlides.length}</strong>
      <button type="button" onClick={() => goTo(index + 1)} disabled={index === presentationSlides.length - 1}><span>次へ</span><ArrowRight size={20} /></button>
    </nav>
  </main>
}
