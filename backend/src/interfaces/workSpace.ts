export interface ICreateWorkSpace {
  userId: string
  name: string
  members: []
}

export interface IUpdateWorkSpace {
  userId: string
  name: string
}

export interface IShareWorkSpace {
  userIds: string[]
  workSpaceId: string
}

export interface IRemoveMembers {
  userIds: string[]
}
