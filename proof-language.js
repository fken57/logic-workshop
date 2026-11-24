const choice = (title,prompt,correct,wrong,hint) => ({kind:"choice",title,prompt,correct,options:[correct,...wrong],hint});
const order = (title,prompt,steps,hint) => ({kind:"order",title,prompt,steps,hint});
const rewrite = (title,prompt,steps,hint) => ({kind:"rewrite",title,prompt,steps,hint});
const truth = (title,prompt,formulas,hint) => ({kind:"truth",title,prompt,formulas,hint});
const proof = (title,target,given,rules,solution,hint) => ({kind:"proof",title,prompt:"講義の推論規則を使い、最後の行で目標式を導いてください。",target,given,rules,solution,hint});
const model = (title,prompt,n,conditions,hint) => ({kind:"model",title,prompt,n,conditions,hint});
const terms = (title,target,limit,hint) => ({kind:"terms",title,prompt:`解釈すると ${target} になる閉項を、${limit} 個以内の記号で組み立ててください。`,target,limit,hint});
const clauses = (title,initial,hint) => ({kind:"clauses",title,prompt:"二つの節と、打ち消す相補リテラルを選び、空節 □ を導いてください。",initial,hint});
const linear = ["仮定","→I","→E"];
const conjunction = [...linear,"∧I","∧Eₗ","∧Eᵣ"];
const classical = [...conjunction,"⊥","RAA"];
const quantified = [...conjunction,"∀I","∀E","∃I","∃E"];
const chapters = [
  {name:"帰納法と集合", source:"第2〜5回", stages:[
    choice("最初の監査：消えた一手","復元器の記録には「4 と 7 は作れる。作れた数には 4 を足せる。ゆえに 18 以上はすべて作れる」とあります。最後の一文を保証するため、基底として一括検証すべき組はどれですか。","18, 19, 20, 21",["18, 22, 26, 30","18, 19, 20","18 と 21"],"操作で 4 を足しても剰余類は変わりません。"),
    order("復元器の連続運転","4 と 7 の非負整数結合で 18 以上を作れることを、命題 P(k)＝「k から k+3 まで作れる」で証明してください。",["18=7+7+4、19=7+4+4+4、20=4×5、21=7×3 を確認する","任意の k≥18 について P(k) を仮定する","既に作れる k に 4 を足して k+4 を作る","仮定から残る三数を引き継ぎ、P(k+1) を得る","帰納法を適用し、任意の n≥18 に P(n) を使う"],"窓を一つ進めると、新しく必要な値は一つだけです。"),
    choice("最小反例の境界","18 以上の最小の作れない数を m とします。「m−4 は作れる」と言うために、m より小さいことに加えて何が必要ですか。","m−4≥18 を基底の検査で保証する",["m が 4 の倍数であることを示す","m−4 が最小反例より小さいともう一度示す","m が 7 の倍数でないと示す"],"最小性が情報を与えるのは、反例を探した範囲の中です。"),
    choice("無限書庫の転居","書庫の棚は 0,1,2,… と並び、どの棚にも記録が一冊あります。平方数の棚をすべて空け、他の棚をちょうど一度ずつ埋める移転法はどれですか。","棚 n の記録を、小さい順に数えて n+1 番目の非平方数の棚へ移す",["棚 n の記録を棚 n²+1 へ移す","棚 n の記録を棚 2n+1 へ移す","平方数の棚だけ、その直後の棚へ移す"],"移転先が重ならず、すべての非平方数に届く必要があります。"),
    choice("対角線の反撃","A の各要素 a に部分集合 f(a) を割り当てました。どの f(a) とも異なる部分集合はどれですか。","{a∈A | a∉f(a)}",["{a∈A | a∈f(a)}","空集合","すべての f(a) の和集合"],"各 a の位置で f(a) と所属を反転します。"),
    choice("集合の否定","『すべての A の要素は B に属する』の否定を選んでください。","A に属し B に属さない要素がある",["B に属し A に属さない要素がある","A と B に共通要素がない","A のすべての要素が B に属さない"],"包含が破れるときに必要な要素は一つです。")
  ]},
  {name:"命題・真理値・同値", source:"第6〜12回", stages:[
    choice("構文木の根","(P→Q)∧(R→P) の構文木で、根に置く結合子を選んでください。","∧",["→","P","Q"],"左右二つの括弧で囲まれた式をつなぐ記号です。"),
    choice("一斉代入","P→(P∧Q) に [P:=Q, Q:=R] を同時代入した結果を選んでください。","Q→(Q∧R)",["R→(R∧R)","Q→(R∧Q)","P→(Q∧R)"],"置き換えで新たに入った Q は再び置き換えません。"),
    truth("含意を破る","式 P→Q を偽にする付値を作ってください。",[["P→Q",false]],"含意で問題になるのは、前件を満たして後件が偽のときです。"),
    truth("後件肯定の反例","左の二式を真に保ち、結論 P を偽にしてください。",[["P→Q",true],["Q",true],["P",false]],"前件が偽でも含意は真になります。"),
    truth("三段の真理値","P を真にしたまま、二つの複合式をどちらも偽にしてください。",[["R∨¬Q",false],["P",true],["P∧(Q→R)",false]],"R∨¬Q が偽なら Q が真で R が偽です。"),
    choice("等価性の検査","P→Q と古典命題論理で意味論的に等価な式を選んでください。","¬P∨Q",["P∧Q","¬Q∨P","¬P∧Q"],"どちらも P=真, Q=偽 のときだけ偽です。")
  ]},
  {name:"標準形と結合子", source:"第13〜16回", stages:[
    choice("NAND で否定","NAND を ↑ と書きます。¬P を実装する結合を選んでください。","P↑P",["(P↑P)↑(P↑P)","P↑⊥","P↑⊤ をさらに否定する"],"NAND は連言を取った後に真偽を反転します。"),
    choice("NAND で連言","NAND だけで P∧Q を作ってください。","(P↑Q)↑(P↑Q)",["P↑Q","(P↑P)↑(Q↑Q)","(P↑Q)↑P"],"一度作った NAND の出力を二つの入力につなぎます。"),
    rewrite("連言標準形への変形","局所的に同値な変形を選んで、節の連言を作ってください。",[
      ["P∨(Q∧R)","(P∨Q)∧(P∨R)",["(P∧Q)∨(P∧R)","(P∨Q)∨(P∨R)"]]],"∨ を ∧ の両側に分配します。"),
    rewrite("選言標準形への変形","否定を内側に移し、リテラルの連言の選言にしてください。",[
      ["¬(P∧(Q∨R))","¬P∨¬(Q∨R)",["¬P∧¬(Q∨R)","P∨¬(Q∨R)"]],
      ["¬P∨¬(Q∨R)","¬P∨(¬Q∧¬R)",["¬P∨(¬Q∨¬R)","¬P∧(¬Q∧¬R)"]]],"ド・モルガンの法則で結合子を交換します。"),
    choice("古典論理の双対","(P∧⊤)∨Q の双対を選んでください。","(P∨⊥)∧Q",["(¬P∨⊥)∧¬Q","(P∨⊤)∧Q","(P∧⊥)∨Q"],"∧と∨、⊤と⊥を交換し、変数はそのままです。"),
    choice("演繹体系の部品","証明体系における推論規則を記述するものを選んでください。","どの前提からどの結論を導出してよいか",["原子命題への真偽値の割り当て","有限モデルの要素の一覧","すべての真理値表の行数"],"体系の構文上の一手を指定します。")
  ]},
  {name:"命題論理の自然演繹", source:"第17〜19・24・41〜44回", stages:[
    proof("仮定を閉じる","P→P",[],linear,[["仮定","P"],["→I",1]],"P の仮定を開いたら、その行を選んで →I で閉じます。"),
    proof("含意をつなぐ","R",["P","P→Q","Q→R"],linear,[["→E",1,2],["→E",4,3]],"P と P→Q から Q を作ります。"),
    proof("連言を交換する","(P∧Q)→(Q∧P)",[],conjunction,[["仮定","P∧Q"],["∧Eₗ",1],["∧Eᵣ",1],["∧I",3,2],["→I",4]],"∧I では選択順が左右の順になります。"),
    proof("見えない仮定","P→(Q→P)",[],conjunction,[["仮定","P"],["仮定","Q"],["→I",1],["→I",3]],"Q を仮定した範囲でも外側の P は参照できます。"),
    proof("矛盾まで進む","(P→Q)→¬(P∧¬Q)",[],classical,[["仮定","P→Q"],["仮定","P∧¬Q"],["∧Eₗ",2],["∧Eᵣ",2],["→E",1,3],["→E",4,5],["→I",6],["→I",7]],"練習問題2。P∧¬Q を分け、Q と ¬Q を合わせます。"),
    proof("矢印を反転する","¬(P∧¬Q)→(P→Q)",[],classical,[["仮定","¬(P∧¬Q)"],["仮定","P"],["仮定","¬Q"],["∧I",2,3],["→E",1,4],["RAA",5],["→I",6],["→I",7]],"練習問題3。¬Q を一時的に仮定し、矛盾を出したら RAA で Q を得ます。"),
    proof("選言を作る","Q→(P∨Q)",[],[...linear,"∨Iᵣ"],[["仮定","Q"],["∨Iᵣ","P",1],["→I",2]],"∨Iᵣ では、選択した式を右に、入力した式を左に置きます。"),
    proof("矛盾から任意の式","P→(¬P→Q)",[],classical,[["仮定","P"],["仮定","¬P"],["→E",1,2],["⊥","Q",3],["→I",4],["→I",5]],"P と P→⊥ から矛盾を作り、矛盾の消去で Q を得ます。")
  ]},
  {name:"健全性・完全性・BHK", source:"第21〜27回", stages:[
    order("健全性を支える骨組み","導出の構造に関する帰納法で健全性を示す流れを並べてください。",["任意の導出を固定する","仮定一つだけの導出で成立を確認する","最後の推論規則ごとに、直前の部分導出へ帰納法の仮定を適用する","規則の意味論と解除した仮定を考慮し、根の結論へ移す"],"根の結論だけでなく、その根を作った規則に注目します。"),
    choice("健全性の向き","古典命題論理の自然演繹の健全性は、どちら向きの含意ですか。","Γ⊢A なら Γ⊨A",["Γ⊨A なら Γ⊢A","Γ⊬A なら Γ⊨A","Γ⊢A なら Γ の任意の部分集合から A が導出できる"],"証明体系が誤った意味論的帰結を作らないことです。"),
    choice("矛盾と充足","Γ から ⊥ が導出できました。健全性から何が言えますか。","Γ のすべての式を真にする付値は存在しない",["Γ の各式はそれぞれ恒偽式である","Γ は空集合である","Γ の各式はそれぞれ恒真式である"],"充足とは、同じ付値で全前提を真にすることです。"),
    order("反例が現れるまで","古典命題論理で Γ⊬A から反例の付値を作る講義の流れを並べてください。",["Γ∪{¬A} が無矛盾であることを示す","極大無矛盾集合に拡張する","原子命題の所属から付値を作り、真理補題を使う","Γ が真で A が偽になる"],"最初に、A の否定を前提に追加します。"),
    choice("BHK の含意","BHK 解釈で A→B の証明が与えるものを選んでください。","A の任意の証明を B の証明に変える方法",["B の証明から A の証明に戻る方法","A の証明と B の証明を並べた組","A を満たさない付値の一覧"],"含意の導入は、仮定 A のもとで B を作る操作でした。"),
    choice("古典と直観主義","練習問題3では、¬Q を仮定して矛盾を出しました。次に Q を得る操作を選んでください。","¬Q の仮定を解除して Q を得る RAA",["Q と R から Q∧R を得る ∧I","Q∧R から Q を得る ∧Eₗ","Q→R と Q から R を得る →E"],"¬Q→⊥ を作る操作と、そこから Q を得る操作を区別します。")
  ]},
  {name:"項・束縛・代入", source:"第28〜31・39〜40回", stages:[
    terms("閉項の組み立て",3,4,"0 に S を三度適用すると 3 です。"),
    terms("練習問題1・値は5",5,6,"S は値を 1 増やします。まずは S だけでも到達できます。"),
    terms("閉項の因数分解",16,11,"4 を表す閉項は、0̄ と S を合わせて5記号です。その閉項を二つ作って T を適用します。"),
    choice("自由変数の位置","R(x,y)∧∀x S(x,z) の自由変数集合を選んでください。","{x,y,z}",["{y,z}","{x}","{x,z}"],"右の ∀x のスコープは S(x,z) です。"),
    rewrite("捕獲を避ける代入","∀y R(x,y) の自由な x に y を代入します。安全な途中式を選んでください。",[
      ["∀y R(x,y)","∀z R(x,z)",["∀y R(y,y)","∀z R(z,y)"]],
      ["∀z R(x,z)","∀z R(y,z)",["∀y R(y,z)","∀z R(z,z)"]]],"まず束縛されている y を、新しい変数 z に改名します。"),
    choice("項とその値","練習問題1の言語で、自然数 5 を表す閉項を答える場面です。提出できるものを選んでください。","S(S(S(S(S(0̄)))))",["5","S(x)","T(0̄)"],"使える記号は 0̄、単項 S、二項 P と T です。")
  ]},
  {name:"モデルと等号", source:"第31〜34回", stages:[
    model("全員に行き先", "各点から少なくとも一つの辺が出ていて、自己ループは一つもない構造を作ってください。",2,[
      ["∀x∃y R(x,y)",true, g=>g.every(row=>row.some(Boolean))],
      ["∃x R(x,x)",false,g=>g.some((row,i)=>row[i])]],"二点を互いに結びます。"),
    model("順序を入れ替える反例","前提には各点の行き先が必要です。全点から到達できる共通の行き先がないようにしてください。",2,[
      ["∀x∃y R(x,y)",true,g=>g.every(row=>row.some(Boolean))],
      ["∃y∀x R(x,y)",false,g=>g[0].some((_,j)=>g.every(row=>row[j]))]],"各点を自分自身だけに結ぶ方法があります。"),
    model("対称でも推移的でない","辺の対称性を成立させ、推移性を破る構造を作ってください。",3,[
      ["∀x∀y (R(x,y)→R(y,x))",true,g=>g.every((row,i)=>row.every((v,j)=>!v||g[j][i]))],
      ["∀x∀y∀z ((R(x,y)∧R(y,z))→R(x,z))",false,g=>g.every((row,i)=>row.every((v,j)=>!v||g[j].every((w,k)=>!w||g[i][k]))) ]],"往復できる二点に、自己ループがあるかを考えます。"),
    model("推移的でも対称でない","非反射的で推移的な関係を作り、対称性は破ってください。",3,[
      ["∃x R(x,x)",false,g=>g.some((row,i)=>row[i])],
      ["∀x∀y (R(x,y)→R(y,x))",false,g=>g.every((row,i)=>row.every((v,j)=>!v||g[j][i]))],
      ["∀x∀y∀z ((R(x,y)∧R(y,z))→R(x,z))",true,g=>g.every((row,i)=>row.every((v,j)=>!v||g[j].every((w,k)=>!w||g[i][k]))) ]],"辺が一本だけでも、推移性の条件を満たせます。"),
    choice("等号で二点を区別","非空の領域の濃度が 2 以上であることを表す文を選んでください。","∃x∃y ¬(x=y)",["∀x∀y ¬(x=y)","∃x∀y ¬(x=y)","∃x∃y (x=y)"],"異なる二点の存在だけを要求します。"),
    choice("等号でちょうど二点","濃度がちょうど 2 の領域を等号で特徴づける文を選んでください。","∃x∃y (¬(x=y)∧∀z (z=x∨z=y))",["∃x∃y ∀z (z=x∨z=y)","∃x∃y (x=y∧∀z (z=x∨z=y))","∀x∀y ¬(x=y)"],"二点が異なることと、三点目がないことの両方を確認します。")
  ]},
  {name:"量化子と自然演繹", source:"第35〜37回", stages:[
    proof("全称から個別へ","P(a)",["∀x P(x)"],quantified,[["∀E","a",1]],"∀E を選び、代入する項 a を入力します。"),
    proof("存在の証人","∃x P(x)",["P(a)"],quantified,[["∃I","∃x P(x)",1]],"∃I の入力欄に結論の存在文を書きます。"),
    proof("任意の個体を一般化","∀x (P(x)→P(x))",[],quantified,[["仮定","P(a)"],["→I",1],["∀I","a x",2]],"仮定を先に解除します。入力欄は『任意変数 量化変数』です。"),
    proof("全称から存在へ","∃x P(x)",["∀x P(x)"],quantified,[["∀E","a",1],["∃I","∃x P(x)",2]],"非空の領域を扱います。∀E で一つの個体に特殊化します。"),
    proof("存在の証人を外に残さない","∃x Q(x)",["∃x P(x)","∀x (P(x)→Q(x))"],quantified,[["仮定","P(a)"],["∀E","a",2],["→E",3,4],["∃I","∃x Q(x)",5],["∃E","a",1,6]],"P(a) を仮定し、∃x Q(x) まで導いてから ∃E で仮定を閉じます。"),
    choice("一般化の落とし穴","未解除の前提 P(a) に依存して P(a) を得ました。∀I がここで使えない理由を選んでください。","a が依存している未解除の仮定に自由出現する",["P が述語記号である","量化変数はすべての段階で a と同じ名前でなければならない","∀I は含意にだけ適用できる"],"前提が a だけに課した条件を、全個体へ広げようとしています。")
  ]},
  {name:"冠頭標準形とエルブラン", source:"第33・38・45〜46回", stages:[
    rewrite("量化子を否定する","否定を述語の直前まで運んでください。",[
      ["¬∀x∃y R(x,y)","∃x ¬∃y R(x,y)",["∀x ¬∃y R(x,y)","∃x ∃y ¬R(x,y)"]],
      ["∃x ¬∃y R(x,y)","∃x∀y ¬R(x,y)",["∃x∃y ¬R(x,y)","∀x∀y ¬R(x,y)"]]],"否定をまたぐと ∀ と ∃ を交換します。"),
    rewrite("練習問題4・冠頭化","量化子の束縛先を保ったまま、すべての量化子を先頭へ運んでください。",[
      ["¬∀x P(x) ∨ ∀x Q(x)","¬∀x P(x) ∨ ∀y Q(y)",["¬∀x P(x) ∨ ∀y Q(x)","¬∀x P(x) ∨ ∃y Q(y)"]],
      ["¬∀x P(x) ∨ ∀y Q(y)","(∃x ¬P(x)) ∨ ∀y Q(y)",["(∀x ¬P(x)) ∨ ∀y Q(y)","(∃x P(x)) ∨ ∀y Q(y)"]],
      ["(∃x ¬P(x)) ∨ ∀y Q(y)","∃x∀y (¬P(x)∨Q(y))",["∃x∀y (¬P(y)∨Q(x))","∃x∀y (¬P(x)∧Q(y))"],["∀y∃x (¬P(x)∨Q(y))"]]],"左右の自由変数を確認します。この面では二つの冠頭形を受理します。"),
    choice("スコーレム関数の引数","∀x∃y∀z∃w R(x,y,z,w) をスコーレム化します。新しい関数記号 f,g で表した結果を選んでください。","∀x∀z R(x,f(x),z,g(x,z))",["∀x∀z R(x,f(z),z,g(z))","∀x∀z R(x,f(x,z),z,g(z))","∀x∀z R(x,f(x),z,g(x))"],"存在量化子より前にある全称変数を、出現順に引数とします。"),
    choice("保存されるもの","スコーレム化で、元の式と変換後の式の間で保存される性質を選んでください。","充足可能性",["同じ言語を使うこと","論理式の長さ","すべての構造で同じ論理式として評価できること"],"新しい関数記号によって言語が拡張されます。"),
    choice("エルブラン宇宙の第2層","定数 c と単項関数 f だけの言語です。深さ2で初めて加わる閉項を選んでください。","f(f(c))",["f(c)","f(f(x))","f(c,c)"],"閉項に自由変数はありません。"),
    order("有限個の基礎例へ","講義第38回の流れで、一階の充足不能を命題論理の問題へ移す手順を並べてください。",["冠頭標準形へ変形する","スコーレム化し全称形にする","閉項を代入して基礎例を列挙する","基礎原子式を命題変数として扱う","有限個の基礎例の命題的な充足不能を示す"],"有限の段階で矛盾が出ないことだけでは、探索は終了しません。")
  ]},
  {name:"導出原理と無限モデル", source:"第47〜48回", stages:[
    clauses("節を一枚消す",[["P"],["¬P","Q"],["¬Q"]],"P と ¬P を消すと単位節 Q が残ります。"),
    clauses("分岐を両方閉じる",[["P","Q"],["¬P","Q"],["P","¬Q"],["¬P","¬Q"]],"片側の分岐を解消して Q を、もう片側から ¬Q を作れます。"),
    clauses("連鎖を止める",[["P","Q"],["¬P","R"],["¬Q","R"],["¬R"]],"¬R を使って ¬P と ¬Q を先に得る方法があります。"),
    choice("単一化して反駁","P(x)∨Q(x) と ¬P(f(a)) を一階の導出原理でつなぐとき、導出節を選んでください。","Q(f(a))",["Q(x)","Q(a)","P(f(a))∨Q(x)"],"P の引数を一致させる代入を、節全体に適用します。"),
    choice("可算モデルの視点","可算な言語の一階理論が無限モデルを持つとき、下方レーヴェンハイム・スコーレムの定理から得られるものは何ですか。","その理論の可算無限モデル",["任意の有限サイズのモデル","すべてのモデルが可算であるという結論","同じ領域の上にある唯一のモデル"],"主張は少なくとも一つの可算モデルの存在です。"),
    choice("スコーレムのパラドックス","集合論の可算モデルが、内部で『ある集合は非可算』と述べられる理由を選んでください。","外部の数え上げを与える全単射が、モデル内に存在するとは限らない",["モデルに含まれる集合はすべて有限だから","モデル内部で自然数が存在しないから","『全単射』の定義が可算モデルでは無効だから"],"モデルの量化は、モデルが持つ対象の上で行われます。")
  ]}
];
function requireThat(condition,message){
  if(!condition) throw new Error(message);
}

function parseFormula(input){
  const source = input.replaceAll("->","→").replaceAll("~","¬").replace(/\s/g,"");
  const tokens = source.match(/[A-Z]|[a-z]|[→∧∨¬⊥⊤∀∃(),]/g) ?? [];
  requireThat(source.length<=180 && tokens.join("")===source,"式を確認してください。例 P→Q、∀x P(x)");
  let at=0;
  const accept = token => tokens[at]===token && (++at>0);
  const variable = () => {
    const name=tokens[at++];
    requireThat(/^[a-z]$/.test(name??""),"変数は英小文字1字で入力します。");
    return name;
  };
  function unary(){
    if(accept("(")){
      const body=expression();
      requireThat(accept(")"),"閉じ括弧が足りません。");
      return body;
    }
    if(accept("¬")) return ["→",unary(),["⊥"]];
    if(tokens[at]==="∀" || tokens[at]==="∃"){
      const kind=tokens[at++], name=variable();
      return [kind,name,unary()];
    }
    if(accept("⊥")) return ["⊥"];
    if(accept("⊤")) return ["⊤"];
    const name=tokens[at++];
    requireThat(/^[A-Z]$/.test(name??""),"原子式が必要です。例 P、P(a)");
    const args=[];
    if(accept("(")){
      do {args.push(variable());} while(accept(","));
      requireThat(accept(")"),"述語の閉じ括弧が足りません。");
    }
    return ["atom",name,args];
  }
  function level(next,op){
    let result=next();
    while(accept(op)) result=[op,result,next()];
    return result;
  }
  const and=()=>level(unary,"∧");
  const or=()=>level(and,"∨");
  function expression(){
    const first=or();
    return accept("→") ? ["→",first,expression()] : first;
  }
  const result=expression();
  requireThat(at===tokens.length,"式の末尾に解釈できない文字があります。");
  return result;
}

const quantifier = kind => kind==="∀" || kind==="∃";
const binary = kind => ["→","∧","∨"].includes(kind);
function format(f,parent=0){
  const [kind,left,right]=f;
  if(kind==="atom") return left+(right.length ? "("+right.join(",")+")" : "");
  if(quantifier(kind)) return kind+left+" "+format(right,4);
  if(kind==="→" && right[0]==="⊥") return "¬"+format(left,4);
  if(binary(kind)){
    const precedence={"→":1,"∨":2,"∧":3}[kind];
    const result=format(left,precedence+(kind==="→"?1:0))+" "+kind+" "+format(right,precedence+(kind==="→"?0:1));
    return precedence<parent ? "("+result+")" : result;
  }
  return kind;
}

function key(f,bound=[]){
  const [kind,left,right]=f;
  if(kind==="atom") return [kind,left,right.map(name=>bound.includes(name)? bound.indexOf(name): name)];
  if(quantifier(kind)) return [kind,key(right,[left,...bound])];
  if(binary(kind)) return [kind,key(left,bound),key(right,bound)];
  return [kind];
}
const same=(a,b)=>JSON.stringify(key(a))===JSON.stringify(key(b));
function free(f){
  const [kind,left,right]=f;
  if(kind==="atom") return [...new Set(right)];
  if(quantifier(kind)) return free(right).filter(name=>name!==left);
  if(binary(kind)) return [...new Set([...free(left),...free(right)])];
  return [];
}
function substitute(f,from,to){
  const [kind,left,right]=f;
  if(kind==="atom") return [kind,left,right.map(name=>name===from?to:name)];
  if(quantifier(kind)){
    if(left===from) return f;
    requireThat(left!==to || !free(right).includes(from),"この代入では変数が量化子に捕獲されます。");
    return [kind,left,substitute(right,from,to)];
  }
  return binary(kind)?[kind,substitute(left,from,to),substitute(right,from,to)]:f;
}

function evaluate(f,values){
  const [kind,left,right]=f;
  switch(kind){
    case "⊥": return false;
    case "⊤": return true;
    case "atom": return values[left];
    case "∧": return evaluate(left,values)&&evaluate(right,values);
    case "∨": return evaluate(left,values)||evaluate(right,values);
    case "→": return !evaluate(left,values)||evaluate(right,values);
  }
  throw new Error("命題論理の式が必要です。");
}

function atoms(f){
  if(f[0]==="atom") return [f[1]];
  return binary(f[0]) ? [...atoms(f[1]),...atoms(f[2])] : [];
}
const isVisible=(line,scope)=>line.scope.every((id,i)=>scope[i]===id);
const union=arrays=>[...new Set(arrays.flat())].sort((a,b)=>a-b);
const scopedLine=(formula,scope,deps,rule,parents=[],discharge=null)=>({formula,scope:[...scope],deps,rule,parents,discharge});
const inputRules={
  "仮定":"仮定する式",
  "∨Iᵣ":"左に加える式",
  "⊥":"導きたい式",
  "∀E":"代入する変数（例 a）",
  "∀I":"任意変数と量化変数（例 a x）",
  "∃I":"目標の存在文（例 ∃x P(x)）",
  "∃E":"証人を表す変数（例 a）"
};
const arity={"仮定":0,"→I":1,"→E":2,"∧I":2,"∧Eₗ":1,"∧Eᵣ":1,"⊥":1,"RAA":1,"∨Iᵣ":1,"∀I":1,"∀E":1,"∃I":1,"∃E":2};

function stepProof(state,rule,rawInput,ids){
  const {lines,scope}=state, input=rawInput.trim(), closing=["→I","RAA","∃E"].includes(rule);
  requireThat(ids.length===arity[rule],"必要な参照行は "+arity[rule]+" 行です。");
  const refs=ids.map(id=>lines[id-1]);
  requireThat(refs.every(line=>line && isVisible(line,scope)),"閉じた仮定の中にある行は、この位置から参照できません。");
  const from=refs.map(line=>line.formula);
  const deps=union(refs.map(line=>line.deps));
  const openId=scope.at(-1);
  const open=lines[openId-1]?.formula;
  const nextScope=closing?scope.slice(0,-1):scope;
  let result, parents=ids;
  const variable = value => {
    requireThat(/^[a-z]$/.test(value),"英小文字1字の変数を入力してください。");
    return value;
  };
  if(closing) requireThat(open,"解除する仮定を先に開いてください。");
  switch(rule){
    case "仮定":{
      const id=lines.length+1;
      result=parseFormula(input);
      scope.push(id);
      lines.push(scopedLine(result,scope,[id],rule));
      return;
    }
    case "→I": result=["→",open,from[0]]; break;
    case "→E":{
      const fits=(arrow,argument)=>arrow[0]==="→" && same(arrow[1],argument);
      const arrow=fits(from[0],from[1])?from[0]:fits(from[1],from[0])?from[1]:null;
      requireThat(arrow,"A→B と、その前件 A を参照してください。");
      result=arrow[2];
      if(arrow!==from[0]) parents=[...ids].reverse();
      break;
    }
    case "∧I": result=["∧",from[0],from[1]]; break;
    case "∧Eₗ":
    case "∧Eᵣ":
      requireThat(from[0][0]==="∧","連言 A∧B の行を参照してください。");
      result=from[0][rule==="∧Eₗ"?1:2];
      break;
    case "∨Iᵣ": result=["∨",parseFormula(input),from[0]]; break;
    case "⊥":
      requireThat(from[0][0]==="⊥","矛盾記号 ⊥ の行を参照してください。");
      result=parseFormula(input);
      break;
    case "RAA":
      requireThat(from[0][0]==="⊥" && open[0]==="→" && open[2][0]==="⊥","¬A を仮定し、⊥ の行を参照してください。");
      result=open[1];
      break;
    case "∀E":{
      requireThat(from[0][0]==="∀","全称式の行を参照してください。");
      const [,name,body]=from[0];
      result=substitute(body,name,variable(input));
      break;
    }
    case "∀I":{
      const names=input.split(/\s+/);
      requireThat(names.length===2,"任意変数、量化変数の順に空白で区切って入力します。");
      const [name,binder]=names.map(variable);
      requireThat(deps.every(id=>!free(lines[id-1].formula).includes(name)),"任意変数が未解除の依存仮定に自由に現れています。");
      requireThat(name===binder || !free(from[0]).includes(binder),"量化する変数名がすでに式に自由出現しています。");
      result=["∀",binder,substitute(from[0],name,binder)];
      break;
    }
    case "∃I":{
      result=parseFormula(input);
      requireThat(result[0]==="∃","結論は存在量化子で始めてください。");
      const [,binder,body]=result;
      const witnesses=new Set([binder,...free(from[0])]);
      requireThat([...witnesses].some(name=>{
        try {return same(substitute(body,binder,name),from[0]);} catch {return false;}
      }),"参照した式が、入力した存在文の代入例になるか確認してください。");
      break;
    }
    case "∃E":{
      const name=variable(input);
      const [exists,goal]=from;
      requireThat(exists[0]==="∃" && isVisible(refs[0],nextScope),"先に外側の存在文、その次に仮定内で導いた結論を参照してください。");
      requireThat(same(substitute(exists[2],exists[1],name),open),"現在の仮定が、存在文に証人を代入した式と一致しません。");
      requireThat(!free(exists).includes(name) && !free(goal).includes(name) && deps.filter(id=>id!==openId).every(id=>!free(lines[id-1].formula).includes(name)),"証人が存在文・結論・未解除の依存仮定のいずれかに自由出現しています。");
      result=goal;
      break;
    }
    default: throw new Error("推論規則を選択してください。");
  }
  lines.push(scopedLine(result,nextScope,closing?deps.filter(id=>id!==openId):deps,rule,parents,closing?openId:null));
  if(closing) scope.pop();
}

const commands={assume:"仮定",intro:"→I",apply:"→E",pair:"∧I",left:"∧Eₗ",right:"∧Eᵣ",absurd:"⊥",raa:"RAA",orRight:"∨Iᵣ",generalize:"∀I",instantiate:"∀E",exists:"∃I",useExists:"∃E"};
function asFormula(text){return text.trim().replaceAll("&","∧").replaceAll("|","∨").replace(/\b(forall|exists|false|true)\b/g,word=>({forall:"∀",exists:"∃",false:"⊥",true:"⊤"})[word]);}
function runProgram(initial,stage,source){
  const result=structuredClone(initial);
  source.split(/\r?\n/).forEach((line,i)=>{
    const code=line.split("#")[0].trim();
    if(!code)return;
    try{
      const parts=code.split(/\s+by\s+/);
      requireThat(parts.length<=2,"1行に by は一つです。");
      const expected=parts.length===2?parseFormula(asFormula(parts[0])):null;
      const instruction=parts.at(-1);
      const split=instruction.indexOf(":");
      const [cmd,...refs]=(split<0?instruction:instruction.slice(0,split)).trim().split(/\s+/);
      const op=Object.hasOwn(commands,cmd)?commands[cmd]:cmd;
      requireThat(stage.rules.includes(op),"この問題で使える命令を確認してください。");
      requireThat(refs.every(x=>/^[1-9]\d*$/.test(x)),"参照行は正の整数で指定してください。");
      const implicit=expected && ["仮定","⊥","∃I"].includes(op)?parts[0]:"";
      const arg=asFormula(split<0?implicit:instruction.slice(split+1));
      requireThat(Boolean(inputRules[op])===Boolean(arg),"式や変数は必要な命令だけに : の後で指定します。");
      requireThat(result.lines.length<80,"証明は80行までです。");
      stepProof(result,op,arg,refs.map(Number));
      if(expected)requireThat(same(expected,result.lines.at(-1).formula),"左辺と規則の結論が一致しません。導出結果："+format(result.lines.at(-1).formula));
    }catch(e){throw Error((i+1)+" 行目："+e.message);}
  });
  result.source=source;
  result.solved=false;
  return result;
}

if(typeof module!=="undefined")module.exports={chapters,runProgram,parseFormula,scopedLine,format};
