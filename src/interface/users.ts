export interface User {
  role: roles
  fullname: string
  gender: genders
  birth: Date
  photoURL: string | null
  conditions: boolean
}

interface Informations {
  cpf: number
  email: string
  phone: number
}

interface Address {
  address: string
  cep: string
  city: string
  complement?: string
  state: string
}

export interface UserInformations extends User {
  informations: Informations
  address: Address
}

type roles = 'PATIENT' | 'PROFESSIONAL'
type genders = 'MASCULINE' | 'FEMENINE' | 'OTHERS'
