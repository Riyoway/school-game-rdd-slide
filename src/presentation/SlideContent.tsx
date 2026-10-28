import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { ArrowRight, Check, CheckCheck, Code2, Cross, FileCode2, Gamepad2, Heart, Layers3, Monitor, RotateCcw, ShieldCheck, Sparkles, Swords, Target, Users } from 'lucide-react'
import { FaGithub } from 'react-icons/fa6'
import { SiCloudflare, SiMarkdown } from 'react-icons/si'
import SpotlightCard from '@/components/SpotlightCard'
import GlareHover from '@/components/GlareHover'
import { Separator } from '@/components/ui/separator'
import { DemoFigure } from './GameDemo'
import { slides } from './content'
import type { ReactNode } from 'react'

function Fact({ value, label }: { value: string; label: string }) {
  return <SpotlightCard className="fact fact-card" theme="light" spotlightColor="#7aa2ff" intensity={0.08} spotlightSize={170} softness={0.9} borderGlow={0.35} proximity={45} smoothing={0.18} flare={false}><strong>{value}</strong><span>{label}</span></SpotlightCard>
}
function Rule({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <SpotlightCard className="rule-row rule-card" theme="light" spotlightColor="#7397ec" intensity={0.07} spotlightSize={220} softness={0.9} borderGlow={0.32} proximity={55} smoothing={0.18} flare={false}><div className="rule-icon">{icon}</div><div><h3>{title}</h3><p>{children}</p></div></SpotlightCard>
}
function ServiceCard({ icon, title, eyebrow, children, accent }: { icon: ReactNode; title: string; eyebrow: string; children: ReactNode; accent: string }) {
  return <SpotlightCard className="service-card" theme="light" spotlightColor={accent} intensity={0.18} spotlightSize={250} softness={0.82} borderGlow={0.72} proximity={70} smoothing={0.2} flare={false}>
    <div className="service-card-top"><div className="service-logo" style={{ color: accent }}>{icon}</div><span>{eyebrow}</span></div>
    <h3>{title}</h3>
    <div className="service-card-copy">{children}</div>
  </SpotlightCard>
}

export function SlideContent({ index, reducedMotion, frameOffset = 0, fixedFrame }: { index: number; reducedMotion: boolean; frameOffset?: number; fixedFrame?: number }) {
  const localFrame = useCurrentFrame()
  const frame = fixedFrame ?? localFrame + frameOffset
  const entrance = reducedMotion || fixedFrame !== undefined ? 1 : interpolate(localFrame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  return <AbsoluteFill className={`spec-slide slide-page-${index}`}>
    <div className="slide-running-header"><span><FileCode2 size={21} />ソフトウェア工学 / ゲーム要求定義</span><span>{String(index + 1).padStart(2, '0')}<i />{String(slides.length).padStart(2, '0')}</span></div>
    <div className="slide-content" style={{ opacity: entrance, transform: `translateY(${(1 - entrance) * 14}px)`, filter: `blur(${(1 - entrance) * 3}px)` }}>
      {index === 0 ? <>
        <div className="intro-layout"><section className="intro-text"><div className="section-label">ゲームの概要</div><h1>2Dシューティング<br />ゲームの要求定義</h1><p className="intro-description">敵構成が変わる区間を連続して進み、<br />時間を巻き戻す最終ボスを倒す。</p><div className="facts"><Fact value="1" label="ステージ" /><Fact value="4種類以上" label="通常敵" /><Fact value="3" label="初期 HP" /></div></section><div className="demo-shell"><DemoFigure mode="combat" frame={frame} reducedMotion={reducedMotion} /></div></div>
        <div className="intro-bottom"><span><Users size={23} />他班が開発するための要求を説明</span><span>発表 約5分 / 質疑応答 3分</span></div>
      </> : <>
        <header className="slide-title"><div className="section-label">{['', 'ゲームの基本', '進行構成', '回復と再挑戦', '最終ボス', '開発と公開', 'まとめ'][index]}</div><h2>{slides[index].title}</h2></header>
        {index === 1 && <><div className="split-layout"><section className="spec-copy"><Rule icon={<Gamepad2 />} title="移動しながら敵を攻撃する">被弾で HP が減り、0 になると敗北。<br />被弾直後は短時間の無敵時間を設ける。</Rule><Rule icon={<Target />} title="通常敵は4種類以上">発射方向・弾数・弾速・発射間隔・移動方法などで違いをつける。</Rule><Rule icon={<Layers3 />} title="進行に合わせて難しくする">後半になるにつれて敵の数・耐久力・弾速などを調整する。</Rule></section><div className="demo-shell"><DemoFigure mode="enemies" frame={frame} reducedMotion={reducedMotion} /></div></div><div className="slide-callout"><Swords size={23} /><span>開始から最終ボスまで、1つのステージとして連続して進行する。</span></div></>}
        {index === 2 && <><div className="split-layout"><section className="spec-copy progression-copy"><div className="point-flow"><div><Gamepad2 /><span>開始</span></div><ArrowRight /><div><Layers3 /><span>敵構成が変化</span></div><ArrowRight /><div><Swords /><span>最終ボス</span></div></div><p className="flow-description">途中に複数の区切りを設け、<br />区切りごとに出現する敵を変える。</p><Separator /><Rule icon={<Check />} title="区切りは別ステージではない">区切りで進行を止めず、そのまま連続して進む。</Rule><Rule icon={<Target />} title="敵の種類・組み合わせ・数を変える">同じ敵だけが続かないよう、進行に応じて出現内容を切り替える。</Rule></section><div className="demo-shell"><DemoFigure mode="progression" frame={frame} reducedMotion={reducedMotion} /></div></div><div className="slide-callout"><Layers3 size={23} /><span>区切りは進行上の目安であり、チェックポイントではない。</span></div></>}
        {index === 3 && <><div className="split-layout"><section className="spec-copy"><Rule icon={<Cross />} title="光る敵を倒して回復する">進行中の一定のタイミング以降、一部の敵がランダムに発光。倒すと回復アイテムを落とす。</Rule><p className="recovery-note"><Heart size={22} />回収すると HP を回復できる。</p><Separator /><div className="retry-heading"><RotateCcw /><h3>敗北したらゲームの最初から再挑戦</h3></div><div className="retention-table"><div><span>HP</span><strong>全回復</strong></div><div><span>再開地点</span><strong>最初から</strong></div></div></section><div className="demo-shell"><DemoFigure mode="recovery" frame={frame} reducedMotion={reducedMotion} /></div></div><div className="slide-callout"><ShieldCheck size={23} /><span>途中の区切りから再開する機能は必須ではない。</span></div></>}
        {index === 4 && <><div className="split-layout boss-split"><section className="spec-copy boss-steps"><div><span className="step-index">1</span><div><h3>必要な状態を記録する</h3><small>Snapshot</small><p>位置・攻撃状態などを一定時間記録。<br />ゲーム全体の完全保存は不要。</p></div></div><div><span className="step-index">2</span><div><h3>数秒前の状態に戻す</h3><small>State Rollback</small><p>巻き戻し中だと視覚的に伝える。</p></div></div><div><span className="step-index">3</span><div><h3>攻撃を変えて再実行する</h3><small>Re-simulation</small><p>前回の回避先を参考に攻撃を変える。<br />例：右に避けたら、次は右を狙う。</p></div></div></section><div className="demo-shell"><DemoFigure mode="boss" frame={frame} reducedMotion={reducedMotion} /></div></div><div className="boss-requirement"><span><CheckCheck size={24} />通常攻撃も2種類以上</span><p>変更可能：発射方向・位置・タイミング・弾速・弾数</p></div></>}
        {index === 5 && <><div className="delivery-cards"><ServiceCard icon={<Monitor />} eyebrow="WEB APP" title="ブラウザで動作" accent="#315fc5"><ul><li>PCを主な対象</li><li>Chrome / Edge 等に対応</li><li>ログイン不要</li><li>基本はクライアント側で動作</li></ul></ServiceCard><ServiceCard icon={<FaGithub />} eyebrow="SOURCE" title="GitHub" accent="#181717"><ul><li>Public Repository</li><li>個人 / Organization どちらでも可</li><li>全員を Contributor として確認</li><li>MIT License</li></ul></ServiceCard><ServiceCard icon={<SiCloudflare />} eyebrow="DEPLOY" title="Cloudflare Pages" accent="#f38020"><ul><li>Workers & Pages で公開</li><li>公開URLから第三者がプレイ可能</li><li>静的なWebアプリとして配信</li></ul></ServiceCard><ServiceCard icon={<SiMarkdown />} eyebrow="DOCUMENT" title="README" accent="#2f6fbd"><ul><li>ゲーム概要・操作方法</li><li>実行方法 / 開発環境</li><li>外部ライブラリ・ライセンス</li><li>公開URL</li></ul></ServiceCard></div><GlareHover width="100%" height="110px" background="#eef3fa" borderRadius="15px" borderColor="#d8e3f2" glareColor="#ffffff" glareOpacity={0.5} glareSize={24} softness={0.8} variant="sheen" mode="hover" className="ai-glare"><div className="ai-condition reactbits-ai"><Sparkles size={27} /><div><h3>AI・Coding Agent の利用は可</h3><p>機密情報を入力しない。外部OSS・コード・素材のライセンスや利用条件を確認する。</p></div></div></GlareHover></>}
        {index === 6 && <><div className="summary-columns"><section><div className="summary-heading"><CheckCheck /><h3>必須要件</h3></div><ul><li><Check />1ステージとして開始からボスまで連続進行</li><li><Check />通常敵4種類以上 / 初期 HP 3</li><li><Check />区切りごとに敵構成を変化</li><li><Check />回復 / 敗北時は最初から再挑戦</li><li><Check />時間巻き戻しボス / 通常攻撃2種類以上</li></ul></section><section><div className="summary-heading flexible"><Code2 /><h3>実装班が決められること</h3></div><ul><li>言語・フレームワーク・ゲームライブラリ</li><li>世界観・見た目・操作キー</li><li>各区間の長さ・敵の組み合わせ・配置</li><li>特殊敵の出現タイミング・回復量</li><li>ボスの通常攻撃・巻き戻し演出・音</li></ul></section></div><div className="summary-end">要求を満たす範囲で、具体的な設計は実装班に任せる。</div></>}
      </>}
    </div>
    <div className="slide-running-footer"><span>2Dシューティングゲーム 要求定義</span><span>{index === 0 ? 'ゲーム仕様と開発条件' : '動作例の見た目・数値は確定仕様ではありません'}</span></div>
  </AbsoluteFill>
}
