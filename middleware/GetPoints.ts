import { AssistanceLevel, HardLevel, Profile, Service, SkillLevel } from "@prisma/client"
export const getEnumVal = (element: any, enumArray: any) => Object.values(enumArray).indexOf(element)



export const GetPoints = (service: Service, UserResp: Profile): number => {
    const hard = getEnumVal(service.hard, HardLevel)
    const skill = getEnumVal(service.skill, SkillLevel)
    const userRespPoints = UserResp ? getEnumVal(UserResp.assistance, AssistanceLevel) : 0
    const base = Number(((hard / 2 + skill / 2) + 1).toFixed(1))
    const points = base + userRespPoints / 2
    return points
}