import csv from 'csv-parser'
import fs from 'fs'
import {
  findManyProduct,
  findProduct,
  updateProduct,
} from '../repository/productRepository'
import { uploadValidation } from '../validations/uploadValidation'
import { packsProduct, updatePack } from '../repository/packRepository'
let products = []
export const create = async (req, res) => {
  const results = []
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      results.push(data)
    })
    .on('end', async () => {
      // Agora você tem os dados do CSV em 'results'
      const newResults = results.map(async (result) => {
        try {
          uploadValidation.validateSync(result, { abortEarly: false })
          const product = await findProduct(Number(result.product_code))
          if (product) {
            return { ...product, new_price: result.new_price }
          } else {
            return {
              error: 'codigo invalido',
            }
          }
        } catch (err) {
          return { error: err.errors }
        }
      })

      const product = await Promise.all(newResults)
      const newProducts = product.map((product) => ({
        ...product,
        code: product?.code?.toString(),
      }))
      products = newProducts
      return res.send(newProducts)
    })
}

export const updateMany = async (req, res) => {
  console.log(products)
  const updates = products.map(async (result) => {
    console.log(`cost: ${result.cost_price}`)
    console.log(`New Price: ${result.new_price}`)

    if (Number(result.cost_price) > Number(result.new_price)) {
      return { error: 'preço de custo maior que o de venda' }
    }

    const reajuste = result.sales_price * 0.1
    let limit = result.sales_price - result.new_price
    if (limit < 0) {
      limit = limit * -1
    }

    if (reajuste.toFixed(1) !== limit.toFixed(1)) {
      limit = 0
      return { error: 'o ajuste deve ser de 10% pra mais ou pra menos' }
    }

    /* Atualizar preço do pack */
    const findPack = await packsProduct(result.product_code)

    if (findPack > 0) {
      const id = findPack.filter((pack) =>
        pack.product_id.toString().includes(result.code)[0].id.toString(),
      )
      const price = findPack
        .map((item) =>
          Number(id) === Number(item.id)
            ? Number(item.qty) * result.new_price
            : Number(item.qty) *
              Number(item.products_packs_product_idToproducts.sales_price),
        )
        .reduce((acumulador, valor) => acumulador + valor, 0)

      await updatePack({
        id: Number(id),
        sales_price: result.new_price,
        price,
      })
    }
    return await updateProduct({
      code: result.code,
      sales_price: result.new_price,
    })
  })

  const productUpdate = await Promise.all(updates)
  console.log(productUpdate)

  const newProductUpdate = {
    ...productUpdate,
    code: productUpdate?.code?.toString(),
  }

  const productExist = await findManyProduct(updates.product_code)
  if (!productExist) {
    return res.json('Produto não encontrado')
  }

  return res.json(newProductUpdate)
}
