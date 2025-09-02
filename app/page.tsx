// app/page.tsx — 禮物開封式情書網站（多階段互動框架，修正 Hooks 順序）
// =====================================================
// 變更重點：
// - 修正 React Hooks 規則：所有 useState/useEffect/useRef 皆在元件頂層宣告。
// - Stage 切換僅影響「是否渲染」，不影響 Hook 呼叫順序。
// - novel 階段的 wrapRef / progress 也移到頂層，並在 effect 內以 stage 判斷是否綁定事件。
// =====================================================

"use client";

import React, { useEffect, useRef, useState } from "react";

// ===================== 內容設定（請改這裡） =====================
const config = {
  loverName: "小跑皮",
  fromName: "大狗",
  finale: "祝福我們，都要開開心，有彼此的陪伴，希望往後餘生都是你。",
  letters: [
    { text: "第一次和妳出國的我，既興奮又緊張，期待我們出去又怕你會生氣", img: "/photos/japan-day1-01.jpg" },
    { text: "第一次走在花火大會的路上，煙火像把夜空切成很多段，我們慢慢的欣賞", img: "/photos/japan-day1-02.jpg" },
    { text: "最喜歡的事情，就是看著你笑。", img: "/photos/daily-01.jpg" },
    { text: "有沒有發現，我們穿著和服特別適合", img: "/photos/daily-02.jpg" },
  {
    text: "在機場的路上，我一個人扛了三個行李，心裡卻覺得一點也不累，因為是帶著你一起去冒險。",
    img: "/photos/airport-luggage.jpg",
  },
  {
    text: "第一次住進大阪城旁的高樓酒店，在九點鐘的夜裡，吃著最貴的晚餐，卻覺得最珍貴的是你的陪伴。",
    img: "/photos/hotel-dinner.jpg",
  },
  {
    text: "清晨的餐桌上，昨天我們做到太晚，讓我整個就很沒精神",
    img: "/photos/hotel-breakfast.jpg",
  },
  {
    text: "在夾娃娃機台前，你看上了一隻美樂蒂，我說『你想要，我就一定要把牠帶回家』。",
    img: "/photos/melody-doll.jpg",
  },
  {
    text: "旅途中太累的夜晚，回到房間靠著依著你睡著了，那一刻比任何安眠藥都安心。",
    img: "/photos/sleep-shoulder.jpg",
  },
  {
    text: "梅田市中心的人潮裡，我們慢慢散步，直到找到你要的愛馬仕（結果沒有）",
    img: "/photos/umeda-walk.jpg",
  },
  {
    text: "第一次尤為重要，因此我把這個機會給了你，此生沒有收過對象的禮物，謝謝你讓我知道被愛的感覺",
    img: "/photos/daily-toast.jpg",
  },
  {
    text: "第一次和你出遊，就選擇了台中，因為我知道台中的風景很美",
    img: "/photos/daily-street.jpg",
  },
  {
    text: "你說過想跟我一起吃泡麵，於是在一天的半夜裡，悄悄打開不想吵到家人",
    img: "/photos/daily-conbini.jpg",
  },
  {
    text: "我想把這些碎片都收進來——因為只要有你，所有日常都是紀念日。",
    img: "/photos/daily-memory.jpg",
  },
],

  longLetter: `
題記
這不是一封普通的情書，而是一本關於「我們」的故事書，濃縮了我們遇到的事情，不論是開心還是不愉快，在每次的事件後我都有記錄在我的記事本裡面，才有辦法誕生這樣的小情書！

從第一次遇見你，到這兩百五十多天裡的每一個日子，我都想一字一句記錄下來。裡面有我們的笑聲，也有我們的淚水；有我們因為小事吵架的瞬間，也有彼此擁抱時的心跳。
或許將來，時間會讓我們遺忘一些細節。可能忘了第一次聊天時，你說過的那句調皮的話；也可能忘了哪一次下雨天，我幫你撐傘時，雨水順著傘緣滴落在地的聲音。但我相信，當我們再讀到這些文字，會像翻閱一本舊相簿，每一個字都會喚起一段記憶，提醒我們：這就是屬於我們的青春、愛情，以及無可取代的日子。
願這本「情書」能在未來的某一天，成為我們的見證。當我們再次閱讀時，能微笑著說：「原來我們走過的每一刻，都這麼珍貴。」
第一章｜初相識：那個哈摟以後
2024年的某一天，我就像往常一樣滑著Thread看著別人發著有趣的文章，突然看到一個通知，一個女生追蹤了我？我想說什麼時候老天爺也會發好吃的給我了，我就自然而然地追蹤回去，順便也把人家的IG也追蹤起來，看了你的貼文後越發覺得奇怪，但就這樣過去了。按讚有趣的東西一直來我的習慣，我當初也沒有多想，看到妳發的限時動態我就隨手按了，隔了幾天，打開手機就收到你的通知，你竟然跟我打招呼：「哈摟」，我看了又看鏡子，我明明不像會被搭訕的人啊，又看了看你的貼文，越發覺得你是中國的詐騙（看太多抖音），所以剛開始一直抱持著懷疑的態度跟你聊天。聊天的細節太多，事隔那麼久我已經有點記不清了，但我會一直記得你剛開始要回不回，雖然那時的我也在專心處理我的事情——麻將。
沒過多久，我就主動邀約你去信義區喝酒，被你百般拒絕，但我秉持著既然聊了我就想見見你，即使最後我可能會被打槍，中山先生革命都花了11次我被拒絕幾次又何妨？所以我依舊拉下臉皮約你，在幾次的軟磨硬泡下你終於答應我，當天我很緊張，我特別在前一天把我的浴室刷得好好的（我其實也不知道為啥需要），可能是因為你跟我說過你出門後就不能回家，我就想把你帶回來了。
11/15是我們第一次見面，之所以印象很深是因為那一陣子我跟大學同學處得不好，他們那一天是學弟妹的制服趴他們都是工作人員，我原本應該去的但因為各種原因我就沒有參加工作，剛好那天我就跟你約了，在Fake Sober沒多久我就看到他們，害我很尷尬，郭力廷原本就知道你這個人他就問我說：「這位是你女朋友嗎？」但這才是我們第一次見面。
喝酒聊天的過程中，我發現你是個很害羞的女生，跟我網路上聊天的你完全不一樣，聊了很多我也不敢對有太多想法，只想著聊天看著你的眼，結束後我就問你要睡哪，因為你曾經跟我說過沒辦法回家，我就主動問你說是否要住我這邊，沒想到你馬上就答應….即使我做好萬全的準備我還是沒想到你真的會答應，回房間後事情就一發不可收拾了….（圖A）
第二章｜說不出口的緊張：告白前後
11/26是我第一次主動去中原接你，原本只是想要去中原找你聊天，結果晃一晃就到了十一點，我就想問你你要不要來我們家，甚至騙我爸媽說我們再一起一段時間，但其實根本還沒再一起哈哈哈，來的時候我還特別心虛，我沒有騙過我媽這種事情，並且沒有女生以女朋友的名義來過我家，所以我特別的緊張。
12/1是我要去台師大考日語檢定日子，那幾天我特別緊張因為我準備了很久，同時我也想問你願不願意陪我去，沒想到的是你竟然願意陪我去考試，考試時間那麼久我也不知道為什麼你願意陪我去，但你二話不說就來了，我還記得我們早上八點就要起床了，我們都很累但你還是願意為了我早起。考完試我們後我們就一直走走晃晃，走到了松菸我們都累了，就打算停下腳步看看有什麼展廳，沒想到走進了一個我也不知道名字的花園，我就和你拍張第一張屬於我們的合照，但當時旁邊就只有一個看起來像印度裔的人，我就想說算了請他幫我們拍，沒想到….是真的拍得好醜，但畢竟是我們第一張照片，我就好好留著！(圖B) 
12/24我很緊張，我心理建設了好久，今天是我打算正式告白的日子，下午的時候你跟YUKI去信義去逛街，我故意約晚一點的時間跟你碰面，就是因為我跑去買禮物了！那天我印象很深刻，我找了兩家世華洛施琪的店，第一家店真的服太差我就很生氣，轉頭去A11新光三越買，那家店員就很詳細的跟我說明，雖然我本來就查過我要買什麼，但我要買的那款到那邊沒貨，所以我還是買了一款看起來比較適合你的款式，到了吃飯的時候我依舊非常緊張，我深怕你會跟上次一樣拒絕我，在告白前五分鐘，我特別去廁所做心理建設，回來後我緊張並且顫顫巍巍的問你：「你願意當我女朋友嗎？」沒想到你沒有拒絕我，反倒直接的說：「我願意」我不敢置信地在問你一次，你的回覆依舊是：「我願意」，到這心裡的巨石才終於放下，原來你也是喜歡我的。(圖C) 
第三章｜我們的第一個季節：相處的磨合
1/7 原本還在韓國的我，提早一天回國為的就是希望可以趕快見到你，馬上帶妳去藝文特區走走，送你回中壢的路上你突然說何心雲要找你吃宵夜，於是我奮不顧身，不管明天五點就要起床出國去日本，沒想到這是我第一次遇到你的朋友們，顯得我有點害羞，而且我們還遇到了以後遇不到的數學男哈哈哈。
1/22 是我們第一次一起名正言順出去玩，我考慮了好久最後決定帶妳去台中走走，因為我很喜歡台中的天氣（除了八家酒文化外），第一天的我們很開心，先去你找的一家咖啡廳，環境很漂亮你也同樣漂亮，但沒想到還是遇到不想遇到的八家酒哈哈哈，晚上我們就慢慢晃，晃到了夜市，但這個時候不好的事情就發生了，我不想回憶了，對不起小寶那次應該是我們第一次大吵架，是因為我的不好讓你生氣，我不應該在當下對你撒氣。隔天我們兩個很有默契的穿一樣的衣服，全身白去吃好吃的早午餐，結果你每次都沒有吃完都會丟給我當廚餘桶，最後的最後我們去了旅途的最後一站——看海，我們艱難地從路上走到了海邊，雖然沒辦法下海踩水，但是我們拍了很多很好看的照片、被風吹得頭痛，但我們始終再一起，永遠再一起。(圖D)
2/12是你的生日，算是我們第一次過的第一個重要的節日，所以我很緊張，我原本想買大蛋糕但又怕我們吃不完，我又在想蛋糕怎麼有辦法偷偷帶進去不被你發現，我差點請陳勝凱幫我先買蛋糕，然後拿去餐廳請他先冰起來，但後來我覺得我的個性就是大辣辣，我打算直接直接一點，所以我就不躲躲藏藏，蛋糕提在手上禮物稍微藏了起來，禮物我準備了好久，我找了好幾家店，結果只有這家有賣（沒想到就在我們家旁邊）吃飯時看你開心地笑著，而我在那一刻知道，能為你製造幸福，是我最喜歡做的事。小寶想跟你說，第一次的情人節是我的問題，我把我的習慣帶來我們生活，我以為節日靠近就可以一起過，這是我第一次瞭解到了你的想法，對不起讓你生氣，我以後的情人節和你的生日一定會分開過！！(圖E)
3/29 從你口中聽說你要去跟朋友吃下午茶，我就下定決心想要彌補上次的情人節，於是我第一次買了一束花送給我的愛人，但在這之前沒有過送人花的經驗， 因此我特別跑去跟你吃飯的朋友，問他你們在哪吃、大概幾點以及我要怎麼偷偷趁你不注意送你。最後決定跟他串通，讓他告訴你他要上廁所藉此讓我有機會走進去並幫我們拍照錄影，走進去的時候我很緊張，我沒有這樣給過別人驚喜，你是第一個也是唯一一個。(圖F)
第四章｜朝日與雨：我們在日常裡成長
4月發生了很多事情，有些我的錯誤行為、讓你不開心等等的，但是我的心裡依舊只有你，我還記得在4/1我穿得很正式，因為你曾經跟我說過你喜歡我穿西裝，我就穿著筆挺帶你去吃好吃的義大利麵，結果你竟然跟我說你前曖昧對象帶你來吃過，我是真的很生氣！！！！後來我們一起去了松菸，我很喜歡看書你也願意陪我去走一走，我們在松菸拍了很多很好看的照片，也吃了好貴好貴的冰淇凌。我也記得4/19我們一起去了中山，原本想帶你吃好吃的義大利麵，結果不小心訂到他的分店，只有賣漢堡和咖喱飯，讓我很難過以為又可以帶你去吃到新品項，但也好在這家分店的漢堡咖哩飯都很好吃。4/26也是一個開心的日子，因為我們跑去宜蘭兩天一夜！這次是我們第二次去外縣市旅遊，我們第一站就跑去吃我喜歡吃的卜肉，剛開始擔心你不喜歡因為有點鹹，但看到你也喜歡我就放心下來了，在我們的討論下我們最終訂了溫泉飯店，達成我們邊泡湯邊打砲的夢想，在這之後我們還去看了小動物，卡皮巴拉、梅花鹿還有我的朋友—大狗，看著你開心的臉我就覺得十分開心，覺得我的付出都是直得，因為我愛你我願意為你付出所有。(圖G)
5/16 是我們第一次去手作戒指，也是我人生第一次和女朋友手作東西，之所以選擇做戒指是因為在宜蘭的時候原本想要帶你去做，但時間太緊迫所以最後延到這個時候，找了一家口碑還不錯，我們做的過程好開心！用敲打的方式打上了對方的名字以及自己的名字在戒指的內側，浴室我們永遠綁定再一起！我們還互相答應了彼此每年都要來定期洗戒指，也代表著我們會再一起到永遠。
5/20 是一個我一輩子都會難忘的日子，你偷偷跑來幫我過生日，我完全沒有察覺，這是第一次女朋友在我不知情的情況下被過生日，我很開心但同時也很心疼你，為了我一個小小的生日打費周章從中壢搭車過來新莊，在這之前你一直問我喜歡什麼顏色的相框、什麼顏色的花適合送人還有偷偷拿金沙的包裝匡我的戒圍，這些細節我都沒有發現，我都以為你只是隨口問問隨口玩玩，沒想到你原來另有所圖，我在進房間後完全有被嚇到，因為我沒有設想到是今天也沒有設想過你會主動幫我過生日，我那時想得很簡單，我是這世界上最幸福的男人。(圖H)
6/7 是我們跑去逛IKEA的日子，原本下午的時候天氣還不錯想去新北都會公園，沒想到突然下雨了，我們就馬上騎車去IKEA逛街，剛開始我覺得就很開心，因為我沒有跟女朋友一起逛過家具，讓我有一種我們未來要一起成家的感覺，過著逛著我們就會開始想像我們之後的房間該長什麼樣子，小孩子的房間需要什麼，後來走著走著就餓了，於是我們就吃了裡面的餐廳，這也是我第一次吃，我很喜歡他們的肉球，開心的一天就結束，但沒想到這個時候準備去牽車的時候發現車子的龍頭既然撞凹了，老婆你就有耐心的陪我去警察局報案，然後我們就自己摸摸鼻子搭計程車回房間了。(圖I)
第五章｜家的方向：家人與朋友
7/4是一個非常緊張的日子，我要見你媽媽了！以前都是你經常來我們家，我的家人以及朋友們都認識了遍，但第一次見你媽媽屬實非常讓我緊張，我不知道你媽媽的個性，也不知道你媽媽是否會喜歡我的面相，一切都讓我非常擔心，第一次見爸媽我不知道要帶什麼禮物，於是我就買了一個最保險的——上海星巴克限定馬克杯，跟你媽媽吃飯聊天的過程中，發現他非常的可愛也很會聊天，跟你一樣喜歡吃好吃的東西，原來我愛人的媽媽也是一樣的可愛，不愧是你媽媽生的出來你那麼可愛的女兒。(圖J)
7/9 是我第一次也是你第一次去貓咖，我們前一天晚上就一直在想要去哪裡好，原本計劃去看電影但最近檔期沒什麼好看的，原本又計畫要去大稻埕走一走順便洗戒指，但是不知道為啥沒去，最後決定去試試看貓咖，剛開始我以為都是宅男去的，但沒想到裡面蠻乾淨的也真的好多小隻的貓咪跑來跑去，看到你開心玩貓的臉，我就覺得很幸福，因為我又帶你創造了一個開心的時刻，沒想到後來因為我的疏忽，讓我們被迫中止我們開心的時間，立馬趕回去桃園。但幸運的是，我答應你的事情還是有做到，我們又開發了一間不一樣的汽車旅館！(圖K)
第六章｜一起出走：日本行
7/24是我最最最最最期待的日子，是我人生第一次第一次和女朋友出國，這是我希望做到的事情，因為我認為能跟女朋友出國玩，並不是在國內可以比擬的，除了行前的規劃、心理準備最重要的是要有一顆開心的心情，才能再出國的時候不生氣、不吵架開開心心結束出國行，在這幾天的旅途中我們有說有笑，雖然有時候你的行為真的會讓我很傻眼不知道怎麼說，但總而言之我們這幾天是開心的愉快的，瘋狂做愛、拍美美的照片、吃好吃的東西以及努力夾了一個你很希歡的娃娃，喔對了，我們還有拍到你最想拍的照片「和服」，雖然當下有點吵架，但是我還是示好道歉，我們最後還是開開心心回來台灣。(圖L)
第七章｜慢步的日常
從日本回來後，我們生活的步調漸漸慢了下來，但不變的是我們依舊去了好多地方嘗試了不一樣的事情，我們開始玩一些好玩的遊戲，像我們在玩模擬市民的時候一直想要去殺人，雖然我一直玩不懂要怎麼玩，但我還是盡力去陪你玩，後來我們就跑去玩煮過頭，這個遊戲經常讓我們吵架，但同時也很好玩，因為看到你成功過關都會大叫，就覺得好像我煮多一點東西也沒關係。在你生理期的期間，我也幫你煮了好喝的紅豆湯，因為我知道你不喜歡吃到紅豆，所以我特別把豆子撈出來，我也記得你喜歡甜甜的湯，所以我在煮的時候也多加了糖，因為你跟我說過的事情，我都會記得。後來的我們感覺慢慢往好的方向發展，你幫我做了好多你的小卡，我也如你願放在我的手機背後，等我開心我就會掛在我書包上！！答應你的事情我也依舊沒有忘記，從高雄回來後我馬上就帶你去吃好吃的玩好玩的，還記得那個時候吃添好運你說你要吃奶皮，我就跟店員說：「不好意思奶皮是熱的嗎」他就聽不懂，你就笑我跟我說奶皮是你自己取的，害我尷尬了好久，上次答應你組樂高小人的事情我也沒忘記，我就乖乖的帶你去拼，我們拼得好開心，每次覺得看到你的笑容就覺得好幸福。(圖M)
你每次都說想我，有時候真的沒辦法去接你的時候就覺得很難過，這次我就打算直接去找你，洗完澡換完衣服我就馬上去找你，回來的路上還遇到火燒車….我們這幾天都開開心心的，帶你去台茂吃好吃的想到你說想吃辣，二話不說就帶你去海底撈排隊，晚上的我們也很開心的看著電影然後一起入睡。情人節當天，我竟然收到你送我的禮物，是一幅我的畫像，老婆你畫得很像非常像看到你認真的對待我，認真的準備我的禮物我就覺得好難過，我從來沒有過節的習慣，也不習慣收到禮物但這次的驚喜是讓我開心的，但在出去玩的過程，因為我的關係讓我們有一點點小小的不愉快，答應你的事情就要好好做到，對不起這一點是我的問題，我一直著急回去家裡，想好好休息，但我發現你真的非常需要，我知道錯了老婆。(圖N)
終章｜我們以後
回頭看，我們已經一起走過了兩百五十多個日子。從陌生、曖昧，到如今牽著手一同面對生活的大小事，每一段回憶都讓我更確定——我想和你一起走很遠很遠的路。
未來我們還會遇到許多開心的事，也一定會有吵架、有誤解、有眼淚。但就像過去的我們那樣，我們會學會好好說話、好好傾聽、好好相愛。
謝謝你選擇了我，也讓我有機會去學習如何成為一個更好的人。
願我們未來的每一封信、每一張合照、每一個擁抱，都成為這本故事書繼續往下寫的動力。
我們的故事，還沒完，還會繼續寫下去。
而我，會永遠是你身邊最真誠、最愛你的那個人。

`,
  randomLines: [
    "",
    "路過很多光，還是你的眼睛最亮。",
    "想把平凡過成節日。",
    "風把話吹得很慢，我把你聽得很認真。",
  ],
};
// ==============================================================

type Stage = "envelope" | "box" | "letters" | "novel" | "finale";

// ===================== 通用小工具 =====================
function useLongPress(callback: () => void, delay = 1000) {
  // 用全域 setTimeout 的回傳型別，跨環境最不會吵
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    if (timer.current) return;
    // 注意：這裡不要加 window.
    timer.current = setTimeout(() => {
      callback();
      timer.current = null;
    }, delay);
  };

  const clear = () => {
    if (timer.current) {
      // 同理，用 clearTimeout（不要加 window.）
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  return { start, clear };
}



// ===================== 花瓣背景（Canvas） =====================
function PetalsBackground({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!active) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 18;
    const petals = Array.from({ length: count }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      r: 6 + Math.random() * 10,
      vx: -0.6 + Math.random() * 1.2,
      vy: 0.8 + Math.random() * 1.2,
      rot: Math.random() * Math.PI,
      vr: -0.01 + Math.random() * 0.02,
      hue: 340 + Math.random() * 20,
    }));

    let raf = 0;
    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      petals.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y - p.r > h) {
          p.x = Math.random() * w;
          p.y = -20;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `hsla(${p.hue},60%,70%,0.8)`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return <canvas ref={ref} className="fixed inset-0 -z-10" aria-hidden />;
}

// ===================== 隨機詩句浮現（彩蛋） =====================
function PoemPopper({ lines, active }: { lines: string[]; active: boolean }) {
  const [items, setItems] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  useEffect(() => {
    if (!active) return;
    let id = 0;
    const onClick = (e: MouseEvent) => {
      const t = lines[Math.floor(Math.random() * lines.length)] || "";
      setItems((prev) => [...prev, { id: id++, x: e.clientX, y: e.clientY, text: t }]);
      setTimeout(() => setItems((prev) => prev.slice(1)), 1600);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [lines, active]);

  if (!active) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {items.map((it) => (
        <span
          key={it.id}
          className="absolute text-sm sm:text-base text-rose-700/90 bg-white/80 backdrop-blur px-2 py-1 rounded-lg shadow transition-opacity duration-700 animate-fadeUp"
          style={{ left: it.x, top: it.y }}
        >
          {it.text}
        </span>
      ))}
      <style>{`
        @keyframes fadeUp { 0%{opacity:0; transform:translate(-50%,-10px)} 20%{opacity:1; transform:translate(-50%,-18px)} 100%{opacity:0; transform:translate(-50%,-44px)} }
        .animate-fadeUp{ animation: fadeUp 1.4s ease-out forwards; transform: translate(-50%,-44px); }
      `}</style>
    </div>
  );
}

// ===================== 煙火（Canvas） =====================
function Fireworks({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!active) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };
    const particles: Particle[] = [];

    const spawnFirework = (x: number, y: number) => {
      const n = 60;
      const hue = Math.floor(200 + Math.random() * 100);
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2;
        const speed = 2 + Math.random() * 3.2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color: `hsl(${hue + Math.random() * 40}, 80%, 60%)`,
        });
      }
    };

    const autoTimer = setInterval(() => {
      spawnFirework(window.innerWidth * (0.3 + Math.random() * 0.4), window.innerHeight * (0.35 + Math.random() * 0.2));
    }, 1300);

    const onClick = (e: MouseEvent) => spawnFirework(e.clientX, e.clientY);
    window.addEventListener("click", onClick);

    let raf = 0;
    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, w, h);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.02;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.012;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
      clearInterval(autoTimer);
    };
  }, [active]);

  return <canvas ref={ref} className="fixed inset-0 -z-10" aria-hidden />;
}

// ===================== 主頁面 =====================
export default function Page() {
  // 1) 全域流程狀態（先宣告）
  const [stage, setStage] = useState<Stage>("envelope");

  // 2) 短篇索引 + 動畫方向/鍵（只宣告一次）
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [dir, setDir] = useState<"fwd" | "back">("fwd");

  // 3) 觸控滑動（ref 不會破壞 hooks 順序）
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 48;

  const goNext = () => {
    if (idx < config.letters.length - 1) {
      setDir("fwd");
      setIdx(i => i + 1);
      setAnimKey(k => k + 1);
    } else {
      setDir("fwd");
      setAnimKey(k => k + 1);
      setStage("novel");
    }
  };

  const goPrev = () => {
    if (idx > 0) {
      setDir("back");
      setIdx(i => i - 1);
      setAnimKey(k => k + 1);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    if (startX.current == null || startY.current == null) return;
    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) goNext(); else goPrev();
    }
    startX.current = null;
    startY.current = null;
  };

  // 4) 鍵盤快捷（可選）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (stage !== "letters") return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, stage]);

  // 5) box 階段（長按拆緞帶）
  const [unboxed, setUnboxed] = useState(false);
  const { start, clear } = useLongPress(() => setUnboxed(true), 900);
  useEffect(() => {
    if (stage === "box" && unboxed) {
      const t = setTimeout(() => setStage("letters"), 600);
      return () => clearTimeout(t);
    }
  }, [stage, unboxed]);

  // 6) novel 階段（長篇）滾動進度
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (stage !== "novel") return;
    const el = wrapRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (el.scrollTop / max) * 100)) : 0;
      setProgress(pct);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [stage]);

  // 7) 氛圍特效開關
  const petalsOn = stage === "envelope" || stage === "box" || stage === "letters";
  const poemsOn = stage === "letters";

// ===== Novel 讀書器：狀態 =====
const [lightbox, setLightbox] = useState<{ open: boolean; src: string; alt?: string; caption?: string }>({ open: false, src: "" });
const [fontScale, setFontScale] = useState(1);            // 1, 1.1, 1.2 ...
const [serif, setSerif] = useState(true);                 // 襯線字體切換
const [darkRead, setDarkRead] = useState(false);          // 夜間模式
const [savedScroll, setSavedScroll] = useState<number | null>(null);

// 字數/分鐘估算（中文用去空白的字元數；約 300 字/分鐘）
const charCount = React.useMemo(
  () => config.longLetter.replace(/\s/g, "").length,
  []
);
const estMinutes = Math.max(1, Math.round(charCount / 300));

// 進入 novel 時，嘗試讀取上次進度
useEffect(() => {
  if (stage !== "novel") return;
  const k = "novelScrollTop";
  const v = Number(localStorage.getItem(k) || "0");
  if (!Number.isNaN(v) && v > 30) setSavedScroll(v);
}, [stage]);

// novel 滾動時，儲存進度（沿用你已有的 wrapRef / progress）
useEffect(() => {
  if (stage !== "novel") return;
  const el = wrapRef.current;
  if (!el) return;
  const onScroll = () => {
    const max = el.scrollHeight - el.clientHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (el.scrollTop / max) * 100)) : 0;
    setProgress(pct);
    localStorage.setItem("novelScrollTop", String(el.scrollTop));
  };
  el.addEventListener("scroll", onScroll);
  return () => el.removeEventListener("scroll", onScroll);
}, [stage]);

// 按「繼續閱讀」時回到上次位置
const resumeReading = () => {
  const el = wrapRef.current;
  if (el && savedScroll) {
    el.scrollTo({ top: savedScroll, behavior: "instant" as ScrollBehavior });
    setSavedScroll(null);
  }
};

  // ====== Stage 1: 信封開場 ======
  if (stage === "envelope") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-pink-100 relative overflow-hidden">
        <PetalsBackground active={petalsOn} />
        <div className="text-center space-y-3 absolute top-8 left-1/2 -translate-x-1/2">
          <p className="text-xs uppercase tracking-widest text-rose-600/80">for {config.loverName}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-rose-700">有一封信想交到你手上</h1>
        </div>
        <button
          aria-label="open envelope"
          onClick={() => setStage("box")}
          className="relative w-[320px] h-[200px] rounded-lg shadow-2xl overflow-hidden border border-rose-200 active:scale-95 transition"
        >
          <div className="absolute inset-0 bg-rose-200" />
          <div className="absolute inset-0 origin-top rotate-12 bg-rose-300/90" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-rose-500 shadow-inner flex items-center justify-center text-white">♥</div>
          <span className="absolute bottom-3 w-full text-center text-sm font-medium text-rose-900"></span>
        </button>
      </main>
    );
  }

  // ====== Stage 2: 禮盒（長按拆緞帶） ======
  if (stage === "box") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-rose-50 relative overflow-hidden">
        <PetalsBackground active={petalsOn} />
        <h2 className="mb-6 text-2xl font-bold text-rose-700">拆開小禮盒</h2>
        <div className="relative w-44 h-44">
          <div className="absolute inset-0 bg-yellow-300 rounded-lg shadow-xl border border-yellow-200" />
          <div className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 bg-red-500 transition ${unboxed ? "opacity-0" : "opacity-100"}`} />
          <div className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-red-500 transition ${unboxed ? "opacity-0" : "opacity-100"}`} />
          <div className={`absolute inset-3 bg-white rounded-md grid place-items-center text-3xl transition-transform ${unboxed ? "-translate-y-8 opacity-100" : "translate-y-0 opacity-90"}`}>🎴</div>
        </div>
        <p className="mt-4 text-rose-700">{unboxed ? "打開中…" : "長按 1 秒拆開緞帶"}</p>
        <button
          onMouseDown={start}
          onMouseUp={clear}
          onMouseLeave={clear}
          onTouchStart={start}
          onTouchEnd={clear}
          className="mt-4 px-4 py-2 rounded-lg bg-rose-500 text-white shadow hover:bg-rose-600"
        >
          ♥ 長按
        </button>
      </main>
    );
  }

  // ====== Stage 3: 短篇信件（文字 + 照片 + 彩蛋詩句） ======
// ====== Stage 3: 短篇信件（滑動翻頁 + 方向動畫） ======
if (stage === "letters") {
  const L = config.letters[idx];
  const hasNext = idx < config.letters.length - 1;

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-rose-50 p-6 relative overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <PetalsBackground active={true} />

      {/* 右上角進度 */}
      <div className="absolute top-4 right-4 text-xs text-rose-600/80 bg-white/70 backdrop-blur px-2 py-1 rounded-md shadow-sm">
        {idx + 1} / {config.letters.length}
      </div>

      {/* 信件卡片：依方向套不同動畫 */}
      <div
        key={animKey}
        className={`max-w-xl w-full bg-white rounded-2xl shadow-lg border border-rose-100 p-6 text-center relative z-10
          ${dir === "fwd" ? "animate-pageNext" : "animate-pagePrev"} will-change-transform`}
      >
        <p className="text-lg leading-relaxed whitespace-pre-line text-gray-800">{L.text}</p>

        {L.img && (
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={L.img}
              alt="memory"
              className="mx-auto w-[58%] max-w-xs h-auto rounded-xl shadow-md object-cover"
            />
            <p className="mt-2 text-xs text-gray-500">（左右滑動可翻頁）</p>
          </div>
        )}
      </div>

      {/* 按鈕（仍然保留） */}
      <div className="mt-6 z-10 flex gap-3">
        {idx > 0 && (
          <button
            onClick={goPrev}
            className="px-4 py-2 rounded-lg bg-rose-200 text-rose-800 shadow hover:bg-rose-300"
          >
            ← 上一封
          </button>
        )}
        {hasNext ? (
          <button
            onClick={goNext}
            className="px-4 py-2 rounded-lg bg-rose-500 text-white shadow hover:bg-rose-600"
          >
            下一封 →
          </button>
        ) : (
          <button
            onClick={() => setStage("novel")}
            className="px-4 py-2 rounded-lg bg-indigo-500 text-white shadow hover:bg-indigo-600"
          >
            進入長篇 📖
          </button>
        )}
      </div>

      {/* 方向感動畫：像翻頁滑入 */}
      <style>{`
        @keyframes pageNext {
          0%   { opacity: 0; transform: perspective(900px) rotateY(-8deg) translateX(24px) translateY(8px) scale(.98); }
          60%  { opacity: 1; transform: perspective(900px) rotateY(-1.5deg) translateX(0) translateY(0) scale(1.006); }
          100% { opacity: 1; transform: perspective(900px) rotateY(0deg) translateX(0) translateY(0) scale(1); }
        }
        @keyframes pagePrev {
          0%   { opacity: 0; transform: perspective(900px) rotateY(8deg) translateX(-24px) translateY(8px) scale(.98); }
          60%  { opacity: 1; transform: perspective(900px) rotateY(1.5deg) translateX(0) translateY(0) scale(1.006); }
          100% { opacity: 1; transform: perspective(900px) rotateY(0deg) translateX(0) translateY(0) scale(1); }
        }
        .animate-pageNext { animation: pageNext .46s cubic-bezier(.2,.7,.2,1) both; }
        .animate-pagePrev { animation: pagePrev .46s cubic-bezier(.2,.7,.2,1) both; }
      `}</style>
    </main>
  );
}



// ====== Stage 4: 長篇小說（自動把 longLetter 轉成故事書 + 圖片標記） ======
if (stage === "novel") {
  const canUnlockFinale = progress >= 85;

  // 你只需要改這張表：把每個圖的 src/caption/span 換成你的實際路徑與圖說
  // span: "narrow"（預設卡片寬）、"wide"（較寬）、"full"（滿版）
  const imageMap: Record<string, { src: string; alt?: string; caption?: string; span?: "narrow" | "wide" | "full" }> = {
    A: { src: "/photos/A.jpg", caption: "靠近，是把心放到同一側。", span: "narrow" },
    B: { src: "/photos/B.jpg", caption: "你的背影依舊很好看", span: "narrow" },
    C: { src: "/photos/C.jpg", caption: "你說「我願意」的那一刻，我贏了。", span: "narrow" },
    D: { src: "/photos/D.jpg", caption: "在海邊看著夕陽，讓我想到了五十年後身旁的你。", span: "narrow" },
    E: { src: "/photos/E.jpg", caption: "學會過你的節日，是我新的作業。", span: "narrow" },
    F: { src: "/photos/F.jpg", caption: "看到你笑的時候，我是這世界上最幸福的男人。", span: "narrow" },
    G: { src: "/photos/G.jpg", caption: "在你笑的時候，我所有的疲憊都歸零。", span: "narrow" },
    H: { src: "/photos/H.jpg", caption: "謝謝你給我的驚喜，我人生的第一次給了你。", span: "narrow" },
    I: { src: "/photos/I.jpg", caption: "不完美的一天，因為你的陪伴讓它過去。", span: "narrow" },
    J: { src: "/photos/J.jpg", caption: "我愛的人，也有她可愛的來處。", span: "narrow" },
    K: { src: "/photos/K.jpg", caption: "被打斷的快樂，也會在下次接續。", span: "narrow" },
    L: { src: "/photos/L.jpg", caption: "看著我們和服的樣子，實在是般配", span: "narrow" },
    M: { src: "/photos/M.jpg", caption: "一起破關，比一個人贏更快樂。", span: "narrow" },
    N: { src: "/photos/N.jpg", caption: "我想你時，路就不遠了。", span: "narrow" },
  };

  // 解析器：把 longLetter -> blocks（章節 / 段落 / 圖片 / 分隔線 / 引言）
  type Block =
    | { type: "chapter"; title: string }
    | { type: "p"; text: string }
    | { type: "img"; src: string; alt?: string; caption?: string; span?: "narrow" | "wide" | "full" }
    | { type: "divider" }
    | { type: "quote"; text: string };

  const parseLongLetterToBlocks = (raw: string): Block[] => {
    const lines = raw.split(/\r?\n/).map(l => l.trim());
    const blocks: Block[] = [];
    let inPrologue = false;

    const pushDivider = () => {
      if (blocks.length && blocks[blocks.length - 1]?.type !== "divider") {
        blocks.push({ type: "divider" });
      }
    };

    for (const line of lines) {
      if (!line) continue;

      if (line === "題記") {
        if (blocks.length) pushDivider();
        blocks.push({ type: "chapter", title: "題記" });
        inPrologue = true;
        continue;
      }

      // 章節（含終章）
      const chapMatch = line.match(/^(第.+?章｜.*|終章｜.*)$/);
      if (chapMatch) {
        pushDivider();
        blocks.push({ type: "chapter", title: chapMatch[1] });
        inPrologue = false;
        continue;
      }

      // 把（圖X）標記抽出，分段 + 插入圖片
      // 支援全形/半形括號
      const imgTagRegex = /（圖([A-Z])）|\(圖([A-Z])\)/g;
      let lastIndex = 0;
      let m: RegExpExecArray | null;
      let hasImageInLine = false;

      while ((m = imgTagRegex.exec(line)) !== null) {
        hasImageInLine = true;
        const before = line.slice(lastIndex, m.index).trim();
        if (before) blocks.push({ type: "p", text: before });

        const key = (m[1] || m[2]) as string;
        const meta = imageMap[key];
        if (meta) {
          blocks.push({ type: "img", src: meta.src, alt: meta.alt, caption: meta.caption, span: meta.span || "narrow" });
        }
        lastIndex = m.index + m[0].length;
      }

      const tail = line.slice(lastIndex).trim();
      if (tail) {
        // 把「太直白」的語句做溫柔化（只針對常見一兩句）
        const softened = tail.replace(/瘋狂做愛/g, "肆無忌憚地相愛");
        blocks.push({ type: "p", text: softened });
      }

      // 題記結尾加一句引言（可選）
      if (inPrologue && line.includes("珍貴")) {
        blocks.push({ type: "quote", text: "謝謝你選擇我，讓我愛上你。" });
        inPrologue = false;
      }
    }

    return blocks;
  };

  const blocks = parseLongLetterToBlocks(config.longLetter);

  // 小元件：渲染區塊（無 hooks）
  const StoryBlock = ({ b }: { b: Block }) => {
    switch (b.type) {
      case "chapter":
        return (
          <div className="my-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">{b.title}</h2>
          </div>
        );
      case "p":
        return <p className="my-4 leading-8">{b.text}</p>;
      case "quote":
        return (
          <blockquote className="my-6 p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-900/90 italic">
            {b.text}
          </blockquote>
        );
      case "divider":
        return <hr className="my-8 border-rose-100" />;
      case "img": {
        const span = b.span || "narrow";
        const wrapper =
          span === "full" ? "max-w-none -mx-6 sm:-mx-7" :
          span === "wide" ? "max-w-4xl" :
          "max-w-2xl";
        return (
          <figure className={`my-5 ${wrapper}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.src}
              alt={b.alt || "photo"}
              className={`w-full h-auto rounded-2xl shadow-md object-cover cursor-zoom-in ${
                span === "full" ? "max-h-[56vh] object-cover" : ""
              }`}
              onClick={() => setLightbox({ open: true, src: b.src, alt: b.alt, caption: b.caption })}
            />
            {b.caption && <figcaption className="text-xs text-gray-500 mt-2">{b.caption}</figcaption>}
          </figure>
        );
      }
      default:
        return null;
    }
  };

  return (
    <main className={`min-h-screen p-0 ${darkRead ? "bg-[#0e0e10] text-[#f3f4f6]" : "bg-rose-50 text-gray-800"}`}>
      {/* 置頂工具列（沿用你原本的） */}
      <div className={`sticky top-0 z-20 border-b ${darkRead ? "border-white/10 bg-black/60" : "border-rose-100 bg-white/80"} backdrop-blur`}>
        <div className={`${darkRead ? "bg-white/10" : "bg-rose-100"} h-1`}>
          <div className={`${darkRead ? "bg-white" : "bg-rose-500"} h-full`} style={{ width: `${progress}%` }} />
        </div>
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="text-sm opacity-80">約 {estMinutes} 分鐘讀完 · 已讀 {Math.round(progress)}%</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSerif(s => !s)} className="px-2 py-1 text-sm rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-white/10" title="襯線/無襯線">
              {serif ? "Serif" : "Sans"}
            </button>
            <button onClick={() => setFontScale(s => Math.max(0.9, Math.round((s - 0.1) * 10) / 10))} className="px-2 py-1 text-sm rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-white/10" title="縮小字級">A-</button>
            <button onClick={() => setFontScale(s => Math.min(1.6, Math.round((s + 0.1) * 10) / 10))} className="px-2 py-1 text-sm rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-white/10" title="放大字級">A+</button>
            <button onClick={() => setDarkRead(d => !d)} className="px-2 py-1 text-sm rounded border border-gray-200 hover:bg-gray-50 dark:hover:bg-white/10" title="夜間模式">
              {darkRead ? "☀︎" : "☾"}
            </button>
          </div>
        </div>
      </div>

      {/* 內文：已解析的故事書區塊（可滾動、可放大圖片） */}
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-6 sm:py-8">
        {savedScroll !== null && (
          <div className={`mb-4 text-sm ${darkRead ? "text-white/80" : "text-gray-600"}`}>
          </div>
        )}

        <div
          ref={wrapRef}
          className={`bg-white ${darkRead ? "!bg-[#0b0b0c] !text-[#f3f4f6] border-white/10" : "border-rose-100"}
                      rounded-2xl shadow-lg border overflow-y-auto max-h-[74vh]
                      px-6 sm:px-7 py-6 selection:bg-rose-200/60`}
          style={{
            fontFamily: serif ? `"Noto Serif TC", ui-serif, serif` : `"Noto Sans TC", ui-sans-serif, system-ui, -apple-system, Segoe UI`,
            fontSize: `${16 * fontScale}px`,
            lineHeight: 1.75,
          }}
        >
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            {blocks.map((b, i) => <StoryBlock key={i} b={b} />)}
          </div>
        </div>

        {/* 底部操作（沿用） */}
        <div className="mt-5 flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setStage("letters")}
            className={`px-4 py-2 rounded-lg ${darkRead ? "bg-white/10 border border-white/20 hover:bg-white/15" : "bg-rose-200 text-rose-800 hover:bg-rose-300"} shadow`}
          >
            回到短篇
          </button>

          <button
            onClick={() => setStage("finale")}
            disabled={!canUnlockFinale}
            className={`px-4 py-2 rounded-lg shadow text-white ${canUnlockFinale ? "bg-indigo-500 hover:bg-indigo-600" : "bg-indigo-300 cursor-not-allowed"}`}
            title={canUnlockFinale ? "" : "讀到 85% 會自動解鎖"}
          >
            看最後的驚喜 ✨
          </button>

          <span className={`text-xs ${darkRead ? "text-white/60" : "text-gray-500"}`}>
            {canUnlockFinale ? "已解鎖" : "已讀滿 85% 即解鎖"}
          </span>
        </div>
      </div>

      {/* Lightbox 放大圖 */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox({ open: false, src: "" })}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox.src} alt={lightbox.alt || "photo"} className="max-h-[82vh] w-auto rounded-2xl shadow-2xl" />
          {lightbox.caption && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/90 bg-black/40 px-3 py-1.5 rounded">
              {lightbox.caption}
            </div>
          )}
        </div>
      )}
    </main>
  );
}



  // ====== Stage 5: 煙火結尾（點擊觸發煙火） ======
  if (stage === "finale") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
        <Fireworks active={true} />
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white text-center drop-shadow-lg z-10">{config.finale}</h1>
        <p className="mt-4 text-sm opacity-80 z-10">— {config.fromName}</p>
        <button onClick={() => setStage("envelope")} className="z-10 mt-8 px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15">回到開頭</button>
      </main>
    );
  }

  return null;
}

