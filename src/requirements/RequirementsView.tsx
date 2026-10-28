import {
  Bot,
  Check,
  CheckCircle2,
  Clock3,
  Code2,
  Cpu,
  FileText,
  Gamepad2,
  GitBranch,
  Globe2,
  HeartPulse,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Swords,
} from 'lucide-react'
import './requirements.css'

type Level = '必須' | '推奨' | '任意'

type Requirement = {
  id: string
  title: string
  level: Level
  body?: string
  items: string[]
}

const nav = [
  ['overview', '概要'],
  ['game', 'ゲーム要件'],
  ['boss', '最終ボス'],
  ['architecture', '動作・構成'],
  ['deployment', '公開・ホスティング'],
  ['source', 'ソース運用'],
  ['ai', 'AI利用'],
  ['freedom', '実装裁量'],
  ['acceptance', '受入条件'],
] as const

const gameRequirements: Requirement[] = [
  { id: 'FR-01', title: 'ゲーム進行', level: '必須', items: ['ゲーム全体は1ステージ', '開始から最終ボスまで連続進行', '画面は上方向へスクロールし続ける', '途中で別ステージへ切り替えない', '最終ボス撃破でゲームクリア'] },
  { id: 'FR-02', title: 'プレイヤー', level: '必須', items: ['初期HPは3', '画面内を移動しながら攻撃できる', '被弾でHP減少', '被弾直後は短時間の無敵時間', 'HP 0で敗北'] },
  { id: 'FR-03', title: '通常敵', level: '必須', items: ['通常敵は4種類以上', '敵ごとに攻撃方法または移動方法の違いを持たせる', '発射方向・弾数・弾速・間隔・移動方法などで差を作る'] },
  { id: 'FR-04', title: '難易度変化', level: '必須', items: ['進行位置に応じて敵の種類・組み合わせ・数・攻撃を変化', '後半になるほど難しくする', '敵構成が変わっても進行は停止しない'] },
  { id: 'FR-05', title: '回復', level: '必須', items: ['一定地点以降、一部の敵をランダムで特殊状態にする', '発光などで通常敵と区別する', '特殊状態の敵を倒すと回復アイテムを落とす', '取得するとHPを回復する'] },
  { id: 'FR-06', title: '敗北・再挑戦', level: '必須', items: ['敗北時はHPを全回復', 'ゲーム開始地点から再挑戦', 'チェックポイントによる途中再開は行わない'] },
]

const bossRequirements: Requirement[] = [
  { id: 'FR-B01', title: 'Snapshot', level: '必須', body: '巻き戻しに必要な状態だけを一定時間記録する。ゲーム全体の完全保存は不要。', items: ['プレイヤー位置', 'ボス・弾の状態', '攻撃状態', '巻き戻し後の再現に必要な情報'] },
  { id: 'FR-B02', title: 'State Rollback', level: '必須', items: ['数秒前の状態までゲーム状態を戻す', '巻き戻し中であることが視覚的に分かる演出を入れる'] },
  { id: 'FR-B03', title: 'Re-simulation', level: '必須', body: '巻き戻し前の回避行動を参考に、ボスの攻撃を変更して再実行する。', items: ['例：右に避けた場合、巻き戻し後は右方向を狙う', '変更候補：発射方向・位置・タイミング・弾速・弾数'] },
  { id: 'FR-B04', title: '通常攻撃', level: '必須', items: ['時間巻き戻し以外の通常攻撃を2種類以上用意する'] },
]

const acceptance = [
  '開始から最終ボスまで1ステージで連続進行する',
  '画面が上方向へスクロールし続ける',
  '通常敵が4種類以上存在する',
  '初期HP 3・被弾・無敵時間・敗北処理が動作する',
  '進行に応じて敵構成と難易度が変化する',
  '特殊状態の敵から回復アイテムを取得できる',
  '敗北すると開始地点から再挑戦する',
  'Snapshot → State Rollback → Re-simulation が機能する',
  'ボスに通常攻撃が2種類以上ある',
  'CSRを基本とし、静的ホスティング可能な構成である',
  '公開URLからログインなしでプレイできる',
  '開発者PCの常時起動に依存せず公開できる',
  'GitHub Public Repositoryでソースを確認できる',
  'README・MIT License・Contributor情報を確認できる',
  'Repositoryに機密情報が含まれていない',
]

function LevelBadge({ level }: { level: Level }) {
  return <span className={`req-level req-level-${level}`}>{level}</span>
}

function RequirementCard({ requirement }: { requirement: Requirement }) {
  return <article className="req-card">
    <div className="req-card-head">
      <code>{requirement.id}</code>
      <LevelBadge level={requirement.level} />
    </div>
    <h3>{requirement.title}</h3>
    {requirement.body && <p>{requirement.body}</p>}
    <ul>{requirement.items.map(item => <li key={item}><Check size={15} />{item}</li>)}</ul>
  </article>
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <header className="req-section-title">
    <span>{eyebrow}</span>
    <h2>{title}</h2>
    {description && <p>{description}</p>}
  </header>
}

export default function RequirementsView() {
  return <div className="requirements-page">
    <header className="req-topbar">
      <a className="req-brand" href="/"><FileText size={17} /><span>2D Shooter RDD</span></a>
      <div className="req-top-meta"><span>Requirements Definition Document</span><strong>v1.0</strong></div>
    </header>

    <div className="req-layout">
      <aside className="req-sidebar">
        <div className="req-sidebar-label">CONTENTS</div>
        <nav>{nav.map(([id, label], index) => <a key={id} href={`#${id}`}><span>{String(index + 1).padStart(2, '0')}</span>{label}</a>)}</nav>
        <div className="req-side-note"><ShieldCheck size={16} /><p><strong>正本</strong><br />詳細は <code>REQUIREMENTS.md</code> と同内容。</p></div>
      </aside>

      <main className="req-main">
        <section className="req-hero" id="overview">
          <div className="req-kicker"><span>SOFTWARE ENGINEERING</span><i />REQUIREMENTS</div>
          <h1>2D縦スクロール<br />シューティングゲーム</h1>
          <p>他班へ開発を依頼するゲームについて、完成物として満たしてほしい機能・動作環境・公開・ソース運用条件を定義します。</p>
          <div className="req-hero-grid">
            <div><Gamepad2 /><span>Stage</span><strong>1</strong><small>開始からボスまで連続</small></div>
            <div><Swords /><span>Enemies</span><strong>4+</strong><small>通常敵4種類以上</small></div>
            <div><HeartPulse /><span>Initial HP</span><strong>3</strong><small>被弾後は短時間無敵</small></div>
            <div><Clock3 /><span>Hosting</span><strong>24/7</strong><small>常時公開を想定</small></div>
          </div>
          <div className="req-level-guide">
            <div><LevelBadge level="必須" /><span>完成物として満たす</span></div>
            <div><LevelBadge level="推奨" /><span>特別な理由がなければ採用</span></div>
            <div><LevelBadge level="任意" /><span>実装班の判断で決定</span></div>
          </div>
        </section>

        <section className="req-section" id="game">
          <SectionTitle eyebrow="01 / FUNCTIONAL" title="ゲーム要件" description="ゲーム体験として必ず成立させたい部分。具体的な見た目や細かな数値は実装班に任せます。" />
          <div className="req-card-grid">{gameRequirements.map(requirement => <RequirementCard key={requirement.id} requirement={requirement} />)}</div>
        </section>

        <section className="req-section" id="boss">
          <SectionTitle eyebrow="02 / FINAL BOSS" title="時間巻き戻しボス" description="単なる演出ではなく、巻き戻し前の回避行動が次の攻撃へ影響することを中心要件とします。" />
          <div className="req-flow">
            <div><span>01</span><Sparkles /><strong>Snapshot</strong><small>必要な状態を記録</small></div>
            <i>→</i>
            <div><span>02</span><RotateCcw /><strong>State Rollback</strong><small>数秒前まで戻す</small></div>
            <i>→</i>
            <div><span>03</span><Cpu /><strong>Re-simulation</strong><small>回避を参考に攻撃変更</small></div>
          </div>
          <div className="req-card-grid req-card-grid-2">{bossRequirements.map(requirement => <RequirementCard key={requirement.id} requirement={requirement} />)}</div>
        </section>

        <section className="req-section" id="architecture">
          <SectionTitle eyebrow="03 / ARCHITECTURE" title="動作環境・構成" />
          <div className="req-split">
            <article className="req-panel"><div className="req-panel-icon"><Globe2 /></div><h3>Webアプリ <LevelBadge level="必須" /></h3><ul><li>PCでのプレイを主対象</li><li>Chrome / Edge等のモダンブラウザ</li><li>ユーザー登録・ログイン不要</li></ul></article>
            <article className="req-panel"><div className="req-panel-icon"><Code2 /></div><h3>CSR <LevelBadge level="必須" /></h3><ul><li>Client Side Renderingを基本構成</li><li>主要処理はブラウザ側で完結</li><li>SSR・専用バックエンドは必須にしない</li><li>静的ホスティング可能な構成</li></ul></article>
          </div>
          <div className="req-callout"><ShieldCheck /><div><strong>目的</strong><p>運用を簡単にし、個人所有サーバーへ依存せず継続公開しやすくするため、CSR + 静的配信を基本とします。</p></div></div>
        </section>

        <section className="req-section" id="deployment">
          <SectionTitle eyebrow="04 / DELIVERY" title="公開・ホスティング" description="完成後にURLを共有すれば、そのまま遊べる状態を想定します。" />
          <div className="req-hosting-grid">
            <article><Globe2 /><span>DEP-01 · 必須</span><h3>公開URL</h3><p>ログインなしで、そのままゲームをプレイできるURLを用意。</p></article>
            <article><Clock3 /><span>DEP-02 · 必須</span><h3>24/7公開</h3><p>開発者PCを起動している間だけ使える構成にはしない。</p></article>
            <article><ShieldCheck /><span>DEP-03 · 推奨</span><h3>Managed Hosting</h3><p>静的配信・HTTPS・継続公開が簡単なサービスを優先。</p></article>
          </div>
          <div className="req-hosting-list"><span>RECOMMENDED</span><strong>Cloudflare Pages</strong><i /> <strong>Vercel</strong><i /> <strong>Netlify</strong><i /> <strong>GitHub Pages</strong><small>または同等の静的ホスティング</small></div>
        </section>

        <section className="req-section" id="source">
          <SectionTitle eyebrow="05 / SOURCE CONTROL" title="ソースコード運用" />
          <div className="req-source-table">
            <div className="head"><span>ID</span><span>要件</span><span>内容</span></div>
            <div><code>SCM-01</code><strong>GitHub管理</strong><p>Public Repositoryで管理。個人 / Organizationどちらでも可。</p></div>
            <div><code>SCM-02</code><strong>開発履歴</strong><p>開発メンバーがContributorとして確認でき、開発過程がコミット履歴から確認できること。</p></div>
            <div><code>SCM-03</code><strong>README</strong><p>概要、操作、実行方法、主要ライブラリ・素材、ライセンス、公開URLを記載。</p></div>
            <div><code>SCM-04</code><strong>License</strong><p>本プロジェクトのソースコードはMIT License。外部成果物は各利用条件に従う。</p></div>
            <div><code>SCM-05</code><strong>Secrets</strong><p>APIキー、パスワード、トークン、個人情報などをPublic Repositoryへ含めない。</p></div>
          </div>
        </section>

        <section className="req-section" id="ai">
          <SectionTitle eyebrow="06 / AI" title="AI・Coding Agent利用" />
          <div className="req-ai-grid">
            <div><Bot /><h3>利用OK</h3><p>AI支援ツール、Coding Agent、コード補完ツール等は利用可能。</p><LevelBadge level="任意" /></div>
            <div><ShieldCheck /><h3>認証情報は入力しない</h3><p>APIキー・パスワード・アクセストークン・個人情報等はAIへ入力しない。</p><LevelBadge level="必須" /></div>
            <div><FileText /><h3>利用条件を確認</h3><p>AIが提案したOSS・コード・画像・音声等を使う場合はライセンスを確認。</p><LevelBadge level="必須" /></div>
          </div>
        </section>

        <section className="req-section" id="freedom">
          <SectionTitle eyebrow="07 / FLEXIBILITY" title="実装班に任せる部分" description="以下はゲームとして成立し、必須要件を満たす範囲で自由に決めて構いません。" />
          <div className="req-tags">{['使用言語', 'フレームワーク', 'ゲームライブラリ', 'キャラクターデザイン', '世界観', '操作キー', '敵HP・速度', '敵配置', '敵構成の切替タイミング', '特殊敵の出現頻度', '回復量', '背景・演出', 'ボス通常攻撃', '巻き戻し演出', 'BGM・効果音'].map(tag => <span key={tag}>{tag}</span>)}</div>
        </section>

        <section className="req-section" id="acceptance">
          <SectionTitle eyebrow="08 / ACCEPTANCE" title="受入条件" description="完成時は、少なくとも以下を一通り確認します。" />
          <div className="req-checklist">{acceptance.map((item, index) => <div key={item}><CheckCircle2 /><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></div>)}</div>
        </section>

        <footer className="req-footer"><GitBranch size={16} /><span>Source of truth: REQUIREMENTS.md</span><i />2D Vertical Scrolling Shooter RDD</footer>
      </main>
    </div>
  </div>
}
