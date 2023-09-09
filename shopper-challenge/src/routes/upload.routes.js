import multer from 'multer'
import storage from '../config/multer'
import { create, updateMany } from '../controllers/uploadController'

const upload = multer({ storage })

export const uploadRoutes = (app) => {
  app.post('/upload', upload.single('file'), create)
  app.put('/upload', updateMany)
}
