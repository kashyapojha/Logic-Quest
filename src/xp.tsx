import {createContext,useContext,useState,ReactNode} from 'react'
const K='lq_demo_xp',BASE=1250
const C=createContext({xp:BASE,add:(_n:number)=>{},reset:()=>{}})
export const useXp=()=>useContext(C)
export const levelOf=(xp:number)=>Math.floor(xp/300)
export function XpProvider({children}:{children:ReactNode}){
  const [xp,setXp]=useState(()=>{try{return Number(localStorage.getItem(K))||BASE}catch{return BASE}})
  const set=(n:number)=>{setXp(n);try{localStorage.setItem(K,String(n))}catch{}}
  return <C.Provider value={{xp,add:n=>set(xp+n),reset:()=>set(BASE)}}>{children}</C.Provider>
}
