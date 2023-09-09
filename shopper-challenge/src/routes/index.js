import { packRoutes } from './pack.routes'
import { productRoutes } from './product.routes'
import { uploadRoutes } from './upload.routes'

export const routes = (app) => {
  productRoutes(app)
  packRoutes(app)
  uploadRoutes(app)
}
