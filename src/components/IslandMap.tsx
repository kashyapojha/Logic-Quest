type I={t:string,s:string,sub?:string}
export default function IslandMap({items}:{items:I[]}){
  const n=items.length,ys=[64,28,68,30,64,34];const pts=items.map((_,i)=>[10+i*(80/Math.max(n-1,1)),ys[i%ys.length]])
  return <div className="map"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points={pts.map(p=>p.join(',')).join(' ')}/></svg>
    {items.map((it,i)=><div key={i} className={'isle3 '+it.s} style={{left:pts[i][0]+'%',top:pts[i][1]+'%'}}><div className="top"/><div className="rock"/>{it.s==='locked'&&<span className="lock"/>}{it.s==='active'&&<span className="bot"/>}<b>{it.t}</b><small>{it.s==='locked'?'Locked':it.s==='done'?'Completed':it.sub||'Active'}</small></div>)}</div>
}
