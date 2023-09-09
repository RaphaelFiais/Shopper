import { index, update } from '../controllers/productController'

export const productRoutes = (app) => {
  app.get('/product', index)
  app.put('/product/:code', update)
}
