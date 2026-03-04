import { Express } from "express"
import userRoutes from './users'
import noteBookRoutes from './noteBooks'
import notesRoutes from './notes'
import workSpaceRoutes from './workSpace'

export const handleAppRouting = (app: Express) => {
  app.use("/api/v1/users", userRoutes)
  app.use("/api/v1/note-books", noteBookRoutes)
  app.use('/api/v1/notes', notesRoutes)
  app.use('/api/v1/work-spaces', workSpaceRoutes)
}