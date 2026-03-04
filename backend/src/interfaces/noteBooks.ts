export interface ICreateNoteBook {
  name: string
  userId: string
  workSpaceId?: string
}

export interface IUpdateNoteBook {
  name: string
}

export interface IShareNoteBook {
  id: string
  userId : string[]
}