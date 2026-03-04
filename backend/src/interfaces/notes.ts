export interface createNote {
  title: string
  jsonBody: string
  notebookId: string
  userId: string
}

export interface updateNote {
  id: string
  title: string
  jsonBody: string
}