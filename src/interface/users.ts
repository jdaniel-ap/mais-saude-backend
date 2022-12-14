export interface User {
  role: roles
  fullname: string
  gender: genders
  birth: Date
  photoURL?: string | null
  conditions: boolean
}

export interface UserResponse {
  status: string,
  message: string,
  data: object,
}

interface Informations {
  cpf: string
  email: string
  phone: string
}

interface Address {
  address: string
  cep: string
  city: string
  complement?: string
  state: string
}

interface Auth {
  password: string
}

export interface UserInformations extends User {
  informations: Informations
  address: Address
  auth: Auth
}

export interface ValidationResponse {
  success: boolean
  data: object
}

type roles = 'PATIENT' | 'PROFESSIONAL'
type genders = 'MASCULINE' | 'FEMENINE' | 'OTHERS'
