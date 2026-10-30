import {student,learningPath,games,skills} from '../data/mock'
const USE_MOCK=import.meta.env.VITE_USE_MOCK!=='false'
const BASE=import.meta.env.VITE_API_BASE_URL as string|undefined
// Real calls are intentionally unimplemented: endpoints/schemas come from the backend teammate.
async function real<T>(name:string):Promise<T>{
  throw new Error(`${name}: backend contract not defined yet (base URL: ${BASE||'unset'})`)
}
export const getStudentDashboard=async()=>USE_MOCK?{student,skills}:real<{student:typeof student,skills:typeof skills}>('getStudentDashboard')
export const getLearningPath=async()=>USE_MOCK?learningPath:real<typeof learningPath>('getLearningPath')
export const getGames=async()=>USE_MOCK?games:real<typeof games>('getGames')
