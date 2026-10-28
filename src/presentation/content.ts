export const slides = [
  { title: 'ゲームの概要', seconds: 20, notes: '画面が上方向へ進み続ける縦スクロール型の2Dシューティングゲームです。プレイヤーは画面下側で敵を避けながら攻撃し、進んだ位置に応じて出現する敵の種類や数が変わります。最後に時間巻き戻し能力を持つボスを倒すとゲームクリアです。' },
  { title: '基本仕様と敵', seconds: 40, notes: '初期HPは3です。画面内を移動して敵を攻撃し、被弾するとHPが減ります。被弾直後には短時間の無敵時間を設け、HPが0になると敗北です。通常敵は4種類以上とし、発射方向、弾数、弾速、間隔、移動などで違いを作ります。' },
  { title: '画面が上へ進み続ける構成', seconds: 40, notes: 'ゲーム中は画面が上方向へスクロールし続け、途中で画面を止めたり別ステージへ切り替えたりしません。進んだ距離に応じて出現する敵の種類、組み合わせ、数、攻撃パターンが変わり、後半になるにつれて難しくなります。最後にボスが出現し、倒すとゲームクリアです。' },
  { title: '回復と敗北時の処理', seconds: 35, notes: '進行中の一定のタイミング以降、一部の敵がランダムに光るようになります。この敵を倒すと回復アイテムを落とし、回収するとHPが回復します。敗北した場合はHPを全回復し、進んでいた位置に関係なくゲームの最初から再挑戦します。' },
  { title: '最終ボスの時間巻き戻し', seconds: 70, notes: 'このゲームの特徴が、最終ボスの時間巻き戻しです。まずSnapshotで位置や攻撃状態など必要な情報だけを一定時間記録します。次にState Rollbackで数秒前に戻します。最後にRe-simulationで、巻き戻し前の回避を参考に攻撃を変えます。例えば右に避けた場合、巻き戻し後は右方向を狙うように攻撃を変えます。通常攻撃も2種類以上用意します。' },
  { title: '公開要件', seconds: 30, notes: '完成したゲームはWeb上に公開し、公開URLを開けば誰でもブラウザから遊べるようにしてください。GitHub PagesやCloudflare Pagesなど、公開方法やホスティング先そのものは問いません。ログインやアカウント作成をしなくても遊べる状態を要件とします。' },
  { title: '必須の要望とお任せする部分', seconds: 25, notes: 'こちらから必ずお願いしたいのは、画面が上へ進み続ける1ステージ構成、4種類以上の通常敵、HP3、進行に応じた敵構成の変化、回復、敗北したら最初から再挑戦すること、時間巻き戻しボス、そして公開URLから誰でも遊べることです。世界観やキャラクターの見た目、操作感、敵の配置、回復量、ボスの細かな攻撃や演出などは、遊びやすい形でお任せします。' },
] as const

export const PRESENTATION_ORDER = [0, 1, 2, 3, 4, 5, 6] as const
export const presentationSlides = PRESENTATION_ORDER.map(sourceIndex => ({ ...slides[sourceIndex], sourceIndex }))

export const TOTAL_SECONDS = presentationSlides.reduce((sum, slide) => sum + slide.seconds, 0)
export const FRAME_RATE = 30
export const DEMO_FRAMES = 360
export const TRANSITION_FRAMES = 24
export const HOLD_FRAMES = FRAME_RATE * 60 * 60
