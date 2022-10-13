export interface Course {
  name: string
  description?: string | null
  duration: number
}

export interface CourseId extends Course {
  id: string
}
