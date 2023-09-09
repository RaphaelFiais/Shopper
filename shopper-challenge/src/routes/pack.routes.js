import { index, getPacksProduct, update } from '../controllers/packController'

export const packRoutes = (app) => {
  app.get('/pack', index)
  app.get('/packs-product/:pack_id', getPacksProduct)
  app.put('/teste/:id', update)
}
