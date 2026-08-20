"use client";

import { useMemo, useRef, useState } from "react";
import { hymnTitles } from "./hymnData";
import { post2000Songs } from "./post2000Data";

type Speed = "快歌" | "慢歌";
type Popularity = "經典熱門" | "高人氣" | "精選";
type Song = { id:number; title:string; team:string; speed:Speed; themes:string[]; popularity:Popularity; year?:string };

const curatedCatalog: Omit<Song,"id">[] = [
  { title:"恩典之路", team:"讚美之泉", speed:"慢歌", themes:["恩典","信靠"], popularity:"經典熱門" },
  { title:"能不能", team:"讚美之泉", speed:"慢歌", themes:["渴慕","委身"], popularity:"經典熱門" },
  { title:"這一生最美的祝福", team:"讚美之泉", speed:"慢歌", themes:["救恩","感恩"], popularity:"經典熱門" },
  { title:"寶貴十架", team:"讚美之泉", speed:"慢歌", themes:["十架","救恩"], popularity:"經典熱門" },
  { title:"沙漠中的讚美", team:"讚美之泉", speed:"快歌", themes:["讚美","信心"], popularity:"經典熱門" },
  { title:"將天敞開", team:"讚美之泉", speed:"快歌", themes:["復興","宣告"], popularity:"高人氣" },
  { title:"這裡有榮耀", team:"讚美之泉", speed:"快歌", themes:["榮耀","同在"], popularity:"高人氣" },
  { title:"新的事將要成就", team:"讚美之泉", speed:"快歌", themes:["盼望","宣告"], popularity:"高人氣" },
  { title:"從早晨到夜晚", team:"讚美之泉", speed:"快歌", themes:["讚美","感恩"], popularity:"高人氣" },
  { title:"我在這裡", team:"讚美之泉", speed:"慢歌", themes:["委身","回應"], popularity:"高人氣" },
  { title:"我的生命獻給祢", team:"讚美之泉", speed:"慢歌", themes:["奉獻","委身"], popularity:"高人氣" },
  { title:"深不見底的愛", team:"讚美之泉", speed:"慢歌", themes:["愛","恩典"], popularity:"高人氣" },
  { title:"祢永遠如此深愛著我", team:"讚美之泉", speed:"慢歌", themes:["愛","醫治"], popularity:"高人氣" },
  { title:"相信有愛就有奇蹟", team:"讚美之泉", speed:"慢歌", themes:["信心","愛"], popularity:"經典熱門" },
  { title:"不要放棄", team:"讚美之泉", speed:"快歌", themes:["信心","鼓勵"], popularity:"經典熱門" },
  { title:"何等恩典", team:"讚美之泉", speed:"慢歌", themes:["恩典","感恩"], popularity:"高人氣" },
  { title:"活著為要敬拜祢", team:"讚美之泉", speed:"慢歌", themes:["敬拜","委身"], popularity:"高人氣" },
  { title:"我神真偉大", team:"約書亞樂團", speed:"慢歌", themes:["敬拜","偉大"], popularity:"經典熱門" },
  { title:"祢是我盼望", team:"約書亞樂團", speed:"慢歌", themes:["盼望","信靠"], popularity:"高人氣" },
  { title:"氣息", team:"約書亞樂團", speed:"慢歌", themes:["渴慕","同在"], popularity:"高人氣" },
  { title:"何等美麗", team:"約書亞樂團", speed:"慢歌", themes:["敬拜","愛"], popularity:"高人氣" },
  { title:"我受造奇妙", team:"約書亞樂團", speed:"快歌", themes:["身份","感恩"], popularity:"精選" },
  { title:"永遠不離開", team:"約書亞樂團", speed:"慢歌", themes:["同在","信靠"], popularity:"精選" },
  { title:"無盡的愛", team:"約書亞樂團", speed:"慢歌", themes:["愛","恩典"], popularity:"高人氣" },
  { title:"得勝君王", team:"約書亞樂團", speed:"快歌", themes:["得勝","宣告"], popularity:"高人氣" },
  { title:"讓聖靈工作", team:"約書亞樂團", speed:"慢歌", themes:["聖靈","回應"], popularity:"精選" },
  { title:"大過一切的愛", team:"約書亞樂團", speed:"慢歌", themes:["愛","醫治"], popularity:"高人氣" },
  { title:"回到起初的愛", team:"約書亞樂團", speed:"慢歌", themes:["愛","悔改"], popularity:"高人氣" },
  { title:"祢使我勇敢", team:"約書亞樂團", speed:"快歌", themes:["勇氣","信心"], popularity:"高人氣" },
  { title:"奮戰到底", team:"約書亞樂團", speed:"快歌", themes:["爭戰","信心"], popularity:"精選" },
  { title:"這是何等大能的名", team:"約書亞樂團", speed:"慢歌", themes:["耶穌","敬拜"], popularity:"經典熱門" },
  { title:"當我抬頭仰望", team:"火把音樂", speed:"慢歌", themes:["創造","敬拜"], popularity:"經典熱門", year:"2020" },
  { title:"唯獨倚靠祢", team:"火把音樂", speed:"慢歌", themes:["信靠","禱告"], popularity:"高人氣", year:"2019" },
  { title:"轉向祢", team:"火把音樂", speed:"慢歌", themes:["回轉","信靠"], popularity:"高人氣", year:"2021" },
  { title:"就是單單", team:"火把音樂", speed:"慢歌", themes:["敬拜","渴慕"], popularity:"高人氣", year:"2022" },
  { title:"三天之後", team:"火把音樂", speed:"快歌", themes:["復活","盼望"], popularity:"高人氣", year:"2021" },
  { title:"不放棄的愛", team:"火把音樂", speed:"快歌", themes:["愛","福音"], popularity:"精選", year:"2023" },
  { title:"榮耀的總和", team:"火把音樂", speed:"慢歌", themes:["榮耀","敬拜"], popularity:"精選" },
  { title:"我心靈得安寧", team:"火把音樂", speed:"慢歌", themes:["平安","安靜"], popularity:"精選" },
  { title:"全然為祢", team:"小羊詩歌", speed:"慢歌", themes:["委身","奉獻"], popularity:"經典熱門" },
  { title:"我願為祢去", team:"小羊詩歌", speed:"慢歌", themes:["宣教","委身"], popularity:"高人氣" },
  { title:"主我跟祢走", team:"小羊詩歌", speed:"慢歌", themes:["跟隨","信靠"], popularity:"高人氣" },
  { title:"願為主閃亮", team:"小羊詩歌", speed:"快歌", themes:["使命","宣告"], popularity:"高人氣" },
  { title:"耶和華祝福滿滿", team:"傳統／經典", speed:"快歌", themes:["祝福","感恩"], popularity:"經典熱門" },
  { title:"如鹿切慕溪水", team:"傳統／經典", speed:"慢歌", themes:["渴慕","敬拜"], popularity:"經典熱門" },
  { title:"奇異恩典", team:"傳統／經典", speed:"慢歌", themes:["恩典","救恩"], popularity:"經典熱門" },
  { title:"祢的信實廣大", team:"傳統／經典", speed:"慢歌", themes:["信實","感恩"], popularity:"經典熱門" },
  { title:"主祢真好", team:"以斯拉事奉中心", speed:"快歌", themes:["讚美","感恩"], popularity:"高人氣" },
  { title:"耶穌我要愛慕祢", team:"以斯拉事奉中心", speed:"慢歌", themes:["愛慕","渴慕"], popularity:"高人氣" },
  { title:"如鷹展翅上騰", team:"生命河靈糧堂", speed:"快歌", themes:["信心","更新"], popularity:"經典熱門" },
  { title:"讓讚美飛揚", team:"讚美之泉", speed:"快歌", themes:["讚美","宣告"], popularity:"經典熱門" },
  { title:"全然向祢", team:"讚美之泉", speed:"慢歌", themes:["敬拜","委身"], popularity:"高人氣" },
  { title:"愛喜樂生命", team:"讚美之泉", speed:"快歌", themes:["愛","讚美"], popularity:"高人氣" },
  { title:"犧牲的愛", team:"讚美之泉", speed:"慢歌", themes:["愛","十架"], popularity:"高人氣" },
  { title:"除祢以外", team:"讚美之泉", speed:"慢歌", themes:["敬拜","渴慕"], popularity:"經典熱門" },
  { title:"光明之子", team:"讚美之泉", speed:"快歌", themes:["身份","宣告"], popularity:"高人氣" },
  { title:"把冷漠變成愛", team:"讚美之泉", speed:"快歌", themes:["愛","使命"], popularity:"經典熱門" },
  { title:"生命的舵手", team:"讚美之泉", speed:"慢歌", themes:["信靠","引導"], popularity:"高人氣" },
  { title:"主賜福如春雨", team:"讚美之泉", speed:"快歌", themes:["祝福","聖靈"], popularity:"高人氣" },
  { title:"興起發光", team:"讚美之泉", speed:"快歌", themes:["使命","宣告"], popularity:"高人氣" },
  { title:"注目看耶穌", team:"讚美之泉", speed:"慢歌", themes:["耶穌","信靠"], popularity:"經典熱門" },
  { title:"生命的凱歌", team:"讚美之泉", speed:"快歌", themes:["得勝","讚美"], popularity:"高人氣" },
  { title:"彩虹下的約定", team:"讚美之泉", speed:"慢歌", themes:["應許","信靠"], popularity:"經典熱門" },
  { title:"舉目向山", team:"讚美之泉", speed:"慢歌", themes:["信靠","禱告"], popularity:"高人氣" },
  { title:"認識祢真好", team:"讚美之泉", speed:"快歌", themes:["感恩","喜樂"], popularity:"經典熱門" },
  { title:"我的救贖者活著", team:"讚美之泉", speed:"快歌", themes:["復活","救恩"], popularity:"經典熱門" },
  { title:"全能的創造主", team:"讚美之泉", speed:"快歌", themes:["創造","讚美"], popularity:"經典熱門" },
  { title:"復興的火", team:"讚美之泉", speed:"快歌", themes:["復興","聖靈"], popularity:"高人氣" },
  { title:"奔跑不放棄", team:"讚美之泉", speed:"快歌", themes:["信心","鼓勵"], popularity:"高人氣" },
  { title:"定睛在耶穌身上", team:"讚美之泉", speed:"慢歌", themes:["耶穌","信靠"], popularity:"高人氣", year:"2026" },
  { title:"有何神像祢", team:"讚美之泉", speed:"快歌", themes:["敬拜","讚美"], popularity:"高人氣", year:"2026" },
  { title:"從我興起", team:"讚美之泉", speed:"快歌", themes:["復興","宣告"], popularity:"高人氣", year:"2026" },
  { title:"這是我們的敬拜", team:"讚美之泉", speed:"快歌", themes:["敬拜","奉獻"], popularity:"高人氣", year:"2026" },
  { title:"是祢的應許", team:"讚美之泉", speed:"快歌", themes:["應許","信心"], popularity:"高人氣", year:"2026" },
  { title:"微小的聲音", team:"約書亞樂團", speed:"慢歌", themes:["聆聽","同在"], popularity:"高人氣", year:"2025" },
  { title:"我安然居住", team:"約書亞樂團", speed:"慢歌", themes:["平安","信靠"], popularity:"經典熱門" },
  { title:"安靜", team:"約書亞樂團", speed:"慢歌", themes:["平安","同在"], popularity:"經典熱門" },
  { title:"聖靈請祢來充滿我心", team:"約書亞樂團", speed:"慢歌", themes:["聖靈","渴慕"], popularity:"經典熱門" },
  { title:"我要愛慕祢", team:"約書亞樂團", speed:"慢歌", themes:["愛慕","敬拜"], popularity:"高人氣" },
  { title:"耶穌基督", team:"約書亞樂團", speed:"慢歌", themes:["耶穌","敬拜"], popularity:"高人氣" },
  { title:"無價至寶", team:"約書亞樂團", speed:"慢歌", themes:["耶穌","渴慕"], popularity:"高人氣" },
  { title:"求充滿這地", team:"約書亞樂團", speed:"快歌", themes:["復興","禱告"], popularity:"高人氣" },
  { title:"在呼召我之處", team:"約書亞樂團", speed:"慢歌", themes:["呼召","委身"], popularity:"高人氣" },
  { title:"我願降服", team:"約書亞樂團", speed:"慢歌", themes:["降服","委身"], popularity:"經典熱門" },
  { title:"恩典之洋", team:"約書亞樂團", speed:"慢歌", themes:["恩典","信靠"], popularity:"經典熱門" },
  { title:"Happy Day", team:"約書亞樂團", speed:"快歌", themes:["喜樂","救恩"], popularity:"經典熱門" },
  { title:"通往祢的路", team:"約書亞樂團", speed:"慢歌", themes:["跟隨","信靠"], popularity:"高人氣", year:"2022" },
  { title:"在祢愛裡", team:"約書亞樂團", speed:"慢歌", themes:["愛","同在"], popularity:"高人氣", year:"2022" },
  { title:"溫柔聖靈", team:"約書亞樂團", speed:"慢歌", themes:["聖靈","安慰"], popularity:"高人氣" },
  { title:"都指向祢", team:"約書亞樂團", speed:"快歌", themes:["耶穌","宣告"], popularity:"高人氣" },
  { title:"與祢同行", team:"約書亞樂團", speed:"快歌", themes:["同行","信靠"], popularity:"高人氣" },
  { title:"盼望引力", team:"約書亞樂團", speed:"慢歌", themes:["盼望","信靠"], popularity:"高人氣" },
  { title:"如祢", team:"約書亞樂團", speed:"慢歌", themes:["更新","委身"], popularity:"高人氣" },
  { title:"何等榮美的名", team:"約書亞樂團", speed:"慢歌", themes:["耶穌","敬拜"], popularity:"經典熱門" },
  { title:"勝過一切", team:"約書亞樂團", speed:"快歌", themes:["得勝","宣告"], popularity:"高人氣" },
  { title:"傾倒我全所有", team:"約書亞樂團", speed:"慢歌", themes:["奉獻","委身"], popularity:"高人氣", year:"2024" },
].map((song,id)=>({...song,id:id+1}));

function inferThemes(title:string){
  const groups:[string,string[]][]=[
    ["讚美",["讚美","頌讚","歌頌","稱謝","哈利路亞","歡呼"]],
    ["敬拜",["敬拜","聖哉","榮耀","尊貴","俯伏"]],
    ["感恩",["感恩","感謝","恩典","恩惠","信實"]],
    ["信靠",["倚靠","信靠","安穩","保守","看顧","引導"]],
    ["救恩",["救主","十架","寶血","救恩","赦免","羔羊"]],
    ["耶穌",["耶穌","基督","主名","君王"]],
    ["聖靈",["聖靈","復興","甦醒","更新"]],
    ["禱告",["禱告","祈求","求主","呼求"]],
    ["奉獻",["奉獻","獻上","獻給","委身"]],
    ["安慰",["安慰","平安","安寧","醫治"]],
    ["節期",["聖誕","降生","復活","新年"]],
  ];
  const found=groups.filter(([,words])=>words.some(word=>title.includes(word))).map(([topic])=>topic);
  return found.length?found.slice(0,2):["信仰生活"];
}

const hymnCatalog:Song[]=hymnTitles.map((h,index)=>({
  id:1000+index,
  title:h.title,
  team:"生命聖詩",
  speed:/讚美|頌讚|歡呼|快樂|哈利路亞|進行/.test(h.title)?"快歌":"慢歌",
  themes:inferThemes(h.title),
  popularity:"精選",
  year:`第 ${h.no} 首`,
}));
const post2000Catalog:Song[]=post2000Songs.map((song,index)=>({
  id:3000+index,
  title:song.title,
  team:song.team,
  speed:/讚美|歡呼|興起|奔跑|得勝|喜樂|跳舞|宣告|復興|Happy|Joy|Praise/i.test(song.title)?"快歌":"慢歌",
  themes:inferThemes(song.title),
  popularity:"精選",
  year:song.year,
}));
const catalog:Song[]=[...new Map([...(curatedCatalog as Song[]),...post2000Catalog,...hymnCatalog].map(song=>[`${song.team}|${song.title}`.toLowerCase().replace(/[\s·・.,，。!！?？'"「」【】()（）-]/g,""),song])).values()];

const teams = ["全部團隊", "讚美之泉", "約書亞樂團", "火把音樂", "小羊詩歌", "以斯拉事奉中心", "生命河靈糧堂", "生命聖詩", "傳統／經典"];
const speeds = ["全部速度", "快歌", "慢歌"];
const themes = ["全部主題", "敬拜", "讚美", "感恩", "信靠", "救恩", "耶穌", "聖靈", "禱告", "奉獻", "安慰", "節期", "信仰生活", "信心", "恩典", "愛", "盼望", "委身", "同在", "宣告"];
const rank:Record<Popularity,number> = { "經典熱門":3, "高人氣":2, "精選":1 };

export default function Home(){
  const [query,setQuery]=useState(""); const [team,setTeam]=useState("全部團隊"); const [speed,setSpeed]=useState("全部速度"); const [theme,setTheme]=useState("全部主題"); const [sort,setSort]=useState("熱門優先"); const [visible,setVisible]=useState(18); const [selected,setSelected]=useState<Song|null>(null); const [lyricsIndex,setLyricsIndex]=useState<Record<string,string>>({}); const [importedCount,setImportedCount]=useState(0); const [planTheme,setPlanTheme]=useState("信心"); const [customTheme,setCustomTheme]=useState(""); const [minutes,setMinutes]=useState(30); const [fastCount,setFastCount]=useState(2); const [slowCount,setSlowCount]=useState(2); const [plans,setPlans]=useState<Song[][]>([]);
  const planResultsRef=useRef<HTMLDivElement>(null);
  const semanticThemes=(q:string)=>{
    const map:[string[],string[]][]=[
      [["害怕","懼怕","恐懼","勇敢","軟弱"],["信心","安慰","信靠","盼望"]],
      [["難過","低谷","流淚","傷心","失落","孤單"],["安慰","盼望","同在","愛"]],
      [["感謝","謝謝","恩典","恩惠"],["感恩","恩典"]],
      [["十字架","寶血","赦免","罪"],["救恩","十架","恩典"]],
      [["聖靈","充滿","復興","更新"],["聖靈","復興","同在"]],
      [["奉獻","獻上","降服","跟隨"],["奉獻","委身","降服","跟隨"]],
      [["讚美","歡呼","高舉","歌唱"],["讚美","敬拜","宣告"]],
      [["禱告","呼求","尋求"],["禱告","渴慕","信靠"]],
    ];
    return map.filter(([words])=>words.some(w=>q.includes(w))).flatMap(([,topics])=>topics);
  };
  const results=useMemo(()=>{
    const q=query.trim().toLowerCase();
    const semantic=semanticThemes(q);
    return catalog.filter(s=>{
      const key=`${s.team}|${s.title}`;
      const searchable=[s.title,s.team,...s.themes,lyricsIndex[key]||""].join(" ").toLowerCase();
      const keywordMatch=!q||searchable.includes(q)||semantic.some(topic=>s.themes.includes(topic));
      return keywordMatch&&(team==="全部團隊"||s.team===team)&&(speed==="全部速度"||s.speed===speed)&&(theme==="全部主題"||s.themes.includes(theme));
    }).sort((a,b)=>sort==="歌名排序"?a.title.localeCompare(b.title,"zh-Hant"):rank[b.popularity]-rank[a.popularity]);
  },[query,team,speed,theme,sort,lyricsIndex]);
  const reset=()=>{setQuery("");setTeam("全部團隊");setSpeed("全部速度");setTheme("全部主題");setVisible(18)};
  const yt=(song:Song)=>`https://www.youtube.com/results?search_query=${encodeURIComponent(`${song.team} ${song.title} 官方`)}`;
  const importLyrics=async(file?:File)=>{
    if(!file)return;
    try{
      const text=await file.text(); let rows:{title:string;team?:string;lyrics:string}[]=[];
      if(file.name.toLowerCase().endsWith(".json")) rows=JSON.parse(text);
      else rows=text.split(/\r?\n/).slice(1).map(line=>{const [title,team,...lyrics]=line.split(",");return {title:title?.trim(),team:team?.trim(),lyrics:lyrics.join(",").trim()}}).filter(row=>row.title&&row.lyrics);
      const next={...lyricsIndex};
      for(const row of rows){
        if(!row.title||!row.lyrics)continue;
        const matches=catalog.filter(song=>song.title===row.title&&(!row.team||song.team===row.team));
        for(const song of matches)next[`${song.team}|${song.title}`]=row.lyrics;
      }
      setLyricsIndex(next);setImportedCount(Object.keys(next).length);
    }catch{alert("無法讀取檔案。請使用 JSON，或 title,team,lyrics 三欄的 CSV。");}
  };
  const createPlans=()=>{
    const focus=customTheme.trim()||planTheme;
    const aliases=semanticThemes(focus);
    const score=(song:Song)=>{
      const searchable=[song.title,...song.themes,lyricsIndex[`${song.team}|${song.title}`]||""].join(" ");
      return (song.themes.includes(focus)?20:0)+(searchable.includes(focus)?16:0)+(aliases.some(t=>song.themes.includes(t))?8:0)+rank[song.popularity]*2+(song.team!=="生命聖詩"?2:0);
    };
    const pool=(wanted:Speed)=>catalog.filter(song=>song.speed===wanted).sort((a,b)=>score(b)-score(a));
    const make=(variant:number)=>{
      const chosen:Song[]=[]; const usedTeams=new Set<string>();
      const pick=(wanted:Speed,count:number)=>{
        const candidates=pool(wanted);
        for(let i=0;i<count;i++){
          const start=(variant*7+i*3)%Math.max(1,Math.min(candidates.length,45));
          const next=candidates.slice(start).find(song=>!chosen.some(c=>c.title===song.title)&&(!usedTeams.has(song.team)||i>1))||candidates.find(song=>!chosen.some(c=>c.title===song.title));
          if(next){chosen.push(next);usedTeams.add(next.team)}
        }
      };
      pick("快歌",fastCount);pick("慢歌",slowCount);return chosen;
    };
    setPlans([make(0),make(1),make(2)]);
    requestAnimationFrame(()=>requestAnimationFrame(()=>planResultsRef.current?.scrollIntoView({behavior:"smooth",block:"start"})));
  };

  return <main>
    <header className="nav"><a className="brand" href="#top"><span className="brandMark"><i className="crossMark" aria-hidden="true"/></span><span>詩尋</span></a><nav><a className="active" href="#library">詩歌庫</a><a href="#planner">敬拜安排</a><a href="#teams">敬拜團</a><a href="#about">資料說明</a></nav><div className="libraryCount"><strong>{catalog.length}</strong><span>首精選</span></div></header>
    <section className="hero compactHero" id="top"><div className="heroCrossBadge" aria-hidden="true"><span/></div><div className="eyebrow"><span>✦</span> WORSHIP SONG FINDER</div><h1>找到適合聚會的<br/><span>每一首敬拜詩歌</span></h1><p>可搜尋歌名、歌詞關鍵字、敬拜團與主題，快速預備你的敬拜歌單。</p><div className="searchShell"><div className="searchRow"><span className="searchIcon">⌕</span><input value={query} onChange={e=>{setQuery(e.target.value);setVisible(18)}} placeholder="輸入歌名、歌詞關鍵字，例如：不要害怕、低谷、恩典⋯" aria-label="搜尋歌曲與歌詞"/>{query&&<button className="clear" onClick={()=>setQuery("")}>×</button>}<a className="searchButton searchLink" href="#library">尋找詩歌</a></div><div className="hint"><span>歌詞／語意搜尋</span>{["不要害怕","低谷","十字架","聖靈充滿","感謝"].map(word=><button key={word} onClick={()=>setQuery(word)}>{word}</button>)}</div></div></section>
    <section className="content" id="library">
      <div className="sectionHead"><div><span className="overline">POST-2000 WORSHIP CATALOG</span><h2>2000 年後敬拜詩歌庫</h2><p>主要華語敬拜團正式發行曲目與《生命聖詩》索引合併整理，可依主題快速查找。</p></div><div className="lineArt"><i/><b>♪</b><i/></div></div>
      <div className="filterPanel" id="teams">
        <div className="filterGroup"><span>敬拜團</span><div className="themeTabs inlineTabs">{teams.map(v=><button key={v} className={team===v?"selected":""} onClick={()=>{setTeam(v);setVisible(18)}}>{v}</button>)}</div></div>
        <div className="filterRow"><div className="filterGroup"><span>歌曲速度</span><div className="segmented">{speeds.map(v=><button key={v} className={speed===v?"selected":""} onClick={()=>{setSpeed(v);setVisible(18)}}>{v}{v==="快歌"?" ⚡":v==="慢歌"?" ◐":""}</button>)}</div></div><div className="filterGroup"><span>主題</span><select value={theme} onChange={e=>{setTheme(e.target.value);setVisible(18)}}>{themes.map(v=><option key={v}>{v}</option>)}</select></div></div>
        <div className="lyricsImport"><div><strong>歌詞全文搜尋</strong><span>{importedCount?`已載入 ${importedCount} 首授權歌詞` : "匯入你有權使用的歌詞索引，即可搜尋完整歌詞內容"}</span></div><label className="importButton">匯入歌詞索引<input type="file" accept=".json,.csv,text/csv,application/json" onChange={e=>importLyrics(e.target.files?.[0])}/></label></div>
      </div>
      <div className="resultBar"><p>找到 <strong>{results.length}</strong> 首詩歌 <button className="reset" onClick={reset}>清除篩選</button></p><label>排序 <select value={sort} onChange={e=>setSort(e.target.value)}><option>熱門優先</option><option>歌名排序</option></select></label></div>
      <div className="songGrid">{results.slice(0,visible).map((song,index)=><article className="songCard modernCard" key={song.id}>
        <div className="cardTop"><span className="number">{String(index+1).padStart(2,"0")}</span><span className={`speedBadge ${song.speed==="快歌"?"fast":"slow"}`}>{song.speed}</span></div>
        <button className="songTitleButton" onClick={()=>setSelected(song)}><h3>{song.title}</h3></button><span className="teamName">{song.team}</span>
        <div className="popularity"><span>▶</span>{song.popularity}<i/><small>{song.year||"官方版本"}</small></div>
        <div className="tags">{song.themes.map(t=><span key={t}>{t}</span>)}</div>
        <div className="cardActions"><button onClick={()=>setSelected(song)}>歌曲資料</button><a href={yt(song)} target="_blank" rel="noreferrer">YouTube ↗</a></div>
      </article>)}</div>
      {results.length===0&&<div className="empty"><span>♫</span><h3>找不到符合條件的歌曲</h3><p>換一個關鍵字，或清除部分篩選條件。</p><button onClick={reset}>顯示全部歌曲</button></div>}
      {visible<results.length&&<button className="loadMore" onClick={()=>setVisible(v=>v+18)}>載入更多歌曲 <span>{visible} / {results.length}</span></button>}
    </section>
    <section className="plannerSection" id="planner">
      <div className="plannerIntro"><div className="plannerCrossBadge" aria-hidden="true"><span/></div><span className="overline">WORSHIP SET PLANNER</span><h2>幫我安排敬拜流程</h2><p>填入聚會條件，立即取得三套曲目方案。系統會從快歌帶入慢歌，形成自然的讚美、轉場與回應。</p></div>
      <div className="plannerForm">
        <label><span>敬拜時間</span><div className="numberField"><input type="number" min="1" max="120" inputMode="numeric" value={minutes} onChange={e=>setMinutes(Number(e.target.value))} onBlur={()=>setMinutes(Math.max(1,Math.min(120,minutes||1)))}/><b>分鐘</b></div></label>
        <label><span>聚會主題</span><select value={planTheme} onChange={e=>setPlanTheme(e.target.value)}>{themes.filter(t=>t!=="全部主題").map(t=><option key={t}>{t}</option>)}</select></label>
        <label><span>自訂主題（選填）</span><input className="customThemeInput" value={customTheme} onChange={e=>setCustomTheme(e.target.value)} placeholder="例：在低谷中仍有盼望"/></label>
        <div className="plannerField"><span>快歌數量</span><div className="stepper"><button onClick={()=>setFastCount(v=>Math.max(0,v-1))} aria-label="減少快歌">−</button><strong>{fastCount}</strong><button onClick={()=>setFastCount(v=>Math.min(6,v+1))} aria-label="增加快歌">＋</button></div></div>
        <div className="plannerField"><span>慢歌數量</span><div className="stepper"><button onClick={()=>setSlowCount(v=>Math.max(0,v-1))} aria-label="減少慢歌">−</button><strong>{slowCount}</strong><button onClick={()=>setSlowCount(v=>Math.min(6,v+1))} aria-label="增加慢歌">＋</button></div></div>
        <button className="generateButton" onClick={createPlans} disabled={fastCount+slowCount===0}>產生三套方案 ✦</button>
      </div>
      <div className="timeGuide"><span>建議：{fastCount+slowCount} 首歌曲約需 <strong>{(fastCount+slowCount)*5}–{(fastCount+slowCount)*7} 分鐘</strong></span>{minutes<(fastCount+slowCount)*5&&<em>目前歌曲數可能超過設定時間</em>}</div>
      {plans.length>0&&<div className="planGrid" ref={planResultsRef}>{plans.map((plan,planIndex)=><article className="planCard" key={planIndex}><div className="planHead"><span>方案 {String.fromCharCode(65+planIndex)}</span><strong>{planIndex===0?"經典穩定":planIndex===1?"跨團隊精選":"新舊交織"}</strong><small>約 {Math.min(minutes,plan.length*6)} 分鐘</small></div><ol>{plan.map((song,index)=><li key={`${song.team}-${song.title}`}><span className={song.speed==="快歌"?"fastDot":"slowDot"}>{index+1}</span><div><strong>{song.title}</strong><small>{song.team} · {song.speed}</small></div><button onClick={()=>setSelected(song)}>查看</button></li>)}</ol><div className="flowNote"><b>流程</b><span>{fastCount?"歡迎／讚美 → ":""}{fastCount>1?"宣告／提升 → ":""}{slowCount?"安靜／敬拜 → 回應":"自由回應"}</span></div></article>)}</div>}
      {plans.length===0&&<div className="plannerEmpty"><span>♪</span><p>設定條件後，按下「產生三套方案」</p></div>}
    </section>
    <section className="sourceNote" id="about"><div><span className="overline">ABOUT THE LIBRARY</span><h2>2000 年後正式曲目集中查找</h2><p>現代敬拜曲採 Apple 公開音樂目錄的發行資料並去除重複版本，傳統曲目採《生命聖詩》公開曲名索引。熱門度為整理標籤，不代表即時觀看數；未經授權不複製完整歌詞與樂譜。</p></div><div className="stats"><span><strong>{catalog.length}</strong>首曲目</span><span><strong>{teams.length-1}</strong>個團隊／類別</span><span><strong>{themes.length-1}</strong>個查找主題</span></div></section>
    <footer><div className="brand"><span className="brandMark"><i className="crossMark" aria-hidden="true"/></span><span>詩尋</span></div><p>讓每一次預備，都更快遇見對的歌。</p><small>歌曲著作權屬各音樂事工與創作者所有。</small></footer>
    {selected&&<div className="modalBackdrop"><section className="modal" role="dialog" aria-modal="true"><button className="modalClose" onClick={()=>setSelected(null)} aria-label="關閉">×</button><span className="modalNote">♪</span><p className="overline">SONG DETAILS</p><h2>{selected.title}</h2><p className="modalEnglish">{selected.team}</p><div className="details"><span>速度<strong>{selected.speed}</strong></span><span>熱門度<strong>{selected.popularity}</strong></span><span>類型<strong>華語敬拜</strong></span><span>版本<strong>{selected.year||"官方"}</strong></span></div><div className="tags">{selected.themes.map(t=><span key={t}>{t}</span>)}</div><a className="primary modalYoutube" href={yt(selected)} target="_blank" rel="noreferrer">在 YouTube 尋找官方版本 ↗</a></section></div>}
  </main>
}

