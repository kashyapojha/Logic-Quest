const P:Record<string,JSX.Element>={
 pattern:<><circle cx="26" cy="26" r="16"/><path d="M38 38l16 16"/></>,
 sequencer:<path d="M12 22h14a6 6 0 1 1 12 0h14v14a6 6 0 1 0 0 12v8H38a6 6 0 1 0-12 0H12V48a6 6 0 1 0 0-12z"/>,
 vault:<><circle cx="32" cy="32" r="20" strokeDasharray="7 4"/><circle cx="32" cy="32" r="9"/><circle cx="32" cy="32" r="2"/></>,
 loop:<><rect x="18" y="22" width="28" height="22" rx="5"/><circle cx="26" cy="33" r="3"/><circle cx="38" cy="33" r="3"/><path d="M32 22v-8M22 44v10h20V44"/></>,
 debug:<><ellipse cx="32" cy="38" rx="12" ry="16"/><circle cx="32" cy="18" r="6"/><path d="M20 30H8M44 30h12M20 44H8M44 44h12M32 22v32"/></>,
 arch:<><rect x="10" y="10" width="44" height="44"/><path d="M10 10l44 44M10 36h18"/></>,
 maze:<path d="M10 10h44v44H10zM10 24h26v14H22v16M44 10v30H34"/>,
 cond:<><circle cx="22" cy="24" r="10" strokeDasharray="5 3"/><circle cx="42" cy="42" r="10" strokeDasharray="5 3"/><path d="M40 12l12 12M52 12L40 24"/></>}
export default function Icon({id}:{id:string}){return <svg viewBox="0 0 64 64" aria-hidden="true">{P[id]||P.pattern}</svg>}
